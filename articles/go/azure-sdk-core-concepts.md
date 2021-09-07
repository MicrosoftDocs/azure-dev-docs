---
title: Core Concepts for the Azure SDK for Go
description: An overview of the common usage patterns in the Azure SDK for Go
ms.date: 09/07/2021
ms.topic: conceptual
ms.custom: devx-track-go
---

# Common concepts with the Azure SDK for Go

The Azure Core (azcore) package in the Azure SDK for Go implements several patterns that are applied throughout the SDK:

- [Pagination (methods that return collections)](#pagination-methods-that-return-collections)
- [Long-running operations (LROs)](#long-running-operations)
- The [HTTP pipeline flow](#http-pipeline-flow), which is the underlying HTTP mechanism used by the SDK's client libraries.
- [Common HTTP pipeline patterns](#common-http-pipeline-patterns).

## Pagination (methods that return collections)

Many operations provided by the Azure Go SDK client libraries return more than one result, in which case the method returns a "Pager" type that supports paging operations. These types are individually defined for different contexts, but share common characteristics like a `NextPage` method.

For example, suppose there's a function `ListWidgets` that returns a `WidgetPager` type. You'd then use that type as shown in the following code.

```go
func (c *WidgetClient) ListWidgets(options *ListWidgetOptions) WidgetPager {
    // ...
}

pager := client.ListWidgets(options)

for pager.NextPage(ctx) {
    for _,w := range pager.PageResponse().Widgets {
        process(w)
    }
}

if pager.Err() != nil {
    // handle error...
}
```

For an example of a paging object implementation, see the SDK source file [zz_generated_pages.go](https://github.com/Azure/autorest.go/blob/track2/test/autorest/paginggroup/zz_generated_pagers.go).

## Long running operations

Some operations on Azure, such as copying data from a source URL to a Storage blob of training an AI model to recognize forms, can take a long time to complete, anywhere from a few seconds to a few days. Such **long running operations (LRO)** don't lend well to the standard HTTP flow of a relatively quick request and response.

By convention, the names for all methods in the SDK libraries for LROs start with `Begin`. This prefix indicates that the return type from the operation is a "Poller" type that simplifies interactions with LROs.

The following examples illustrate various patterns for handling LROs. You can also learn more from the [poller.go](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/internal/pollers/poller.go) source code in the SDK.

### Blocking call to PollUntilDone

```go
resp,err := client.BeginCreate(context.Background(), "blue_widget", nil)

if err != nil {
    // handle error...
}

// Second argument is the polling interval if the endpoint doesn't send a Retry-After header.
// A good starting value is 30 second; some resources might work better with different intervals.
w,err = resp.PollUntilDone(context.Background(), 5*time.Second)

if err != nil {
    // handle error...
}

process(w)
```

#### Customized poll loop

```go
resp,err := client.BeginCreate(context.Background(), "green_widget")

if err != nil {
    // handle error...
}

poller := resp.Poller

for {
    resp,err := poller.Poll(context.Background())

    if err != nil {
        // handle error ...
    }

    if poller.Done() {
        break
    }

    // Perform other work while waiting
}

w,err := poller.FinalResponse(ctx)

if err != nil {
    // handle error ...
}

process(w)
```

### Resume from a previous operation

```go
// Object the resume token from a previous poller instance
poller := resp.Poller
tk,err := poller.ResumeToken()

if err != nil {
    // handle error ...
}

// To resume from the resume token that was previously saved, create an appropriate
// *Response object as appropriate for the client and call it's resume method.

resp = WidgetPollerResponse()

// Resume takes the resume token as an arg
err := resp.Resume(tk, ...)

if err != nil {
    // handle error ...
}

for {
    resp,err := poller.Poll(context.Background())

    if err != nil {
        // handle error ...
    }

    if poller.Done() {
        break
    }

    // Perform other work while waiting
}

w,err := poller.FinalResponse(ctx)

if err != nil {
    // handle error ...
}

process(w)
```

## HTTP pipeline flow

The various client objects in the Azure SDK for Go provide an convenient abstraction on top of Azure's underlying REST API, so typically you don't need to be concerned with the underlying HTTP transport. You can, however, customize that transport if needed.

The SDK makes HTTP requests through an HTTP **pipeline**. The pipeline describes the sequence of steps executed for each HTTP request-response round trip.

The pipeline is composed of a transport along with any number of policies:

- The **transport** sends the request to the service and receives the response.
- Each **policy** performs a specific action within the pipeline.

The following diagram illustrates the flow of a pipeline:

![Request and response flow diagram](media/azure-sdk-core-concepts/request-response-pipeline-flow.png)

Because all client libraries share a standard Azure Core request-response layer, each policy runs in a predictable order:

- When sending HTTP request, all policies run in the order that they were added to the pipeline before the request is sent to the HTTP endpoint.
- After the endpoint responds, all policies run in the reverse order before the response returns to your code.

Each policy is provided with the necessary request or response data along with any necessary context to run the policy. The policy performs its operation with the given data and then passes control to the next policy in the pipeline.

By default, each SDK client library creates a pipeline configured to work with that specific client library. You can also provide a custom HTTP pipeline when creating a client, as described in the following section.

### Core HTTP pipeline policies

Azure Core provides three commonly required HTTP policies that you can add to any pipeline:

- [Retry Policy](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore/runtime/policy_retry.go)
- [Logging Policy](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore/runtime/policy_logging.go)
- [Telemetry Policy](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore/runtime/policy_telemetry.go)

### Custom HTTP pipeline policy

To provide capabilities beyond the Core HTTP policies, such as authentication or specifying custom header parameters, you can implement a custom policy that can modify the request and/or response. When adding the policy to the pipeline, you can specify whether this policy should run on a per-call or per-retry retry.

To create a custom HTTP pipeline policy, you implement the [`Policy`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L20) interface in one of two ways:

- As a first-class function for a *stateless policy*.
- As a `Do` method on a type for a *stateful policy*, which is defined by the `Policy` interface. Because HTTP requests made via the same pipeline share the same policy instances, any stateful policy that mutates its state must be properly synchronized to avoid race conditions.

Either way, the policy runs as follows:

1. The pipeline calls the function or `Do` method with an [`policy.Request`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L27) object.
1. The policy performs any desired operations, such as logging the outgoing request, mutating the URL, modifying headers and/or query parameters, injecting a failure, and so on.
1. The policy forwards the request to the next policy in the pipeline by calling the request's `Next` method.
1. The return value of `Next` is tuple consisting of an `http.Response` object and an error object, with which the policy performs any desired operations on the response, such as logging the response, handling errors, and so forth.
1. The policy returns the possibly modified response and error objects, which the pipeline then passes to the next policy in the response pipeline.

The following sections provide templates for both stateless and stateful policy implementations.

#### Template for a stateless policy

```go
type policyFunc func(*policy.Request) (*http.Response, error)

// Do implements the Policy interface on policyFunc.
func (pf policyFunc) Do(req *policy.Request) (*http.Response, error) {
    return pf(req)
}

func NewMyStatelessPolicy() Policy {
    return policyFunc(func(req *policy.Request) (*http.Response, error) {
        // TODO: mutate/process Request

        // Forward the request to next policy in the pipeline
        resp, err := req.Next()
        
        // TODO: mutate/process Response/error
        
        // Pass the Response and error to next policy in the response pipeline.
        return resp, err        
    })        
}
```

#### Template for a stateful policy

```go
type MyStatefulPolicy struct {
    // TODO: add configuration, setting, and state fields
}
    
// TODO: add initialization args to NewMyStatefulPolicy()

func NewMyStatefulPolicy() Policy {
    return &MyStatefulPolicy {
        // TODO: initialize configuration/setting fields
    }
}

func (p *MyStatefulPolicy) Do(req *azcore.Request) (resp *azcore.Response, err error) {
    // TODO: mutate/process Request

    // Forward the request to next policy in the pipeline
    resp, err := req.Next()

    // TODO: mutate/process Response/error

    // Pass the Response and error to next policy in the response pipeline.
    return resp, err
}
```

### Custom HTTP transport

A transport is responsible for sending the HTTP request and returning the corresponding HTTP response or error. The transport is invoked by the last policy in the chain, and is the first to handle the response before passing it along to the policies in reverse order.

The default transport implementation uses a shared `http.Client` from the standard library.

You create a custom stateful or stateless transport in the same manner as a custom policy; in the stateful case, you implement the `Do` method inherited from the [`Transporter`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L23) interface. In both cases, your function or `Do` method again receives an `azcore.Request` and returns an `azCore.Response` and performs actions in the same order as a policy.

## Common HTTP pipeline patterns

### Create a pipeline

A pipeline is created with the [`NewPipeline`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/runtime/request.go#L49) function, to which you provide a transport and one or more policies:

```go
// Use the default transport and no policies
pipeline := NewPipeline(nil)

// Use the default transport with policies
pipeline := NewPipeline(nil, PolicyA, PolicyB, PolicyC)

// Use a custom transport with policies
pipeline := NewPipeline(TransportA, PolicyA, PolicyB, PolicyC)
```

As illustrated in the earlier diagram, the policies are invoked in the order they're provided to `NewPipeline`, followed by the transport.

To send a request, create a [`policy.Request`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L27) instance with the [`NewRequest`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/runtime/request.go#L43) function and pass that request to pipeline's `Do` method. The `Pipeline.Do` method sends the specified request through the chain of `Policy` and `Transport` instances. The response/error is then sent through the same chain of `Policy` instances in reverse order.

```go
import (
    "context"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"

    "github.com/Azure/azure-sdk-for-go/sdk/azcore"
)

func main() {
    req, err := azcore.NewRequest(context.Background(), http.MethodGet, "https://github.com/robots.txt")

    if err != nil {
        log.Fatal(err)
    }

    // TODO: Create PolicyA, PolicyB, PolicyC ...

    pipeline := azcore.NewPipeline(nil, PolicyA, PolicyB, PolicyC)

    resp, err := pipeline.Do(req)

    if err != nil {
        log.Fatal(err)
    }

    robots, err := ioutil.ReadAll(resp.Body)

    resp.Body.Close()

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("%s", robots)
}
```

### Set the request body

A `Request` instance is a wrapper around an `*http.Request`. A request also contains some internal state and provides various convenience methods. If the request should contain a body, call the `SetBody` method:

```go
req, err := azcore.NewRequest(context.Background(), http.MethodPut, "https://contoso.com/some/endpoint")

if err != nil {
    log.Fatal(err)
}

body := strings.NewReader("this is seekable content to be uploaded")

err = req.SetBody(streaming.NopCloser(body), "text/plain")

if err != nil {
    log.Fatal(err)
}
```

The body must be a seekable stream so that upon retry, the retry policy instance can seek the stream back to the beginning before retrying the network request and uploading the body again.

### Send an explicit null

Operations like `JSON-MERGE-PATCH` send a JSON `null` to indicate a value should be deleted:

```json
{
    "delete-me": null
}
```

This requirement conflicts with the SDK's default marshaling that specifies `omitempty` as a means to resolve the ambiguity between a field to be excluded and its zero-value.

```go
type Widget struct {
    Name *string `json:",omitempty"`
    Count *int `json:",omitempty"`
}
```

In the above example, `Name` and `Count` are defined as pointer-to-type to disambiguate between a missing value (`nil`) and a zero-value (0) which might have semantic differences.

In a `PATCH` operation, any fields left as `nil` are to have their values preserved. When updating the count of a `Widget`, specify the new value for `Count`, leaving `Name` as `nil`.

To fulfill the requirement for sending a JSON `null`, the `NullValue` function is used:

```go
w := Widget{
    Count: azcore.NullValue(0).(*int),
}
```

This code set an explicit `null` for `Count`, indicating that any current value for `Count` should be deleted.

### Process the response

An `http.Response` is returned through the transport and all `Policy` instances. Each `Policy` instance can inspect or mutated the embedded `http.Response`.

### Cancel a request

Cancellation is handled via the `context.Context` parameter, which is always the first method parameter. Any API that performs I/O of any kind, sleeps, or performs a significant amount of CPU-bound work will take a `context.Context` as its first parameter. For more information and examples, see the [context](https://pkg.go.dev/context) reference.

## See also

- [Azure SDK for Go reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go)
- [Azure SDK for Go source code (GitHub)](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore)
---
title: Core concepts for the Azure SDK for Go
description: An overview of the common usage patterns in the Azure SDK for Go
ms.date: 09/07/2021
ms.topic: conceptual
ms.custom: devx-track-go
---

# Common concepts with the Azure SDK for Go

The Azure Core (`azcore`) package in the Azure SDK for Go implements several patterns that are applied throughout the SDK:

- The [HTTP pipeline flow](#http-pipeline-flow), which is the underlying HTTP mechanism used by the SDK's client libraries.
- [Pagination (methods that return collections)](#pagination-methods-that-return-collections)
- [Long-running operations (LROs)](#long-running-operations-lros)

## Pagination (methods that return collections)

Many Azure services return collections of items. Because the numbers of items can be enormous, these client methods return a "Pager", allowing your app to process one page of results at a time. These types are individually defined for different contexts but share common characteristics like a `NextPage` method.

For example, suppose there's a `ListWidgets` method that returns a `WidgetPager`. You'd then use the `WidgetPager` as shown in the following code:

```go
func (c *WidgetClient) ListWidgets(options *ListWidgetOptions) WidgetPager {
    // ...
}

pager := client.ListWidgets(options)

for pager.NextPage(ctx) {
    for _, w := range pager.PageResponse().Widgets {
        process(w)
    }
}

if pager.Err() != nil {
    // handle error...
}
```

For an example of a Pager implementation, see the SDK source file [zz_generated_pages.go](https://github.com/Azure/autorest.go/blob/track2/test/autorest/paginggroup/zz_generated_pagers.go).

## Long-running operations (LROs)

Some operations on Azure can take a long time to complete&mdash;anywhere from a few seconds to a few days. Examples of such operations include copying data from a source URL to a Storage blob or training an AI model to recognize forms. These *long-running operations (LROs)* don't lend well to the standard HTTP flow of a relatively quick request and response.

By convention, methods that start an LRO are prefixed with "Begin" and return a "Poller". The "Poller" is used to periodically poll the service until the operation completes.

The following examples illustrate various patterns for handling LROs. You can also learn more from the [poller.go](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/internal/pollers/poller.go) source code in the SDK.

### Blocking call to PollUntilDone

`PollUntilDone` handles the entire span of the polling operation until a terminal state is reached. Then returns the final HTTP response for the polling operation with the content of the payload into the respType interface that is provided.

```go
resp, err := client.BeginCreate(context.Background(), "blue_widget", nil)

if err != nil {
    // handle error...
}

// Second argument is the polling interval if the endpoint doesn't send a Retry-After header.
w, err = resp.PollUntilDone(context.Background(), 5*time.Second)

if err != nil {
    // handle error...
}

process(w)
```

#### Customized poll loop

```go
resp, err := client.BeginCreate(context.Background(), "green_widget")

if err != nil {
    // handle error...
}

poller := resp.Poller

for {
    resp, err := poller.Poll(context.Background())

    if err != nil {
        // handle error ...
    }

    if poller.Done() {
        break
    }

    // Perform other work while waiting
}

w, err := poller.FinalResponse(ctx)

if err != nil {
    // handle error ...
}

process(w)
```

### Resume from a previous operation

```go
// From an existing Poller, extract and save its resume token.
poller := resp.Poller
tk, err := poller.ResumeToken()

if err != nil {
    // handle error ...
}

// To resume polling (perhaps in another process or PC), create a new PollerRespone instance 
// and then initialize it by calling its Resume method, passing it the previously-saved resume token.
// *Response object as appropriate for the client and call it's resume method.

resp = WidgetPollerResponse()

// Resume takes the resume token as an arg
err := resp.Resume(tk, ...)

if err != nil {
    // handle error ...
}

for {
    resp, err := poller.Poll(context.Background())

    if err != nil {
        // handle error ...
    }

    if poller.Done() {
        break
    }

    // Perform other work while waiting
}

w, err := poller.FinalResponse(ctx)

if err != nil {
    // handle error ...
}

process(w)
```

## HTTP pipeline flow

The various clients provide an abstraction over an Azure service's HTTP API enabling code-completion and compile-time type-safety while also freeing you from dealing with lower-level transport mechanics.  However, you can customer the transport mechanics (such as retries and logging) if you so desire.

The SDK makes HTTP requests through an HTTP **pipeline**. The pipeline describes the sequence of steps executed for each HTTP request-response round trip.

The pipeline is composed of a transport along with any number of policies:

- The **transport** sends the request to the service and receives the response.
- Each **policy** performs a specific action within the pipeline.

The following diagram illustrates the flow of a pipeline:

![Request and response flow diagram](media/azure-sdk-core-concepts/request-response-pipeline-flow.png)

All client packages share a "Core" package (named `azcore`). This package constructs the HTTP pipeline with its ordered set of policies ensuring that all client packages behave consistently.

- When sending an HTTP request, all policies run in the order that they were added to the pipeline before the request is sent to the HTTP endpoint. These policies typically add request headers or log the outgoing HTTP request.
- After the Azure service responds, all policies run in the reverse order before the response returns to your code. Most policies ignore the response, but the logging policy records the response and the retry policy may re-issue the request making your app more resilient to network failures.

Each policy is provided with the necessary request or response data along with any necessary context to run the policy. The policy performs its operation with the given data and then passes control to the next policy in the pipeline.

By default, each client package creates a pipeline configured to work with that specific Azure service. You can also define and insert your own custom policies into the HTTP pipeline when creating a client (see the next section).

### Core HTTP pipeline policies

The Core package provides three HTTP policies that are part of every pipeline:

- [Retry Policy](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore/runtime/policy_retry.go)
- [Logging Policy](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore/runtime/policy_logging.go)
- [Telemetry Policy](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore/runtime/policy_telemetry.go)

### Custom HTTP pipeline policy

You can define your own custom policy to add capabilities beyond what's included with the Core package. For example, you could create a policy that injects fault when making requests while testing to see how your app deals with network or service failures. Or, you could create a policy that mocks a service's behavior for testing.

To create a custom HTTP policy, define your own structure with a `Do` method implementing the [`Policy`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L20) interface. 

Your policy's `Do` method should do the following:

1. Perform any desired operation on the incoming [`policy.Request`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L27). Operation examples include logging, injecting a failure, or modifying any of the request's URL, query parameters, or request headers.
1. Forward the (modified) request to the next policy in the pipeline by calling the request's `Next` method.
1. `Next` returns the `http.Response` and an error. Your policy can perform any desired operation such as logging the response/error.
1. Your policy must return a response and error back to the previous policy in the pipeline.

> [!NOTE]
> Policies must be goroutine-safe, as this allows multiple goroutines to access a single client object concurrently. It's common for a policy to be immutable once created; this ensures the goroutine is safe.

The following section demonstrates how to define a custom policy.

#### Policy template

```go
type MyPolicy struct {
    LogPrefix string
}

func (m *MyPolicy) Do(req *policy.Request) (*http.Response, error) {
	// mutate/process req
	start := time.Now()
	// Forward the request to next policy in the pipeline
	res, err := req.Next()
	// mutate/process res
	// Return the response & error back to the previous policy in the pipeline.
	record := struct {
		Policy   string
		URL      string
		Duration time.Duration
	}{
		Policy:   "MyPolicy",
		URL:      req.Raw().URL.RequestURI(),
		Duration: time.Duration(time.Since(start).Milliseconds()),
	}
	b, _ := json.Marshal(record)
	log.Printf("%s %s\n", m.LogPrefix, b)
	return res, err
}

func ListResourcesWithPolicy(subscriptionID string) error {
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		return err
	}

	mp := &MyPolicy{
		LogPrefix: "[MyPolicy]",
	}
	options := &arm.ConnectionOptions{}
	options.PerCallPolicies = []policy.Policy{mp}
	options.Retry = policy.RetryOptions{
		RetryDelay: 20 * time.Millisecond,
	}

	con := arm.NewDefaultConnection(cred, options)
	if err != nil {
		return err
	}

	client := armresources.NewResourcesClient(con, subscriptionID)
	pager := client.List(nil)
	for pager.NextPage(context.Background()) {
		if err := pager.Err(); err != nil {
			log.Fatalf("failed to advance page: %v", err)
		}
		for _, r := range pager.PageResponse().ResourceListResult.Value {
			printJSON(r)
		}
	}
	return nil
}
```

### Custom HTTP transport

A transport sends an HTTP request and returns its response/error. The transport is invoked by the last policy in the pipeline and is the first to handle the response before returning the response/error back to the pipeline's policies (in reverse order).

By default, clients use the shared `http.Client` from Go's standard library.

You create a custom stateful or stateless transport in the same manner as a custom policy. In the stateful case, you implement the `Do` method inherited from the [`Transporter`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/policy/policy.go#L23) interface. In both cases, your function or `Do` method again receives an `azcore.Request` and returns an `azCore.Response` and performs actions in the same order as a policy.

### How to delete a JSON field when invoking an Azure operation that supports HTTP PATCH with a JSON Merge Patch request body

Operations like `JSON-MERGE-PATCH` send a JSON `null` to indicate a field should be deleted (along with its value):

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

In the preceding example, `Name` and `Count` are defined as pointer-to-type to disambiguate between a missing value (`nil`) and a zero-value (0) which might have semantic differences.

In an HTTP PATCH operation, any field whose value is `nil` won't impact the value in the server's resource. When updating a Widget's `Count` field, specify the new value for `Count`, leaving `Name` as `nil`.

To fulfill the requirement for sending a JSON `null`, the `NullValue` function is used:

```go
w := Widget{
    Count: azcore.NullValue(0).(*int),
}
```

This code sets `Count` to an explicit JSON `null`. When sent to the server, the resource's `Count` field will be deleted.

## See also

- [Azure SDK for Go reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go)
- [Azure SDK for Go source code (GitHub)](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore)

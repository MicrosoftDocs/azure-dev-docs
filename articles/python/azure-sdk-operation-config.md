---
title: Configuration arguments for client objects and operations
description: An explanation of the extra named parameters for client objects and methods in the Azure SDK.
ms.date: 06/03/2020
ms.topic: conceptual
ms.custom: seo-python-october2019
---

# How to configure client and operation behaviors

Within the Azure libraries for Python, many client objects and operation methods accept a standard set of optional named parameters. These parameters allow you to configure various behaviors such as logging, proxies, headers, and other underlying aspects of HTTP requests made to the Azure REST API.

Objects and methods that accept these parameters appear in the reference documentation with an `**operation_config` or `**kwargs` parameter at the end of the function signature. For example:

<pre>
# A client object
BlobServiceClient(account_url, credential=None, **kwargs)

...

# An operation method
create_container(name, metadata=None, public_access=None, **kwargs)

...

# An operation method
create_or_update(resource_group_name, name, site_envelope, custom_headers=None, raw=False, polling=True, **operation_config)
</pre>

The allowable arguments depend on whether the version of the library in question uses the common Azure Core library:

- Those libraries that appear on the [Latest releases](https://azure.github.io/azure-sdk/releases/latest/python.html) page use the Core library. For these libraries, see [Configuration parameters - Core-based libraries](#configuration-parameters--core-based-libraries).
- For all other libraries, see [Configuration parameters - non-Core libraries](#configuration-parameters--non-core-libraries).

Objects and methods produce an error if they don't recognize a parameter, in which case you're using the wrong parameter list for that version of the library.

## Applied scope

Configuration applied to a client object applies to all operations invoked through that object.

```python
# Enable logging and set retries to 5 for all operations invoked through the client.
client = BlobClient(endpoint, credential, logging_enable=True, retries_total=5)
```

Configuration applied to a operation method applies to only that one operation.

```python
# Use default configuration through the client
client = BlobClient(endpoint, credential)

# Change configuration for this specific operation
client.create_container("container01", logging_enable=True, retries_total=5)
```

For Azure Core-based libraries, any configuration parameters that can be applied at the client scope can also be applied at the operation scope. An operation may also support specific configuration parameters that apply to that method only and are described in the documentation for each library.

## Configuration parameters - non-Core libraries

The following table lists the arguments accepted by libraries that don't use the Azure Core library.

| Name               | Type | Default | Description |
| ---                | ---  | ---     | ---         |
| verify             | bool | True    | Verify the SSL certificate. |
| cert               | str  | None    | Path to local certificate for client-side verification. |
| timeout            | int  | 30      | Timeout for establishing a server connection in seconds. |
| allow_redirects    | bool | False   | Enable redirects. |
| max_redirects      | int  | 30      | Maximum number of allowed redirects. |
| proxies            | dict | []      | Proxy server settings. |
| use_env_proxies    | bool | False   | Enable reading of proxy settings from local environment variables. |
| retries            | int  | 10      | Total number of allowable retry attempts. |
| enable_http_logger | bool | False   | Enable logs of HTTP in debug mode. |

## Configuration parameters - Core-based libraries

### Connection configuration

| Parameter             | Type     | Default | Scope             | Description |
| ---                   | ---      | ---     | ---               | ---         |
| connection_timeout    | float    | 300     | Client            | Connection timeout, in seconds. |
| read_timeout          | float    | 300     | Client            | Read/response timeout, in seconds. |
| connection_verify     | bool     | False   | Client            | Enables SSL certificate verification. Can alternately be a string containing the path to a CA_BUNDLE file or directory with certificates of trusted CAs. |
| connection_cert       | string   | None    | Client-side certificates. You can specify a local certificate to use as client side certificate, as a single file (containing the private key and the certificate), or as a tuple of both files' paths. |
| connection_data_block_size | int | 4096 | The block size of data sent over the connection. | 

Class: ConnectionConfiguration


| transport             | any      |         | Client            | User-provided transport to send the HTTP request. |
| client_request_id     | str      | None    | Operation         | Optional user specified identification of the request. |
| require_encryption    | bool     | False   | Client, operation | Determines whether to enforce that objects are encrypted. |
| key_encryption_key    | object   | None    | Client, operation | The user-provided key-encryption-key. The instance must implement the following methods:
    - `wrap_key(key)`: wraps the specified key using an algorithm of the user's choice. 
    - `get_key_wrap_algorithm()`: returns the algorithm used to wrap the specified symmetric key.
    - `get_kid()`: returns a string key id for this key-encryption-key. |
| key_resolver_function | callable | None    | Client, operation | The user-provided key resolver. Uses the kid string to return a key-encryption-key implementing the interface defined above. |

### Policy configuration

The behavior of requests to the Azure REST API are configured through a collection of *policies*, where each policy applies to a specific aspect such as retries, redirects, request headers, and proxies.

You can customize each policy in two ways:

1. Configure individual behaviors by passing specific parameters to client constructors or operation methods.

1. Customize the policy as a whole by specifying one parameter that contains an instance of the appropriate class from the `azure.core.pipeline.policies` library.

The following sections describe the details for each policy.

#### Bearer token authorization

Adds a bearer token Authorization header to requests.

**Individual arguments**:

| Parameter         | Type     | Default | Description |
| ---               | ---      | ---     | ---         |


**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [BearerTokenCredentialPolicy](/python/api/azure-core/azure.core.pipeline.policies.bearertokencredentialpolicy?view=azure-python) | `bearer_token_credential_policy` |

#### Content decoding

Configures decoding of unstreamed response content.

**Individual arguments**:

| Parameter         | Type     | Default | Scope             | Description |
| ---               | ---      | ---     | ---               | ---         |
| response_encoding |          |         | Client, operation |  |


**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [ContentDecodePolicy](/python/api/azure-core/azure.core.pipeline.policies.contentdecodepolicy?view=azure-python) | `content_decode_policy` |

#### Custom response hooks

Enables a callback for responses.

**Individual arguments**:

| Parameter         | Type     | Default | Scope             | Description |
| ---               | ---      | ---     | ---               | ---         |
| raw_request_hook  | callable | None    | Client, operation | Adds a callback for the request before it's sent to a service. |
| raw_response_hook | callable | None    | Client, operation | Adds a callback for responses from a service. |

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [CustomHookPolicy](/python/api/azure-core/azure.core.pipeline.policies.customhookpolicy?view=azure-python) | `custom_hook_policy` |

#### Distributed tracing

Configures spans for Azure calls.

**Individual arguments**:

| Parameter          | Type     | Default | Scope             | Description |
| ---                | ---      | ---     | ---               | ---         |
| network_span_namer |          |         | Client, operation |  |
| tracing_attributes |          |         | Client |  |



**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [DistributedTracingPolicy](/python/api/azure-core/azure.core.pipeline.policies.distributedtracingpolicy?view=azure-python) | `distributed_tracing_policy` |


#### Headers

Configures custom headers to all HTTP requests.

**Individual arguments**:

| Parameter         | Type     | Default | Scope             | Description |
| ---               | ---      | ---     | ---               | ---         |
| headers           | dict     | None    | Client, operation | Provides custom headers as key, value pairs, for example, `headers={'CustomValue': value}`. |
| base_headers      |          |         | Client |

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [HeadersPolicy](/python/api/azure-core/azure.core.pipeline.policies.headerspolicy?view=azure-python) | `headers_policy` |

#### HTTP logging

Configures logging of HTTP requests and responses.

**Individual arguments**:

| Parameter         | Type     | Default | Description |
| ---               | ---      | ---     | ---         |


**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [HttpLoggingPolicy](/python/api/azure-core/azure.core.pipeline.policies.httploggingpolicy?view=azure-python) | `http_logging_policy` |


#### Network trace logging

Configures HTTP network trace output to the configured logger.

**Individual arguments**:

| Parameter         | Type     | Default | Scope             | Description |
| ---               | ---      | ---     | ---               | ---         |
| logging_enable    | bool     | False   | Client, operation | Enabled logging at DEBUG level. |

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [NetworkTraceLoggingPolicy](/python/api/azure-core/azure.core.pipeline.policies.networktraceloggingpolicy?view=azure-python) | `network_trace_logging_policy` |

#### Proxies

Configures proxy settings.

You may also use the HTTP_PROXY and HTTPS_PROXY environment variables to provide proxy information. In each case, the environment variable should contain a JSON dictionary in the following form (username and password are optional):

# [cmd](#tab/cmd)

```cmd
set HTTP_PROXY={'proxy_hostname': '127.0.0.1', 'proxy_port': 3128, 'username': 'admin', 'password': '123456' }
```

# [bash](#tab/bash)

```cmd
HTTP_PROXY={'proxy_hostname': '127.0.0.1', 'proxy_port': 3128, 'username': 'admin', 'password': '123456' }
```

```python
http_proxy = 'http://10.10.1.10:1180'
https_proxy = 'http://user:password@10.10.1.10:1180/'
```

---

**Individual arguments**:

| Parameter                  | Type     | Default | Scope             | Description |
| ---                        | ---      | ---     | ---               | ---         |
| http_proxy<br/>https_proxy | dict     | {}      | Client, operation | A dictionary of proxies where each key is a protocol. |

For an example, see the [Event Hub sample - proxy.py file](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/samples/sync_samples/proxy.py).

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [ProxyPolicy](/python/api/azure-core/azure.core.pipeline.policies.proxypolicy?view=azure-python) | `proxy_policy` |

#### Redirects

Configures redirects.

**Individual arguments**:

| Parameter                | Type     | Default | Scope             | Description |
| ---                      | ---      | ---     | ---               | ---         |
| permit_redirects         |          |         | Client, operation |             |
| redirect_max             |          |         | Client, operation |             |
| redirect_remove_headers  |          |         | Client            |             |
| redirect_on_status_codes |          |         | Client            |             |

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [RedirectPolicy](/python/api/azure-core/azure.core.pipeline.policies.redirectpolicy?view=azure-python) | `redirect_policy` | 
| [AsyncRedirectPolicy](/python/api/azure-core/azure.core.pipeline.policies.asyncredirectpolicy?view=azure-python) | `async_redirect_policy` |

#### Retries

Configures retries.

**Individual arguments**:

| Parameter             | Type     | Default | Scope | Description |
| ---                   | ---      | ---     | ---      | --- |
| retry_total           | int      | 10      | Client, operation | Total number of retries to allow. Takes precedence over other counts. Pass in `retry_total=0` if you do not want to retry on requests. |
| retry_connect         | int      | 3       | Client, operation | How many connection-related errors to retry on. |
| retry_read            | int      | 3       | Client, operation | How many times to retry on read errors. |
| retry_status          | int      | 3       | Client, operation | How many times to retry on bad status codes. |
| retry_backoff_factor  | int      | 4       | Client, operation | How many times to retry on bad status codes. |
| retry_backoff_max     | int      | 60      | Client, operation | How many times to retry on bad status codes. |
| retry_mode            | int      | 3       | Client, operation | How many times to retry on bad status codes. |
| retry_on_status_codes | list     | [404, 429, 500, 600] | Client, operation | A list of status codes that trigger retries. |
| retry_to_secondary    | bool     | False   | Client, operation | Whether the request should be retried to secondary, if able.
This should only be enabled of RA-GRS accounts are used and potentially stale data can be handled. |

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [RetryPolicy](/python/api/azure-core/azure.core.pipeline.policies.retrypolicy?view=azure-python) | `retry_policy` |
| [AsyncRetryPolicy](/python/api/azure-core/azure.core.pipeline.policies.asyncretrypolicy?view=azure-python) | `async_retry_policy` |

#### User-Agent

Configures the User-Agent header.

**Individual arguments**:

| Parameter            | Type     | Default | Scope             | Description |
| ---                  | ---      | ---     | ---               | ---         |
| user_agent           | str      | None    | Client, operation | Custom string to append to the user-agent header to be sent with requests. |
| base_user_agent      | | | Client | |
| user_agent_overwrite | | | Client | |
| user_agent_use_env   | | | Client | |
| sdk_moniker          | | | Client | |

**Policy object**:

| Policy object | Parameter name |
| --- | --- |
| [UserAgentPolicy](/python/api/azure-core/azure.core.pipeline.policies.useragentpolicy?view=azure-python) | `user_agent_policy` |

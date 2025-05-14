---
title: Azure SDK for C++ - Errors
description: Understand how to handle errors effectively when using the Azure SDK for C++. 
author: ronniegeraghty
ms.author: rgeraghty
ms.topic: overview
ms.date: 4/8/2025
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# Error handling in the Azure SDK for C++

Error handling in the Azure SDK for C++ is primarily implemented through C++ exceptions. This approach aligns with standard C++ practices and allows for clear error reporting and handling across the SDK. When your C++ application interacts with Azure services, operations can fail for various reasons such as authentication issues, service unavailability, invalid requests, or resource constraints. The SDK captures these errors as exceptions that provide detailed information about the failure.

## Exception hierarchy

### Core exception types

The Azure SDK for C++ uses a hierarchy of exception classes, with the most important ones being:

1. **`std::runtime_error`** - The base C++ standard exception from which Azure-specific exceptions inherit.

2. **`Azure::Core::RequestFailedException`** - Derived from `std::runtime_error`, this is the base exception for all Azure service request failures. Defined in `azure/core/exception.hpp`, this exception is thrown when a request to an Azure service fails. It provides:
   - HTTP status code
   - Error codes from the service
   - Error messages
   - Request IDs for troubleshooting
   - The raw HTTP response

3. **`Azure::Core::OperationCancelledException`** - Derived from `std::runtime_error`, this exception is thrown when an operation is canceled, typically through a context object.

4. **`Azure::Core::Http::TransportException`** - Derived from `Azure::Core::RequestFailedException`, this exception is thrown when there's an error in the HTTP transport layer, such as connection failures.

5. **`Azure::Core::Credentials::AuthenticationException`** - Derived from `std::exception`, this exception is thrown when authentication with Azure services fails.

### Service-specific exception types

Different Azure services extend the base exception types to provide service-specific error information:

1. **`Azure::Storage::StorageException`** - Extends `RequestFailedException` with other storage-specific information. This exception includes:
   - Storage-specific error codes
   - Additional information in response body
   - Details about the failed storage operation

2. **`Azure::Messaging::EventHubs::EventHubsException`** - An exception specific to Event Hubs operations. It includes:
   - Error condition (symbolic value from AMQP (Advanced Message Queuing Protocol))
   - Error description
   - Status code
   - Information about whether the error is transient

## Error information in exceptions

The `RequestFailedException` class contains rich information about service failures:

```cpp
class RequestFailedException : public std::runtime_error {
public:
    // The entire HTTP raw response
    std::unique_ptr<Azure::Core::Http::RawResponse> RawResponse;
    
    // The HTTP response code
    Azure::Core::Http::HttpStatusCode StatusCode;
    
    // The HTTP reason phrase from the response
    std::string ReasonPhrase;
    
    // The client request header (x-ms-client-request-id) from the HTTP response
    std::string ClientRequestId;
    
    // The request ID header (x-ms-request-id) from the HTTP response
    std::string RequestId;
    
    // The error code from service returned in the HTTP response
    std::string ErrorCode;
    
    // The error message from the service returned in the HTTP response
    std::string Message;
    
    /* ... constructors and other methods ... */
};
```

Service-specific exceptions can add extra fields. For example, `StorageException` adds `AdditionalInformation`:

```cpp
struct StorageException final : public Azure::Core::RequestFailedException {
    // Some storage-specific information in response body
    std::map<std::string, std::string> AdditionalInformation;
    
    /* ... constructors and other methods ... */
};
```

## Exception handling patterns and examples

### Using error codes

Service exceptions contain `ErrorCode` values that can be used to make decisions about how to handle failures. Here's an example with Storage services:

```cpp
try {
    containerClient.Delete();
}
catch (Azure::Storage::StorageException& e) {
    if (e.ErrorCode == "ContainerNotFound") {
        // Ignore the error if the container does not exist
    }
    else {
        // Handle other errors here
    }
}
```

### Handling basic exceptions

Basic pattern for handling exceptions in the Azure SDK:

```cpp
try {
    // Perform an Azure SDK operation
    result = client.SomeOperation();
}
catch (Azure::Core::RequestFailedException const& e) {
    std::cout << "Request Failed Exception happened:" << std::endl << e.what() << std::endl;
    if (e.RawResponse) {
        std::cout << "Error Code: " << e.ErrorCode << std::endl;
        std::cout << "Error Message: " << e.Message << std::endl;
    }
    // Handle or rethrow as appropriate
}
catch (std::exception const& e) {
    std::cout << "Other exception: " << e.what() << std::endl;
    // Handle general exceptions
}
```

### Handling transient errors

Some services, like Event Hubs, provide information about whether an error is transient, allowing for retry logic:

```cpp
try {
    // EventHubs operation
}
catch (Azure::Messaging::EventHubs::EventHubsException& e) {
    if (e.IsTransient) {
        // Retry the operation after a delay
    }
    else {
        // Handle permanent failure
    }
}
```

The SDK implements internal retry policies for transient failures, but you want to handle specific cases in your application code.

### Service-specific error handling

For storage services (Blobs, Files, Queues, etc.), you can handle errors based on both error codes and HTTP status codes:

```cpp
try {
    shareClient.Delete();
}
catch (Azure::Storage::StorageException& e) {
    if (e.ErrorCode == "ShareNotFound") {
        // Ignore the error if the file share does not exist
    }
    else if (e.StatusCode == Azure::Core::Http::HttpStatusCode::Conflict) {
        // Handle conflict error (e.g., resource in use)
        std::cout << "Conflict error: " << e.Message << std::endl;
        
        // Check additional information
        for (auto const& info : e.AdditionalInformation) {
            std::cout << info.first << ": " << info.second << std::endl;
        }
    }
    else {
        // Handle other errors based on status code or error code
        std::cout << "Error: " << e.Message << " (Code: " << e.ErrorCode << ")" << std::endl;
    }
}
```

For Key Vault operations, you might need to handle authentication exceptions separately:

```cpp
try {
    // Key Vault operation
}
catch (Azure::Core::Credentials::AuthenticationException const& e) {
    std::cout << "Authentication Exception happened:" << std::endl << e.what() << std::endl;
    // Handle authentication failure (e.g., invalid credentials)
}
catch (Azure::Core::RequestFailedException const& e) {
    std::cout << "Key Vault Client Exception happened:" << std::endl << e.Message << std::endl;
    // Handle Key Vault specific errors
}
```

## Thread safety considerations

The Azure SDK for C++ guarantees that client instance methods are thread-safe and independent of each other. This means you can safely use a client instance across multiple threads without synchronization.

When handling exceptions across threads, keep in mind:

1. Exception objects shouldn't be shared between threads unless properly synchronized
2. The `RequestFailedException` includes a copy constructor that creates a deep copy, which can be used when needing to pass exception information between threads

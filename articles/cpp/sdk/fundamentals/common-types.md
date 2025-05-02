---
title: Azure SDK for C++ - Common Types
description: Understand how to effectively use the common types provided by the Azure Core library when developing applications with the Azure SDK for C++.
author: ronniegeraghty
ms.author: rgeraghty
ms.topic: overview
ms.date: 4/11/2025
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# Common Types in the Azure SDK for C++

The Azure SDK for C++ relies on several common types from the Azure Core library to provide consistent functionality across its service libraries. Understanding these types help you use Azure services more effectively.

## Core Types

### Response\<T>

`Azure::Response<T>` wraps the result of an Azure service operation, providing both the typed response value and access to the raw HTTP response.

```cpp
template <class T> class Response final {
public:
  // The value returned by the service
  T Value;
  
  // The HTTP response returned by the service
  std::unique_ptr<Azure::Core::Http::RawResponse> RawResponse;
  
  // Constructor
  explicit Response(T value, std::unique_ptr<Azure::Core::Http::RawResponse> rawResponse)
      : Value(std::move(value)), RawResponse(std::move(rawResponse))
  {
  }
};
```

Usage example:

```cpp
// When calling a service operation that returns a response
auto response = blobClient.GetProperties();

// Accessing the returned value
auto blobProperties = response.Value;

// Accessing the raw HTTP response
auto& rawResponse = *response.RawResponse;
auto statusCode = rawResponse.GetStatusCode();
```

### Nullable\<T>

`Azure::Nullable<T>` represents a value that may or may not be present. It's similar to `std::optional` (C++17), but is available even when compiling with C++14.

```cpp
template <class T> class Nullable final {
public:
  // Constructs an empty Nullable
  constexpr Nullable() : m_hasValue(false) {}
  
  // Constructs a Nullable with a value
  constexpr Nullable(T initialValue) : m_value(std::move(initialValue)), m_hasValue(true) {}
  
  // Check if the Nullable contains a value
  bool HasValue() const noexcept { return m_hasValue; }
  
  // Retrieve the value (throws if empty)
  T& Value() & noexcept;
  const T& Value() const& noexcept;
  
  // Get the value or a default
  typename std::remove_cv<T>::type ValueOr(U&& defaultValue) const&;
  
  // Reset to empty state
  void Reset() noexcept;
  
  // Boolean conversion operator
  explicit operator bool() const noexcept { return HasValue(); }
  
  // Dereference operators
  T* operator->() { return std::addressof(m_value); }
  const T* operator->() const { return std::addressof(m_value); }
  T& operator*() & { return m_value; }
  const T& operator*() const& { return m_value; }
};
```

Usage example:

```cpp
// A property that might not have a value
Azure::Nullable<std::string> versionId = blobProperties.VersionId;

// Check if it has a value
if (versionId.HasValue()) {
    // Use versionId.Value() or *versionId
    std::string version = versionId.Value();
    // OR
    std::string version = *versionId;
}

// Using ValueOr to provide a default
std::string version = versionId.ValueOr("default-version");

// Boolean context
if (versionId) {
    // versionId has a value
}
```

### Operation\<T>

`Azure::Core::Operation<T>` represents a long-running operation (LRO) that may not complete immediately. It allows checking the status of the operation and waiting for completion.

```cpp
template <class T> class Operation {
public:
  // Get the current status of the operation
  OperationStatus const& Status() const noexcept;
  
  // Poll for status updates
  Http::RawResponse const& Poll();
  Http::RawResponse const& Poll(Context const& context);
  
  // Wait for the operation to complete
  Response<T> PollUntilDone(std::chrono::milliseconds period);
  Response<T> PollUntilDone(std::chrono::milliseconds period, Context& context);
  
  // Get the result value (only valid when the operation is complete)
  virtual T Value() const = 0;
  
  // Get the raw HTTP response from the last poll
  Http::RawResponse const& GetRawResponse() const;
  
  // Get a token to resume the operation later
  virtual std::string GetResumeToken() const = 0;
};
```

Usage example:

```cpp
// Start a long-running operation
auto operation = sourceBlob.StartCopyFromUri(destinationUri);

// Check the status
if (operation.Status() == Azure::Core::OperationStatus::Succeeded) {
    // Operation already completed
}

// Poll for status updates
operation.Poll();

// Wait for the operation to complete
auto response = operation.PollUntilDone(std::chrono::seconds(1));

// Access the result
auto blobProperties = response.Value;
```

### PagedResponse\<T>

`Azure::Core::PagedResponse<T>` provides an interface for handling paginated results from Azure services.

```cpp
template <class T> class PagedResponse {
public:
  // The current page token
  std::string CurrentPageToken;
  
  // The token for the next page (empty if no more pages)
  Azure::Nullable<std::string> NextPageToken;
  
  // Move to the next page
  void MoveToNextPage(const Context& context = {});
  
  // Check if there are more pages
  bool HasPage() const;
};
```

Usage example:

```cpp
// Get a paged list of containers
auto response = blobServiceClient.ListBlobContainers();

// Process each page
do {
    // Process the current page's results
    for (const auto& container : response.BlobContainers) {
        std::cout << "Container name: " << container.Name << std::endl;
    }
    
    // Continue to next page if available
    if (response.HasPage()) {
        response.MoveToNextPage();
    } else {
        break;
    }
} while (true);
```

### Context

`Azure::Core::Context` allows controlling the lifetime of operations and supports cancellation.

```cpp
class Context {
public:
  // Default constructor creates a context with no cancellation
  Context() noexcept;
  
  // Create a context with a timeout
  static Context WithDeadline(Azure::DateTime deadline);
  static Context WithTimeout(std::chrono::milliseconds timeout);
  
  // Create a context with a cancellation signal
  static Context WithCancellation();
  
  // Check if the context has been cancelled
  bool IsCancelled() const noexcept;
  
  // Throw an exception if the context has been cancelled
  void ThrowIfCancelled() const;
  
  // Cancel the context
  static void Cancel(Context& context);
};
```

Usage example:

```cpp
// Create a context with a 30-second timeout
auto context = Azure::Core::Context::WithTimeout(std::chrono::seconds(30));

// Use the context with an operation
auto response = blobClient.DownloadTo(outputStream, {}, context);

// Create a cancelable context
auto cancelableContext = Azure::Core::Context::WithCancellation();

// Cancel the context from another thread
std::thread([&cancelableContext]() {
    std::this_thread::sleep_for(std::chrono::seconds(5));
    Azure::Core::Context::Cancel(cancelableContext);
}).detach();
```

### ETag

`Azure::ETag` represents an HTTP entity tag used for conditional operations.

```cpp
class ETag final {
public:
  // Create an ETag from a string
  explicit ETag(std::string etag);
  
  // Get the string representation
  const std::string& ToString() const;
  
  // Comparison operators
  bool operator==(const ETag& other) const;
  bool operator!=(const ETag& other) const;
};
```

Usage example:

```cpp
// Get the ETag from blob properties
Azure::ETag etag = blobProperties.ETag;

// Use the ETag for conditional operations
Azure::Storage::Blobs::DeleteBlobOptions options;
options.IfMatch = etag;
blobClient.Delete(options);
```

### DateTime

`Azure::DateTime` represents a date and time value with timezone information.

```cpp
class DateTime final {
public:
  // Create a DateTime representing the current time in UTC
  static DateTime Now();
  
  // Parse from string formats
  static DateTime Parse(const std::string& dateTime);
  
  // Format to string
  std::string ToString() const;
};
```

Usage example:

```cpp
// Get the last modified time of a blob
Azure::DateTime lastModified = blobProperties.LastModified;

// Format as a string
std::string formattedTime = lastModified.ToString();

// Use in conditional operations
Azure::Storage::Blobs::GetBlobPropertiesOptions options;
options.IfModifiedSince = lastModified;
```

### Http::RawResponse

`Azure::Core::Http::RawResponse` represents an HTTP response from a service.

```cpp
class RawResponse final {
public:
  // Get HTTP status code
  HttpStatusCode GetStatusCode() const;
  
  // Get the reason phrase
  const std::string& GetReasonPhrase() const;
  
  // Get headers
  const CaseInsensitiveMap& GetHeaders() const;
  
  // Get HTTP version
  int32_t GetMajorVersion() const;
  int32_t GetMinorVersion() const;
  
  // Access the body
  std::vector<uint8_t> const& GetBody() const;
  std::unique_ptr<Azure::Core::IO::BodyStream> ExtractBodyStream();
};
```

Usage example:

```cpp
// Access the raw HTTP response
auto& rawResponse = *response.RawResponse;

// Get status code
auto statusCode = rawResponse.GetStatusCode();
if (statusCode == Azure::Core::Http::HttpStatusCode::Ok) {
    // Handle success case
}

// Get headers
auto contentType = rawResponse.GetHeaders().at("content-type");

// Get body as bytes
const auto& bodyBytes = rawResponse.GetBody();
```

## Error Handling

### RequestFailedException

`Azure::Core::RequestFailedException` is the base exception type for service errors.

```cpp
class RequestFailedException : public std::runtime_error {
public:
  // Constructor
  RequestFailedException(
      std::string message,
      std::unique_ptr<Azure::Core::Http::RawResponse> rawResponse);
  
  // Get the status code from the response
  Azure::Core::Http::HttpStatusCode StatusCode;
  
  // Get the error code returned by the service
  std::string ErrorCode;
  
  // Get the request ID for troubleshooting
  std::string RequestId;
  
  // Access the raw response that caused this exception
  const Azure::Core::Http::RawResponse& RawResponse() const;
};
```

Usage example:

```cpp
try {
    auto response = blobClient.Delete();
}
catch (const Azure::Core::RequestFailedException& e) {
    std::cerr << "Status code: " << static_cast<int>(e.StatusCode) << std::endl;
    std::cerr << "Error code: " << e.ErrorCode << std::endl;
    std::cerr << "Message: " << e.what() << std::endl;
    std::cerr << "Request ID: " << e.RequestId << std::endl;
}
```

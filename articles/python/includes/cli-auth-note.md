This code uses CLI-based authentication (using `AzureCliCredential`) because it demonstrates actions that you might otherwise do with the Azure CLI directly. In both cases you're using the same identity for authentication.

To use such code in a production script (for example, to automate VM management), use `DefaultAzureCredential` (recommended) or a service principal based method as describe in [How to authenticate Python apps with Azure services](../azure-sdk-authenticate.md).

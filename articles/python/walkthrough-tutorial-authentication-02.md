---
title: "Walkthrough, Part 2: Authenticate Python apps with Azure services"
description: A discussion of the different authentication needs and challenges in the example scenario, and how those challenges are met with Azure integrated authentication.
ms.date: 05/27/2025
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 2: Authentication needs in this example scenario

[Previous part: Introduction and background](walkthrough-tutorial-authentication-01.md)

In this example scenario, the main application has three distinct authentication requirements:

* Azure Key Vault

  The application must authenticate with Azure Key Vault in order to retrieve a securely stored API key needed to call a third-party service.

* Third-party API

  Once the API key is retrieved, the application uses it to authenticate with the external third-party API.

* Azure Queue Storage

  After processing the request, the application must authenticate with Azure Queue Storage to enqueue a message for asynchronous or deferred processing.

These tasks require the app to manage three sets of credentials:

* Two for Azure resources (Key Vault and Storage)

* One for an external service (third-party API)

## Key authentication challenges

Building secure cloud applications requires careful handling of credentials—especially when multiple services are involved. This example scenario presents several critical challenges:

* Circular dependency on Key Vault

  The application uses Azure Key Vault to securely store secrets, such as third-party API keys or Azure Storage credentials. However, to retrieve those secrets, the app must first authenticate with Key Vault. This creates a circular problem: The app needs credentials to access Key Vault, but those credentials must themselves be stored securely. Without a secure solution, this could lead to hardcoded credentials or insecure configurations in development environments.

* Secure handling of third-party API keys

  After retrieving the API key from Key Vault, the application must use it to call an external third-party service. This key must be handled with extreme care:

  * Never hardcoded in source code or configuration files
  * Never logged to stdout, stderr, or application logs
  * Held only in memory and accessed at runtime, just before use
  * Disposed promptly after the request is complete

  Failure to follow these practices increases the risk of credential leakage or unauthorized use.

* Securing Azure Queue Storage credentials

  To write messages to Azure Queue Storage, the app typically needs a connection string or shared access token. These credentials:

  * Must be stored in a secure location like Key Vault
  * Must not appear in logs, stack traces, or developer tools
  * Should be accessed only through secure runtime mechanisms
  * Require proper RBAC configuration if using managed identity

* Environment Flexibility

  The app must run reliably in both local development and cloud production environments, using the same codebase and minimal conditional logic. This means:

  * No environment-specific secrets embedded in the code
  * No need to manually toggle credentials or logic paths
  * Consistent use of identity-based authentication across environments

## Azure-First authentication with Microsoft Entra ID

Hardcoding secrets or placing them in config files is a common but risky practice. To address this security issue, Azure provides Microsoft Entra ID as a secure identity platform that integrates natively with services like Key Vault and Storage.

With Microsoft Entra managed identities, you can:

* Eliminate credential handling in code
* Authenticate securely with Azure services
* Use the same identity model across environments

## Environment-specific identity flow

**Azure**:

* A managed identity is assigned to your app (App Service, Function, etc.).
* Azure handles all token generation and lifecycle management.
* Your app accesses Azure services (Key Vault, Storage, etc.) using RBAC or access policies.

**Local development environment**:

* A service principal acts as the app’s identity during development.
* You authenticate the CLI (for example, via az login) or provide environment variables.
* The same code still works—only the identity source changes.

In both environments, Azure SDKs use the `DefaultAzureCredential`, which abstracts away the identity source and selects the right method automatically.

## Best practices for secure development

While it's possible to set secrets as environment variables (for example, via Azure App Settings), this approach has downsides:

* You must manually replicate secrets in local environments.
* There’s a risk of secrets leaking into source control.
* Additional logic may be required to differentiate between environments.

Instead, the recommended approach is:

* Use Key Vault to store third-party API keys and other secrets.
* Assign managed identity to your deployed app.
* Use a service principal for local development and assign it the same access rights.
* Use DefaultAzureCredential in your code to abstract authentication logic.
* Avoid storing or logging any credentials.

## Authentication flow in practice

Here’s how authentication works at runtime:

* Your code creates a `DefaultAzureCredential` instance.
* You use this credential to instantiate a client (for example, SecretClient, QueueServiceClient).
* When the app invokes a method (for example, get_secret()), the client uses the credential to authenticate the request.
* Azure verifies the identity and checks whether it has the correct role or policy to perform the operation.

This flow ensures that your app can securely access Azure services without embedding secrets in code or configuration files. It also allows you to seamlessly switch between local development and cloud deployment without changing your authentication logic.

> [!div class="nextstepaction"]
> [Part 3 - Third-party API implementation >>>](walkthrough-tutorial-authentication-03.md)

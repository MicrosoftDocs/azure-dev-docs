---
title: "Walkthrough, Part 2: Authenticate Python apps with Azure services"
description: A discussion of the different authentication needs and challenges in the example scenario, and how those challenges are met with Azure integrated authentication.
ms.date: 05/27/2025
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 2: Authentication needs in the scenario

[Previous part: Introduction and background](walkthrough-tutorial-authentication-01.md)

In this example scenario, the main application has three distinct authentication requirements:

* Azure Key Vault

  Authenticate to retrieve a securely stored third-party API key.

* Third-Party API

  Authenticate using the API key obtained from Key Vault.

* Azure Queue Storage

  Authenticate to enqueue a message using credentials for the associated storage account.

These tasks require the app to manage three sets of credentials:

* Two for Azure resources (Key Vault and Storage)

* One for an external service (third-party API)

## Credential management challenges

* Circular dependency on Key Vault

  To securely store and retrieve secrets, the app relies on Azure Key Vault. But accessing Key Vault itself requires initial credentials—creating a circular dependency: The app needs credentials to access Key Vault, but those credentials must also be stored securely.

* Secure Handling of Third-Party API Keys

  The API key retrieved from Key Vault must:

  * Not be hardcoded or logged
  * Be held only in memory temporarily
  * Be accessed only at runtime, when required

* Securing Azure Queue Storage Credentials

  * To interact with Azure Queue Storage, the app requires a connection string or token. These credentials must:
  * Be stored securely (not in code)
  * Avoid exposure through logs or dev tools

* Environment Flexibility

  The authentication mechanism must support both local development and cloud deployment—without duplicating logic or introducing fragile environment-specific configurations.

## Azure-First Authentication with Microsoft Entra ID

Hardcoding secrets or placing them in config files is a common but risky practice. To address this, Azure provides Microsoft Entra ID as a secure identity platform that integrates natively with services like Key Vault and Storage.

With Microsoft Entra managed identities, you can:

* Eliminate credential handling in code
* Authenticate securely with Azure services
* Use the same identity model across environments

## Environment-Specific Identity Flow

In Azure:

* A managed identity is assigned to your app (App Service, Function, etc.).
* Azure handles all token generation and lifecycle management.
* Your app accesses Azure services (Key Vault, Storage, etc.) using RBAC or access policies.

In local development environment:

* A service principal acts as the app’s identity during development.
* You authenticate the CLI (e.g., via az login) or provide environment variables.
* The same code still works—only the identity source changes.

In both environments, Azure SDKs use the `DefaultAzureCredential`, which abstracts away the identity source and selects the right method automatically.

## Best Practices for Secure Development

While it's possible to set secrets as environment variables (e.g., via Azure App Settings), this approach has downsides:

* You must manually replicate secrets in local environments.
* There’s a risk of secrets leaking into source control.
* Additional logic may be required to differentiate between environments.

Instead, the recommended approach is:

* Use Key Vault to store third-party API keys and other secrets.
* Assign managed identity to your deployed app.
* Use a service principal for local development and assign it the same access rights.
* Use DefaultAzureCredential in your code to abstract authentication logic.
* Avoid storing or logging any credentials.

Authentication Flow in Practice

Here’s how authentication works at runtime:

* Your code creates a DefaultAzureCredential instance.
* You use this credential to instantiate a client (e.g., SecretClient, QueueServiceClient).
* When the app invokes a method (e.g., get_secret()), the client uses the credential to authenticate the request.
* Azure verifies the identity and checks whether it has the correct role or policy to perform the operation.

This flow ensures that your app can securely access Azure services without embedding secrets in code or configuration files. It also allows you to seamlessly switch between local development and cloud deployment without changing your authentication logic.

The remainder of this tutorial demonstrates all the details of the process in the context of the example scenario and the accompanying sample code.

In the sample's provisioning script, all of the resources are created under a resource group named `auth-scenario-rg`. This group is created using the Azure CLI [`az group create`](/cli/azure/group#az-group-create) command.

> [!div class="nextstepaction"]
> [Part 3 - Third-party API implementation >>>](walkthrough-tutorial-authentication-03.md)

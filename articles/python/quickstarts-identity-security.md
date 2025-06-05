---
title: Overview and resources for Azure identity and access management features for Python apps
description: Overview and links to resources about authentication, identity, and access management for Python apps on Azure.
ms.date: 06/02/2025
ms.topic: concept-article
ms.custom: devx-track-python, py-fresh-zinc
---

# Identity and access management for Python apps on Azure

In Azure, identity and access management (IAM) for Python applications involves two key concepts:

* **Authentication**: Verifying the identity of a user, group, service, or application
* **Authorization**: Determining what actions that identity is allowed to perform on Azure resources

Azure provides multiple IAM options to fit your application's security requirements. This article includes links to essential resources to help you get started.

To learn more, see [Recommendations for identity and access management](/azure/well-architected/security/identity-access).

## Passwordless connections

Whenever possible, we recommend using managed identities to simplify identity management and enhance security. Managed identities support passwordless authentication, eliminating the need to embed sensitive credentials—such as passwords or client secrets—in code or environment variables.
Managed identities are available for Azure services like App Service, Azure Functions, and Azure Container Apps. They allow your applications to authenticate to Azure services without needing to manage credentials.

The following resources demonstrate how to use the Azure SDK for Python with passwordless authentication via [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#defaultazurecredential). `DefaultAzureCredential` is ideal for most applications running in Azure, as it seamlessly supports both local development and production environments by chaining multiple credential types in a secure and intelligent order.

* [Overview: Passwordless connection for Azure services](../intro/passwordless-overview.md)

* [Authenticate Python Apps to Azure services using the Azure SDK for Python](./sdk/authentication-overview.md)

* [Use DefaultAzureCredential in an application](./sdk/authentication-overview.md#use-defaultazurecredential-in-an-application)

* [Quickstart: Azure Blob Storage client library for Python with passwordless connections](/azure/storage/blobs/storage-quickstart-blobs-python)

* [Quickstart: Send messages to and receive message from Azure Service Bus queues with passwordless connections](/azure/service-bus-messaging/service-bus-python-how-to-use-queues)

* [Create and deploy a Flask web app to Azure with a system-assigned managed identity](./tutorial-python-managed-identity-cli.md)

* [Create and deploy a Django web app to Azure with a user-assigned managed identity](./tutorial-python-managed-identity-user-assigned-cli.md)

## Service Connector

Many Azure resources commonly used in Python applications support the [Service Connector](/azure/service-connector/overview). The Service Connector streamlines the process of configuring secure connections between Azure services. It automates the setup of authentication, network access, and connection strings between compute services (like App Service or Container Apps) and dependent services (such as Azure Storage, Azure SQL, or Cosmos DB). This reduces manual steps, helps enforce best practices (like using managed identities and private endpoints), and improves deployment consistency and security.

* [Quickstart: Create a service connection in App Service from the Azure portal](/azure/service-connector/quickstart-portal-app-service-connection)

* [Tutorial: Using Service Connector to build a Django app with Postgres on Azure App Service](/azure/service-connector/tutorial-django-webapp-postgres-cli)

## Key Vault

Using a key management solution such as [Azure Key Vault](/azure/key-vault/general/overview) offers greater control over your secrets and credentials, though it comes with added management complexity.

* [Quickstart: Azure Key Vault certificate client library for Python](/azure/key-vault/certificates/quick-create-python)

* [Quickstart: Azure Key Vault keys client library for Python](/azure/key-vault/keys/quick-create-python)

* [Quickstart: Azure Key Vault secret client library for Python](/azure/key-vault/secrets/quick-create-python)

## Authentication and identity for signing in users in apps

You can develop Python applications that allow users to sign in with Microsoft identities (like Azure AD accounts) or external social accounts (such as Google or Facebook). Once authenticated, your app can authorize users to access its own APIs or Microsoft APIs, such as Microsoft Graph, to interact with resources like user profiles, calendars, and emails.

* [Quickstart: Sign in users and call the Microsoft Graph API from a Python web app](/entra/identity-platform/quickstart-web-app-python-sign-in)

* [Web app authentication topics](/entra/identity-platform/index-web-app)

* [Quickstart: Acquire a token and call Microsoft Graph from a Python daemon app](/entra/identity-platform/quickstart-daemon-app-python-acquire-token)

* [Back-end service, daemon, and script authentication topics](/entra/identity-platform/index-service?pivots=devlang-python)

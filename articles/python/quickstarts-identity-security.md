---
title: Quickstarts for Azure identity and security features for Python apps on Azure
description: Overview of getting started material in the Azure documentation for authentication, identity, and security in Python apps.
ms.date: 01/24/2023
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Identity and security for Python apps on Azure

Identity and security for Python apps in Azure are fundamentally about the [*authentication*](/azure/architecture/framework/security/design-identity-authentication) and [*authorization*](/azure/architecture/framework/security/design-identity-authorization) of a user, group, application, or service to access Azure resources. There are different options you can choose from depending on your application and security needs. Here are some guidelines:

* **Passwordless connections**: Whenever possible, we recommend you use managed identities to simplify overall management and improve security. Specifically, use [*passwordless connections*](/azure/developer/intro/passwordless-overview) to avoid using embedding sensitive data such as passwords in code or environment variables.

  * [Overview: Passwordless connection for Azure services](/azure/developer/intro/passwordless-overview)
  * Passwordless connection examples:

    * [Quickstart: Azure Blob Storage client library for Python with passwordless connections](/azure/storage/blobs/storage-quickstart-blobs-python)
    * [Quickstart: Send messages to and receive message from Azure Service Bus queues with passwordless connections](/azure/service-bus-messaging/service-bus-python-how-to-use-queues)

  When programming using the Azure Python SDK (control or data plane), you should use the passwordless connection capabilities of the [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#defaultazurecredential). The `DefaultAzureCredential` is appropriate for most applications that will run in Azure because it combines common production credentials with development credentials.

    * [Authenticate Python Apps to Azure services using the Azure SDK for Python](/azure/developer/python/sdk/authentication-overview)

* **Service Connector**: Many Azure resources you're likely to use when creating Python apps enable the [Service Connector](/azure/service-connector/overview) service. Service Connector helps you configure network settings and connection information between Azure services such as App Service and Container Apps and other services such as storage or databases.

  * [Quickstart: Create a service connection in App Service from the Azure portal](/azure/service-connector/quickstart-portal-app-service-connection)
  * [Tutorial: Using Service Connector to build a Django app with Postgres on Azure App Service](/azure/service-connector/tutorial-django-webapp-postgres-cli)

* **Key Vault**: In some cases, using a key management solution like [Azure Key Vault](/azure/key-vault/general/overview) gives you more control but with an increase in management complexity.

  * [Quickstart: Azure Key Vault certificate client library for Python](/azure/key-vault/certificates/quick-create-python)
  * [Quickstart: Azure Key Vault keys client library for Python](/azure/key-vault/keys/quick-create-python)
  * [Quickstart: Azure Key Vault secret client library for Python](/azure/key-vault/secrets/quick-create-python)

* **Authentication and identity for signing in users in apps**: You can also build applications to enable your users and customers to sign in to using their Microsoft identities or social accounts. Your app authorizes access to your own APIs or Microsoft APIs like Microsoft Graph.

  * [Quickstart: Add sign-in with Microsoft to a web app](/azure/active-directory/develop/web-app-quickstart)
  * [Quickstart: Acquire a token and call the Microsoft Graph API by using a console app's identity](/azure/active-directory/develop/console-app-quickstart?pivots=devlang-python)

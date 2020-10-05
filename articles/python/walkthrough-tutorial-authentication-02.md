---
title: "Walkthrough, Part 2: Authenticate Python apps with Azure services"
description: A discussion of the different authentication needs and challenges in the example scenario, and how those challenges are met with Azure integrated authentication.
ms.date: 08/24/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 2: Authentication needs in the scenario

[Previous part: Introduction and background](walkthrough-tutorial-authentication-01.md)

Within this example scenario, the main app has the following authentication requirements:

- Authenticate with Azure Key Vault to access the stored third-party API key.
- Authenticate with the third-party API using the API key.
- Authenticate with Azure Queue Storage using the necessary credentials for the storage account.

With these three distinct requirements, the application has to manage three sets of credentials: two for Azure resources (Key Vault and Queue Storage) and one for an external resource (the third-party API).

As noted earlier, you can securely manage all the credentials in Key Vault except for those credentials needed for Key Vault itself. Once authenticated with Key Vault, the application can then retrieve any other keys at run time to authenticate with services like Queue Storage.

This approach, however, still requires the app to separately manage credentials for Key Vault. How, then, can you manage that credential securely and have it work both for local development and in your production deployment in the cloud?

A partial solution is to store the key in a server-side environment variable (that is, through an application setting with Azure App Service and Azure Functions), which at least keeps the key out of source control. However, to run the code on a developer workstation you must replicate that environment variable locally, which risks exposure of the credentials and/or accidental inclusion in source control. You could work around the problem to some extent by implementing special procedures in the development version of your code, but doing so adds complexity to your development process.

Fortunately, integrated authentication with Azure Active Directory (AD) allows an app to avoid handling any Azure credentials at all.

## Integrated authentication with managed identity

Many Azure services, like Storage and Key Vault, are integrated with Azure Active Directory (Azure AD) such that when you authenticate the application with Azure AD using a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview), it's automatically authenticated with other connected resources. Authorization for the identity is handled through [role-based access control (RBAC)](/azure/role-based-access-control/role-assignments-steps) and occasionally through other access policies.

This integration means that you never need to handle any Azure-related credentials in your app code and those credentials never appear on developer workstations or in source control. Furthermore, any handling of keys for third-party APIs and services is done entirely at run time, thus keeping those keys secure.

Managed identity specifically works with apps that are deployed to Azure. For local development, you create a separate service principal to serve as the app identity when running locally. You make this service principal available to the Azure libraries using environment variables as described on [Configure your local development environment - configure authentication](configure-local-development-environment.md#configure-authentication). You also assign role permissions to this service principal alongside the managed identity used in the cloud.

Once you do these steps for the local service principal, the same code works both locally and in the cloud to authenticate the app with Azure resources. These details are discussed in [How to authenticate and authorize apps](azure-sdk-authenticate.md), but the short version is as follows:

1. In your code, create a `DefaultAzureCredential` object that automatically uses your managed identity when running on Azure and your separate service principal when running locally.

1. Use this credential when you create the appropriate client object for whatever resource you want to access (Key Vault, Queue Storage, etc.).

1. Authentication then takes place when you call an operation method through the client object, which generates a REST API call to the resource.

1. If the app identity is valid, then Azure also checks whether that identity is also authorized for the specific operation.

The remainder of this tutorial demonstrates all the details of the process in the context of the example scenario and the accompanying sample code.

In the sample's provisioning script, all of the resources are created under a resource group named `auth-scenario-rg`. This group is created using the Azure CLI [`az group create`](/cli/azure/group?view=azure-cli-latest#az-group-create) command.

> [!div class="nextstepaction"]
> [Part 3 - Example third-party API implementation >>>](walkthrough-tutorial-authentication-03.md)

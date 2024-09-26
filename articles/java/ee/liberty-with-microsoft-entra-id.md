---
title: "WebSphere Liberty/Open Liberty with Microsoft Entra ID"
description: Shows you how to secure IBM WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect (OIDC).
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 09/26/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-entra-id, devx-track-extended-java, devx-track-azurecli
---

# Secure WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect

This article shows you how to secure Red Hat WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect (OIDC).

In this article, you learn how to:

> [!div class="checklist"]
> - Set up an OpenID Connect provider with Microsoft Entra ID.
> - Protect a WebSphere Liberty/Open Liberty app by using OpenID Connect.
> - Run and test the WebSphere Liberty/Open Liberty app.

## Prerequisites

[!INCLUDE [secure-with-entra-id-prerequisites](includes/secure-with-entra-id-prerequisites.md)]

## Set up an OpenID Connect provider with Microsoft Entra ID

In this section, you set up an OpenID Connect provider with Microsoft Entra ID for use with your WebSphere Liberty/Open Liberty app. In a later section, you configure the WebSphere Liberty/Open Liberty app by using OpenID Connect to authenticate and authorize users in your Microsoft Entra tenant.

### Create users in Microsoft Entra tenant

[!INCLUDE [secure-with-entra-id-create-users](includes/secure-with-entra-id-create-users.md)]

### Register an application in Microsoft Entra ID

[!INCLUDE [secure-with-entra-id-register-app](includes/secure-with-entra-id-register-app.md)]

### Add app roles to your application

[!INCLUDE [secure-with-entra-id-add-app-roles](includes/secure-with-entra-id-add-app-roles.md)]

## Protect a WebSphere Liberty/Open Liberty app by using OpenID Connect

In this section, you secure a WebSphere Liberty/Open Liberty app that authenticates and authorizes users in your Microsoft Entra tenant by using OpenID Connect. You also learn how to give users access to certain parts of the app using role-based access control (RBAC).

The sample WebSphere Liberty/Open Liberty app for this quickstart is on GitHub in the [liberty-entra-id](https://github.com/Azure-Samples/liberty-entra-id/tree/2024-09-26) repository.

## Run and test the WebSphere Liberty/Open Liberty app

In this section, you run and test the WebSphere Liberty/Open Liberty app to see how it works with Microsoft Entra ID as the OpenID Connect provider.

### Run the WebSphere Liberty/Open Liberty app

### Test the WebSphere Liberty/Open Liberty app

#### Gather the credentials for the two users

[!INCLUDE [secure-with-entra-id-gather-user-credentials](includes/secure-with-entra-id-gather-user-credentials.md)]

#### Exercise the functionality of the app

## Clean up resources

[!INCLUDE [secure-with-entra-id-clean-up-resources](includes/secure-with-entra-id-clean-up-resources.md)]

## Next steps

In this quickstart, you protect WebSphere Liberty/Open Liberty applications with Microsoft Entra ID using OpenID Connect. To learn more, explore the following resources:

- [Deploy a Java application with Open Liberty or WebSphere Liberty on Azure Container Apps](/azure/developer/java/ee/deploy-java-liberty-app-aca)
- [Deploy WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-liberty-app)
- [Deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-liberty-app)
- [OpenID Connect authentication with Microsoft Entra ID](/entra/architecture/auth-oidc)
- [Microsoft identity platform and OAuth 2.0 authorization code flow](/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Authenticating users through social media providers](https://openliberty.io/guides/social-media-login.html)
- [Social Media Login 1.0](https://openliberty.io/docs/latest/reference/feature/socialLogin-1.0.html)
- [OpenID Connect Client 1.0](https://openliberty.io/docs/latest/reference/feature/openidConnectClient-1.0.html)

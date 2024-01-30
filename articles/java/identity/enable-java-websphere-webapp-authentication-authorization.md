---
title: Enable your Java Websphere web app to sign in users and call APIs with the Microsoft identity platform
description: "Tutorial: Enable your Java Websphere webapp to sign users in, protect endpoints, call APIs with the Microsoft identity platform"
services: active-directory
documentationcenter: java
ms.date: 02/01/2024
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, devx-track-extended-java
adobe-target: true
---

# Tutorial: Enable your Java Websphere web app to sign in users and call APIs with the Microsoft identity platform

The [Microsoft identity platform](https://learn.microsoft.com/entra/identity-platform/v2-overview), along with [Entra ID](https://learn.microsoft.com/entra/fundamentals/whatis) (Entra ID) and [Azure Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/overview) (Azure AD B2C) are central to the **Azure** cloud ecosystem. This tutorial aims to take you through the fundamentals of modern authentication using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)

We recommend following the chapters in successive order. However, the code samples are self-contained, so feel free to pick samples by topics that you may need at the moment.


## Prerequisites

- Java 8. This sample has been developed on Java 8 but should be compatible with some higher versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [Websphere](https://www.ibm.com/support/pages/v905-download-websphere-application-server-version-905-passport-advantage-online)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [VS Code Azure Tools Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

Please refer to each chapter's README for sample-specific prerequisites.

## Recommendations

- Some familiarity with the [Java / Jakarta Servlets](https://projects.eclipse.org/projects/ee4j.servlet)
- Some familiarity with Linux/OSX terminal or Windows PowerShell
- [jwt.ms](https://jwt.ms) for inspecting your tokens.
- [Fiddler](https://www.telerik.com/fiddler) for monitoring your network activity and troubleshooting.
- Follow the [Entra ID Blog](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/bg-p/Identity) to stay up-to-date with the latest developments.

Please refer to each sample's README for sample-specific recommendations.

## Contents

### Chapter 1: Enable your web application to sign in users

|               |               |
|---------------|---------------|
| <img src="media/sign-in.png" width="200"> | [**1.1 Sign-in with Entra ID**](./enable-java-websphere-webapp-authentication-entra-id) </br> Sign your users in with **Entra ID** and learn to work with **ID Tokens**.  |
| <img src="media/sign-in.png" width="200"> | [**1.2 Sign-in with Azure AD B2C**](./enable-java-websphere-webapp-authentication-azure-ad-b2c) </br> Sign your customers in with **Azure AD B2C**. Learn to integrate with **external social identity providers**. Learn how to use **user-flows** and **custom policies**. |

### Chapter 2: Get an Access Token and call Microsoft Graph

|                |               |
|----------------|---------------|
| <img src="media/topology.png" width="200"> | [**2.1 Acquire an Access Token from Entra ID and call Microsoft Graph**](./2enable-java-websphere-webapp-authorization-entra-id) </br> Enable your web app to acquire an Access Token to Authorize it to call **Microsoft Graph API**. |


### Chapter 3: Restrict access to routes based on group and / or role membership

|                |               |
|----------------|---------------|
| <img src="media/sign-in.png" width="200"> | [**3.1 Acquire an ID Token with the roles claim**](./enable-java-websphere-webapp-authorization-role-entra-id) </br> Enable your web app to acquire an ID Token with the **Roles** claim. Filter access to routes based on the role membership. |
| <img src="media/sign-in.png" width="200"> | [**3.2 Acquire an ID Token with the Groups claim**](./enable-java-websphere-webapp-authorization-group-entra-id) </br> Enable your web app to acquire an ID Token with a **Groups** claim. Filter access to routes based on the role membership. Learn how to call Graph to handle edge cases where the user is a member of too many groups to fit into an ID Token. |

### Chapter 4: Deploy your app to Azure Virtual Machines

|                 |               |
|-----------------|---------------|
| <img src="media/sign-in.png" width="200"> | [**4.1 Deploy to Azure Virtual Machines**](https://learn.microsoft.com/azure/developer/java/migration/migrate-websphere-to-azure-vm-manually?tabs=in-bash%2Cwas-nd-v9) </br> Prepare your app for deployment to Azure Virtual Machines. Learn how to package and upload files, configure authentication parameters and use various Azure services for managing your operations. |



## More information

Learn more about the **Microsoft identity platform**:

- [Microsoft identity platform](https://learn.microsoft.com/entra/identity-platform/)
- [Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/)
- [Overview of Microsoft Authentication Library (MSAL)](https://learn.microsoft.com/entra/identity-platform/msal-overview)
- [Application types for Microsoft identity platform](https://learn.microsoft.com/entra/identity-platform/v2-app-types)
- [Understanding Entra ID application consent experiences](https://learn.microsoft.com/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](https://learn.microsoft.com/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Entra ID](https://learn.microsoft.com/entra/identity-platform/app-objects-and-service-principals)
- [Microsoft identity platform best practices and recommendations](https://learn.microsoft.com/entra/identity-platform/identity-platform-integration-checklist)

See more code samples:

- [MSAL code samples](https://learn.microsoft.com/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [MSAL B2C code samples](https://docs.microsoft.com/azure/active-directory-b2c/code-samples)


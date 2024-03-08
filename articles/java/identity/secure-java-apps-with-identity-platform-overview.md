---
title: Secure Java apps using the Microsoft identity platform
titleSuffix: Azure
description: Provides an overview of recommended strategies for securing Java applications with the Microsoft identity platform.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Get started with securing Java application with the Microsoft identity platform

This series of articles provides an overview of recommended strategies for securing Java applications with the Microsoft identity platform.

## Get started

The [Microsoft identity platform](/entra/identity-platform/v2-overview), along with [Microsoft Entra ID](/entra/fundamentals/whatis) (Entra ID) and [Azure Azure Active Directory B2C](/azure/active-directory-b2c/overview) (Azure AD B2C) are central to the **Azure** cloud ecosystem. This tutorial aims to take you through the fundamentals of modern authentication using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)

## Next steps

The guidance is available for multiple server platforms: JBoss EAP, Tomcat, WebLogic, WebSphere, and Java Spring Boot.

We recommend following the articles in successive order for your platform of choice. However, the code samples are self-contained, so feel free to pick samples by topics that you may need at the moment.

Each platform has guidance on the following tasks:

- Sign your users in with Microsoft Entra ID and learn to work with ID tokens.
- Sign your customers in with Azure AD B2C. Learn to integrate with external social identity providers. Learn how to use user flows and custom policies.
- Enable your web app to acquire an access token to Authorize it to call Microsoft Graph API. This can be used to get extra user details from the Microsoft Graph API.
- Enable your web app to acquire an ID token with the roles claim. You can use this token to filter access to routes based on the role membership.
- Enable your web app to acquire an ID token with a groups claim. This can be used to filter access to routes based on the role membership. You also learn how to call Graph to handle edge cases where the user is a member of too many groups to fit into an ID Token.
- Deploy your app to the Azure platform.

## More information

Learn more about the Microsoft identity platform from the following articles:

- [Microsoft identity platform](/entra/identity-platform/)
- [Azure Active Directory B2C](/azure/active-directory-b2c/)
- [Overview of Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview)
- [Application types for the Microsoft identity platform](/entra/identity-platform/v2-app-types)
- [Understanding Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals)
- [Microsoft identity platform best practices and recommendations](/entra/identity-platform/identity-platform-integration-checklist)

See more code samples at the following locations:

- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [MSAL B2C code samples](/azure/active-directory-b2c/code-samples)

---
title: Secure Java apps using the Microsoft identity platform
titleSuffix: Azure
description: Provides an overview of recommended strategies for securing Java applications with the Microsoft identity platform.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: get-started
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Get started with securing Java application with the Microsoft identity platform

This series of articles provides an overview of recommended strategies for securing Java applications with the [Microsoft identity platform](/entra/identity-platform/v2-overview).


The Microsoft identity platform, along with [Microsoft Entra ID](/entra/fundamentals/whatis) (Entra ID) and [Azure Azure Active Directory B2C](/azure/active-directory-b2c/overview) (Azure AD B2C) are central to the Azure cloud ecosystem. This guidance takes you through the fundamentals of modern authentication using the [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java).

The guidance is available for the following server platforms: Java Spring Boot, Tomcat, JBoss EAP, WebLogic, and WebSphere.

We recommend that you follow the articles in order for your platform of choice. However, the articles and code samples are self-contained, so you can use whichever article you need.

Each platform has guidance on the following tasks:

- Enable sign-in for your users with Microsoft Entra ID and learn to work with ID tokens.
- Enable sign-in for your customers with Azure AD B2C. Learn how to integrate with external social identity providers. Learn how to use user flows and custom policies.
- Enable your app to acquire an access token to authorize it to call the Microsoft Graph API. You can use the Microsoft Graph API to access extra user details.
- Enable your app to acquire an ID token with the roles claim. You can use this token to filter access to routes based on role membership.
- Enable your app to acquire an ID token with a groups claim. You can use this token to filter access to routes based on group membership. You also learn how to call Microsoft Graph to handle edge cases where the user is a member of too many groups to fit into an ID token.
- Deploy your app to the Azure platform.

## Next steps

To read all the guidance for a particular platform, start with one of the following articles:

- [Secure your Java Spring Boot app](enable-spring-boot-webapp-authentication-entra-id.md)
- [Secure your Java Tomcat app](enable-java-tomcat-webapp-authentication-entra-id.md)
- [Secure your Java JBoss EAP app](enable-java-jboss-eap-webapp-authentication-entra-id.md)
- [Secure your Java WebLogic app](enable-java-weblogic-webapp-authentication-entra-id.md)
- [Secure your Java WebSphere app](enable-java-websphere-webapp-authentication-entra-id.md)
- [Secure your Java WebSphere Liberty/Open Liberty app](../ee/liberty-with-microsoft-entra-id.md?toc=/azure/developer/java/identity/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Secure your Java Quarkus app](../ee/quarkus-with-microsoft-entra-id.md?toc=/azure/developer/java/identity/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

## More information

To learn more about the Microsoft identity platform, see the following articles:

- [Microsoft identity platform](/entra/identity-platform/)
- [Azure Active Directory B2C](/azure/active-directory-b2c/)
- [Overview of Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview)
- [Application types for the Microsoft identity platform](/entra/identity-platform/v2-app-types)
- [Consent experience for applications in Microsoft Entra ID](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals)
- [Microsoft identity platform best practices and recommendations](/entra/identity-platform/identity-platform-integration-checklist)

For more code samples, see the following articles:

- [Microsoft identity platform code samples - Java](/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [Azure Active Directory B2C code samples](/azure/active-directory-b2c/code-samples)

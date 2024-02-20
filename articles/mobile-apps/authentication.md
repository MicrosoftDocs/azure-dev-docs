---
title: Add authentication to your mobile apps with Visual Studio App Center and Azure services
description: Learn about the services such as Visual Studio App Center that help set up user authentication and enable mobile applications to authenticate with social accounts, Microsoft Entra ID, and custom authentication.
author: codemillmatt
ms.assetid: 34a8a070-2222-4faf-9090-ccff02097224
ms.service: mobile-services
ms.topic: article
ms.date: 02/18/2024
ms.author: masoucou
ms.custom: team=cloud_advocates
ms.contributors: masoucou-06082020
---

# Add authentication and manage user identities in your mobile apps

Having a view of the user and their behavior across your application empowers developers to better engage users by creating tailored experiences for them. Whether you're an application developer who is building a collaboration application for users inside your organization or you're creating the next social network platform, you need a way to authenticate users and manage user identities. An identity management service is one of the most important features of a mobile back-end service.

Use the following services to enable user authentication in your mobile apps.

## Azure Active Directory B2C

[Azure AD B2C](https://azure.microsoft.com/services/active-directory-b2c/) is a business-to-consumer (B2C) identity management service that developers can use to authenticate their customers. This white-label service lets developers customize and control how users securely interact with their web, desktop, mobile, or single-page applications. Using Azure AD B2C, users can sign up, sign in, reset passwords, and edit profiles. Azure AD B2C implements a form of the OpenID Connect and OAuth 2.0 protocols. 

### Azure Active Directory B2C features

- Securely authenticate customers with their preferred identity provider.
- Manage customer identity and access.
- Gain sign-in support for social media such as Facebook, GitHub, Google, LinkedIn, Twitter, WeChat, and Weibo.
- Connect to your user accounts by using industry standard protocols, such as OpenID Connect or SAML, to make identity management possible on a variety of platforms.
- Provide branded registration and sign-in experiences.
- Easily integrate with CRM databases, marketing analytics tools, and account verification systems.
- Capture sign-in, preference, and conversion data for customers.

### Azure Active Directory B2C references

- [Azure portal](https://portal.azure.com/)
- [Azure AD B2C documentation](/azure/active-directory-b2c/)
- [Quickstarts](/azure/active-directory-b2c/active-directory-b2c-quickstarts-web-app)
- [Samples](/azure/active-directory-b2c/code-samples)

<a name='azure-active-directory'></a>

## Microsoft Entra ID

[Microsoft Entra ID](https://azure.microsoft.com/services/active-directory/) is Microsoft's cloud-based identity and access management service, which helps your employees to sign in and gain access to:

- External resources, such as Microsoft 365, the Azure portal, and thousands of other software as a service (SaaS) applications.
- Internal resources, such as apps on your corporate network and intranet, along with any cloud apps developed by your own organization.

<a name='azure-active-directory-features'></a>

### Microsoft Entra features

- Seamless, highly secure access by connecting users to the applications they need.
- Comprehensive identity protection and enhanced security for identities and access based on user, location, device, data, and application context.
- Thousands of pre-integrated apps for both commercial and custom applications, such as Microsoft 365, Salesforce.com, and Box.
- Ability to manage access at scale.

<a name='azure-active-directory-references'></a>

### Microsoft Entra ID references

- [Azure portal](https://portal.azure.com/)
- [What is Microsoft Entra ID?](/azure/active-directory/fundamentals/active-directory-whatis)
- [Get started with Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-whatis)
- [Quickstarts](/azure/active-directory/fundamentals/active-directory-access-create-new-tenant)

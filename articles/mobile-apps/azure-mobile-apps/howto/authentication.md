---
title: Authentication and authorization in Azure App Service for mobile apps
description: Learn about authentication and authorization for mobile apps with Azure App Service.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/06/2022
ms.author: adhal
---

# Authentication and authorization in Azure App Service for mobile apps

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This article describes how authentication and authorization works when developing native mobile apps with an App Service back end. App Service provides integrated authentication and authorization, so your mobile apps can sign users in without changing any code in App Service. It provides an easy way to protect your application and work with per-user data.

> [!WARNING]
> This article covers v4.2.0 of the Azure Mobile Apps Client SDK.  The current release uses a new authentication mechanism and does not support Azure App Service Authentication & Authorization in the same way.

For information on how authentication and authorization work in App Service, see [Authentication and authorization in Azure App Service](/azure/app-service/overview-authentication-authorization).

## Authentication with provider SDK

After everything is configured in App Service, you can modify mobile clients to sign in with App Service. There are two approaches here:

* Use an SDK that a given identity provider publishes to establish identity and then gain access to App Service.
* Use a single line of code so that the Mobile Apps client SDK can sign in users.

> [!TIP]
> Most applications should use a provider SDK to get a more consistent experience when users sign in, to use token refresh support, and to get other benefits that the provider specifies.

When you use a provider SDK, users can sign in to an experience that integrates more tightly with the operating system that the app is running on. This method also gives you a provider token and some user information on the client, which makes it much easier to consume graph APIs and customize the user experience. This method is known as the "client flow" or "client-directed flow" because code on the client signs in users.

After a provider token is obtained, it needs to be sent to App Service for validation. Azure App Service validates the token. The service then creates a new token for the client. The Mobile Apps client SDK has helper methods to manage this exchange and automatically attach the token to all requests to the application back end. You can also keep a reference to the provider token.

> [!NOTE]
> Some platforms, such as Windows (WPF), will ONLY work with a client-directed flow.  Others will work equally well with both server and client flow.  If the platform only works with client-directed flow, the quickstart guide will show this.

For more information on the authentication flow, see [App Service authentication flow](/azure/app-service/overview-authentication-authorization#authentication-flow).

## Authentication without provider SDK

If you don't want to set up a provider SDK, you can allow the Azure App Service handle the sign-in for you. The Azure Mobile Apps client SDK will open a web view to the provider of your choosing and sign in the user. This method is called the "server flow" or "server-directed flow" because the server manages the process that signs in users. The client SDK never receives the provider token.

## Submitting a token from the client-directed flow

When using the client-directed flow, first obtain the relevant information that Azure App Service needs to validate the token.  In most cases, the token will be an access token.  For more information, [consult the Azure App Service documentation](/azure/app-service/app-service-authentication-how-to#validate-tokens-from-providers).

You can then build the appropriate JSON object.  For example, if you're using MSAL to do a client-directed flow on .NET in a WPF application, you might use the following code:

``` csharp
var requestBody = new JObject(new JProperty("access_token", authResult.AccessToken));
var userInfo = await mobileClient.login("aad", requestBody);
```

The request body must match the expectations as laid out in [the documentation](/azure/app-service/app-service-authentication-how-to#validate-tokens-from-providers).

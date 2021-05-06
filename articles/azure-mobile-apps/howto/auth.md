---
title: Authentication and authorization in Azure App Service for mobile apps
description: Learn about authentication and authorization for mobile apps with Azure App Service.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Authentication and authorization in Azure App Service for mobile apps

This article describes how authentication and authorization works when developing native mobile apps with an App Service back end. App Service provides integrated authentication and authorization, so your mobile apps can sign users in without changing any code in App Service. It provides an easy way to protect your application and work with per-user data.

For information on how authentication and authorization work in App Service, see [Authentication and authorization in Azure App Service](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization).

## Authentication with provider SDK

After everything is configured in App Service, you can modify mobile clients to sign in with App Service. There are two approaches here:

* Use an SDK that a given identity provider publishes to establish identity and then gain access to App Service.
* Use a single line of code so that the Mobile Apps client SDK can sign in users.

> **TIP**
> Most applications should use a provider SDK to get a more consistent experience when users sign in, to use token refresh support, and to get other benefits that the provider specifies.

When you use a provider SDK, users can sign in to an experience that integrates more tightly with the operating system that the app is running on. This method also gives you a provider token and some user information on the client, which makes it much easier to consume graph APIs and customize the user experience. Occasionally on blogs and forums, it is referred to as the "client flow" or "client-directed flow" because code on the client signs in users, and the client code has access to a provider token.

After a provider token is obtained, it needs to be sent to App Service for validation. After App Service validates the token, App Service creates a new App Service token that is returned to the client. The Mobile Apps client SDK has helper methods to manage this exchange and automatically attach the token to all requests to the application back end. Developers can also keep a reference to the provider token.

> **NOTE**
> Some platforms, such as Windows (WPF), will ONLY work with a client-directed flow.  Others will work equally well with both server and client flow.  If the platform only works with client-directed flow, the quickstart guide will show this.

For more information on the authentication flow, see [App Service authentication flow](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization#authentication-flow).

## Authentication without provider SDK

If you do not want to set up a provider SDK, you can allow the Azure App Service handle the sign-in for you. The Azure Mobile Apps client SDK will open a web view to the provider of your choosing and sign in the user. Occasionally on blogs and forums, it is called the "server flow" or "server-directed flow" because the server manages the process that signs in users, and the client SDK never receives the provider token.

Code to start this flow is included in the authentication tutorial for each platform. At the end of the flow, the client SDK has an App Service token, and the token is automatically attached to all requests to the application backend.

## Submitting a token from the client-directed flow

When using the client-directed flow, first obtain the relevant information that Azure App Service needs to validate the token.  In most cases, the token will be an access token.  However, [consult the documentation](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to#validate-tokens-from-providers).

You can then build the appropriate JSON object.  For example, if you are using MSAL to perform a client-directed flow on .NET in a WPF application, you might use the following code:

``` csharp
var requestBody = new JObject(new JProperty("access_token", authResult.AccessToken));
var userInfo = await mobileClient.login("aad", requestBody);
```

The request body must match the expectations as laid out in [the documentation](https://docs.microsoft.com/azure/app-service/app-service-authentication-how-to#validate-tokens-from-providers).

---
title: Add authentication to your Xamarin.Android app
description: Add authentication to your Xamarin.Android app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/12/2022
ms.author: adhal
---

# Add authentication to your Xamarin.Android app

In this tutorial, you add Microsoft authentication to the TodoApp project using Azure Active Directory. Before completing this tutorial, ensure you have [created the project and deployed the backend](./index.md).

[!INCLUDE [Register with AAD for the backend](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-backend.md)]

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstarts/windows/configure-auth-backend.md)]

## Add authentication to the app

The Microsoft Datasync Framework has built-in support for any authentication provider that uses a Json Web Token (JWT) within a header of the HTTP transaction.  This application will use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to request such a token and authorize the signed in user to the backend service.

[!INCLUDE [Configure a native app for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-client.md)]

Open the `TodoApp.sln` solution in Visual Studio and set the `TodoApp.Android` project as the startup project.

[!INCLUDE [Set up MSAL in Windows](~/mobile-apps/azure-mobile-apps/includes/quickstarts/windows/add-msal-library.md)]

<!-- TODO: Add authentication to a Xamarin.Android app -->

The `GetAuthenticationToken()` method works with the Microsoft Identity Library (MSAL) to get an access token suitable for authorizing the signed-in user to the backend service.  This function is then passed to the `RemoteTodoService` for creating the client.  If the authentication is successful, the `AuthenticationToken` is produced with data necessary to authorize each request.  If not, then an expired bad token is produced instead.

## Test the app

You should be able to press **F5** to run the app.  When the app runs, a browser will be opened to ask you for authentication.  The first time the app runs, you will be asked to consent to the access:

![Consent screen](./media/authentication-consent.png)

Press **Yes** to continue to your app.  The app will then run as before.

## Next steps

Next, configure your application to operate offline by [implementing an offline store](./offline.md).

## Further reading

* [Quickstart: Protect a web API with the Microsoft identity platform](/azure/active-directory/develop/web-api-quickstart?pivots=devlang-aspnet-core)
* [Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET](/azure/active-directory/develop/msal-net-xamarin-android-considerations)
* [Scenario: Mobile application that calls web APIs](/azure/active-directory/develop/scenario-mobile-overview)

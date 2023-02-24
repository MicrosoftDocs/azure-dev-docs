---
title: Add authentication to your Uno Platform app
description: Add authentication to your Uno Platform app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 02/24/2023
ms.author: adhal
---

# Add authentication to your Uno Platform app

In this tutorial, you add Microsoft authentication to the TodoApp project using Azure Active Directory. Before completing this tutorial, ensure you've [created the project and deployed the backend](./index.md).

> [!TIP]
> Although we use Azure Active Directory for authentication, you can use any authentication library you wish with Azure Mobile Apps.  

[!INCLUDE [Register with AAD for the backend](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-backend.md)]

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-auth-backend.md)]

## Add authentication to the app

The Microsoft Datasync Framework has built-in support for any authentication provider that uses a Json Web Token (JWT) within a header of the HTTP transaction.  This application uses the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to request such a token and authorize the signed in user to the backend service.

[!INCLUDE [Configure a native app for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-client.md)]

Open the `TodoApp.sln` solution in Visual Studio and set the `TodoApp.Uno`project as the startup project.  Add the [Microsoft Identity Library (MSAL)](/azure/active-directory/develop/msal-overview) to the `TodoApp.Uno` projects:

[!INCLUDE [Set up MSAL in Windows](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-msal-library.md)]

Ensure you add the Microsoft Identity Library (MSAL) to all the `TodoApp.Uno` projects, including `TodoApp.Uno.Mobile`.

Open the `MainPage.xaml.cs` file in the top folder of the `TodoApp.Uno` project.  

Add the following `using` statements to the top of the file:

``` csharp
using Microsoft.Datasync.Client;
using Microsoft.Identity.Client;
using System.Diagnostics;
using System.Linq;
```

Remove the `TodoService` property and replace it with the following code:

``` csharp
    private readonly IPublicClientApplication _identityClient;
    private readonly TodoListViewModel _viewModel;
    private readonly ITodoService _service;

    public MainPage() {
        this.InitializeComponent();

#if ANDROID
        _identityClient = PublicClientApplicationBuilder
            .Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithRedirectUri($"msal{Constants.ApplicationId}://auth")
            .WithParentActivityOrWindow(() => Platform.CurrentActivity)
            .Build();
#elif IOS
        _identityClient = PublicClientApplicationBuilder
            .Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
            .WithRedirectUri($"msal{Constants.ApplicationId}://auth")
            .Build();
#else
        _identityClient = PublicClientApplicationBuilder
            .Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
            .Build();
#endif
        _service = new RemoteTodoService();
        _viewModel = new TodoListViewModel(this, _service);
        mainContainer.DataContext = _viewModel;
    }
```

Add the following method into the `MainPage` class:

``` csharp
    public async Task<AuthenticationToken> GetAuthenticationToken()
    {
        var accounts = await _identityClient.GetAccountsAsync();
        AuthenticationResult result = null;
        bool tryInteractiveLogin = false;

        try
        {
            result = await _identityClient
                .AcquireTokenSilent(Constants.Scopes, accounts.FirstOrDefault())
                .ExecuteAsync();
        }
        catch (MsalUiRequiredException)
        {
            tryInteractiveLogin = true;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"MSAL Silent Error: {ex.Message}");
        }

        if (tryInteractiveLogin)
        {
            try
            {
                result = await _identityClient
                    .AcquireTokenInteractive(Constants.Scopes)
                    .ExecuteAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"MSAL Interactive Error: {ex.Message}");
            }
        }

        return new AuthenticationToken
        {
            DisplayName = result?.Account?.Username ?? string.Empty,
            ExpiresOn = result?.ExpiresOn ?? DateTimeOffset.MinValue,
            Token = result?.AccessToken ?? string.Empty,
            UserId = result?.Account?.Username ?? string.Empty
        };
    }
```

The `GetAuthenticationToken()` method works with the Microsoft Identity Library (MSAL) to get an access token suitable for authorizing the signed-in user to the backend service.  This function is then passed to the `RemoteTodoService` for creating the client.  If the authentication is successful, the `AuthenticationToken` is produced with data necessary to authorize each request.  If not, then an expired bad token is produced instead.

## Configure the Android app for authentication

Open the `TodoApp.Uno.Mobile` project. Create a new class `MsalActivity` with the following code:

``` csharp
using Android.App;
using Android.Content;
using Microsoft.Identity.Client;

namespace TodoApp.Forms.Droid
{
    [Activity(Exported = true)]
    [IntentFilter(new[] { Intent.ActionView },
        Categories = new[] { Intent.CategoryBrowsable, Intent.CategoryDefault },
        DataHost = "auth",
        DataScheme = "msal{client-id}")]
    public class MsalActivity : BrowserTabActivity
    {
    }
}
```

Replace `{client-id}` with the application ID of the native client (which is the same as `Constants.ApplicationId`).

## Test the app

Run or restart the app.

When the app starts, a browser is opened to ask you for authentication.  If you haven't authenticated with the app before, the app asks for consent.  Once authentication is complete, the browser closes and your app continues as before.

## Next steps

Next, configure your application to operate offline by [implementing an offline store](./offline.md).

## Further reading

* [Quickstart: Protect a web API with the Microsoft identity platform](/azure/active-directory/develop/web-api-quickstart?pivots=devlang-aspnet-core)
  
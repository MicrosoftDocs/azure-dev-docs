---
title: Add authentication to your .NET MAUI app
description: Add authentication to your .NET MAUI app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 06/11/2021
ms.author: adhal
---

# Add authentication to your .NET MAUI app

In this tutorial, you add Microsoft authentication to your app using Azure Active Directory. Before completing this tutorial, ensure you've [created the project and deployed the backend](./index.md).

> This tutorial currently supports a limited set of platforms.  Specifically, the iOS platform is not covered at the moment.

> [!TIP]
> Although we use Azure Active Directory for authentication, you can use any authentication library you wish with Azure Mobile Apps. 

[!INCLUDE [Register with AAD for the backend](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-backend.md)]

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-auth-backend.md)]

## Add authentication to the app

The Microsoft Datasync Framework has built-in support for any authentication provider that uses a Json Web Token (JWT) within a header of the HTTP transaction.  This application will use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to request such a token and authorize the signed in user to the backend service.

[!INCLUDE [Configure a native app for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-client.md)]

Open the `TodoApp.sln` solution in Visual Studio and set the `TodoApp.MAUI` project as the startup project.  Add the [Microsoft Identity Library (MSAL)](/azure/active-directory/develop/msal-overview) to the `TodoApp.MAUI` project:

[!INCLUDE [Set up MSAL in Windows](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-msal-library.md)]

Open the `MainPage.xaml.cs` class in the `TodoApp.MAUI` project. Add the following `using` statements:

``` csharp
using Microsoft.Datasync.Client;
using Microsoft.Identity.Client;
using System.Diagnostics;
```

In the `MainPage` class, add a new property:

``` csharp
public IPublicClientApplication IdentityClient { get; set; }
```

Adjust the constructor to read:

``` csharp
public MainPage()
{
    InitializeComponent();
    TodoService = new RemoteTodoService(GetAuthenticationToken);
    viewModel = new MainViewModel(this, TodoService);
    BindingContext = viewModel;
}
```

Add the `GetAuthenticationToken` method to the class:

``` csharp
public async Task<AuthenticationToken> GetAuthenticationToken()
{
    if (IdentityClient == null)
    {
                object parentWindow = null;
#if ANDROID
                parentWindow = Platform.CurrentActivity;
#endif
                IdentityClient = PlatformService.GetIdentityClient(parentWindow);
    }

    var accounts = await IdentityClient.GetAccountsAsync();
    AuthenticationResult result = null;
    bool tryInteractiveLogin = false;

    try
    {
        result = await IdentityClient
            .AcquireTokenSilent(Constants.Scopes, accounts.FirstOrDefault())
            .ExecuteAsync();
    }
    catch (MsalUiRequiredException)
    {
        tryInteractiveLogin = true;
    }
    catch (Exception ex)
    {
        Debug.WriteLine($"MSAL Silent Error: {ex.Message}");
    }

    if (tryInteractiveLogin)
    {
        try
        {
            result = await IdentityClient
                .AcquireTokenInteractive(Constants.Scopes)
                .ExecuteAsync()
                .ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"MSAL Interactive Error: {ex.Message}");
        }
    }

    return new AuthenticationToken
    {
        DisplayName = result?.Account?.Username ?? "",
        ExpiresOn = result?.ExpiresOn ?? DateTimeOffset.MinValue,
        Token = result?.AccessToken ?? "",
        UserId = result?.Account?.Username ?? ""
    };
}
```

The `GetAuthenticationToken()` method works with the Microsoft Identity Library (MSAL) to get an access token suitable for authorizing the signed-in user to the backend service.  This function is then passed to the `RemoteTodoService` for creating the client.  If the authentication is successful, the `AuthenticationToken` is produced with data necessary to authorize each request.  If not, then an expired bad token is produced instead.

Add the `PlatformService.cs` class with the following contents:

``` csharp
using Microsoft.Identity.Client;
using TodoApp.Data;

namespace TodoApp.MAUI
{
    internal class PlatformService
    {
        public static IPublicClientApplication GetIdentityClient(object parentWindow)
        {
            var clientBuilder = PublicClientApplicationBuilder
                .Create(Constants.ApplicationId)
                .WithAuthority(AzureCloudInstance.AzurePublic, "common");

#if ANDROID
            clientBuilder = clientBuilder
                .WithRedirectUri($"msal{Constants.ApplicationId}://auth")
                .WithParentActivityOrWindow(() => parentWindow);
#endif

#if WINDOWS
            clientBuilder = clientBuilder
                .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient");
#endif

            return clientBuilder.Build();
        }
    }
}
```

We can add any platform-specific options using the `#if` areas with a platform-specifier.  For example, Android requires us to specify the parent activity, which is passed in from the calling page.

## Configure the Android app for authentication

Create a new class `Platforms\Android\MsalActivity.cs` with the following code:

``` csharp
using Android.App;
using Android.Content;
using Microsoft.Identity.Client;

namespace TodoApp.MAUI
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

Open `Platforms\Android\MainActivity.cs`.  Add the following code to the bottom of the class:

``` csharp
protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
{
    base.OnActivityResult(requestCode, resultCode, data);
    // Return control to MSAL
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode, resultCode, data);
}
```

Include the following `using` statements at the top of the file:

``` csharp
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Runtime;
using Microsoft.Identity.Client;
```

When the Android requires authentication, it will obtain an identity client from `GetIdentityClient()`, then switch to an internal activity that opens the system browser.  Once authentication is complete, the system browser redirects to the defined redirect URL (`msal{client-id}://auth`).  The redirect URL is trapped by the `MsalActivity`, which then switches back to the main activity by calling `OnActivityResult()`.  That then calls the MSAL authentication helper, which completes the transaction.

## Test the Android app

Set `TodoApp.MAUI` as the startup project, select an android emulator as the target, then press **F5** to build and run the app.  When the app starts, you'll be prompted to sign in to the app.  On the first run, you'll also be asked to consent to the app.  Once authentication is complete, the app runs as normal.

## Test the Windows app

Set `TodoApp.MAUI` as the startup project, select **Windows Machine** as the target, then press **F5** to build and run the app.  When the app starts, you'll be prompted to sign in to the app.  On the first run, you'll also be asked to consent to the app.  Once authentication is complete, the app runs as normal.

## Next steps

Next, configure your application to operate offline by [implementing an offline store](./offline.md).

## Further reading

* [Quickstart: Protect a web API with the Microsoft identity platform](/azure/active-directory/develop/web-api-quickstart?pivots=devlang-aspnet-core)
* [Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET](/azure/active-directory/develop/msal-net-xamarin-android-considerations)
* [Scenario: Mobile application that calls web APIs](/azure/active-directory/develop/scenario-mobile-overview)

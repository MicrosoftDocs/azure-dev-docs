---
title: Add authentication to your .NET MAUI app
description: Add authentication to your .NET MAUI app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.custom: devx-track-dotnet
ms.topic: article
ms.date: 11/11/2021
ms.author: adhal
recommendations: false
zone_pivot_group_filename: developer/mobile-apps/azure-mobile-apps/zumo-zone-pivot-groups.json
zone_pivot_groups: vs-platform-options
---

# Add authentication to your .NET MAUI app

In this tutorial, you add Microsoft authentication to your app using Azure Active Directory. Before completing this tutorial, ensure you've [created the project and deployed the backend](./index.md).

> This tutorial currently supports a limited set of platforms.  Specifically, the iOS platform is not covered at the moment.

> [!TIP]
> Although we use Azure Active Directory for authentication, you can use any authentication library you wish with Azure Mobile Apps. 

[!INCLUDE [Register with AAD for the backend](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-backend.md)]

::: zone pivot="vs2022-windows"

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-auth-backend.md)]

::: zone-end

::: zone pivot="vs2022-mac"

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/mac/configure-auth-backend.md)]

::: zone-end

## Add authentication to the app

The Microsoft Datasync Framework has built-in support for any authentication provider that uses a Json Web Token (JWT) within a header of the HTTP transaction.  This application will use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to request such a token and authorize the signed in user to the backend service.

[!INCLUDE [Configure a native app for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-client.md)]

Open the `TodoApp.sln` solution in Visual Studio and set the `TodoApp.MAUI` project as the startup project.  Add the [Microsoft Identity Library (MSAL)](/azure/active-directory/develop/msal-overview) to the `TodoApp.MAUI` project:

::: zone pivot="vs2022-windows"

[!INCLUDE [Configure the M S A L library on Windows](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-msal-library.md)]

::: zone-end

::: zone pivot="vs2022-mac"

[!INCLUDE [Configure the M S A L library on a Mac](~/mobile-apps/azure-mobile-apps/includes/quickstart/mac/add-authentication-library.md)]

::: zone-end

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
#if ANDROID
        IdentityClient = PublicClientApplicationBuilder
            .Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithRedirectUri($"msal{Constants.ApplicationId}://auth")
            .WithParentActivityOrWindow(() => Platform.CurrentActivity)
            .Build();
#elif IOS
        IdentityClient = PublicClientApplicationBuilder
            .Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
            .WithRedirectUri($"msal{Constants.ApplicationId}://auth")
            .Build();
#else
        IdentityClient = PublicClientApplicationBuilder
            .Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
            .Build();
#endif
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
                .ExecuteAsync();
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

Open `MauiProgram.cs`.  Include the following `using` statements at the top of the file:

``` csharp
using Microsoft.Identity.Client;
```

Update the builder to the following code:

``` csharp
    builder
        .UseMauiApp<App>()
        .ConfigureLifecycleEvents(events =>
        {
#if ANDROID
            events.AddAndroid(platform =>
            {
                platform.OnActivityResult((activity, rc, result, data) =>
                {
                    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(rc, result, data);
                });
            });
#endif
        })
        .ConfigureFonts(fonts =>
        {
            fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
        });
```

If you're doing this step after updating the application for iOS, add the code designated by the `#if ANDROID` (including the `#if` and `#endif`).  The compiler will pick the correct piece of code based on the platform that is being compiled. This code can be placed either before or after the existing block for iOS.

When the Android requires authentication, it will obtain an identity client, then switch to an internal activity that opens the system browser.  Once authentication is complete, the system browser redirects to the defined redirect URL (`msal{client-id}://auth`).  The redirect URL is trapped by the `MsalActivity`, which then switches back to the main activity by calling `OnActivityResult()`.  The `OnActivityResult()` method calls the MSAL authentication helper, which completes the transaction.

## Test the Android app

Set `TodoApp.MAUI` as the startup project, select an android emulator as the target, then press **F5** to build and run the app.  When the app starts, you'll be prompted to sign in to the app.  On the first run, you'll also be asked to consent to the app.  Once authentication is complete, the app runs as normal.

::: zone pivot="vs2022-windows"

## Test the Windows app

Set `TodoApp.MAUI` as the startup project, select **Windows Machine** as the target, then press **F5** to build and run the app.  When the app starts, you'll be prompted to sign in to the app.  On the first run, you'll also be asked to consent to the app.  Once authentication is complete, the app runs as normal.

::: zone-end

::: zone pivot="vs2022-mac"

## Configure the iOS app for authentication

Open `MauiProgram.cs`.  Include the following `using` statements at the top of the file:

``` csharp
using Microsoft.Identity.Client;
```

Update the builder to the following code:

``` csharp
    builder
        .UseMauiApp<App>()
        .ConfigureLifecycleEvents(events =>
        {
#if IOS
            events.AddiOS(platform =>
            {
                platform.OpenUrl((app, url, options) =>
                {
                    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url);
                });
            });
#endif
        })
        .ConfigureFonts(fonts =>
        {
            fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
        });
```

If you're doing this step after updating the application for Android, add the code designated by the `#if IOS` (including the `#if` and `#endif`).  The compiler will pick the correct piece of code based on the platform that is being compiled.  This code can be placed either before or after the existing block for Android.

> In your own app, you would need to create an `Entitlements.plist` file to provide keychain access.  For more information on entitlements for .NET MAUI, see [Entitlements and capabilities](/dotnet/maui/ios/deployment/entitlements).

## Test the iOS app

[!INCLUDE [Provisioning profile is required](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/ios-provisioning-profile.md)]
 
Set `TodoApp.MAUI` as the startup project, select an iOS simulator as the target, then press **F5** to build and run the app.  When the app starts, you'll be prompted to sign in to the app.  On the first run, you'll also be asked to consent to the app.  Once authentication is complete, the app runs as normal.

::: zone-end

## Next steps

Next, configure your application to operate offline by [implementing an offline store](./offline.md).

## Further reading

* [Quickstart: Protect a web API with the Microsoft identity platform](/azure/active-directory/develop/web-api-quickstart?pivots=devlang-aspnet-core)
* [Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET](/azure/active-directory/develop/msal-net-xamarin-android-considerations)
* [Scenario: Mobile application that calls web APIs](/azure/active-directory/develop/scenario-mobile-overview)

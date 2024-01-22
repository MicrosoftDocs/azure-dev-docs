---
title: Add authentication to your Xamarin.Forms app
description: Add authentication to your Xamarin.Forms app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 01/12/2024
ms.author: adhal
---

# Add authentication to your Xamarin.Forms app

In this tutorial, you add Microsoft authentication to your app using Microsoft Entra ID. Before completing this tutorial, ensure you've [created the project and deployed the backend](./index.md).

> [!NOTE]
> Since the iOS app requires keychain access, you will need to set up an iOS provisioning profile.  A provisioning profile requires either a real iOS device or a paid Apple Developer Account (if using the simulator).  You can skip this tutorial and move on to adding [offline access to your app](./offline.md) if you cannot use authentication due to this restriction.

> [!TIP]
> Although we use Microsoft Entra ID for authentication, you can use any authentication library you wish with Azure Mobile Apps.

[!INCLUDE [Register with AAD for the backend](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-backend.md)]

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-auth-backend.md)]

## Register your app with the identity service

The Microsoft Data sync Framework has built-in support for any authentication provider that uses a Json Web Token (JWT) within a header of the HTTP transaction.  This application uses the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to request such a token and authorize the signed in user to the backend service.

[!INCLUDE [Configure a native app for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-client.md)]

## Add the Microsoft Identity Client to your app

Open the `TodoApp.sln` solution in Visual Studio and set the `TodoApp.Forms` project as the startup project.

[!INCLUDE [Set up MSAL in Windows](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/add-msal-library.md)]

Open the `TodoApp.Forms` project.  Add a new file called `IPlatform.cs` with the following contents:

``` csharp
using Microsoft.Identity.Client;

namespace TodoApp.Forms
{
    public interface IPlatform
    {
        IPublicClientApplication GetIdentityClient(string applicationId);
    }
}
```

This interface is used later on to allow the shared project to ask the platform project for an identity client suitable for the platform.

Open `App.xaml.cs`.  Add the following `using` statements:

``` csharp
using Microsoft.Datasync.Client;
using Microsoft.Identity.Client;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
```

In the `App` class, add two new properties:

``` csharp
public IPublicClientApplication IdentityClient { get; set; }
public IPlatform PlatformService { get; }
```

Adjust the constructor to read:

``` csharp
public App(IPlatform platformService)
{
    InitializeComponent();

    PlatformService = platformService;
    TodoService = new RemoteTodoService(GetAuthenticationToken);
    MainPage = new NavigationPage(new MainPage(this, TodoService));
}
```

Add the `GetAuthenticationToken` method to the class:

``` csharp
public async Task<AuthenticationToken> GetAuthenticationToken()
{
    if (IdentityClient == null)
    {
        IdentityClient = PlatformService.GetIdentityClient(Constants.ApplicationId);
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

## Configure the Android app for authentication

Open the `TodoApp.Forms.Android` project. Create a new class `MsalActivity` with the following code:

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

If your project targets Android version 11 (API version 30) or later, you must update your `AndroidManifest.xml` to meet the [Android package visibility requirements](https://developer.android.com/preview/privacy/package-visibility).  Open `TodoApp.Forms.Android/Properties/AndroidManifest.xml` and add the following `queries/intent` nodes to the `manifest` node:

```xml
<manifest>
  ...
  <queries>
    <intent>
      <action android:name="android.support.customtabs.action.CustomTabsService" />
    </intent>
  </queries>
</manifest>
```

Open `MainActivity.cs`.  Add `IPlatform` to the definition of the `MainActivity` class:

``` csharp
public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity, IPlatform
```

Change the `LoadApplication()` call in the `OnCreate()` method:

``` csharp
protected override void OnCreate(Bundle savedInstanceState)
{
    base.OnCreate(savedInstanceState);

    Xamarin.Essentials.Platform.Init(this, savedInstanceState);
    global::Xamarin.Forms.Forms.Init(this, savedInstanceState);
    LoadApplication(new App(this));
}
```

Add the following code to the bottom of the class:

``` csharp
protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
{
    base.OnActivityResult(requestCode, resultCode, data);
    // Return control to MSAL
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode, resultCode, data);
}

public IPublicClientApplication GetIdentityClient(string applicationId)
{
    var identityClient = PublicClientApplicationBuilder.Create(applicationId)
        .WithAuthority(AzureCloudInstance.AzurePublic, "common")
        .WithRedirectUri($"msal{applicationId}://auth")
        .WithParentActivityOrWindow(() => this)
        .Build();
    return identityClient;
}
```

When the shared project requires authentication, it obtains an identity client from `GetIdentityClient()`, then switch to an internal activity that opens the system browser.  Once authentication is complete, the system browser redirects to the defined redirect URL (`msal{client-id}://auth`).  The `MsalActivity` traps the redirect URL, which then switches back to the main activity by calling `OnActivityResult()`.  That then calls the MSAL authentication helper, which completes the transaction.

## Configure the iOS app for authentication

Open the `AppDelegate.cs` file in the `TodoApp.Forms.iOS` project.  Add `IPlatform` to the definition of the `AppDelegate` class:

``` csharp
public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate, IPlatform
```

Change the `FinishedLaunching()` method to read:

``` csharp
public override bool FinishedLaunching(UIApplication app, NSDictionary options)
{
    global::Xamarin.Forms.Forms.Init();
    LoadApplication(new App(this));
    return base.FinishedLaunching(app, options);
}
```

Add the following code to the end of the class:

``` csharp
public override bool OpenUrl(UIApplication app, NSUrl url, NSDictionary options)
{
    bool result = AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url);
    return result || base.OpenUrl(app, url, options);
}

public IPublicClientApplication GetIdentityClient(string applicationId)
{
    var identityClient = PublicClientApplicationBuilder.Create(applicationId)
        .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
        .WithRedirectUri($"msal{applicationId}://auth")
        .Build();
    return identityClient;
}
```

Add keychain access to the `Entitlements.plist`:

1. Open the `Entitlements.plist` file.  
2. Select **Keychain**.
3. Select **Add New** in the keychain groups.  
4. Enter `com.microsoft.adalcache` as the value:

   ![Screenshot showing the i O S entitlements.](./media/windows-ios-entitlements-plist.png)

Add the custom entitlements to the project:

1. Right-click on the `TodoApp.Forms.iOS` project, then select **Properties**.
2. Select **iOS Bundle Signing**.
3. Select the **...** button next to the **Custom Entitlements** field.
4. Select `Entitlements`, then select **Open**.
5. Press **Ctrl+S** to save the project.

   ![Screenshot showing the i O S bundle signing properties.](./media/windows-ios-bundle-signing.png)

## Test the Android app

Set `TodoApp.Forms.Android` as the startup project, then press **F5** to build and run the app.  When the app starts, you're prompted to sign in to the app.  On the first run, you're asked to consent to the app.  Once authentication is complete, the app runs as normal.

## Test the iOS app

[!INCLUDE [Provisioning profile is required](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/ios-provisioning-profile.md)]

Set `TodoApp.Forms.iOS` as the startup project, then press **F5** to build and run the app.  When the app starts, you're prompted to sign in to the app.  On the first run, you're asked to consent to the app.  Once authentication is complete, the app runs as normal.

## Next steps

Next, configure your application to operate offline by [implementing an offline store](./offline.md).

## Further reading

* [Quickstart: Protect a web API with the Microsoft identity platform](/azure/active-directory/develop/web-api-quickstart?pivots=devlang-aspnet-core)
* [Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET](/azure/active-directory/develop/msal-net-xamarin-android-considerations)
* [Considerations for using Xamarin iOS with MSAL.NET](/azure/active-directory/develop/msal-net-xamarin-ios-considerations)
* [Scenario: Mobile application that calls web APIs](/azure/active-directory/develop/scenario-mobile-overview)

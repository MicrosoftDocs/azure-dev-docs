---
title: Add authentication to your Xamarin.Forms app
description: Add authentication to your Xamarin.Forms app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add authentication to your Xamarin.Forms app

In this tutorial, you add Microsoft authentication to your app using Azure Active Directory. Before completing this tutorial, ensure you have [created the project](./index.md) and [enabled offline sync](./offline.md).

> [!TIP]
> Although we use Azure Active Directory for authentication, you can use any authentication library you wish with Azure Mobile Apps.  

[!INCLUDE [Register with AAD for the backend](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-backend.md)]

[!INCLUDE [Configure the service for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/windows/configure-auth-backend.md)]

## Add authentication to the app

The Microsoft Datasync Framework has built-in support for any authentication provider that uses a Json Web Token (JWT) within a header of the HTTP transaction.  This application will use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to request such a token and authorize the signed in user to the backend service.

[!INCLUDE [Configure a native app for authentication](~/mobile-apps/azure-mobile-apps/includes/quickstart/common/register-aad-client.md)]

Open the `TodoApp.sln` solution in Visual Studio project as the startup project.

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

This interface will be used later on to allow the shared project to ask the platform project for an identity client suitable for the platform.

Open `App.xaml.cs`.  Add the following `using` statements:

``` csharp
using Microsoft.Datasync.Client;
using Microsoft.Identity.Client;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
```

In the `App` class, add two additional properties:

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
        .WithParentActivityOrWindow(() => this)
        .Build();
    return identityClient;
}
```

When the shared project requires authentication, it will obtain an identity client from `GetIdentityClient()`, then switch to an internal activity that opens the system browser.  Once authentication is complete, the system browser redirects to the defined redirect URL (`msal{client-id}://auth`).  The redirect URL is trapped by the `MsalActivity`, which then switches back to the main activity by calling `OnActivityResult()`.  That then calls the MSAL authentication helper, which completes the transaction.

## Configure the iOS app for authentication

Open the `AppDelegate.cs` file in the `TodoApp.Forms.iOS` project.
### Add authentication to the iOS app

Open the `AppDelegate.cs` class in the `ZumoQuickstart.iOS` project.  Add the following code to the end of the class:

``` csharp
    public override bool OpenUrl(UIApplication app, NSUrl url, NSDictionary options)
        => Xamarin.Essentials.Platform.OpenUrl(app, url, options);

    public Task<bool> AuthenticateAsync(MobileServiceClient client)
    {
        var tcs = new TaskCompletionSource<bool>();
        var view = UIApplication.SharedApplication.KeyWindow.RootViewController;

        Device.BeginInvokeOnMainThread(async () =>
        {
            try
            {
                var user = await client.LoginAsync(view, "aad", "zumoquickstart");
                tcs.TrySetResult(user != null);
            }
            catch (Exception error)
            {
                var alert = UIAlertController.Create("Sign-in result", error.Message, UIAlertControllerStyle.Alert);
                alert.AddAction(UIAlertAction.Create("OK", UIAlertActionStyle.Default, null));
                view.PresentViewController(alert, true, null);
                tcs.TrySetResult(false);
            }
        });

        return tcs.Task;
    }
```

Right-click on the `Info.plist` file, then select **Open with...**.  Select the **XML (Text) Editor**.  Add the following to the file right before the final `</dict>` line.

``` xml
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleURLName</key>
        <string>URL Type 1</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>zumoquickstart</string>
        </array>
        <key>CFBundleTypeRole</key>
        <string>None</string>
      </dict>
    </array>
```

After the user completes the sign-in, the user will be redirected back to the application.  You can now build and run the application.  The user is prompted to sign-in before the list of items is displayed.

### Add authentication to the UWP app

Open the `App.xaml.cs` file within the `ZumoQuickstart.UWP` project.  Add the following code to the end of the class:

``` csharp
    public static MobileServiceClient CurrentClient { get; set; } = null;

    protected override void OnActivated(IActivatedEventArgs args)
    {
        base.OnActivated(args);
        if (args.Kind == ActivationKind.Protocol)
        {
            MobileServiceClientExtensions.ResumeWithURL(CurrentClient, (args as ProtocolActivatedEventArgs).Uri);
        }
    }
```

This calls the response handler within Azure Mobile Apps when the response from the authentication service is received.

Open the `MainPage.xaml.cs` file and add the following code to the end of the class:

``` csharp
    public Task<bool> AuthenticateAsync(MobileServiceClient client)
    {
        var tcs = new TaskCompletionSource<bool>();
        Device.BeginInvokeOnMainThread(async () =>
        {
            try
            {
                var user = await client.LoginAsync("aad", "zumoquickstart");
                tcs.TrySetResult(user != null);
            }
            catch (Exception error)
            {
                var dialog = new MessageDialog(error.Message, "Sign-in error");
                await dialog.ShowAsync();
                tcs.TrySetResult(false);
            }
        });

        return tcs.Task;
    }
```

Finally, register the "zumoquickstart" protocol:

* Open the `Package.appxmanifest` file.
* Select the **Declarations** tab.
* Under **Available Declarations**, select **Protocol** and then press **Add**.
* Fill in the form as follows:
  * Display name: _Authentication Response_
  * Name: _zumoquickstart_
  * ExecutableOrStartPageIsRequired: checked
  All other fields can be left blank.

You can now build and run the application.  When it runs, the sign-in process will be triggered prior to the list of items being displayed.

## Test the app

From the **Run** menu, press **Run app** to start the app.  You'll be prompted for a Microsoft account.  When you're signed in, the app should run as before without errors.

[!INCLUDE [clean-up](~/mobile-apps/azure-mobile-apps/includes/quickstart-clean-up.md)]

## Next steps

Take a look at the HOW TO sections:

* Server ([Node.js](../../howto/server/nodejs.md)
* Server ([ASP.NET Framework](../../howto/server/dotnet-framework.md))
* [.NET Client](../../howto/client/dotnet.md)

You can also do a Quick Start for another platform using the same backend server:

* [Apache Cordova](../cordova/index.md)
* [Windows (UWP)](../uwp/index.md)
* [Windows (WPF)](../wpf/index.md)
* [Xamarin.Android](../xamarin-android/index.md)
* [Xamarin.iOS](../xamarin-ios/index.md)

[Learn more about developing cross-platform apps with Xamarin.Forms and Azure Mobile Apps with a free book](https://adrianhall.github.io/develop-mobile-apps-with-csharp-and-azure/).

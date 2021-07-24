---
title: Add authentication to your Xamarin.iOS app
description: Add authentication to your Xamarin.iOS app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add authentication to your Xamarin.iOS app

In this tutorial, you add Microsoft authentication to the quickstart project on Xamarin.iOS using Azure Active Directory. Before completing this tutorial, ensure you've [created the project](./index.md) and [enabled offline sync](./offline.md).

[!INCLUDE [configure-auth](../../includes/quickstart-configure-auth.md)]

## Test that authentication is being requested

* Open your project in Visual Studio.
* Press F5 to run the app.
* Verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

## Add authentication to the app

Open the `TodoService.cs` class.  Add the `AuthenticateAsync()` method to the class:

``` csharp
private Task<bool> AuthenticateAsync()
{
  var tcs = new TaskCompletionSource<bool>();
  Xamarin.Essentials.MainThread.BeginInvokeOnMainThread(async () =>
  {
    var rootController = UIApplication.SharedApplication.KeyWindow.RootViewController;
    try
    {
      var user = await mClient.LoginAsync(rootController, "aad", "zumoquickstart");
      tcs.TrySetResult(user != null);
    }
    catch (Exception error)
    {
      var alert = UIAlertController.Create("Sign-in result", error.Message, UIAlertControllerStyle.Alert);
      alert.AddAction(UIAlertAction.Create("OK", UIAlertActionStyle.Default, null));
      rootController.PresentViewController(alert, true, null);
      tcs.TrySetResult(false);
    }
  });

  return tcs.Task;
}
```

Use _Alt+Enter_ to add the required package (UIKit). Edit the `InitializeAsync()` method to request authentication:

``` csharp
    // Get a reference to the table.
    mTable = mClient.GetSyncTable<TodoItem>();

    await AuthenticateAsync();

    isInitialized = true;
```

Open the `SceneDelegate.cs` class.  Add the following code to the end of the class:

``` csharp
[Export("scene:openURLContexts:")]
public void OpenUrlContexts(UIScene scene, NSSet<UIOpenUrlContext> urlContexts)
{
  var context = urlContexts.AnyObject;
  if (context == null) return;
  var url = context.Url;
  var options = context.Options == null ? null : new UIApplicationOpenUrlOptions
  {
    Annotation = context.Options.Annotation,
    OpenInPlace = context.Options.OpenInPlace,
    SourceApplication = context.Options.SourceApplication
  };
  Xamarin.Essentials.Platform.OpenUrl(UIApplication.SharedApplication, url, options.Dictionary);
}
```

The `OpenUrlContexts` method handles the callback from the web authenticator on iOS 13 and later.  For other iOS versions, follow the instructions in the [Xamarin.Essentials documentation](https://docs.microsoft.com/xamarin/essentials/web-authenticator?context=xamarin%2Fios&tabs=ios).

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

iOS uses this information to redirect the user back to the app once they have signed in.  You can now build and run the application.  The sign-in process will be triggered immediately.

## Test the app

Press F5 to run the app.  When you're successfully signed in, the app should run as before without errors.

[!INCLUDE [clean-up](../../includes/quickstart-clean-up.md)]

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
* [Xamarin.Forms](../xamarin-forms/index.md)

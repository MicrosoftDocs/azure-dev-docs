---
title: Add Authentication to your Xamarin.Android app
description: Add authentication to your Xamarin.Android app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add Authentication to your Xamarin.Android app

In this tutorial, you add Microsoft authentication to the quickstart project on Xamarin.Android using Azure Active Directory. Before completing this tutorial, ensure you have [created the project](./index.md) and [enabled offline sync](./offline.md).

[!INCLUDE (../../includes/quickstart-configure-auth.md)]

## Test that authentication is being requested

* Open your project in Visual Studio
* From the **Run** menu, click **Run app**.
* Verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

This exception happens because the app attempts to access the back end as an unauthenticated user, but the *TodoItem* table now requires authentication.

## Add authentication to the app

Update the `TodoService.cs` class so that it initiates a login process when initializing the service.  Add a constructor:

``` csharp
    private Android.Content.Context mContext;

    public TodoService(Android.Content.Context context)
    {
        mContext = context;
    }
```

Then, edit the `InitializeAsync()` method to add the login call:

``` csharp
    private async Task InitializeAsync()
    {
        using (await initializationLock.LockAsync())
        {
            if (!isInitialized)
            {
                // Create the client.
                mClient = new MobileServiceClient(Constants.BackendUrl, new LoggingHandler());

                // Define the offline store.
                mStore = new MobileServiceSQLiteStore("todoitems.db");
                mStore.DefineTable<TodoItem>();
                await mClient.SyncContext.InitializeAsync(mStore).ConfigureAwait(false);

                // Authenticate the user
                await mClient.LoginAsync(mContext, "aad", "zumoquickstart");

                // Get a reference to the table.
                mTable = mClient.GetSyncTable<TodoItem>();
                isInitialized = true;
            }
        }
    }
```

Edit the `MainActivity.cs` file to pass the context into the service within the `OnCreate()` method:

``` csharp
    // Azure Mobile Apps
    CurrentPlatform.Init();
    todoService = new TodoService(this);
```

Edit the `Properties\AndroidManifest.xml` to register the authentication response handler:

``` xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:versionCode="1" android:versionName="1.0" package="com.companyname.zumoquickstart">
    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="28" />
    <application android:label="ZumoQuickstart.Android" android:theme="@style/MainTheme">
      <activity
          android:name="com.microsoft.windowsazure.mobileservices.authentication.RedirectUrlActivity"
          android:launchMode="singleTop" android:noHistory="true">
        <intent-filter>
          <action android:name="android.intent.action.VIEW" />
          <category android:name="android.intent.category.DEFAULT" />
          <category android:name="android.intent.category.BROWSABLE" />
          <data android:scheme="zumoquickstart" android:host="easyauth.callback" />
        </intent-filter>
      </activity>      
    </application>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
</manifest>
```

You can now run the Android app in the emulator.  It will prompt you for a Microsoft credential prior to showing you the list of items.

## Test the app

From the **Run** menu, click **Run app** to start the app.  You will be prompted for a Microsoft account.  When you are successfully signed in, the app should run as before without errors.

> **Deleting the resources**
>
> Now you have completed the quickstart tutorial, you can delete the resources with `az group delete -n zumo-quickstart`. You can also delete the global app registration used for authentication through the portal.

## Next steps

Take a look at the HOW TO sections:

* Server ([Node.js](../../howto/server/nodejs.md)
* Server ([ASP.NET Framework](../../howto/server/dotnet-framework.md))
* [.NET Client](../../howto/client/dotnet.md)

You can also do a Quick Start for another platform using the same backend server:

* [Apache Cordova](../cordova/index.md)
* [Windows (UWP)](../uwp/index.md)
* [Windows (WPF)](../wpf/index.md)
* [Xamarin.Forms](../xamarin-forms/index.md)
* [Xamarin.iOS](../xamarin-ios/index.md)

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

Open the `MainActivity.cs` file in the `TodoApp.Android` project.  At the top of the file, add the following using statements:

``` csharp
using Microsoft.Identity.Client;
using Microsoft.Datasync.Client;
using System.Linq;
using System.Threading.Tasks;
using Debug = System.Diagnostics.Debug;
```

At the top of the `MainActivity` class, add the following field:

``` csharp
public IPublicClientApplication identityClient;
```

In the `OnCreate()` method, change the definition of the `TodoService`:

``` csharp
TodoService = new RemoteTodoService(GetAuthenticationToken);
```

Add the following code to define the `GetAuthenticationToken()` method:

``` csharp
public async Task<AuthenticationToken> GetAuthenticationToken()
{
    if (identityClient == null)
    {
        identityClient = PublicClientApplicationBuilder.Create(Constants.ApplicationId)
            .WithAuthority(AzureCloudInstance.AzurePublic, "common")
            .WithParentActivityOrWindow(() => this)
            .Build();
    }

    var accounts = await identityClient.GetAccountsAsync();
    AuthenticationResult result = null;
    bool tryInteractiveLogin = false;

    try
    {
        result = await identityClient
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
            result = await identityClient
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

Handle the callback from the identity client by adding the following method:

``` csharp
protected override void OnActivityResult(int requestCode, [GeneratedEnum] Result resultCode, Intent data)
{
    base.OnActivityResult(requestCode, resultCode, data);
    // Return control to MSAL
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(requestCode, resultCode, data);
}
```

Open the `Properties/AndroidManifest.xml` file.  Add the following to the `<application>` block:

``` xml
<activity android:name="microsoft.identity.client.BrowserTabActivity" 
          android:configChanges="orientation|screenSize"
          android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="msal{client-id}" android:host="auth" />
    </intent-filter>
</activity>
```

Replace the `{client-id}` with the value of `Constants.ApplicationId`.  For example, if your `ApplicationId` is `6fb6182-4387-41bf-8853-547dede149ef`, then your final `AndroidManifest.xml` file will contain the following code:

``` xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" 
          android:versionCode="1" 
          android:versionName="1.0" 
          package="com.companyname.todoapp.android">
	<uses-sdk android:minSdkVersion="29" android:targetSdkVersion="31" />
	<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
	<uses-permission android:name="android.permission.INTERNET" />

	<application
		android:allowBackup="false"
		android:icon="@mipmap/ic_launcher"
		android:label="@string/app_name"
		android:roundIcon="@mipmap/ic_launcher_round"
		android:supportsRtl="true"
		android:theme="@style/AppTheme">
		<activity android:name="microsoft.identity.client.BrowserTabActivity"
				  android:configChanges="orientation|screenSize"
				  android:exported="true">
			<intent-filter>
				<action android:name="android.intent.action.VIEW" />
				<category android:name="android.intent.category.DEFAULT" />
				<category android:name="android.intent.category.BROWSABLE" />
				<data android:scheme="msalb6fb6182-4387-41bf-8853-547dede149ef" android:host="auth" />
			</intent-filter>
		</activity>
	</application>
</manifest>
```

## Test the app

You should be able to press **F5** to run the app.  When the app runs, a browser will be opened to ask you for authentication.  If you have not authenticated with the app before, you will need to consent.  Once authentication is complete, the system browser will close and your app will run as before.

## Next steps

Next, configure your application to operate offline by [implementing an offline store](./offline.md).

## Further reading

* [Quickstart: Protect a web API with the Microsoft identity platform](/azure/active-directory/develop/web-api-quickstart?pivots=devlang-aspnet-core)
* [Configuration requirements and troubleshooting tips for Xamarin Android with MSAL.NET](/azure/active-directory/develop/msal-net-xamarin-android-considerations)
* [Scenario: Mobile application that calls web APIs](/azure/active-directory/develop/scenario-mobile-overview)

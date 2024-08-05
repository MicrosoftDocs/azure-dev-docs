---
title: Add authentication to your Apache Cordova app
description: Add authentication to your Apache Cordova app using Azure Mobile Apps with our tutorial.
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 05/05/2021
ms.author: adhal
---

# Add authentication to your Apache Cordova app

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

In this tutorial, you add Microsoft authentication to the quickstart project using Microsoft Entra ID. Before completing this tutorial, ensure you've [created the project](./index.md) and [enabled offline sync](./offline.md).

[!INCLUDE [portal-configure-auth](~/mobile-apps/azure-mobile-apps/includes/quickstart-configure-authentication.md)]

## Test that authentication is being requested

* Run the app using `cordova run android`
* Verify that an unhandled exception with a status code of 401 (Unauthorized) is raised after the app starts.

## Add authentication to the app

To add authentication via the built-in provider, you must:

* Add the authentication provider to the list of known good sources.
* Call the authentication provider before accessing data.

### Update the Content Security Policy

Each Apache Cordova app declares their known good sources via a `Content-Security-Policy` header. Each supported provider has an OAuth host that needs to be added:

| Provider | SDK Provider Name | OAuth Host |
|:--- |:--- |:--- |
| Microsoft Entra ID | Microsoft Entra ID | `https://login.microsoftonline.com` |
| Facebook | facebook | `https://www.facebook.com` |
| Google | google | `https://accounts.google.com` |
| Twitter | twitter | `https://api.twitter.com` |

Edit `www/index.html`; add the OAuth host for Microsoft Entra ID as follows:

``` html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self' 
    data: gap: https://login.microsoftonline.com https://ZUMOAPPNAME.azurewebsites.net; 
    style-src 'self'; media-src *;">
```

The content is multiple lines for readability.  Place all code on the same line.

``` html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://login.microsoftonline.com https://ZUMOAPPNAME.azurewebsites.net; style-src 'self'; media-src *;">
```

You have already replaced `ZUMOAPPNAME` with the name of your app. 

## Call the authentication provider

Edit `www/js/index.js`. Replace the `setup()` method with the following code:

``` javascript
function setup() {
    client.login('aad').then(function () {
        // ORIGINAL CONTENTS OF FUNCTION
        todoTable = client.getSyncTable('todoitem');
        refreshDisplay();
        addItemEl.addEventListener('submit', addItemHandler);
        refreshButtonEl.addEventListener('click', refreshDisplay);
        // END OF ORIGINAL CONTENTS OF FUNCTION
    });
}
```

## Test the app

Run the following command:

``` bash
cordova run android
```

Once the initial startup is complete, you'll be prompted to sign in with your Microsoft credentials.  Once complete, you can add and delete items from the list.  

> [!TIP]
> If the emulator does not automatically start, open Android Studio, then select **Configure** > **AVD Manager**.  This will allow you to start the device manually.  If you run `adb devices -l`, you should see your selected emulated device.

[!INCLUDE [clean-up](~/mobile-apps/azure-mobile-apps/includes/quickstart-clean-up.md)]

## Next steps

Take a look at the HOW TO sections:

* Server ([Node.js](../../howto/server/nodejs.md))
* Server ([ASP.NET Framework](../../howto/server/dotnet-framework.md))
* [Apache Cordova Client](../../howto/client/cordova.md)

You can also do a Quick Start for another platform using the same service:

* [Windows (UWP)](../uwp/index.md)
* [Windows (WPF)](../wpf/index.md)
* [Xamarin.Android](../xamarin-android/index.md)
* [Xamarin.Forms](../xamarin-forms/index.md)
* [Xamarin.iOS](../xamarin-ios/index.md)

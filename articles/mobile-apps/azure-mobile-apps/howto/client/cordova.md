---
title: How to use the Apache Cordova plugin for Azure Mobile Apps
description: How to use the Apache Cordova plugin for Azure Mobile Apps
author: adrianhall
ms.service: mobile-services
ms.topic: article
ms.date: 12/19/2022
ms.author: adhal
---

# How to use the Apache Cordova plugin for Azure Mobile Apps

> [!NOTE]
> This product is retired. For a replacement for projects using .NET 8 or later, see the [Community Toolkit Datasync library](https://aka.ms/azure-mobile-apps/docs).

This guide teaches you to perform common scenarios using the latest [Apache Cordova Plugin for Azure Mobile Apps](https://www.npmjs.com/package/cordova-plugin-ms-azure-mobile-apps). If you are new to Azure Mobile Apps, first complete [Azure Mobile Apps Quick Start](../../quickstarts/cordova/index.md) to create a backend, create a table, and download a pre-built Apache Cordova project. In this guide, we focus on the client-side Apache Cordova Plugin.

## Supported platforms

This SDK supports Apache Cordova v6.0.0 and later on iOS, Android, and Windows devices.  The platform support is as follows:

* Android API 19+.
* iOS versions 8.0 and later.

> [!WARNING]
> This article covers information for the v4.2.0 library version, which is retired. No further updates will be made to this library, including updates for security issues. Consider moving to a .NET client such as [.NET MAUI](/dotnet/maui/what-is-maui) for continued support.

## Setup and prerequisites

This guide assumes that you have created a backend with a table.  Examples use the `TodoItem` table from the quick starts.  To add the Azure Mobile Apps plugin to your project, use the following command:

``` bash
cordova plugin add cordova-plugin-ms-azure-mobile-apps
```

For more information on creating [your first Apache Cordova app](https://cordova.apache.org/#getstarted), see their documentation.

## Setting up an Ionic v2 app

To properly configure an Ionic v2 project, first create a basic app and add the Cordova plugin:

``` bash
ionic start projectName --v2
cd projectName
ionic plugin add cordova-plugin-ms-azure-mobile-apps
```

Add the following lines to `app.component.ts` to create the client object:

``` typescript
declare var WindowsAzure: any;
var client = new WindowsAzure.MobileServiceClient("https://yoursite.azurewebsites.net");
```

You can now build and run the project in the browser:

``` bash
ionic platform add browser
ionic run browser
```

The Azure Mobile Apps Cordova plugin supports both Ionic v1 and v2 apps.  Only the Ionic v2 apps require the extra declaration for the `WindowsAzure` object.

## Create a client connection

Create a client connection by creating a `WindowsAzure.MobileServiceClient` object.  Replace `appUrl` with the URL to your Mobile App.

```javascript
var client = WindowsAzure.MobileServiceClient(appUrl);
```

## Work with tables

To access or update data, create a reference to the backend table. Replace `tableName` with the name of your table

```javascript
var table = client.getTable(tableName);
```

Once you have a table reference, you can work further with your table:

* [Query a Table](#querying)
  * [Filtering Data](#table-filter)
  * [Paging through Data](#table-paging)
  * [Sorting Data](#sorting-data)
* [Inserting Data](#inserting)
* [Modifying Data](#modifying)
* [Deleting Data](#deleting)

### <a id="querying"></a>Query a table reference

Once you have a table reference, you can use it to query for data on the server.  Queries are made in a "LINQ-like" language.  To return all data from the table, use the following code:

```javascript
/**
 * Process the results that are received by a call to table.read()
 *
 * @param {Object} results the results as a pseudo-array
 * @param {int} results.length the length of the results array
 * @param {Object} results[] the individual results
 */
function success(results) {
   var numItemsRead = results.length;

   for (var i = 0 ; i < results.length ; i++) {
       var row = results[i];
       // Each row is an object - the properties are the columns
   }
}

function failure(error) {
    throw new Error('Error loading data: ', error);
}

table
    .read()
    .then(success, failure);
```

The success function is called with the results.  Do not use `for (var i in results)` in
the success function as that will iterate over information that is included in the results
when other query functions (such as `.includeTotalCount()`) are used.

For more information on the Query syntax, see the [Query object documentation](/previous-versions/azure/reference/jj613353(v=azure.100)).

#### <a id="table-filter"></a>Filtering data on the server

You can use a `where` clause on the table reference:

```javascript
table
    .where({ userId: user.userId, complete: false })
    .read()
    .then(success, failure);
```

You can also use a function that filters the object.  In this case, the `this` variable is assigned to the current object being filtered.  The following code is functionally equivalent to the prior example:

```javascript
function filterByUserId(currentUserId) {
    return this.userId === currentUserId && this.complete === false;
}

table
    .where(filterByUserId, user.userId)
    .read()
    .then(success, failure);
```

#### <a id="table-paging"></a>Paging through data

Utilize the `take()` and `skip()` methods.  For example, if you wish to split the table into 100-row records:

```javascript
var totalCount = 0, pages = 0;

// Step 1 - get the total number of records
table.includeTotalCount().take(0).read(function (results) {
    totalCount = results.totalCount;
    pages = Math.floor(totalCount/100) + 1;
    loadPage(0);
}, failure);

function loadPage(pageNum) {
    let skip = pageNum * 100;
    table.skip(skip).take(100).read(function (results) {
        for (var i = 0 ; i < results.length ; i++) {
            var row = results[i];
            // Process each row
        }
    }
}
```

The `.includeTotalCount()` method is used to add a totalCount field to the results object.  The totalCount field is filled with the total number of records that would be returned if no paging is used.

You can then use the pages variable and some UI buttons to provide a page list; use `loadPage()` to load the new records for each page.  Implement caching to speed access to records that have already been loaded.

#### <a id="sorting-data"></a>Return sorted data

Use the `.orderBy()` or `.orderByDescending()` query methods:

```javascript
table
    .orderBy('name')
    .read()
    .then(success, failure);
```

For more information on the Query object, see the [Query object documentation].

### <a id="inserting"></a>Insert data

Create a JavaScript object with the appropriate date and call `table.insert()` asynchronously:

```javascript
var newItem = {
    name: 'My Name',
    signupDate: new Date()
};

table
    .insert(newItem)
    .done(function (insertedItem) {
        var id = insertedItem.id;
    }, failure);
```

On successful insertion, the inserted item is returned with extra fields that are required for sync operations.  Update your own cache with this information for later updates.

The Azure Mobile Apps Node.js Server SDK supports dynamic schema for development purposes.  Dynamic Schema allows you to add columns to the table by specifying them in an insert or update operation.  We recommend that you turn off dynamic schema before moving your application to production.

### <a id="modifying"></a>Modify data

Similar to the `.insert()` method, you should create an Update object and then call `.update()`.  The update object must contain the ID of the record to be updated - the ID is obtained when reading the record or when calling `.insert()`.

```javascript
var updateItem = {
    id: '7163bc7a-70b2-4dde-98e9-8818969611bd',
    name: 'My New Name'
};

table
    .update(updateItem)
    .done(function (updatedItem) {
        // You can now update your cached copy
    }, failure);
```

### <a id="deleting"></a>Delete data

To delete a record, call the `.del()` method.  Pass the ID in an object reference:

```javascript
table
    .del({ id: '7163bc7a-70b2-4dde-98e9-8818969611bd' })
    .done(function () {
        // Record is now deleted - update your cache
    }, failure);
```


## <a id="auth"></a>Authenticate users

Azure App Service supports authenticating and authorizing app users using various external identity providers: Facebook, Google, Microsoft Account, and Twitter. You can set permissions on tables to restrict access for specific operations to only authenticated users. You can also use the identity of authenticated users to implement authorization rules in server scripts. For more information, see the [Get started with authentication](../../quickstarts/cordova/authentication.md) tutorial.

When using authentication in an Apache Cordova app, the following Cordova plugins must be available:

* [cordova-plugin-device](https://www.npmjs.com/package/cordova-plugin-device)
* [cordova-plugin-inappbrowser](https://www.npmjs.com/package/cordova-plugin-inappbrowser)

> [!NOTE]
> Recent security changes in iOS and Android may render the server-flow authentication unavailable.  In these cases, you must use a client-flow.

Two authentication flows are supported: a server flow and a client flow.  The server flow provides the simplest authentication experience, as it relies on the provider's web authentication interface. The client flow allows for deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific device-specific SDKs.

### <a id="server-auth"></a>Authenticate with a provider (Server Flow)

To have Mobile Apps manage the authentication process in your app, you must register your app with your identity provider. Then in your Azure App Service, you need to configure the application ID and secret provided by your provider. For more information, see the tutorial [Add authentication to your app](../../quickstarts/cordova/authentication.md).

Once you have registered your identity provider, call the `.login()` method with the name of your provider. For example, to sign in with Facebook use the following code:

```javascript
client.login("facebook").done(function (results) {
     alert("You are now signed in as: " + results.userId);
}, function (err) {
     alert("Error: " + err);
});
```

The valid values for the provider are 'aad', 'facebook', 'google', 'microsoftaccount', and 'twitter'.

> [!NOTE]
> Due to security concerns, some authentication providers may not work with a server-flow.  You must use a client-flow method in these cases.

In this case, Azure App Service manages the OAuth 2.0 authentication flow.  It displays the sign-in page of the selected provider and generates an App Service authentication token after successful sign-in with the identity provider. The login function, when complete, returns a JSON object that exposes both the user ID and App Service authentication token in the userId and authenticationToken fields, respectively. This token can be cached and reused until it expires.

### <a id="client-auth"></a>Authenticate with a provider (Client Flow)

Your app can also independently contact the identity provider and then provide the returned token to your App Service for authentication. This client flow enables you to provide a single sign-in experience for users or to retrieve extra user data from the identity provider.

#### Social Authentication basic example

This example uses Facebook client SDK for authentication:

```javascript
client.login("facebook", {"access_token": token})
.done(function (results) {
     alert("You are now signed in as: " + results.userId);
}, function (err) {
     alert("Error: " + err);
});

```
This example assumes that the token provided by the respective provider SDK is stored in the token variable.  The details required by each provider are slightly different.  Consult the [Azure App Service Authentication and Authorization documentation](/azure/app-service/app-service-authentication-how-to#validate-tokens-from-providers) to determine the exact form of the payload.

### <a id="auth-getinfo"></a>Obtain information about the authenticated user

The authentication information can be retrieved from the `/.auth/me` endpoint using an HTTP call with any HTTP/REST library.  Ensure you set the `X-ZUMO-AUTH` header to your authentication token.  The authentication token is stored in `client.currentUser.mobileServiceAuthenticationToken`.  For example, to use the fetch API:

```javascript
var url = client.applicationUrl + '/.auth/me';
var headers = new Headers();
headers.append('X-ZUMO-AUTH', client.currentUser.mobileServiceAuthenticationToken);
fetch(url, { headers: headers })
    .then(function (data) {
        return data.json()
    }).then(function (user) {
        // The user object contains the claims for the authenticated user
    });
```

Fetch is available as [an npm package](https://www.npmjs.com/package/isomorphic-fetch) or for browser download from [CDNJS](https://cdnjs.com/libraries/fetch).  Data is received as a JSON object.

### <a id="configure-external-redirect-urls"></a>Configure your Mobile App Service for external redirect URLs.

Several types of Apache Cordova applications use a loopback capability to handle OAuth UI flows.  OAuth UI flows on localhost cause problems since the authentication service only knows how to utilize your service by default.  Examples of problematic OAuth UI flows include:

* The Ripple emulator.
* Live Reload with Ionic.
* Running the mobile backend locally
* Running the mobile backend in a different Azure App Service than the one providing authentication.

Follow these instructions to add your local settings to the configuration:

1. Log in to the [Azure portal](https://portal.azure.com)
2. Select **All resources** or **App Services** then click the name of your Mobile App.
3. Click **Tools**
4. Click **Resource explorer** in the OBSERVE menu, then click **Go**.  A new window or tab opens.
5. Expand the **config**, **authsettings** nodes for your site in the left-hand navigation.
6. Click **Edit**
7. Look for the "allowedExternalRedirectUrls" element.  It may be set to null or an array of values.  Change the value to the following value:

    ``` json
    "allowedExternalRedirectUrls": [
        "http://localhost:3000",
        "https://localhost:3000"
    ],
    ```

    Replace the URLs with the URLs of your service.  Examples include `http://localhost:3000` (for the Node.js sample service), or `http://localhost:4400` (for the Ripple service).  However, these URLs are examples - your situation, including for the services mentioned in the examples, may be different.
8. Click the **Read/Write** button in the top-right corner of the screen.
9. Click the green **PUT** button.

The settings are saved at this point.  Do not close the browser window until the settings have finished saving. Also add these loopback URLs to the CORS settings for your App Service:

1. Log in to the [Azure portal](https://portal.azure.com)
2. Select **All resources** or **App Services** then click the name of your Mobile App.
3. The Settings blade opens automatically.  If it doesn't, click **All Settings**.
4. Click **CORS** under the API menu.
5. Enter the URL that you wish to add in the box provided and press Enter.
6. Enter more URLs as needed.
7. Click **Save** to save the settings.

It takes approximately 10-15 seconds for the new settings to take effect.
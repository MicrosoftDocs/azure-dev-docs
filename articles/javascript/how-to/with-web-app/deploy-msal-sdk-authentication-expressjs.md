---
title: Deploy MSAL-enabled Express.js
description: Deploy Microsoft authentication Express.js to Azure App service with VS Code. 
ms.topic: how-to
ms.date: 05/11/2021
ms.custom: devx-track-js
#intent: Deploy Microsoft authentication Express.js to Azure App service with VS Code. 
---

# Deploy Express.js with Microsoft Authentication to Azure App service 

Learn how to deploy an Express.js app, integrated with Microsoft Authentication Library (MSAL).

* [Sample code](https://github.com/Azure-Samples/js-e2e-web-app-server-auth)

## Server authentication with Microsoft Authentication Library

The sample Express.js web app uses the Embedded JavaScript templates (EJS) template engine to deliver server-side rendered HTML to allow users to sign in with the Microsoft Identity provider. Authentication is provided with the [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node) npm package to provide:

* Sign-in and sign-out
* Route restrictions to only authenticated users
* Query a restricted API with user - such as Graph

This sample uses simplified choices that shouldn't be understood as best practices in all cases. These choices were made to have a short sample with a _few_ advanced choices. When developing for a production environment, you should research your own choices for the following:

* Where to save user authentication in the browser.
* What authentication information is stored on the server, even if it is in-memory cache. 
* How long a user's authentication is valid for. 
* Where server and integration secrets are stored and used in the Express.js app.
* Passing authentication information to the rendering environment. 

## What does this sample do?

This sample allows you to sign in to a web app with your Microsoft user account. The account must exist on the tenant specified in the `./appSettings` file. Once you sign in, you can choose to see your profile from the Microsoft Graph or see information about your tenant. If you aren't an administrator on your tenant, that functionality won't work. When you are done, you can sign out.

### Protect routes with a check of current authentication

The app has the root as publicly available for all, and the `/profile` and `/tenant` routes are secured with the `authProvider.isAuthenticated` method found in the `/src/msal-express-wrapper/auth-provider.js` file. You must be authenticated to successfully use those routes. 

### Sign in to the app

When the user selects the `Sign-in` button from the top navigation bar, the Express.js server calls into the MSAL SDK with configuration information. The MSAL SDK knows to pop-up an authentication window. Depending on how your Active Directory app is configured and how your tenant is secured, you may have single or 2-factor authentication (2FA). The JavaScript for these steps is in the `./src/msal-express-wrapper/auth-provider.js` file.

### Redirect back to your web app after authentication

Once your authentication is completed through the MSAL SDK, the web browser is redirected to a URL you specified when you create your Active Directory app. The redirect handler requests a token to use for secured Microsoft platform requests, such as Microsoft Graph. The server tracks the user as authenticated with the `isAuthenticated` property, checking and passing the property to the rendering engine files to determine what to display.

## Prepare your development environment

Make sure the following are installed on your local developer workstation:

- An Azure account with **an active subscription, which you own**. [Create an account for free](https://azure.microsoft.com/free/). Ownership is required to provide the correct Azure Active Directory permissions to complete these steps.
- Microsoft Identity account - this is an [email account](https://signup.live.com) added to Microsoft Identity but doesn't have to be the same account you use to create resources.
- [Node.js 14 and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
- Visual Studio Code extensions:
    - [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.

## Download sample Express.js app

Create and run an Express.js app by cloning an Azure sample repository. 

1. At a terminal command prompt, go to the location where you want to create the app folder.

1. Use the following base command with git to clone the repository, change into the repository folder named `myexpressapp`, then install the npm dependencies. 

    ```bash
    git clone https://github.com/Azure-Samples/js-e2e-web-app-server-auth myexpressapp && \
        cd myexpressapp && \
        npm install
    ```

1. Run the app with the following command: 

    ```bash
    npm start
    ```

1. Browse to your locally running app, `http://localhost:8080`.

    > [!TIP]
    > Port 8080 is the default port for Azure app service. If your app uses a different port, make sure the `process.env.PORT` environment variable is used in your running application to get the port value: `port = process.env.PORT || 8080`.

## Create an Azure web app

1. In VS Code, select **Azure** from the activity bar, then select **+** in the **Azure: App Service** side bar. 
1. Complete the prompts:

    |Prompt|Enter|
    |--|--|
    |Enter a globally unique name for the new web app.|The name is used as a subdomain for the web app's URI. |
    |Select a runtime stack.|Select the **most recent version of Node.js**, such as 14 LTS.|
    |Select a pricing tier|Select the **free** tier.|
    
1. Wait for the web app creation to complete. 
1. Select **Deploy** to deploy the sample Express.js app, when the notification pop-up displays. 
1. When the notification pop-up displays a link to the **output window**, select the link to watch the [zip deployment](/azure/app-service/deploy-zip). 

    You can return to this deployment window at any time when you select the Integrated terminal's Output window, then select **Azure App Service**.

## Browse to Azure web app
 
1. Select **Browse website** from the notification. 
    The web app may take a minute or two to return from the server for the first (cold) start.

1. When you receive the following response in the browser, the sample app is deployed and is responding correctly. 
    Authentication isn't configured yet.  

    :::image type="content" source="../../media/express-app-msal-auth/please-configure-appSettings.png" alt-text="Select **Browse website** from the notification. When you receive the following response in the browser, the sample app is deployed and is responding correctly. Authentication isn't configured yet. ":::

## Create Active Directory app

Create an Active Directory app to authenticate users with the Microsoft Identity provider. 

1. In VS Code, select **Azure** from the activity bar, then right-click your new web app from the **Azure: App Service** side bar, then select **Open in portal**.
1. In the search bar, enter **Azure Active Directory**, then select **App registrations**. As an alternative, you can use this link to [go to App registrations](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) for your default tenant. 
1. Select **New registration** to begin the app registration process.

    :::image type="content" source="../../media/express-app-msal-auth/azure-portal-active-directory-app-registrations-new-registration.png" alt-text="Select Authentication under the app's settings then select Add identity provider":::

1. In the next form, configure the following identity provider settings:

    |Setting|Value|
    |--|--|
    |Name|Enter a name such as `msal-express-sample` and postpend your name at the end so you can easily search for it later.|
    |Supported account types|Select **Any Azure AD directory and personal Microsoft accounts**. This allows anyone within the Microsoft Identity provider to access your web app. Learn more about [these choices](/azure/active-directory/develop/single-and-multi-tenant-apps).|
    |Web Redirect URI|Enter your local redirect URL:<br>`http://localhost:8080`.|

    :::image type="content" source="../../media/express-app-msal-auth/azure-portal-app-service-add-identity-provider-any-directory.png" alt-text="Configure Authentication for the Microsoft provider with a new app registration for any Azure AD Directory and personal account.":::

1. Select **Register** to finish the process. 

1. When the process completes, still in the Azure portal for your new Active Directory app registration, select **Authentication** to add your Azure web app's redirect URL then select **Save**.

    :::image type="content" source="../../media/express-app-msal-auth/azure-portal-active-directory-app-registrations-new-registration-add-app-service-redirect-url.png" alt-text="When the process completes, still in the Azure portal for your new Active Directory app registration, select **Authentication** to add your Azure app service's redirect URL then select **Save**.":::


1. Copy the following values to use in your Express.js app:

    |Property|Location|
    |--|--|
    |Application (client) ID|Overview page, Essentials section|
    |Directory (tenant) ID|Overview page, Essentials section|
    |Client secret|Follow the next step|

1. Select **Certificates and secrets** then **New client secret** to create a new secret and immediately copy the secret. If you lose the secret, you need to create a new secret.
1. Set these three values in the `./appSettings` file for the `credentials` properties. Post the values into the hard-coded string, used only for local development. 

    ```json
    "credentials": {
        "clientId": process.env.AD_CLIENT_ID || "REPLACE-WITH-YOUR-APP-CLIENT-ID",
        "tenantId": process.env.AD_TENANT_ID || "REPLACE-WITH-YOUR-APP-TENANT-ID",
        "clientSecret": process.env.AD_CLIENT_ID_SECRET || "REPLACE-WITH-YOUR-APP-CLIENT-ID-SECRET"
    },
    ```

    The hard-coded strings will be used in local development only for this tutorial. Once you are done with the tutorial, create local environment settings for these values on your development workstation. You set the cloud settings, `process.env.[variable]`, in the next section. 

> [!CAUTION]
> Azure App service's app versus Azure Active Directory app - what's the difference? 
> The **App service is your web site hosting environment**. This is where you upload your source code. **Active Directory is your Identity solution for validating users**. These two services can be used completely independently but both can be referred to as **apps**. 

## Configure App service environment variables for your Active Directory app secrets

While you still have the secret and other settings handy, configure your remote App's settings too.

1. In VS Code, in the Azure side bar, select your App service then right-click on **Application Settings**, and select **Add New Setting**.
1. Add the following name/value pairs, each, as a separate application setting.

    |App setting name|App setting value|
    |--|--|
    |BASE_URI|This value should be the name of your app service and is used to build the full base URL with the redirect route, which is used in the MSAL SDK. |
    |AD_CLIENT_ID|This is the Active Directory client ID, from a previous section, `Application (client) ID`.|
    |AD_TENANT_ID|This is the Active Directory tenant ID used to validate users, from a previous section, `Directory (tenant) ID`.|
    |AD_CLIENT_ID_SECRET|This is the Active Directory client's secret. If you lost the secret, return to the Azure portal for your Active Directory app (App Registration), and create a new secret.|

## Run your app locally to verify MSAL authentication

1. Run your Express.js app locally to verify the MSAL authentication is functional. Press F5 in VSCode or use the following bash command in the VS Code integrated terminal.  

    ```bash
    npm start
    ```

1. In a web browser, open your local app, `http://localhost:8080`.
1. Select **Sign-in** from the top navigation bar.

    :::image type="content" source="../../media/express-app-msal-auth/sign-in-to-access-your-resources.png" alt-text="In the web browser for your Express.js app, select **Sign-in** from the top navigation bar.":::


1. Review the permissions requested pop-up then select **Accept**. This is a one-time required request for you, and your app's users, to agree to the permissions requested by your Active Directory app.

    :::image type="content" source="../../media/express-app-msal-auth/browser-window-permissions-requested-by-active-directory-app.png" alt-text="Review the permissions requested pop-up then select **Accept**. This is a one-time required request for you (your app's users) to agree to the permissions requested by the Active Directory app.":::

1. Complete the sign-in process. The exact process depends on your tenant configuration and can include two-factor authentication (2FA).
1. When the sign-in process is complete, select **Get my profile**.

    :::image type="content" source="../../media/express-app-msal-auth/welcome-get-my-profile.png" alt-text="When the sign-in process is complete, select **Get my profile**.":::

1. View your profile data help in the Microsoft Identity provider. The following profile is an example only.

    :::image type="content" source="../../media/express-app-msal-auth/calling-microsoft-graph.png" alt-text="View your profile data help in the Microsoft Identity provider. The following profile is an example only.":::

    The **Get my tenant** button will only work for users with Admin permissions on the tenant. 

## Restart your app service to use authentication settings

1. In VS Code, in the Azure side bar, select your App service then right-click and select **Start streaming logs**. These are the logs for your Azure app service and include `console.log` output.
1. In VS Code, in the Azure side bar, select your App service then right-click and select **Restart**, to have the new app settings take effect.

    :::image type="content" source="../../media/express-app-msal-auth/vscode-app-service-restart-app.png" alt-text="In VS Code, in the Azure side bar, select your App service then right-click and select **Restart**.":::

1. In the Azure side bar, select your App service then right-click and select **Browse website** then select **Open** in the pop-up window. 

## What this tutorial accomplished

There are many steps to create a new web app, develop the app locally, then deploy the app to Azure and configuration authentication for that app. 

The [sample code](https://github.com/Azure-Samples/js-e2e-web-app-server-auth) provided:
* Express.js app integrated with MSAL SDK for authentication.

You created: 
* A new Azure web app - to host your source code.
* A new Azure Active Directory app - to authenticate your users.

You used VSCode to:
* Run the Express.js app locally.
* Deploy the Express.js app to Azure.
* Configure the App's settings.
* Restart the app.
* View the logs for the deployment process and your running Azure web app.
* Open your Azure web app in a browser.
* Open your Azure web app in the Azure portal.

This tutorial demonstrated deploying an MSAL-enabled Express.js app. You can continue developing with it for your own purposes, refactoring to your needs. 

## Next steps

* Continue to learn and use the [Microsoft Identity](/azure/active-directory/develop/v2-overview) Provider
    * [MSAL SDK on GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-js) includes a huge number of samples. 
    * [Tutorial: Sign in users and call the Microsoft Graph API from a React single-page app (SPA) using auth code flow](/azure/active-directory/develop/tutorial-v2-react)
    * [Use App service easy auth](/azure/developer/javascript/how-to/with-web-app/add-authentication-to-web-app)
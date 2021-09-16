---
title: "7-Auth: Add easy authentication"
description: In this article, add authentication to the React client app, which uses the Static Web app authentication.
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---

# 7. Add easy authentication to web app

In this article, add authentication to the React client app, which uses the Static Web app authentication. 


* Sample [basic app and API with authentication](https://github.com/Azure-Samples/js-e2e-static-web-app-with-cli/tree/2-basic-app-with-api-and-auth) - on branch named `2-basic-app-with-api-and-auth`

## Create navigation bar for authentication

Create a navigation component, which provides login and logout functionality.

1. In VS Code, create a `components` directory under the React `./app/src` directory.
1. Create a `NavBar.tsx` file and copy the following code into the file. 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/components/NavBar.tsx" highlight="8,11":::  

1. Create a `PublicHome.tsx` file and copy the following code into the file: 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/components/PublicHome.tsx" :::  

1. Create a `PrivateHome.tsx` file and copy the following code into the file: 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/components/PrivateHome.tsx" highlight="15-23":::  

1. Open the `./app/src/App.tsx` file and copy the following code into the file: 

    :::code language="JSON" source="~/../js-e2e-static-web-app-with-cli-2-basic-app-with-api-and-auth/app/src/App.tsx" highlight="18-34":::  

    The highlighted code lines request the current authentication from the `/.auth/me` route provided by the Static Web Apps environment. 

## Test the local authentication process provided by SWA CLI

1. Allow the local app to rebuild and refresh the entire app in the browser, `http://localhost:4280`. 
   

    :::image type="content" source="../../../media/static-web-app-with-swa-cli/static-web-app-with-auth-providers.png" alt-text="Browser screenshot showing the app with authentication provider choices of Twitter, GitHub, and AAD. ":::

1. Select the GitHub authentication provider.
1. The local SWA CLI provides an authentication form to use.
   
    :::image type="content" source="../../../media/static-web-app-with-swa-cli/local-browser-swa-cli-authentication-form.png" alt-text="Browser screenshot showing the app with authentication form provided with SWA CLI. ":::

    This form simulates the authentication process for your local development environment. It doesn't call the real authentication providers.

1. Enter a name and select **Login** to finish the local authentication process. Control is then returned back to your app and the PrivateHome component is displayed. 

    :::image type="content" source="../../../media/static-web-app-with-swa-cli/local-browser-swa-cli-authentication-form-private-home-component-with-navbar.png" alt-text="Browser screenshot showing the PrivateHome component because authentication has been provided. ":::

    Both the NavBar and PrivateHome HTML form display the authenticated user name, which is returned from the authentication process.

## Commit changes to source control

1. Check the new app code into your local repo and push to the remote repo:
   
   ```bash
   git add . && git commit -m "swa authentication" && git push origin main
   ```

1. In a web browser, go back to your GitHub repo, and make sure the next build of your Action succeeds with these new changes. The actions URL should look like:

    ```HTTP
    https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/actions
    ```

1. In VS Code, in the Azure explorer, find your static web app, then right-click and select **Browse site**.

1. The same React app, as your local version, should appear. The same form functionality as your local version should work, returning a message from the API.  
   
## Next steps

* [Clean up resources](clean-up-swa-auth-resources.md)
* Use your own [custom authentication](/azure/static-web-apps/authentication-custom) in your static web app
* Use [local configuration file](https://github.com/azure/static-web-apps-cli#use-a-configuration-file-staticwebappconfigjson) for SWA CLI
* [SWA authentication and authorization emulation](https://github.com/azure/static-web-apps-cli#local-authentication--authorization-emulation)
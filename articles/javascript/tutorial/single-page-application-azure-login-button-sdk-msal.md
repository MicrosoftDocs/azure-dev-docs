---
title: "Tutorial: Add Microsoft logon button to React SPA"
description: Azure Active Directory authentication presented in this tutorial is a login and logout button, and access to a user's username (email). Develop the application with a Azure client-side SDK, `@azure/msal-browser`, to manage the interaction of the user in the single page application (SPA).
ms.topic: tutorial
ms.date: 12/01/2020
ms.custom: devx-track-js
---

# Add Microsoft logon button to a single page application for authentication

Azure Active Directory authentication presented in this tutorial is a login and logout button, and access to a user's username (email). The username is used as part of the user-specific image container. Develop the application with a Azure client-side SDK, `@azure/msal-browser`, to manage the interaction of the user in the single page application (SPA).

The full source code for this tutorial is available as a GitHub repository:

- [js-e2e-client-azure-login-button](https://github.com/Azure-Samples/js-e2e-client-azure-login-button)

## Application architecture and functionality

The SPA built in this tutorial is a React app (create-react-app) with the following tasks:

- Login using a Microsoft-supported login such as Office 365 or Outlook.com
- Logoff the application

### Azure SDK front-end development

To provide a quick and simple single page application, the sample uses create-react-app with TypeScript. This front-end framework provides several shortcuts in typical client development with Azure SDKs:

- Bundling, required for Azure SDKs used in a client-application
- Environment variables in the `.env` file
- HTTPS, required for Azure authentication

[!INCLUDE [azure subscription](../includes/environment-subscription-h2.md)]

## 1. Set up development environment

Verify the following is installed on your local computer.

- [Node.js and npm](https://nodejs.org/en/download) - installed to your local machine.
- [Visual Studio Code](https://code.visualstudio.com/) - installed to your local machine. 
    - [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

## 2. Keep values for environment variables

**Set aside a place to copy values** from the Azure portal. The values are necessary to connect to Azure resources. Values will eventually be moved to the `.env` file for the React app.

Environment variable for Login button:

* Register Azure application - copy and save the Client ID to your environment file, `.env`, as `REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID`

## 3. Create App registration for authentication

1. **Sign in** to [Azure portal](https://portal.azure.com/?quickstart=True#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) for the Default Directory's App registrations.
1. Select **+ New Registration**.
1. **Enter your app registration data** using the following table:

   | Field                   | Value                                                                                                                                                                      |
   | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Name                    | `Simple Auth Tutorial` - this is the app name user's will see on the permission form when they sign in to your app.                                                 |
   | Supported account types | **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)** - this will cover most account types. |
   | Redirect URI type           | **Single Page Application (SPA)**                                                                                        |
   | Redirect URI value           | `https://localhost:3000` - notice this requires `HTTPS`.                                                                                        |

1. Select **Register**. Wait for the app registration process to complete.
1. **Copy the Application (client) ID** from the Overview section of the app registration. You will add this value to your environment variable for the client app later.

## 4. Create React single page application for TypeScript

1. In a Bash shell, **create a create-react-app** using TypeScript as the language:

   ```bash
   npx create-react-app tutorial-demo-login-button --template typescript
   ```

1. Change into the new directory and install Azure SDK client libraries:

   ```bash
   cd tutorial-demo-login-button && npm install @azure/msal-browser
   ```

1. Create a `.env` at the root level file and add the following lines:

    :::code language="env" source="~/../js-e2e-client-azure-login-button/.env"  :::

    The `.env` file is read as part of the create-react-app framework.

1. Copy your Azure App (client) ID into the second value.

## 5. Add logon and logoff buttons

1. Create a subfolder for the Azure-specific files named `azure` within the `./src` folder. 

1. Create a new configuration file for authentication in the `azure` folder, named `azure-authentication-config.ts` and copy in the following TypeScript code:

    :::code language="typescript" source="~/../js-e2e-client-azure-login-button/src/azure/azure-authentication-config.ts"  highlight="3-4,8":::

    This file reads your application ID in from the `.env file, sets session as the browser storage instead of cookies, and provides logging that is considerate of personally identifying information (PII).

1. Create a new file for the Azure authentication middleware in the `azure` folder, named `azure-authentication-context.ts` and copy in the following TypeScript code:

    :::code language="typescript" source="~/../js-e2e-client-azure-login-button/src/azure/azure-authentication-context.ts"  highlight="43, 58, 65":::

1. Create a new file for the user interface button component file in the `azure` folder, named `azure-authentication-component.tsx` and copy in the following TypeScript code:

   :::code language="typescript" source="~/../js-e2e-client-azure-login-button/src/azure/azure-authentication-component.tsx"  highlight="3, 11, 23, 29, 33-38":::

   This button component logs in a user, and passes back the user account to the calling/parent component.

   The button text and functionality is toggled based on if the user is currently logged in, captured with the `onAuthenticated` function as property passed into the component.

   When a user logs in, the button calls Azure authentication library method, `authenticationModule.login` with `returnedAccountInfo` as the callback function. The returned user account is then passed back to the parent component with the `onAuthenticated` function.


1. Open the `./src/App.tsx` file and replace the code with the following code to incorporate the Login/Logout button component:

   :::code language="typescript" source="~/../js-e2e-client-azure-login-button/src/App.tsx"  highlight="10, 38-44":::

## 6. Run React SPA app with login button

1. At the Visual Studio Code terminal, start the app:

    ```bash
    npm run start
    ```

    If a browser window opens to the app, close it. 

1. In the `azure-authentication-context.ts` file, set a break point at the first line of the handleResponse method:

    ```typescript
    handleResponse(response: AuthenticationResult, incomingFunction: any) {
        if (response !== null) {
         this.account = response.account;
        } else {
         this.account = this.getAccount();
        }
        
        if (this.account) {
         incomingFunction(this.account);
        }
    }
    ```

1. In Visual Studio Code, select the **Run** menu, then the **Add Configuration...* menu to configure the `launch.json` file configuration for debugging. Copy and add the following entry: 

    ```json
    {
        "name": "Chrome",
        "type": "chrome",
        "request": "launch",
        "url": "https://localhost:3000",
        "webRoot": "${workspaceFolder}/src",
        "sourceMapPathOverrides": {
            "webpack:///src/*": "${webRoot}/*"
        }
    }
    ```

    Make sure the `url` property does use `https` as the protocol. 

1. Start debugging by selecting F5, or **Run -> Start Debugging**.

1. In the browser, select the **Login** button at the top right. 

1. Select the user account 
    authentication-popup-select-user-account

1. Review the pop-up showing the 1) user name, 2) app name, 3) permissions you are agreeing to, and then select **Yes**.

    authentication-popup-let-this-app-access-your-info.png

create-react-app-after-authentication-login-button-succeeds

## 7. Clean up resources

## Next step
---
title: "Tutorial: Add Microsoft logon button to React SPA"
description: Azure Active Directory authentication presented in this tutorial is a login and logout button, and access to a user's username (email). Develop the application with a Azure client-side SDK, `@azure/msal-browser`, to manage the interaction of the user in the single page application (SPA).
ms.topic: tutorial
ms.date: 12/01/2020
ms.custom: devx-track-js
---

# Add Microsoft logon button to a single page application for authentication

Azure Active Directory authentication presented in this tutorial is a login and logout button, and access to a user's username (email). The username is used as part of the user-specific image container. Develop the application with a Azure client-side SDK, `@azure/msal-browser`, to manage the interaction of the user in the single page application (SPA).

## Application architecture and functionality

The SPA built in this tutorial is a React app (create-react-app), which allows a user to:

- Login using a Microsoft-supported login such as Office 365 or Outlook.com
- Upload photos to personal storage, provided by an Azure Storage Blob container
- View photos in personal storage.
- Delete an image or all images in personal storage.
- Logoff the application.

The full source code for this tutorial is available as a GitHub repository:

- [js-e2e-]()

### Simple Azure authentication

Azure authentication is used to authenticate a user and provide the username for the personal storage. As a simple application, the application doesn't create or manage a user database with custom application information. The user can only upload to their own personal storage because their user name is part of the container name.

This authentication code is kept in the sample application in the `azure/azure-authentication-*` files.

### Create-react-app with TypeScript

To provide a quick and simple single page application, the sample uses create-react-app. This frontend framework provides several shortcuts in typical client development with Azure SDKs and TypeScript:

- Bundling, required for Azure SDKs used in a client-application
- Environment variables in the `.env` file
- HTTPS, required for Azure authentication
- TypeScript, useful for typing and statement completion

## 1. Set up development environment

Make sure you have the following software locally installed:

- Node.js version 12 or higher
- Visual Studio Code
- Visual Studio Code extension: [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

## 2. Keep values for environment variables

**Set aside a place to copy values** from the Azure portal. The values are necessary to connect to Azure resources. Values will eventually be moved to the `.env` file for the React app.

Environment variable for Login button:

- Register Azure application - copy and save the Client ID to your environment file, `.env`, as `REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID`

Environment variable for Upload Photo storage

- Create Azure Storage Blob - copy and save the resource name to your environment file, `.env`, as `REACT_APP_AZURE_STORAGE_ACCOUNT_NAME`
- Create SAS Token - copy and save the token to your environment file, `.env`, as `REACT_APP_AZURE_STORAGE_SAS_TOKEN`

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

   ```text
   HTTPS=true
   REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID=
   ```

   The `.env` file is read as part of the create-react-app framework.

1. Copy your Azure App (client) ID into the second value.

## 5. Add logon and logoff buttons

1. Create a subfolder for the Azure-specific files named `azure` within the `./src` folder. 

1. Create a new configuration file for authentication in the `azure` folder, named `azure-authentication-config.ts` and copy in the following TypeScript code:

   ```typescript
   import { Configuration, LogLevel } from "@azure/msal-browser";

   const AzureActiveDirectoryAppClientId: any =
     process.env.REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID;

   export const MSAL_CONFIG: Configuration = {
     auth: {
       clientId: AzureActiveDirectoryAppClientId,
     },
     cache: {
       cacheLocation: "sessionStorage",
       storeAuthStateInCookie: false,
     },
     system: {
       loggerOptions: {
         loggerCallback: (level, message, containsPii) => {
           if (containsPii) {
             return;
           }
           switch (level) {
             case LogLevel.Error:
               console.error(message);
               return;
             case LogLevel.Info:
               console.info(message);
               return;
             case LogLevel.Verbose:
               console.debug(message);
               return;
             case LogLevel.Warning:
               console.warn(message);
               return;
           }
         },
       },
     },
   };
   ```

    This file reads your application ID in from the `.env file, sets session as the browser storage instead of cookies, and provides logging that is considerate of personally identifying information (PII).

1. Create a new file for the user interface button component file in the `azure` folder, named `azure-authentication-component.tsx` and copy in the following TypeScript code:

   ```typescript
   import React, { useState } from "react";
   import AzureAuthenticationContext from "./azure-authentication-context";
   import { AccountInfo } from "@azure/msal-browser";

   const ua = window.navigator.userAgent;
   const msie = ua.indexOf("MSIE ");
   const msie11 = ua.indexOf("Trident/");
   const isIE = msie > 0 || msie11 > 0;

   // Log In, Log Out button
   const AzureAuthenticationButton = ({
     onAuthenticated,
   }: any): JSX.Element => {
     // Azure client context
     const authenticationModule: AzureAuthenticationContext = new AzureAuthenticationContext();

     const [authenticated, setAuthenticated] = useState<Boolean>(false);
     const [user, setUser] = useState<AccountInfo>();

     const logIn = (method: string): any => {
       const typeName = "loginPopup";
       const logInType = isIE ? "loginRedirect" : typeName;

       // Azure Login
       authenticationModule.login(logInType, returnedAccountInfo);
     };
     const logOut = (): any => {
       if (user) {
         onAuthenticated(undefined);
         // Azure Logout
         authenticationModule.logout(user);
       }
     };

     const returnedAccountInfo = (user: AccountInfo) => {
       // set state
       setAuthenticated(user?.name ? true : false);
       onAuthenticated(user);
       setUser(user);
     };

     const showLogInButton = (): any => {
       return (
         <button id="authenticationButton" onClick={() => logIn("loginPopup")}>
           Log in
         </button>
       );
     };

     const showLogOutButton = (): any => {
       return (
         <div id="authenticationButtonDiv">
           <div id="authentication">
             <button id="authenticationButton" onClick={() => logOut()}>
               Log out
             </button>
           </div>
           <div id="authenticationLabel">
             <label>{user?.name}</label>
           </div>
         </div>
       );
     };

     const showButton = (): any => {
       return authenticated ? showLogOutButton() : showLogInButton();
     };

     return (
       <div id="authentication">
         {authenticationModule.isAuthenticationConfigured ? (
           showButton()
         ) : (
           <div>Authentication Client ID is not configured.</div>
         )}
       </div>
     );
   };

   export default AzureAuthenticationButton;
   ```

   This button component logs in a user, and passes back the user account to the calling/parent component.

   The button text and functionality is toggled based on if the user is currently logged in, captured with the `onAuthenticated` function as property passed into the component.

   When a user logs in, the button calls Azure authentication library method, `authenticationModule.login` with `returnedAccountInfo` as the callback function. The returned user account is then passed back to the parent component with the `onAuthenticated` function.

1. Create a new file for the Azure authentication middleware in the `azure` folder, named `azure-authentication-context.ts` and copy in the following TypeScript code:

   ```typescript
   import {
     PublicClientApplication,
     AuthenticationResult,
     AccountInfo,
     EndSessionRequest,
     RedirectRequest,
     PopupRequest,
   } from "@azure/msal-browser";

   import { MSAL_CONFIG } from "./azure-authentication-config";

   export class AzureAuthenticationContext {
     private myMSALObj: PublicClientApplication = new PublicClientApplication(
       MSAL_CONFIG
     );
     private account?: AccountInfo;
     private loginRedirectRequest?: RedirectRequest;
     private loginRequest?: PopupRequest;

     public isAuthenticationConfigured = false;

     constructor() {
       // @ts-ignore
       this.account = null;
       this.setRequestObjects();
       if (MSAL_CONFIG?.auth?.clientId) {
         this.isAuthenticationConfigured = true;
       }
     }

     private setRequestObjects(): void {
       this.loginRequest = {
         scopes: [],
         prompt: "select_account",
       };

       this.loginRedirectRequest = {
         ...this.loginRequest,
         redirectStartPage: window.location.href,
       };
     }

     login(signInType: string, setUser: any): void {
       if (signInType === "loginPopup") {
         this.myMSALObj
           .loginPopup(this.loginRequest)
           .then((resp: AuthenticationResult) => {
             this.handleResponse(resp, setUser);
           })
           .catch((err) => {
             console.error(err);
           });
       } else if (signInType === "loginRedirect") {
         this.myMSALObj.loginRedirect(this.loginRedirectRequest);
       }
     }

     logout(account: AccountInfo): void {
       const logOutRequest: EndSessionRequest = {
         account,
       };

       this.myMSALObj.logout(logOutRequest);
     }
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
     private getAccount(): AccountInfo | undefined {
       console.log(`loadAuthModule`);
       const currentAccounts = this.myMSALObj.getAllAccounts();
       if (currentAccounts === null) {
         // @ts-ignore
         console.log("No accounts detected");
         return undefined;
       }

       if (currentAccounts.length > 1) {
         // TBD: Add choose account code here
         // @ts-ignore
         console.log(
           "Multiple accounts detected, need to add choose account code."
         );
         return currentAccounts[0];
       } else if (currentAccounts.length === 1) {
         return currentAccounts[0];
       }
     }
   }

   export default AzureAuthenticationContext;
   ```

1. Open the `./src/App.tsx` file and replace the code with the following code to incorporate the Login/Logout button component:

   ```typescript
   import React, { useState } from 'react';
   import AzureAuthenticationButton from './azure/azure-authentication-component';
   import { AccountInfo } from '@azure/msal-browser';

   const App = (): JSX.Element => {

     // current authenticated user
     const [currentUser, setCurrentUser] = useState<AccountInfo>();

     const onAuthenticated = async (userAccountInfo: AccountInfo) => {
       setCurrentUser(userAccountInfo);

     return (
       <div id="App">
         <AzureAuthenticationButton onAuthenticated={onAuthenticated} />
         <div id="App.body">
           <h2>Upload file to Azure Blob Storage</h2>
           <div>
             {currentUser ?
               <div>{currentUser?.username} is logged in.</div>
             ) : (
               <div>Log in</div>
             )}
           </div>
         </div>
       </div>
     );
   };

   export default App;
   ```

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
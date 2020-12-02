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

### Simple Azure Blob Storage

Azure Storage is used to contain the personal storage images and photos. The personal storage can't be accessed anonymously but each image can be shared with friends with a URL with anonymous access. The user can also delete images or the entire personal storage.

This storage code is kept in the sample application in the `azure/azure-storage-blob.ts` files

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

**Set aside a place to copy values** from the Azure portal. The values are necessary to connect to Azure resources. The value will eventually be moved to the `.env` file for the React app.

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
   | Name                    | `JohnSmithSimpleAuthTutorial` - this is the app name user's will see on the permission form when they sign in to your app.                                                 |
   | Supported account types | `Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)` - this will cover most account types. |
   | Redirect URI            | `Single Page Application`, `https://localhost;3000` - notice this requires `HTTPS`.                                                                                        |

1. Select **Register**. Wait for the app registration process to complete.
1. **Copy the Application (client) ID** from the Overview section of the app registration. You will add this value to your environment variable for the client app later.

## Create React single page application for TypeScript

1. In a Bash shell, **create a create-react-app** using TypeScript as the language:

   ```bash
   npx create-react-app tutorial-demo-login-button --template typescript
   ```

1. Change into the new directory and install dependencies:

   ```bash
   cd tutorial-demo-login-button && npm install
   ```

1. Add Azure SDK client libraries for Login button:

   ```bash
   npm install @azure/msal-browser
   ```

1. Create a root level file, `.env` and add the following lines:

   ```text
   HTTPS=true
   REACT_APP_AZURE_ACTIVE_DIRECTORY_APP_CLIENT_ID=
   ```

   The `.env` file is read as part of the create-react-app framework.

1. Copy your Azure App (client) ID into the second value.

## Add logon and logoff buttons

1. Create a `src` subfolder for the Azure-specific files named `azure`.

1. Create a new configuration file for authentication, named `azure-authentication-config.ts` and copy in the following TypeScript code:

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

1. Create a new file for the user interface button component file, named `azure-authentication-component.tsx` and copy in the following TypeScript code:

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

1. Create a new file for the Azure authentication middleware, named `azure-authentication-context.ts` and copy in the following TypeScript code:

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

## Run React SPA app with login button

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

    In the browser, select the **Login** button at the top right. 


## X. Create Storage resource for images

1. **Create a new Azure Storage resource** in the [Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) using the following table:

   | Field                | Value                                                                                                                                                                                      |
   | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | Subscription         | Select your subscription.                                                                                                                                                                  |
   | Resource group       | Create a new resource group named `rg-tutorial-demo`. A resource group allows you to easily delete all resources created within the group.                                                 |
   | Storage account name | `tutorialdemo<YOUR-ID>`, replace `<YOUR-ID>` with your email or name. This account name is used as part of the web URL for the resource so it must be unique across all storage resources. |
   | Location             | Select a regional location close to you.                                                                                                                                                   |
   | Performance          | Standard                                                                                                                                                                                   |
   | Account kind         | StorageV2                                                                                                                                                                                  |
   | Replication          | Locally-redundant storage (LRS)                                                                                                                                                            |

   Any fields not specifically listed above should not be changed from the default value.

1. **Copy the Storage account name** . You will add this value to your environment variable for the client app later.

## 5. Generate your shared access signature (SAS) token

Generate the SAS token before configuring CORS so the client application has specific access to the storage resource.

1. While still in the Azure portals, in the Settings section, select **Shared access signature**.
1. Configure the SAS token with the following settings.

   | Property                    | Value                                                                      |
   | --------------------------- | -------------------------------------------------------------------------- |
   | Allowed services            | Blob                                                                       |
   | Allowed resource types      | Service, Container, Object                                                 |
   | Allowed permissions         | Read, write, delete, list, add, create                                     |
   | Enable deletions of version | Checked                                                                    |
   | Start and expiry date/time  | Accept the start date/time and set the end date time 1 year in the future. |
   | HTTPS only                  | Selected                                                                   |
   | Preferred routing tier      | Basic                                                                      |
   | Signing Key                 | key1 selected                                                              |

1. Select **Generate SAS and connection string**. Immediately copy the SAS token, without the `?` at the beginning. You will add this value to your environment variable for the client app later.

   The SAS token value is a partial query string and is used in the URL when queries are made to your cloud-based resource. The token format depends are which tool you used to create it:

   - **Azure portal**: If you create your SAS token in the portal, the token includes the `?` as the first character of the string.
   - **Azure CLI**: If you create your SAS token with the Azure CLI, the value returned doesn't include the `?` as the first character of the string.

## 6. Configure CORS for Azure Storage resource

Configure CORS for your resource so the client-side React code can access your storage account.

1. While still in the Azure portals, in the Settings section, select **CORS**.
1. **Configure CORS** as shown in the image.

   | Property        | Value             |
   | --------------- | ----------------- |
   | Allowed origins | `*`               |
   | Allowed methods | All except patch. |
   | Allowed headers | `*`               |
   | Exposed headers | `*`               |
   | Max age         | 86400             |

1. Select **Save** above the settings to save them to the resource. The code doesn't require any changes to work with these CORS settings.

## Add Azure Storage for uploaded files

## Run React SPA app with file upload

## User revoke application permissions

## Next step

> [!div class="nextstepaction"] > []()

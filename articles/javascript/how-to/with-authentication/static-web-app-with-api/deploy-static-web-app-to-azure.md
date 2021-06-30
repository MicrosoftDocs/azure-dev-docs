---
title: "5: Deploy Static web app to Azure"
titleSuffix: Azure Developer Center
description: In this article, learn to deploy the Static web app to Azure. 
ms.topic: how-to
ms.date: 06/28/2021
ms.custom: devx-track-js
---

# Deploy Static web app to Azure

In this article, learn to deploy the Static web app to Azure by creating and configuring a GitHub action.

## Git commit changes 

In VS Code, review the changes and commit the changes. While developing the sample, it was easier to limit the view of the file explorer. Now that you need to create the Static web app, you need to see and understand the entire file structure again.

1. In VS Code, select the File menu, then select **Close Folder**. Then select File menu, and **Open Folder** to open the root of the GitHub sample repo, `ms-identity-javascript-react-tutorial`.

1. In VS Code, select the Source Control explorer, and review the changes. 
1. In the Message box, above the changes files, enter a commit message, such as `first commit - cosmos DB user`. 
1. Select the Source Control's check mark, above the message box, to finish the commit. 
1. Select the ellipsis, `...`, to the right of the check mark, and select **Push**. This pushes your code changes to your fork on GitHub. 

    The source code originally came from `https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial`. Because you forked that repo, you have your own repo to push and pull from which doesn't affect the `azure-samples` original work. 

## Create the Static web app in VS Code

1. In VS Code, select the Azure explorer, then right-click your subscription and select **Create Static Web App (Advanced)** for Static web apps.

1. If you are not already signed into GitHub in VS Code, a browser opens and asks you to authorize VS Code to access GitHub. Complete the authorization.

    This is required so the Static web app extension can create a GitHub workload to deploy to Azure in your repo. 
 
1. Follow the prompts using the following table to understand how to create your **Azure Static web app** resource.

    |Prompts 1-8|Value|
    |--|--|
    |Enter a name for the new static web app.|Accept the default value `ms-identity-javascript-react-tutorial`. |
    |Select a resource group for new resources.| Select the resource group used to create your Cosmos DB resource.|
    |Select a sku|Free|
    |Choose build preset to configure default project structure. |Select **Custom**, because the sample code is deeply nested inside the MSAL sample repo.|
    |Enter the location of your application code. |Enter `/4-Deployment/2-deploy-static/App/` to indicate where the React app's package.json is.|
    |Enter the location of your Azure Functions code or leave blank to skip this step.|Enter `/4-Deployment/2-deploy-static/App/api`.|
    |Enter the location of your build output relative to your app's location or leave blank if it has not build.|Enter `build` because that is where create-react-app generates the built files.|

    Wait for the deployment to finish. 

## Add Function API environment variables

1. In VS Code, in the Azure explorer, right-click your static web app's **Application Settings** and select **Add New Setting**. Add each of the following settings your Function API uses during runtime. Find these values in the `./api/local.settings.json` file for the sample. 

    |Setting|Value
    |--|--|
    |CLIENT_ID|Application (client) ID|
    |CLIENT_SECRET|Application's (client) secret|
    |TENANT_INFO|Directory (tenant) ID|
    |EXPECTED_SCOPES|`access_as_user`|
    |MONGODB_URL|Cosmos DB for MongoDB API connection string|
 
    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/vscode-static-web-app-add-application-settings.png" alt-text="A browser screenshot show VS Code's Azure explorer app settings for the static web app.":::


## Add new static web app's URL to Active Directory app

The Active Directory app, through MSAL, doesn't know about the new static web app URL or its redirect URL and won't work until it is set.

1. In VS Code, in the Azure explorer, select you static web app then right-click on **Production**, then select **Browse site**. The new site opens in a browser. 
   
1. Copy the URL. 
1. In VS Code, in the Azure explorer, select your static web app then select **Open in Portal**. 
1. In the portal, search for **App registrations** then select your Active Directory app.
1. Select the **Authentication** page and add your new URL to the redirect URLs list then select **Save**. 

    You also need this URL in the next section.

## Add React client environment variables to workflow configuration file

1. In the Azure explorer, right-click your new Static web app, and select **Edit Configuration**.
1. In the *.yml file, add the React client environment variables needed to use MSAL. Find these values in the `./.env` file for the sample. 

    ```yaml
    jobs:
    build_and_deploy_job:
      if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
      runs-on: ubuntu-latest
      name: Build and Deploy Job
      steps:
        - uses: actions/checkout@v2
            with:
            submodules: true
        - name: Build And Deploy
            id: builddeploy
            uses: Azure/static-web-apps-deploy@v1
            with:
              azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_XYZ }}
              repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
              action: "upload"
              ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
              # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
              app_location: "/4-Deployment/2-deploy-static/App/" # App source code path
              api_location: "/4-Deployment/2-deploy-static/App/api" # Api source code path - optional
              output_location: "build" # Built app content directory - optional
              ###### End of Repository/Build Configurations ######
            env: 
              REACT_APP_AAD_APP_CLIENT_ID: "YOUR-APP-ID"
              REACT_APP_AAD_APP_TENANT_ID: "YOUR-TENANT-ID"
              REACT_APP_AAD_APP_REDIRECT_URI: "YOUR-REDIRECT-URL"
              REACT_APP_AAD_APP_FUNCTION_SCOPE_URI: "YOUR-FUNCTION-SCOPE-URI"
    ```

    Remember yaml (*.yml) files are very specific with spacing at the beginning of the line. Make sure your new environment variables are indented under the `env` setting.

1. In VS Code, select the Source Control explorer, and review the changes. 
1. In the Message box, above the changes files, enter a commit message, such as `update workflow file`. 
1. Select the Source Control's check mark, above the message box, to finish the commit. 
1. Select the ellipsis, `...`, to the right of the check mark, and select **Push**. This pushes your code changes to your repo on GitHub. 

## View the deployment on GitHub

1. Open the GitHub repository, `https://github.com/YOUR-ACCOUNT/ms-identity-javascript-react-tutorial`, in a browser. Replace `YOUR-ACCOUNT` with your GitHub alias. 
1. Select **Actions** then your workflow to see the workflow status.

    Wait until the workflow successfully finishes before continuing.

## Use the remote static web app

1. Open the static web app in a browser and login. 
1. Go to the **Function API** page and see that your favorite color, entered when you ran the sample locally, is still set. 
1. Change the color and submit. 

    You've run the sample locally and remotely, signing in to your Active Directory-secured identity app, and accessing your Microsoft Graph identity information, and setting your favorite color in Cosmos DB.

## Clean up resources

1. To clean up the Azure resources in the resource group, use the Azure explorer in VS Code to select the resource group, then select **Delete**.
1. To remove your Active Directory identity app, open the [Azure portal](https://portal.azure.com) and search for **App registrations**. 
1. Select the app registration you created for this sample. 
1. On the Overview page for the app, select **Delete**. 

## Next steps

* [Deploy Static web app to Azure](./deploy-static-web-app-to-azure.md)

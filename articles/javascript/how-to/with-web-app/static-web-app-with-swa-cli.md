---
title: "Create static web app with serverless app"
description: Create a static web app (React and API) and locally develop using the SWA CLI. Run the same code locally and remotely to ensure that customers get the correct web behavior.
ms.topic: how-to
ms.date: 10/19/2021
ms.custom: devx-track-js
#intent: Create Express.js web app with easy auth configured. 
---
# Create a Static web app with a serverless API 

Learn how to locally run then deploy a static web app with a serverless API to Azure. This tutorial uses the **preview version of the latest Azure Functions Node.js programming model**.

Learn how to:

* Locally run a [static web app](/azure/static-web-apps/) (SWA)
* Locally proxy front-end requests to local API using the [SWA CLI](https://github.com/Azure/static-web-apps-cli). 
* Deploy and run the same code remotely without changes.

The proxy between the front-end and APIs is provided by the Static web app CLI provides:
* The URL in React, `/api/todo`, doesn't specify the server or port number for the API. Requests using this URL are successful locally because the SWA CLI manages the proxy for you. 
* A local authentication emulator when accessing `/.auth/login/<provider>`
* Route management and authorization 

## Authentication in this sample

The authentication in this sample is provided for front-end users:
* Login/Logout
* Public and private content

This is an _easy auth_ implementation. The back-end API can't act [_on behalf of_(OBO)](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) the logged in user. Acting on behalf of the user requires more configuration both in the Azure Active Directory app and the Azure Identity SDK in the API. 

## Source code in this sample

The source code in this sample is meant to learn how to build and deploy a static web app with a serverless API. The code isn't meant for production. 

You'll find several places in the code that don't follow best security practices. For example, the code uses `console.log` to write to the browser console.

When you move to a production environment, you should review and remove any code, which violates security best practices, in your organization.

## 1. Prepare your development environment

Create the following accounts:

- Azure subscription - [Create a free Azure account](https://azure.microsoft.com/free/)
- [GitHub account](https://github.com/) - You need a GitHub account to deploy in this tutorial. If you don't have one, you can deploy from the SWA CLI. Learn more about [deployment with the SWA CLI](/azure/static-web-apps/static-web-apps-cli-deploy).

Install the following on your local development computer:

- [Node.js](https://nodejs.org/en/download/releases/) v18+
- [Visual Studio Code](https://code.visualstudio.com/Download) (VS Code)
- [Azure Static Web Apps (SWA) CLI](https://azure.github.io/static-web-apps-cli/docs/use/install) installed globally with `-g` flag
- [Azure Functions Core Tools](/azure/azure-functions/functions-core-tools-reference?tabs=v2) v4.0.5095+ (if running locally) installed globally with `-g` flag
- [TypeScript](https://www.typescriptlang.org/) v4+

## 2. Fork the sample repository

You need to have your own fork of the sample repository to complete the deployment from GitHub. During the fork process, you only need to copy the `main` branch. 

Fork the [sample repository](https://github.com/Azure-Samples/azure-typescript-e2e-apps/): `https://github.com/Azure-Samples/azure-typescript-e2e-apps`.

## 3. Clone the forked sample repository

 The remaining local development steps are optional and helpful to know what the application looks like and how it should behave before you deploy to Azure. If you aren't interested in running the sample locally, you can skip to [Create a new Azure Static Web app](#6-create-a-new-azure-static-web-app).

1. In a bash terminal, clone **your forked repository** to your local computer. Don't clone the original sample repository. An example URL is ``

    ```bash
    git clone YOUR-FORKED-REPO-URL
    ```

1. Install dependencies for SWA CLI.

    ```bash
    cd azure-typescript-e2e-apps && npm install
    ```

1. Install dependencies for the local front-end app:

    ```bash
    cd app-react-vite && npm install 
    ```

1. Install dependencies for the local back-end app:

    ```bash
    cd ../apiV4-inmemory && npm install && cd ..
    ```


## 4. Optional, build and run local app

The sample repository has several versions of the front-end and backend apps. The following steps use the React version of the front-end and the Azure Function v4 with Node.js version of the back-end.

1. From the root of the sample app, use the SWA CLI with the `swa-cli.config.json` file to build the front-end and back-end apps:

    ```bash
    swa build
    ```

    If you run into errors, which may happen depending on the version of various packages and your environment, fix the errors before continuing. It's important to know that your project successfully builds locally before moving on to deployment to Azure Static Web Apps.

1. From the root of the sample app, use the SWA CLI to start the apps with a proxy.
   
    ```bash 
    swa start
    ```

1. When you see the following lines in the bash terminal, the project successfully started. 

    ```bash
    [swa] Serving static content:
    [swa]   /workspaces/js-e2e-static-web-app-with-cli/v2/app/dist
    [swa] 
    [swa] Serving API:
    [swa]   /workspaces/js-e2e-static-web-app-with-cli/v2/api
    [swa] 
    [swa] Azure Static Web Apps emulator started at http://0.0.0.0:4280. Press CTRL+C to exit.
    ```

1. Open a web browser to the proxied URL, `http://localhost:4280`. You should see the following page:
   
    :::image type="content" source="../../media/static-web-app-with-swa-cli/browser-local-not-signed-in.png" alt-text="Screenshot of local React app prior to authentication.":::

1. You can sign in using authentication provided by the SWA CLI using on of the listed providers. The process mocks authentication in Azure Static web apps. The front-end code uses the `/.auth/me` endpoint to get the user's identity. Enter any fake user name and don't change the rest of the fields.

    :::image type="content" source="../../media/static-web-app-with-swa-cli/browser-local-sign-in-form.png" alt-text="Screenshot of local React app's mock authentication form.":::

1. Once a user is authenticated, the front-end displays _private_ information such as the API's environment variables.

    :::image type="content"  source="../../media/static-web-app-with-swa-cli/browser-local-signed-in.png" alt-text="Screenshot of local React app with authentication complete.":::

1. Expand the public and private sections to see the content from the API is displayed. 

## 5. Create a new Azure Functions app

The previous section of running the static web app with the API was optional. The remaining sections of the article are required to deploy the app and API to the Azure cloud.

To use the **preview version of the Azure Functions v4 runtime**, you need to create a new Azure Functions app. This is known as a bring-your-own (BYO) function to Static web app. Your static web app also needs to be rebuilt and redeployed to use the Azure Functions app URI in the fetch requests to the API instead of using a proxied and managed API.

1. In a web browser, open the Azure portal to create a new Azure Functions app: [Create new app](https://ms.portal.azure.com/#create/Microsoft.FunctionApp)

1. Use the following information to create the Function App::


    |Tab:Setting|Value|
    |--|--|
    |Basics: Subscription|Select the subscription you want to use.|
    |Basics: Resource Group|Create a new resource group such as `first-static-web-app-with-api`. The name isn't used in the app's public URL. Resource groups help you group and managed related Azure resources.|
    |Basics: Instance details: Function App name|Enter a globally unique name such as `swa-api` with 3 random characters added at the end.|
    |Basics: Instance details: Code or container|Select `Code`.|
    |Basics: Instance details: Runtime stack|Select `Node.js`.|
    |Basics: Instance details: Runtime stack|Select `18LTS`.|
    |Basics: Operating system| Select `Linux`.|
    |Basics: Hosting|Select `Consumption`.|
    |Storage: Storage account|Don't change this. A new Azure Storage account is created to help with function events.|
    |Networking|Don't change anything.|
    |Monitoring: Application Insights: Enable Application Insights|Select `Yes`. Don't change the default name provided.|
    |Deployment: GitHub Actions Settings: Continuous deployment|Select `Enable`.|
    |Deployment: GitHub account| Select your GitHub account, it if isn't already set.|
    |Deployment: Organization|Select your GitHub account, which you used when you forked the sample repository.|
    |Deployment: Repository|Select your forked repository name, `azure-typescript-e2e-apps`.|
    |Deployment: Branch|Select `main`.|
    |Tags|Don't change anything.|
    |Review + create|Select `Create`.|

    The step adds a GitHub yaml workflow file to your forked repository. 

1. When the resource is created, select the `Go to resource` button.
1. Select **Settings -> Configuration** then add a configuration setting for the Azure Function Node.js v4 runtime with name `AzureWebJobsFeatureFlags` and value `EnableWorkerIndexing`.
1. Select **Save** to save the setting.

1. In a bash terminal, use **git** to pull down the new yaml workflow file to your local computer.

    ```bash
    git pull origin main
    ```

1. In Visual Studio Code, open the new yaml workflow file located at `./.github/workflows/`. 
1. The workflow file assumes the function source code is at the root of the repository and is the only app in the repository but that isn't the case with this sample repository. To fix that, edit the set, which builds the Azure Function app. The lines to edit are highlighted in the following yaml block and explained below the image:

    :::code language="yaml" source="~/../azure-typescript-e2e-apps/example-workflows/api-inmem.yml" highlight="7, 13-14,18,20, 42-49" :::

    |Property change|Purpose|
    |--|--|
    |`name`|Shorten the name so you can easily find it in your fork's GitHub actions list.|
    |`paths`|Add the paths section to  limit the deployment to run only when the Azure Functions API code changes. When you edit the workflow file, you can trigger the deployment manually.|
    |`AZURE_FUNCTIONAPP_PACKAGE_PATH`|When using a subdirection for source code, this needs to be that subdirectory path and name.|
    |`VERBOSE`|This is setting is helpful for debugging the build and deploy process.|
    |step named `Upload artifact for deployment job`|This step creates a downloadable artifact. This is helpful when debugging exactly what files are deployed to your Azure Function.|

    The `Upload artifact for deployment job` is optional. It's used to understand and debug what files are deployed to Azure Functions or to use those files in a separate environment.

1. Save the file then add, commit, and push it back to GitHub with git:

    ```bash
    git add .
    git commit -m "fix the workflow for a subdir"
    git push origin main
    ```

1. From a browser, rerun the workflow on GitHub in your fork's actions area.

    :::image type="content" source="../../media/static-web-app-with-swa-cli/github-action-api-rerun.png" alt-text="Screenshot of GitHub forked repository, showing how to rerun a GitHub action.":::

1. Wait for the action to successfully complete before continuing. 
1. In a web browser, use your function app's external API endpoint to verify the app deployed successfully.
    
    ```URL
    https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/todo
    ```

    The JSON result returned for the in-memory data is:

    ```json
    {
        "1": "Say hello"
    }
    ```

1. Make a note of your function's URL. You need that in the next section.
1. You know your Azure Function app is working in the cloud. Now you need to create your static web app in the cloud to use the API. 

## 6. Create a new Azure Static web app

This creation process deploys the same forked GitHub sample repository to Azure. You configure the deployment to use only the front-end app. 

1. Open the Azure portal and sign in with your Azure account: [Azure portal](https://ms.portal.azure.com/#create/Microsoft.StaticApp).
1. Use the following information to complete the information:

    |Prompt|Setting|
    |--|--|
    |Subscription|Select the subscription you want to use.|
    |Resource Group|Select `Create new` and enter a new for the resource group such as `first-static-web-app`. The name isn't use in the app's public URL. Resource groups help you group resources used for a single project.|
    |Hosting plan type|Select `Free`|
    |Azure Functions and staging details|Don't change the default. You aren't deploying the Function API within the static web app.|
    |Deployment details - source| Select `GitHub`|
    |Deployment details - GitHub| Sign in to GitHub if necessary.|
    |Deployment details - Organization|Select your GitHub account.|
    |Deployment details - Repository|Select the forked repository named `azure-typescript-e2e-apps`.|
    |Deployment details - Branch|Select the `main` branch.|
    |Build details - Build Presents|Select `Custom`.|
    |Build details - App location|Enter `/app-react-vite`.|
    |Build details - Api location|Leave empty|
    |Build details - Output location|Enter the location of the front-end's output directory, `dist`.|
  

1. Select **Review + create**, then select **Create**. 
1. When the resource is created, select the `Go to resource` button.
1. On the **Overview** page, make a note of your static web app's URL. You need that in the next section when you set the Azure Function's CORS setting.

1. The creation process creates a GitHub yaml workflow file in your forked GitHub repository. Pull that change down with the following command:

    ```bash
    git pull origin main
    ```

1. The GitHub action found at `./.github/workflows/azure-static-web-apps-*.yml` is responsible for building and deploying the front-end and the back-end apps. Edit the file to add an environment variable for the API URL. The lines to edit are highlighted in the following yaml block and explained below the yaml block.

    :::code language="yaml" source="~/../azure-typescript-e2e-apps/example-workflows/app-react-vite.yml" highlight="7-8, 13-15,19, 39-41" :::

    |Property change|Purpose|
    |--|--|
    |`paths`|Add the paths section to limit the deployment to run only when the Azure Functions API code changes. When you edit the workflow file, you can trigger the deployment manually.|
    |`workflow_dispatch`|Add `workflow_dispatch` _only_ while learning the deployment process and debugging any issues in the Vite build. Remove this line, when you continue this source code beyond this article.|
    |`if ... || github.event_name == 'workflow_dispatch' `|Include the `workflow_dispatch` event as allowed to generate a build only while learning the deployment process and debugging any issues in the Vite build.|
    |`env`|Add the environment variables necessary to include the Azure Function API's URL in the static build with **Vite**.|

1. Save the file then add, commit, and push it back to GitHub with git:

    ```bash
    git add .
    git commit -m "fix the workflow for a subdir"
    git push origin main
    ```

1. From a browser, rerun the workflow on GitHub in your fork's actions area for your static web app. 
1. Your front-end app is deployed to Azure. Now you need to configure the Azure Function app to allow CORS requests from your static web app.

## 7. Configure CORS for your Azure Function app

When using a separate Azure Function app, instead of a managed Function app, you need to configure CORS to allow requests from your static web app. 

1. In the Azure portal, open your Azure Function app. 
1. In the **API -> CORS** section, add your static web app's URL to the list of allowed origins. 

> [!NOTE]
> When your use a managed Azure Function app, which is deployed in the same workflow as your static web app with the **Azure/static-web-apps-deploy** GitHub action, CORS is configured automatically.

## 8. Test your static web app

1. In a browser, open your static web app. 
1. Interact with the app to sign in in, view public and private information, and sign out again.  

## Troubleshooting 

This sample keeps a [list of known issues and resolutions](https://github.com/Azure-Samples/azure-typescript-e2e-apps/blob/main/docs/troubleshooting.md). If your issue isn't listed, please [open an issue](https://github.com/Azure-Samples/azure-typescript-e2e-apps/issues).


## Static web app and function app public URLs

You can always find your static web app's URL and your function app's URL in the Azure portal, on each resource's **Overview** page. These URLs are public by default. 

## 8. Clean up all resources used in this article series

Clean up all resources created in this article series.

1. In the Azure portal, delete your resource group, which deletes the static web app and the function app.
1. In the GitHub portal, delete your forked repository.

## Next steps

* [Add search to your web site](/azure/search/tutorial-javascript-overview)
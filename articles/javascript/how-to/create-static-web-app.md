---
title: Build static web app on Azure with JavaScript
description: Build a JAMstack app (JavaScript, APIs, and Markup) on Azure
ms.topic: how-to
ms.date: 05/03/2021
ms.custom: devx-track-js
---

# Build a new Static web app on Azure with Node.js

Azure Static Web Apps is a service that automatically builds and deploys full stack web apps to Azure from a public code repository. 

* **Client apps**: Static web apps are commonly built using libraries and frameworks like Angular, React, Svelte, Vue, or Blazor where server-side rendering is not required. 
* **APIs**: API endpoints are hosted using a serverless architecture, which avoids the need for a full back-end server all together.

* [Static web app community samples](https://github.com/microsoft/static-web-apps-gallery-code-samples)

## What is a static web app resource? 

A Static web app resource is a hosted app with both the generated static client files and the optional api endpoints. When you create the resource, you include information necessary for a GitHub action to build the static files and deploy to Azure. 

:::image type="content" source="../media/howto-static-web-app/azure-portal-create-static-web-app.png" alt-text="When you create the resource, you include information necessary for a GitHub action to build the static files and deploy to Azure.":::

Create the Static web app with one of the following:

* [Azure portal](/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript)
* [VS Code extension](/azure/static-web-apps/getting-started?tabs=vanilla-javascript)
* [Azure CLI](/azure/static-web-apps/get-started-cli?tabs=vanilla-javascript)

## The GitHub action builds and deploys your app

The GitHub action is created during resource creation and includes instructions to _build_ and _deploy_ the site. The action is created on the source code repo selected during resource creation. 

The following GitHub action YAML file is based on the Azure [search tutorial](/azure/search/tutorial-javascript-overview) and its [sample code](https://github.com/azure-samples/azure-search-javascript-samples) to add search to a website. 

```yml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - master
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - master

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
        uses: Azure/static-web-apps-deploy@v0.0.1-preview
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME> }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "search-website" # App source code path
          api_location: "search-website/api" # Api source code path - optional
          output_location: "build" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v0.0.1-preview
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_<GENERATED_HOSTNAME> }}
          action: "close"
```

## Static web apps include apis

[Azure Function](/azure/azure-functions/) apis are provided in static web apps optionally and typically live in a folder named `/api`. 

These functions allow you to develop a full-stack web site without needing to deal with the server-side configuration of an entire web hosting environment. 

Learn more about [Azure Function apps with JavaScript](/azure/azure-functions/functions-reference-node). 

* [Azure serverless community library of samples](https://serverlesslibrary.net/)

## Develop static web apps with Visual Studio Code extension

Use one of the following methods to create  to quickly develop and deploy your apps. 

Tutorials, which use the [Static web app extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) include: 

* [Add search to a website with Azure Search and Static web apps](/azure/search/tutorial-javascript-overview)
* [Analyze an image with Azure Computer Vision and Static web apps](/azure/developer/javascript/tutorial/static-web-app/introduction)


## Configure the static web app with GitHub

Because the GitHub action controls building and deploying, Static web app [environment variables](/azure/static-web-apps/github-actions-workflow#environment-variables), typically injected into the static files, need to be configured in the action yaml in the `env` section. Secrets should be [stored in GitHub secrets and pulled in to the `env` section](/azure/developer/github/github-variable-substitution).  

## Deploy static web apps to Azure

Deploying a static web app to Azure is started by pushing to the source code repository's specific branch, listed in the GitHub action under `pull_requests:branches`. 

The push from your local computer needs to use the Static web app's repository or fork of a repository. If your GitHub user account doesn't have permission to push to the specified branch on the specified organization repo, such as your company's GitHub organization, you should fork the repository, then configure your GitHub action to use your fork. 

View deployment success from the GitHub action. 

:::image type="content" source="../media/howto-static-web-app/github-action-build-and-deploy-status.png" alt-text="View deployment success from the GitHub action.":::

## View logs of static web apps on Azure

Turn on **Application Insights** in the Azure portal for your Static web app to collect logging. The integrated [Application Insights](/azure/azure-monitor/app/javascript) logging collects a huge amount of information for you, without any changes to your code. 

To add custom logging from your app to Application Insights, add the [@microsoft/applicationinsights-web](https://www.npmjs.com/package/@microsoft/applicationinsights-web) npm package then add the JavaScript code to capture custom information.

```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
  /* ...Other Configuration Options... */
} });
appInsights.trackTrace({message: 'some trace'});
```

## Next step

* Learn more about [Static web apps](/azure/static-web-apps/)
* [Add an API](/azure/static-web-apps/add-api) in Static web apps

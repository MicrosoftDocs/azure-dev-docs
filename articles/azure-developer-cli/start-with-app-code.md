---
title: Add Azure Developer CLI support to your app using code in your app directory
description: How to add Azure Developer CLI support to your app using code in your app directory
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep, build-2023
---

# Add Azure Developer CLI support to your app using code in your app directory

The Azure Developer CLI (`azd`) provides two different workflows to initialize a template to use with your app, which include:

- **Use code in the current directory**: This approach analyzes your app and autogenerates supported infrastructure and configuration resources.
- **Select a template**: This approach allows you to integrate an existing template with your app, or use an existing template as a starting point for a new app.

Both of these approaches are explored in the [Create Azure Developer CLI templates overview](make-azd-compatible.md) doc.

In this article, you learn how to add support for the Azure Developer CLI (`azd`) to your app through the **Use code in the current directory** approach. Visit the [Add `azd` support to your app using an existing template](start-with-existing-template.md) doc for more information on the alternative approach. You can also visit the [Training - build and deploy `azd` templates](/training/paths/azure-developer-cli) for more information on building `azd` templates.

## Use code in the current directory

1. You can follow the steps ahead using your own project. However, if you'd prefer to follow along using a sample application, clone the following starter repo to an empty directory on your computer:

    ```bash
    git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart
    ```

1. Open a terminal to the root directory of the project.

1. Run the `azd init` command to initialize the template.

    ```bash
    azd init
    ```

1. When prompted, select the option to **Use code in the current directory**. `azd` analyzes the project and provides a summary of the detected services and recommended Azure hosting resources.

1. Select **Confirm and continue initializing my app**. `azd` generates the following assets in the project root directory:

    * An `azure.yaml` file with appropriate service definitions.
    * An `infra` folder with infrastructure-as-code files to provision and deploy the project to Azure.
    * A `.azure` folder with environment variables set in a `.env` file.

    More details on this detection and generation process are provided later in the article.

1. The generated files work as-is for the provided sample app and may for your own apps as well. If necessary, the generated files can be modified to fit your needs. For example, you may need to further modify the infrastructure-as-code files in the `infra` folder if your app relies on Azure resources beyond those that were identified by `azd`.

1. Run the `azd up` command to provision and deploy your app to Azure.

    ```bash
    azd up
    ```

1. When prompted, select the desired subscription and location to begin the provisioning and deployment process.

1. When the process completes, click the link in the `azd` output to open the app in the browser.

## Explore the initialization steps

When you select the **Use code in the current directory** workflow, the `azd init` command analyzes your project and autogenerates code based on what it discovers. The sections below explain the details of how this process works and which technologies are currently supported.

### Detection

The `azd init` command detects project files for supported languages located in your project directory and subdirectories. `azd` also scans package dependencies to gather information about the web frameworks or databases your app uses. If needed, you can manually add or edit the detected components as presented in the confirmation summary prompt.

The current detection logic is as follows:

- Supported languages:
    -  Python
    - JavaScript/TypeScript
    - .NET
    - Java
- Supported databases:
    - MongoDB
    - PostgreSQL
- For Python and JavaScript/TypeScript, web frameworks and databases are automatically detected.
- When a JavaScript/TypeScript project uses a front-end (or client-side) web framework, it is classified as a front-end service. If your service uses a front-end web framework that is currently undetected, you may select JQuery to provide equivalent front-end service classification and behavior.

### Generation

After you confirm the detected components, `azd init` generates the infrastructure-as-code files needed to deploy your application to Azure.

The generation logic is as follows:

- Supported hosts:
    - Azure Container Apps.
- For databases, the supported mapping between database technology and service used:
    - MongoDB: Azure CosmosDB API for MongoDB
    - PostgreSQL: Azure Database for PostgreSQL flexible server
    - Redis: Azure Container Apps Redis add-on
- Services using databases will have environment variables that provide connection to the database pre-configured by default.
- When both front-end and back-end services are detected, CORS configuration on the Azure host for back-end services will be updated to allow the default hosting domain of front-end services. This can be modified or removed as necessary in the Infrastructure as Code configuration files.

[!INCLUDE [add-dev-container-support](includes/add-dev-container-support.md)]

[!INCLUDE [add-cicd-support](includes/add-cicd-support.md)]

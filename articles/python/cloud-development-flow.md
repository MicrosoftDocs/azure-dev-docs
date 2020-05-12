---
title: The Azure development flow
description: An overview of the cloud development cycle on Azure, which involves provisioning, coding, testing, deployment, and management.
ms.date: 05/12/2020
ms.topic: conceptual
---

# The Azure development flow: provision, code, test, deploy, and manage

[Previous article: provisioning, accessing, and managing resources](cloud-development-provisioning.md)

Now that you understand Azure's model of services and resources, you can understand the overall flow of developing cloud applications with Azure: **provision**, **code**, **test**, **deploy**, and **manage**.

## Step 1: Provision and configure resources

As described in the [previous article of this series](cloud-development-provisioning.md), the first step in developing any application is to provision and configure the resources that make up the target environment for your application.

Provisioning begins by creating a resource group in a suitable Azure region. You can create a resource group through the Azure portal, through the Azure CLI, or with a custom script that uses the Azure SDK (or REST API).

Within that resource group, you then provision and configure the individual resources you need, again using the portal, the CLI, or the Azure SDK. Configuration includes setting access policies that control what identities (service principals and/or application IDs) are able to access those resources.

For most development scenarios, you'll likely create provisioning scripts with the Azure CLI and/or Python code using the Azure SDK. Such scripts describe the totality of your application's resource needs, and enable you to easily recreate those resources within different development, test, and production environments (as opposed to manually performing many repeated steps in the Azure portal). Such scripts aso make it easy to provision an environment in a different region, or to use different resource groups. You can also maintain these scripts in source control repositories so that you have full auditing and change history.

## Step 2: Write your app code to use resources

Once you've provisioned the resources you need for your application, you write the application code to work with those resources (excepting the resources to which you deploy the code itself).

For example, in the provisioning step you might have created an Azure storage account, created a blob container within that account, and set access policies for the application on that container. From your code, now, you can authenticate with that storage account and then create, update, or delete blobs within that container. (This process is demonstrated in [Example - Use Azure Storage](azure-sdk-example-storage.md)) Similarly, you might have provisioned a database with a schema and appropriate permissions, so that your application code can connect to the database and perform the usual create-read-update-delete operations.

As a Python developer, you'll typically be writing your application code in Python using the Azure SDK for Python. That said, any independent part of a cloud application can be written in any supported language. If you're working in a team with a variety of language expertise, for instance, it's entirely possible that some parts of the application are written in Python, some in JavaScript, some in Java, and others in C#.

Note that application code can use the Azure SDK to perform provisioning and management operations as needed. Provisioning scripts, similarly, can use the SDK to initialize resources with specific data, or perform housekeeping tasks on cloud resources even when those scripts are run locally.

## Step 3: Test and debug your app code locally

Developers typically like to test app code on their local workstations before deploying that code to the cloud Testing app code locally means that you're typically accessing other resources that you've already provisioned in the cloud, such as storage, databases, and so forth. The difference is that you're not yet running the app code itself within a cloud service.

By running the code locally, you can also take full advantage of debugging features offered by tools such as Visual Studio Code and manage your code in a source control repository.

You don't need to modify your code at all for local testing: Azure fully supports local development and debugging using the same code you deploy to the cloud. Environment variables are the key: on the cloud, your code can access the hosting resource's settings as environment variables. By creating those same environment variables locally, the same code runs without modification. This pattern works for authentication credentials, resource URLs, connection strings, and any number of other settings, making it easy to use resources in a development environment when running code locally and production resources once the code is deployed to the cloud.

## Step 4: Deploy your app code to Azure

Once you've tested your code locally, you're ready to deploy the code to the Azure resource that you've provisioned to host it. For example, if you're writing a Django web application, you either deploy that code to a virtual machine (where you provide your own web server) or to Azure App Service (which provides the web server for you). Once deployed, that code is running on the server rather than on your local machine, and can access all the Azure resources for which it's authorized.

As noted in the previous section, in typical development processes you first deploy your code to the resources you've provisioned in a development environment. After a round of testing, you deploy your code to resources in a staging environment, making the application available to your test team and perhaps preview customers. Once you're satisfied with the application's performance, you can deploy the code to your production environment. All of these deployments can also be automated through continuous integration and continuous deployment using Azure DevOps.

However you do it, once the code is deployed to the cloud, it truly becomes a cloud application, running entirely on the server computers in Azure's data centers.

## Step 5: Manage, monitor, and revise

After deployment, you want to make sure the application is performing as it should, responding to customer requests and using resources efficiently (and at the lowest cost). You can manage how Azure automatically scales your deployment as needed, and you can collect and monitor performance data through the Azure portal, the Azure CLI, or custom scripts written with the Azure SDK. You can then make real-time adjustments to your provisioned resources to optimize performance, again using any of the same tools.

Monitoring gives you insight about how you might restructure your cloud application. For example, you may find that certain portions of a web app (such as a group of API endpoints) are used only occasionally in comparison to the primary parts. You could then choose to deploy those APIs separately as serverless Azure Functions, where they have their own backing compute resources that don't compete with the main application but cost only pennies per month. Your main application then becomes more responsive to more customers without having to scale up to a higher-cost tier.

## Next steps

You're now familiar with the basic structure of Azure and the overall development flow: provision resources, write and test code, deploy the code to Azure, and then monitor and manage those resources.

The next step is to get your workstation fully configured to work with that flow, after which you're ready to get rolling with the Azure SDK!

> [!div class="nextstepaction"]
> [Configure your local dev environment >>>](configure-local-development-environment.md)

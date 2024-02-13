---
title: Get started with securing java application with Microsoft Identity platform
description: Shows you how to enable your Java web app to restrict access to routes using app roles with the Microsoft identity platform
services: active-directory
documentationcenter: java
ms.date: 01/01/2024
ms.service: active-directory
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: identity
ms.custom: devx-track-java, devx-track-extended-java
adobe-target: true
---

# Deploy your Java Spring Boot web app to Azure Spring Apps

This guidance assumes you have run through any of the Spring Boot Web app examples for enabling security with Microsoft Entra ID. 


## Prerequisites

- An Azure subscription. 
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the Requirements section of Enterprise plan in Azure Marketplace.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.

## Prepare the Spring project

Use the following steps to prepare the project:

1. Use the following [Maven](https://maven.apache.org/what-is-maven.html) command to build the project:

   ```azurecli-interactive
       mvn clean package
   ```

1. Run the sample project locally by using the following command:

   ```azurecli-interactive
       mvn spring-boot:run
   ```

## Prepare the cloud environment

This section describes how to create an Azure Spring Apps service instance and prepare the Azure cloud environment.

### Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### Create an Azure Spring Apps instance

Use the following steps to create a service instance:

1. Select **Create a resource** in the corner of the Azure portal.

1. Select **Compute** > **Azure Spring Apps**.

1. Fill out the **Basics** form with the following information:

   | Setting        | Suggested Value                  | Description                                                                                                                                                                                                                                                                                        |
   |----------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | Subscription   | Your subscription name           | The  Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.                                                                                                                       |
   | Resource group | *myresourcegroup*                | A new resource group name or an existing one from your subscription.                                                                                                                                                                                                                               |
   | Name           | *myasa*                          | A unique name that identifies your Azure Spring Apps service. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number. |
   | Plan           | *Standard*                       | The pricing plan that determines the resource and cost associated with your instance.                                                                                                                                                                                                              |
   | Region         | The region closest to your users | The location that is closest to your users.                                                                                                                                                                                                                                                        |
   | Zone Redundant | Unselected                       | Indicates whether to create your Azure Spring Apps service in an Azure availability zone. This feature isn't currently supported in all regions.                                                                                                                                                   |                                                                                                                                                 |

1. Select **Review and Create** to review your selections. Select **Create** to provision the Azure Spring Apps instance.

1. On the toolbar, select the **Notifications** icon (a bell) to monitor the deployment process. After the deployment is done, you can select **Pin to dashboard**, which creates a tile for this service on your Azure portal dashboard as a shortcut to the service's **Overview** page.


1. Select **Go to resource** to go to the **Azure Spring Apps Overview** page.

 ## Deploy the app to Azure Spring Apps

Use the following steps to deploy using the [Maven plugin for Azure Spring Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Apps):

1. Navigate to the src directory, and then run the following command to configure the app in Azure Spring Apps:

   ```bash
       mvn com.microsoft.azure:azure-spring-apps-maven-plugin:1.19.0:config
   ```

   The following list describes the command interactions:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.
   - **Select subscription**: Select the subscription list number of the Azure Spring Apps instance you created, which defaults to the first subscription in the list. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Use existing Azure Spring Apps in Azure**: Press <kbd>y</kbd> to use the existing Azure Spring Apps instance.
   - **Select Azure Spring Apps for deployment**: Select the list number of the Azure Spring Apps instance you created. If you use the default number, press <kbd>Enter</kbd> directly.
   - **Use existing app in Azure Spring Apps \<your-instance-name\>**: Press <kbd>n</kbd> to create a new app.
   - **Input the app name (demo)**: Provide an app name. If you use the default project artifact ID, press <kbd>Enter</kbd> directly.
   - **Expose public access for this app (boot-for-azure)**: Press <kbd>y</kbd>.
   - **Confirm to save all the above configurations**: Press <kbd>y</kbd>. If you press <kbd>n</kbd>, the configuration isn't saved in the POM files.

2. Use the following command to deploy the app:

   ```bash
       mvn azure-spring-apps:deploy
   ```

   The following list describes the command interaction:

   - **OAuth2 login**: You need to authorize the sign in to Azure based on the OAuth2 protocol.

   After the command is executed, you can see from the following log messages that the deployment was successful:

   ```output
   [INFO] Deployment(default) is successfully created
   [INFO] Starting Spring App after deploying artifacts...
   [INFO] Deployment Status: Running
   [INFO]   InstanceName:demo-default-x-xxxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:UNREGISTERED
   [INFO]   InstanceName:demo-default-x-xxxxxxxxx-xxxxx  Status:Terminating Reason:null       DiscoverStatus:UNREGISTERED
   [INFO] Getting public url of app(demo)...
   [INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io

## Validate the app

After the deployment finishes, access the application with the output application URL. Use the following steps to check the app's logs to investigate any deployment issue:

1. Access the output application URL from the **Outputs** page of the **Deployment**.
1. From the navigation pane of the Azure Spring Apps instance **Overview** page, select **Logs** to check the app's logs.

## Next Steps

For more information and other deployment options, see the follwoing articles:

- [Quickstart: Deploy your first application to Azure Spring Apps](https://learn.microsoft.com/en-us/azure/spring-apps/enterprise/quickstart?tabs=Azure-portal%2CAzure-portal-maven-plugin-ent%2CConsumption-workload&pivots=sc-enterprise)
- [Spring Boot to Azure Spring Apps](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-apps)
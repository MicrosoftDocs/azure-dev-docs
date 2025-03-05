---
author: KarlErickson
ms.author: karler
ms.date: 05/27/2021
---

## Recommendations

* If you opted to use the **/home**  directory for file storage, consider replacing it with Azure Storage. For more information, see [Access Azure Storage as a network share from a container in App Service](/azure/app-service/configure-connect-to-azure-storage).

* If you have configuration in the **/home**  directory that contains connection strings, SSL keys, and other secret information, consider using Azure Key Vault and/or parameter injection with application settings where possible. For more information, see [Use Key Vault references for App Service and Azure Functions](/azure/app-service/app-service-key-vault-references) and [Configure an App Service app in the Azure portal](/azure/app-service/configure-common).

* Consider using deployment slots for reliable deployments with zero downtime. For more information, see [Set up staging environments in Azure App Service](/azure/app-service/deploy-staging-slots).

* Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider automating deployments and testing with Azure Pipelines. For more information, see [Build and deploy to a Java web app](/azure/devops/pipelines/ecosystems/java-webapp). When you use deployment slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?tabs=yaml#deploy-to-a-slot) followed by the slot swap. For more information, see the [Deploy to a slot](/azure/devops/pipelines/targets/webapp#deploy-to-a-slot) section of [Deploy an Azure Web App (Linux)](/azure/devops/pipelines/targets/webapp).

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a multi-region deployment architecture. For more information, see [Highly available multi-region web application](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

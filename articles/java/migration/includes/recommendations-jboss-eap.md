---
author: KarlErickson
ms.author: karler
ms.date: 09/20/2024
---

### Recommendations

* If you opted to use the */home* directory for file storage, consider replacing it with Azure Storage. For more information, see [Mount Azure Storage as a local share in a custom container in App Service](/azure/app-service/containers/how-to-serve-content-from-azure-storage).

* If you have configuration in the */home* directory that contains connection strings, SSL keys, and other secret information, consider using a combination of Azure Key Vault and parameter injection with application settings where possible. For more information, see [Use Key Vault references for App Service and Azure Functions](/azure/app-service/app-service-key-vault-references) and [Configure an App Service app](/azure/app-service/configure-common).

* Consider using deployment slots for reliable deployments with zero downtime. For more information, see [Set up staging environments in Azure App Service](/azure/app-service/deploy-staging-slots).

* Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider automating deployments and testing with Azure Pipelines. For more information, see [Build & deploy to Java web app](/azure/devops/pipelines/ecosystems/java-webapp). If you're using deployment slots, you can automate deployment to a slot and the subsequent slot swap. For more information, see the [Example: Deploy to a slot](/azure/devops/pipelines/targets/webapp#example-deploy-to-a-slot) section of [Deploy to App Service using Azure Pipelines](/azure/devops/pipelines/targets/webapp).

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a multi-region deployment architecture. For more information, see [Highly available multi-region web application](/azure/architecture/reference-architectures/app-service-web-app/multi-region).

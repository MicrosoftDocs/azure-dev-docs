---
author: VaijanathB
ms.author: vaangadi
ms.date: 3/20/2021
---

## Recommendations

* If you opted to use the */home* directory for file storage, consider [replacing it with Azure Storage](/azure/app-service/configure-connect-to-azure-storage).

* If you have configuration in the */home* directory that contains connection strings, SSL keys, and other secret information, consider using [Azure Key Vault](/azure/app-service/app-service-key-vault-references) and/or [parameter injection with application settings](/azure/app-service/configure-common#configure-app-settings) where possible.

* Consider [using Deployment Slots](/azure/app-service/deploy-staging-slots) for reliable deployments with zero downtime.

* Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/java-webapp). When you use Deployment Slots, you can [automate deployment to a slot](/azure/devops/pipelines/targets/webapp?tabs=yaml#deploy-to-a-slot) followed by the slot swap.

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/architecture/reference-architectures/app-service-web-app/multi-region).
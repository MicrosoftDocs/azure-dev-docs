---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/12/2022
---

Add a "AcrPull" role for the managed identity.

* Starting in the **Identity** resource where you just enabled managed identity, sellect **Azure role assignment**.
* In "Azure role assignments", select **+ Add roll assignment**.
  * **Scope** &rarr; "Resource group"
  * **Subscription** &rarr; Your subscription.
  * **Resource group** &rarr; The group with the Azure Container Registry and App Service.
  * **Role** &rarr; "AcrPull"
* Select **Save**.

The AcrPull allows the App Service to pull images form the Azure Container Registry. 
 
---
author: KarlErickson
ms.author: jiangma
ms.date: 09/26/2024
---

This article doesn't direct you to deploy your app on Azure. There are no Azuer resources to clean up for the app, though there **are** Microsoft Entra ID resources. To deploy an app on Azure, you can follow the guidance referenced in the next section.

When you finish with the resources for this sample app, use the following steps to clean up the Microsoft Entra ID resources. Removing unused Microsoft Entra ID resources is an important security best practice.

1. Remove the app registration you created by following the steps in [Remove an application registered with the Microsoft identity platform](/entra/identity-platform/howto-remove-app). You only need to follow the steps in the section **Remove an application authored by your organization**.
1. The act of removing the app registration should also delete the enterprise application. For more information about deleting enterprise applications, see [Delete an enterprise application](/entra/identity/enterprise-apps/delete-application-portal).
1. Delete the users you created by following the steps in [How to create, invite, and delete users](/entra/fundamentals/how-to-create-delete-users).

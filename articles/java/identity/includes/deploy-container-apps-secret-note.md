---
author: KarlErickson
ms.author: bappadityams
ms.date: 09/11/2024
---

> [!IMPORTANT]
> The *application.yml* file of the application currently holds the value of your client secret in the `client-secret` parameter. It isn't good practice to keep this value in this file. You might also be taking a risk if you commit it to a Git repository.
>
> As an extra security step, [Manage secrets](../../container-apps/manage-secrets?tabs=azure-portal) in Azure Container Apps to make it available in your application.

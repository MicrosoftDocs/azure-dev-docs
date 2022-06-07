---
ms.topic: include
ms.date: 06/03/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

In Visual Studio:

1. Right-click on the `TodoApp` solution, then select **Manage NuGet Packages...**.
2. Select the **Browse** tab, then enter **Microsoft.Datasync.Client** in the search box.

    ![Screenshot of adding the offline NuGet in Visual Studio.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/select-offline-nuget.png)

3. Select the `Microsoft.Datasync.Client.SQLiteStore` package.
4. Select **Add Package**.
5. In the **Select Projects** window, select all the client projects (except the `TodoAppService.NET6` project).
6. Select **Ok**.
7. Accept the license agreement when prompted.

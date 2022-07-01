---
ms.topic: include
ms.date: 05/06/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

In Visual Studio:

1. Right-click on the `TodoApp` solution, then select **Manage NuGet Packages for Solution...**.
2. In the new tab, select **Browse**, then enter **Microsoft.Datasync.Client** in the search box.

    ![Screenshot of adding the offline NuGet in Visual Studio.](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/select-offline-nuget.png)

3. Select the `Microsoft.Datasync.Client.SQLiteStore` package.
4. In the right-hand pane, select all the client projects (except the `TodoAppService.NET6` project).
5. Select **Install**.
6. Accept the license agreement when prompted.

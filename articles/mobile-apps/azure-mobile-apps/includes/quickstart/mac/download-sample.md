---
ms.topic: include
ms.date: 06/03/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

1. Open the [azure-mobile-apps repository] in your browser.
2. Open the **Code** drop-down, then select **Download ZIP**.

    ![Screenshot of the Code menu on GitHub.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/download-sample-zip.png)

3. Once the download is complete, open your *Downloads* folder.
4. The package will already be unpacked in the `azure-mobile-apps-main` folder.  You can move this folder to a more appropriate location if you like.

The samples are located in the *samples* folder within the extracted files.  The sample for the quick start is named `TodoApp`.  You can open the sample in Visual Studio 2022 for Mac by double-clicking the `TodoApp.sln` file.

  ![Screenshot of the file explorer for the solution.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/deploy-sample-sln.png)

When you open the sample for the first time, notice that certain projects aren't available.  For example, Windows-specific projects (such as WPF and UWP) can't be compiled with Visual Studio 2022 for Mac.

You can unload any project you aren't working with.  Expand the `windows` folder in the solution explorer.

  ![Screenshot of the solution explorer with disabled projects.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/vsmac-disabled-projects.png)

For each disabled project, right-click on the project, then select **Unload project**.

<!-- Links -->
[azure-mobile-apps repository]: https://github.com/azure/azure-mobile-apps/
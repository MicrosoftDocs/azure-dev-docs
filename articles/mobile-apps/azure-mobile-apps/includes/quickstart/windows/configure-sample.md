---
ms.topic: include
ms.date: 05/06/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

Your client application needs to know the base URL of your backend so that it can communicate with it.

1. Expand the `TodoApp.Data` project.
1. Right-click on the `TodoApp.Data` project, then select **Add** > **Class...**.
1. Enter `Constants.cs` as the name, then select **Add**.

    ![Add Constants.cs](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/configure-sample-constants.png)

1. Open the `Constants.cs.example` file and copy the contents (Ctrl-A, followed by Ctrl-C).
1. Switch to `Constants.cs`, highlight all text (Ctrl-A), then paste the contents from the example file (Ctrl-V).
1. Replace the `https://APPSERVICENAME.azurewebsites.net` with the backend URL of your service.

    ``` csharp
    namespace TodoApp.Data
    {
        public static class Constants
        {
            /// <summary>
            /// The base URI for the Datasync service.
            /// </summary>
            public static string ServiceUri = "https://demo-datasync-quickstart.azurewebsites.net";
        }
    }
    ```

    You can obtain the backend URL of your service from the **Publish** tab.

1. Save the file. (Ctrl-S).

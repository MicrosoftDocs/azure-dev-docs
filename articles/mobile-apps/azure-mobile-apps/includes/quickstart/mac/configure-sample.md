---
ms.topic: include
ms.date: 09/07/2023
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

Your client application needs to know the base URL of your backend so that it can communicate with it.

> If you used `azd up` to provision and deploy the service, the `Constants.cs` file was created for you and you can skip this step.

1. Expand the `TodoApp.Data` project.
2. Right-click on the `TodoApp.Data` project, then select **Add** > **New Class...**.
3. Select **Empty Class**, enter `Constants.cs` as the name, then select **Create**.

    ![Screenshot of adding the Constants.cs file to the project.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/configure-sample-constants.png)

4. Open the `Constants.cs.example` file and copy the contents (&#8984;-A, followed by &#8984;-C).
5. Switch to `Constants.cs`, highlight all text (&#8984;-A), then paste the contents from the example file (&#8984;-V).
6. Replace the `https://APPSERVICENAME.azurewebsites.net` with the backend URL of your service.

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

7. Save the file. (&#8984;-S).

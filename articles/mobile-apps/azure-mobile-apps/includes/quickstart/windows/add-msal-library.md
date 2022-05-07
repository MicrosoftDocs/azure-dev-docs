---
ms.topic: include
ms.date: 05/06/2022
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

Add the [Microsoft Identity Library (MSAL)](/azure/active-directory/develop/msal-overview) to the platform project:

1. Right-click on the project, then select **Manage NuGet Packages...**.
1. Select the **Browse** tab.
1. Enter `Microsoft.Identity.Client` in the search box, then press Enter.
1. Select the `Microsoft.Identity.Client` result, then click **Install**.
   
   ![Select MSAL NuGet](~/mobile-apps/azure-mobile-apps/media/quickstart/windows/select-msal-nuget.png)

1. Accept the license agreement to continue the installation.

Add the native client ID and backend scope to the configuration:

1. Open the `TodoApp.Data` project and edit the `Constants.cs` file.
1. Add constants for `ApplicationId` and `TenantId`:

  ``` csharp
    public static class Constants
    {
        /// <summary>
        /// The base URI for the Datasync service.
        /// </summary>
        public static string ServiceUri = "https://demo-datasync-quickstart.azurewebsites.net";

        /// <summary>
        /// The application (client) ID for the native app within Azure Active Directory
        /// </summary>
        public static string ApplicationId = "<client-id>";

        /// <summary>
        /// The list of scopes to request
        /// </summary>
        public static string[] Scopes = new[]
        {
            "<scope>"
        };
    }
  ```

Replace the `<client-id>` with the value you received when registering the client application in Azure Active Directory, and the `<scope>` with the scope you copied when you used **Expose an API** while registering the service application.

---
ms.topic: include
ms.date: 09/07/2023
author: adrianhall
ms.author: adhal
ms.prod: azure-mobile-apps
---

1. Right-click on the platform project, then select **Manage NuGet Packages...**.
2. Select the **Browse** tab.
3. Enter `Microsoft.Identity.Client` in the search box, then press Enter.
4. Select the `Microsoft.Identity.Client` result, then click **Install**.

   ![Screenshot of selecting the MSAL NuGet in Visual Studio.](~/mobile-apps/azure-mobile-apps/media/quickstart/mac/select-authentication-nuget.png)

5. Accept the license agreement to continue the installation.

Add the native client ID and backend scope to the configuration. 

Open the `TodoApp.Data` project and edit the `Constants.cs` file. Add constants for `ApplicationId` and `Scopes`:

``` csharp
  public static class Constants
  {
      /// <summary>
      /// The base URI for the Datasync service.
      /// </summary>
      public static string ServiceUri = "https://demo-datasync-quickstart.azurewebsites.net";

      /// <summary>
      /// The application (client) ID for the native app within Microsoft Entra ID
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

Replace the `<client-id>` with the value you received when registering the client application in Microsoft Entra ID and the `<scope>` with the scope you copied when you used **Expose an API** while registering the service application.

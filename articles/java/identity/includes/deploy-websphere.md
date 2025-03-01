---
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
---

## Run the sample

These instructions assume that you installed WebSphere and set up a server. You can use the guidance at [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](../../ee/traditional-websphere-application-server-virtual-machines.md) for a basic server setup.

Before you can deploy to WebSphere, use the following steps to make some configuration changes in the sample itself and then build or rebuild the package:

1. Navigate to your app's **authentication.properties** file and change the value of `app.homePage` to your server URL and port number you're planning to use, as shown in the following example:

   ```ini
   # app.homePage is by default set to dev server address and app context path on the server
   # for apps deployed to azure, use https://your-sub-domain.azurewebsites.net
   app.homePage=https://<server-url>:<port-number>/msal4j-servlet-auth/
   ```

1. After saving this file, use the following command to rebuild your app:

   ```bash
   mvn clean package
   ```

1. After the code finishes building, copy the **.war** file over to your target server's file system.

You also need to make the same change in the Azure app registration, where you set it in the Azure portal as the **Redirect URI** value on the **Authentication** tab.

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.

1. Use the search box to search for your app registration - for example, `java-servlet-webapp-authentication`.

1. Open your app registration by selecting its name.

1. Select **Authentication** from the menu.

1. In the **Web** - **Redirect URIs** section, select **Add URI**.

1. Fill out the URI of your app, appending **/auth/redirect** - for example, `https://<server-url>:<port-number>/auth/redirect`.

1. Select **Save**.

Use the following steps to deploy the sample using the WebSphere's Integrated Solutions Console:

1. On the **Applications** tab, select **New Application**, then **New Enterprise Application**.

1. Choose the **.war** file you built, then select **Next** until you get to the **Map context roots for Web modules** installation step. The other default settings should be fine.

1. For the context root, set it to the same value as after the port number in the 'Redirect URI' you set in sample configuration/Azure app registration. That is, if the redirect URI is `http://<server-url>:9080/msal4j-servlet-auth/`, then the context root should be `msal4j-servlet-auth`.

1. Select **Finish**.

1. After the application finishes installing, go to the **WebSphere enterprise applications** section of the **Applications** tab.

1. Select the **.war** file you installed from the list of applications and then select **Start** to deploy.

1. After it finishes deploying, navigate to `http://<server-url>:9080/{whatever you set as the context root}` and you should be able to see the application.

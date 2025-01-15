---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

You're now ready to deploy your app to Azure App Service. Use the following command to make sure you're signed in to your Azure environment to execute the deployment:

```azurecli
az login
```

With all the configuration ready in your **pom.xml** file, you can now use the following command to deploy your Java app to Azure:

```bash
mvn package azure-webapp:deploy
```

After deployment is completed, your application is ready at `http://<your-app-name>.azurewebsites.net/`. Open the URL with your local web browser, where you should see the start page of the `msal4j-servlet-auth` application.

---
ms.author: givermei
ms.date: 01/01/2024
ms.custom: devx-track-java
---

You're now ready to deploy your Web App to Azure App Service. Make sure you're logged into your Azure environment to execute the deployment.

```azurecli
az login
```

With all the configuration ready in your *pom.xml* file, you can now deploy your Java app to Azure with one single command.

```bash
mvn package azure-webapp:deploy
```

After deployment is completed, your application is ready at `http://<your-app-name>.azurewebsites.net/`. Open the URL with your local web browser, you should see the start page of the `msal4j-servlet-auth` application.

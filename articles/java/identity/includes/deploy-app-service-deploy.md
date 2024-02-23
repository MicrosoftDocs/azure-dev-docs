---
ms.author: givermei
ms.date: 01/01/2024
ms.custom: devx-track-java
---

You are now ready to deploy your Web App to Azure App Service. Make sure you are logged into your Azure environment to execute the deployment.

```azurecli
az login
```

With all the configuration ready in your *pom.xml* file, you can now deploy your Java app to Azure with one single command.

```bash
mvn package azure-webapp:deploy
```

Once deployment is completed, your application is ready at `http://<your-app-name>.azurewebsites.net/`. Open the url with your local web browser, you should see the start page of the `msal4j-servlet-auth` application.

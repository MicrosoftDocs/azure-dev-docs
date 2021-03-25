---
author: VaijanathB
ms.author: vaangadi
ms.date: 3/20/2021
---

### Build the Application 

Build the application using the following Maven command.
```bash
mvn clean install -DskipTests
```

### Deploy the Application

If your application is built from a Maven POM file, use the Webapp plugin for Maven to create the Web App and deploy your application. For more information, see [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux).

To automate the deployment of JBoss EAP applications you can use [Azure Pipelines task for Web App](/azure/devops/pipelines/tasks/deploy/azure-rm-web-app?view=azure-devops) or [Github Action for Azure WebApp](https://github.com/marketplace/actions/azure-webapp).

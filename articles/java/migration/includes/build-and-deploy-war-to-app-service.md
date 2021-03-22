---
author: vaangadi
ms.author: vaangadi
ms.date: 3/20/2021
---

### Build the Application 

Build the application using the following Maven command.
```bash
mvn clean install -DskipTests
```

### Deploy the Application

To deploy .war files to JBoss, use the /api/wardeploy/ endpoint to POST your archive file. For more information on this API, please see [this documentation](azure/app-service/deploy-zip#deploy-war-file).

To deploy .ear files, [use FTP](/azure/app-service/deploy-ftp?tabs=portal).

Do not deploy your .war or .jar using FTP. The FTP tool is designed to upload startup scripts, dependencies, or other runtime files. It is not the optimal choice for deploying web apps.

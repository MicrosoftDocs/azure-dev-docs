---
author: KarlErickson
ms.author: givermei
ms.date: 03/11/2024
---

Use the following command to deploy the app:

```bash
mvn azure-spring-apps:deploy
```

The following list describes the command interaction:

- **OAuth2 login**: You need to authorize the sign-in to Azure based on the OAuth2 protocol.

After the command is executed, you can see from the following log messages that the deployment was successful:

```output
[INFO] Deployment(default) is successfully created
[INFO] Starting Spring App after deploying artifacts...
[INFO] Deployment Status: Running
[INFO]   InstanceName:demo-default-x-xxxxxxxxxx-xxxxx  Status:Running Reason:null       DiscoverStatus:UNREGISTERED
[INFO]   InstanceName:demo-default-x-xxxxxxxxx-xxxxx  Status:Terminating Reason:null       DiscoverStatus:UNREGISTERED
[INFO] Getting public url of app(demo)...
[INFO] Application url: https://<your-Azure-Spring-Apps-instance-name>-demo.azuremicroservices.io
```

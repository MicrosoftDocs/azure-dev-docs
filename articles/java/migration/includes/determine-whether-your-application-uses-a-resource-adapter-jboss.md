---
author: VaijanathB
ms.author: vaangadi
ms.date: 05/27/2021
---

### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with JBoss EAP. Determine whether the RA works fine on a standalone instance of JBoss EAP by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the App Service and put the necessary configuration files in the correct location in the JBoss EAP server directories for it to be available.

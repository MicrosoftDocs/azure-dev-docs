---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Validate that the supported Java version works correctly

All of the migration paths for WebLogic to Azure require a specific Java version, which varies for each path. You'll need to validate that your application is able to run correctly using that supported version.

To obtain your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

> [!NOTE]
> When migrating to WebLogic on Azure virtual machines, the requirements for the specific Java versions are determined by the pre-installed Java on the virtual machines.

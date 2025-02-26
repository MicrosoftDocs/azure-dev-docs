---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 1/21/2020
---

### Validate that the supported Java version works correctly

All of the migration paths for WebLogic to Azure require a specific Java version, which varies for each path. You'll need to validate that your application is able to run correctly using that supported version.

[!INCLUDE [note-obtain-your-current-java-version](note-obtain-your-current-java-version.md)]

> [!NOTE]
> When migrating to WLS on Azure virtual machines, the requirements for the specific Java versions are determined by the pre-installed Java on the virtual machines. When migrating to WLS on AKS, the specific Java version is determined by the container image chosen. There are a wide variety of choices, but all of them use the Oracle JDK.

---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 05/31/2023
---

### Determine whether the Liberty version is compatible

You need the [Open Liberty Operator](https://openliberty.io/docs/latest/open-liberty-operator.html) or the [WebSphere Liberty operator](https://www.ibm.com/docs/en/was-liberty/core?topic=operator-getting-started-websphere-liberty) to deploy and manage applications on Kubernetes-based clusters. Make sure your existing Liberty version is one of the versions supported by the operator. Versions of Open Liberty are maintained in GitHub [OpenLiberty/open-liberty](https://github.com/OpenLiberty/open-liberty/releases). IBM maintains versions of IBM WebSphere Application Server Liberty. For more information, see [WebSphere Application Server Liberty](https://www.ibm.com/docs/was-liberty/base?topic=liberty-overview).

The prebuilt Azure Marketplace offer allows you to select your application images from public registry, and thus implicitly supports all of the versions.

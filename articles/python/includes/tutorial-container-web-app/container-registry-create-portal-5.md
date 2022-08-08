---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 08/07/2022
---

The admin account is required to deploy a container image from a registry to Azure Web Apps for Containers. Enable the admin user:

* Got to the **Access Keys** resource of the registry.
* Select **Enabled** for the **Admin User**.

The registry [admin account](/azure/container-registry/container-registry-authentication#admin-account) is needed when you use the Azure portal to deploy a container image as is shown in this tutorial. The admin account is only used during the creation of the App Service. After the App Service is created, managed identity is used to pull images from the registry and the admin account can be disabled.

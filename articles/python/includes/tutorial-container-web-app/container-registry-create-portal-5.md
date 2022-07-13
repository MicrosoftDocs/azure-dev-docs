---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 07/07/2022
---

The admin account is required to deploy a container image from a registry to Azure Web Apps for Containers. Enable the admin user:

* Got to the **Access Keys** resource of the registry.
* Select **Enabled** for the **Admin User**.

The admin account is only used during the creation of the App Service. After the App Service is created, managed identity is used to pull images from the registry and the admin account can be disabled.

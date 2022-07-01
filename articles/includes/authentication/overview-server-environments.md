---
author: diberry
ms.service: azure
ms.topic: include
ms.date: 06/13/2019
ms.author: diberry
---
When hosting in a server environment, each application should be assigned a unique *application identity* per environment. In Azure, an app identity is represented by a **service principal**, a special type of *security principal* intended to identify and authenticate apps to Azure. The type of service principal to use for your app depends on where your app is running.
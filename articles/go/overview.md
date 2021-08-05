---
title: What is the Azure SDK for Go?
description: Learn how the Azure SDK for Go can help you create and manage Azure resources.
ms.date: 08/04/2021
ms.topic: overview
ms.custom: devx-track-go
---
# What is the Azure SDK for Go?

## Key details

- The Azure SDK for Go provides two libraries (*management* and *client*) that allow your Go code to communicates with Azure services. Your Go code can run either locally or in the cloud.
- The management and client libraries support the two most recent major Go releases. For a list of all Go releases and to see how to update to a , see [Go Release History](https://golang.org/doc/devel/release.html).
- You will sometimes see the management library referred to as the "management plane" and the client library referred to as the "data plane".
- The key difference between the management plane and the data plane is the following:
    - You use the management plane (management library) to manage resources in your Azure subscription. This includes creating Azure resources such as resource groups, virtual machines, and so on.
    - You use the data plane (client library) to use capabilities exposed by an instance of a resource type. For example, once created, you interact with a given resources - such as a resource groups or virtual machines - via the data plane.
    - As an example, you use the management plan to create a storage account and the data plane to read and write data in that storage account.

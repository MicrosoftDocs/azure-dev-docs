---
title: Key Azure Services for Go developers
description: Azure has over 100 services, but these are the 8 services most frequently used by Go developers.
ms.date: 7/29/2024
ms.topic: article
ms.custom: devx-track-go
---

# Key Azure services for Go developers

While Azure offers over 100 services, Go developers use the following Azure services the most frequently.

| Icon | Service | Description |
|:----:|:--------|:------------|
| ![Azure Storage Blobs Icon](./media/service-icons/blob-block-general.svg) | **Azure Blob Storage**   | [Azure Blob Storage](/azure/storage/blobs/) allows your applications to store and retrieve files in the cloud.  Azure Storage is highly scalable to store massive amounts of data and data is stored redundantly to ensure high availability. |
| ![Azure Functions Icon](./media/service-icons/function-app.svg) | **Azure Functions** | [Azure Functions](/azure/azure-functions/) is a serverless compute service that lets you write small, discrete segments of code that can be executed in a scalable and cost-effective manner, all without managing any servers or runtimes.  Functions can be invoked by a variety of different events and easily integrate with other Azure services through the use of input and output bindings.        |
| ![Azure Container Registry](./media/service-icons/container-registries.svg) | **Azure Container Registry** | [Azure Container Registry](/azure/container-registry/) is a managed, private Docker registry service based on the open-source Docker Registry 2.0. Create and maintain Azure container registries to store and manage your private Docker container images and related artifacts. |
| ![Azure Container Instance](./media/service-icons/containers-instances.svg) | **Azure Container Instance** | [Azure Container Instances](/azure/container-instances/) offers the fastest and simplest way to run a container in Azure, without having to manage any virtual machines and without having to adopt a higher-level service. |
| ![Azure Kubernetes Service](./media/service-icons/azure-kubernetes-service.svg) | **Azure Kubernetes Service** | [Azure Kubernetes Service](/azure/aks/) (AKS) simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. As a hosted Kubernetes service, Azure handles critical tasks, like health monitoring and maintenance. Since Kubernetes masters are managed by Azure, you only manage and maintain the agent nodes. |
| ![Azure Virtual Machines](./media/service-icons/virtual-machine.svg) | **Azure Virtual Machines**   | [Azure virtual machines](/azure/virtual-machines/) (VMs) enable you to create dedicated compute resources in minutes that can be used just like a physical desktop or server machine. |
| ![Azure Key Vault Icon](./media/service-icons/key-vaults.svg) | **Azure Key Vault**   | [Azure Key Vault](/azure/key-vault/general/) helps you store and access secrets securely, in an encrypted vault with restricted access to make sure your secrets and your application are not compromised.   |
| ![Azure AI services Icon](./media/service-icons/azure-openai.svg) | **Azure AI services**   | [Azure AI services](/azure/ai-services/) are a collection of cloud-based services that allow you to add AI based capabilities to your application.  Examples include computer vision, speech recognition, language understanding, and anomaly detection. |

For the full list of Azure products and services, visit the [Azure documentation home page](/azure/?product=all).

### Next steps

> [!div class="nextstepaction"]
> [Authenticate with the Azure SDK for Go](azure-sdk-authentication.md)

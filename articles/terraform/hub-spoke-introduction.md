---
title: Create a hub and spoke hybrid network topology in Azure using Terraform
description: Learn how to create an entire hybrid network reference architecture in Azure using Terraform.
ms.topic: how-to
service: virtual-network
ms.service: azure-virtual-network
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Create a hub and spoke hybrid network topology in Azure using Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This articles series shows how to use Terraform to implement in Azure a [hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke). 

A hub and spoke topology is a way to isolate workloads while sharing common services. These services include identity and security. The hub is a virtual network (VNet) that acts as a central connection point to an on-premises network. The spokes are VNets that peer with the hub. Shared services are deployed in the hub, while individual workloads are deployed inside spoke networks.

In this article, you learn how to:

> [!div class="checklist"]
> * Lay out hub and spoke hybrid network reference architecture resources
> * Create hub network appliance resources
> * Create hub network in Azure to act as common point for all resources
> * Create individual workloads as spoke VNets in Azure
> * Establish gateways and connections between on premises and Azure networks
> * Create VNet peerings to spoke networks

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Understand hub and spoke topology architecture

In the hub and spoke topology, the hub is a VNet. The VNet acts as a central point of connectivity to your on-premises network. The spokes are VNets that peer with the hub, and can be used to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN gateway connection. The following image demonstrates the components in a hub and spoke topology:

![Hub and spoke topology architecture in Azure](./media/hub-and-spoke-series/hub-spoke-architecture.png)

### Benefits of the hub and spoke topology

A hub and spoke network topology is a way to isolate workloads while sharing common services. These services include identity and security. The hub is a VNet that acts as a central connection point to an on-premises network. The spokes are VNets that peer with the hub. Shared services are deployed in the hub, while individual workloads are deployed inside spoke networks. Here are some benefits of the hub and spoke network topology:

- **Cost savings** by centralizing services in a single location that can be shared by multiple workloads. These workloads include network virtual appliances and DNS servers.
- **Overcome subscriptions limits** by peering VNets from different subscriptions to the central hub.
- **Separation of concerns** between central IT (SecOps, InfraOps) and workloads (DevOps).

### Typical uses for the hub and spoke architecture

Some of the typical uses for a hub and spoke architecture include:

- Many customers have workloads that are deployed in different environments. These environments include development, testing, and production. Many times, these workloads need to share services such as DNS, IDS, NTP, or AD DS. These shared services can be placed in the hub VNet. That way, each environment is deployed to a spoke to maintain isolation.
- Workloads that don't require connectivity to each other, but require access to shared services.
- Enterprises that require central control over security aspects.
- Enterprises that require segregated management for the workloads in each spoke.

## 3. Preview the demo components

As you work through each article in this series, various components are defined in distinct Terraform scripts. The demo architecture created and deployed consists of the following components:

- **On-premises network**. A private local-area network running with an organization. For hub and spoke reference architecture, a VNet in Azure is used to simulate an on-premises network.

- **VPN device**. A VPN device or service provides external connectivity to the on-premises network. The VPN device may be a hardware appliance or a software solution. 

- **Hub VNet**. The hub is the central point of connectivity to your on-premises network and a place to host services. These services can be consumed by the different workloads hosted in the spoke VNets.

- **Gateway subnet**. The VNet gateways are held in the same subnet.

- **Spoke VNets**. Spokes can be used to isolate workloads in their own VNets, managed separately from other spokes. Each workload might include multiple tiers, with multiple subnets connected through Azure load balancers. 

- **VNet peering**. Two VNets can be connected using a peering connection. Peering connections are non-transitive, low latency connections between VNets. Once peered, the VNets exchange traffic by using the Azure backbone, without needing a router. In a hub and spoke network topology, VNet peering is used to connect the hub to each spoke. You can peer VNets in the same region, or different regions.

## 4. Implement the Terraform code

1. Create a directory to contain the example code for the entire multi-article series.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/301-hub-spoke/main.tf)]

1. Create a file named `variables.tf` to contain the project variables and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/301-hub-spoke/variables.tf)]

    **Key points:**

    - This article uses a password you enter when you call `terraform plan`. In a real-world app, you might consider using a SSH public/private key pair.
    - For more information about SSH keys and Azure, see [How to use SSH keys with Windows on Azure](/azure/virtual-machines/linux/ssh-from-windows).

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Create on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md)

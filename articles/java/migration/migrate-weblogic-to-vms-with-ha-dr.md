---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebLogic Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: how-to
ms.date: 11/30/2023
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java,, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you how to deploy the Oracle WebLogic Server (WLS) on Azure Virtual Machines (VMs) that integrates with Azure SQL Database and Azure Traffic Manager for high availability and disaster recovery.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/wls-on-vms-solution-architecture.png" alt-text="Solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/wls-on-vms-solution-architecture.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Setup an Azure SQL Database failover group in paried regions, which allows you to manage the replication and failover of databases to another Azure region.
> - Setup active and passive WLS clusters on Azure VMs, where your application workload will be deployed and running.
> - Setup an Azure Traffic Manager, which allows you to distribute traffic to your public facing applications across the global Azure regions.
> - Configure active and passive WLS clusters for high availability and disaster recovery.
> - Validate the solution.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you've been assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with either Windows, Linux or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
* Install [Maven](https://maven.apache.org/download.cgi) 3.9.3 or higher.

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

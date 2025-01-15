---
author: KarlErickson
ms.author: haiche
ms.date: 11/30/2022
---

A WebLogic Server domain is a logically related group of WebLogic Server instances, and the resources running on and connected to them, that can be managed as a single administrative unit. For more information, see [WebLogic Server Domains](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/intro/domains.html#GUID-EE8E9DA0-2D95-4EF1-ADA2-4C76CB1AB3A4).

The foundation of high availability in WebLogic Server is the cluster. A WebLogic Server cluster is a group of WebLogic Server instances running simultaneously and working together to provide increased scalability and reliability. For more information, see [Oracle WebLogic Cluster](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/intro/clustering.html#GUID-E39A18C2-B990-485F-BFB1-0549250FABFE).

There are two kinds of cluster, as described in the following list. For more information, see [About Dynamic Clusters](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/intro/clustering.html#GUID-2C32CF86-D1F8-464D-AF62-E27C9DDF4459).

- Dynamic cluster: A cluster that contains one or more generated (dynamic) server instances that are based on a single shared server template. When you create a dynamic cluster, the dynamic servers are preconfigured and automatically generated for you, enabling you to easily scale up the number of server instances in your dynamic cluster when you need another server capacity. You can start the dynamic servers without having to first manually configure and add them to the cluster.
- Configured cluster: A cluster in which you manually configure and add each server instance. You have to configure and add new server instance to increase server capacity.

To show you how to form a WebLogic cluster, this tutorial guides you through the process of creating a configured cluster.

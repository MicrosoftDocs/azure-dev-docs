---
title: "Tutorial: Migrate Oracle WebLogic Server to AKS with KEDA scaler based on Prometheus Metrics"
description: Shows how to deploy WebLogic Server to AKS and enable autoscaling with KEDA scaler based on Prometheus Metrics.
author: KarlErickson
ms.author: haiche
ms.topic: tutorial
ms.date: 03/11/2024
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, migration-java
---

# Tutorial: Migrate Oracle WebLogic Server to AKS with KEDA scaler based on Prometheus Metrics

This tutorial shows you how to migrate Oracle WebLogic Server and configure automatic horizontal scaling based on Prometheus Metrics.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - What WebLogic application metrics can be exported using WebLogic Monitoring Exporter?
> - Deploy and run WebLogic applciation on AKS using Azure marketplace offer.
> - Enable Prometheus Metrics.
> - Enable Kubernetes Event-driven Autoscaling (KEDA).
> - Create KEDA scaler that is based on Prometheus Metrics.
> - Validate the scaler configuration.

## Overview

The following diagram illustrates the architecture you build:

<!-- Diagram source -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-aks-autoscaling-architecture.png" alt-text="Diagram of the solution architecture of WLS on AKS with KEDA scaler based on Prometheus Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-aks-autoscaling-architecture.png" border="false":::


In this article, metrics that will be exported by [WebLoigc Monitoring Exporter](https://github.com/oracle/weblogic-monitoring-exporter), which is a Prometheus-compatible exporter. Available metrices are listed in the following picture. If you want to customize the exporter, see [WebLoigc Monitoring Exporter Configuration](https://github.com/oracle/weblogic-monitoring-exporter?tab=readme-ov-file#configuration).

<!-- Diagram source -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-metrics.png" alt-text="WebLogic Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-metrics.png" border="false":::

## Prerequisites

- Java Headless Mode. Run `jar --vesion` to test if the headless mode is workable. You can run `apt install openjdk-11-jdk-headless` to install it in Ubuntu.

## Prepare sample application

This article uses [testwebapp](https://github.com/oracle/weblogic-kubernetes-operator/tree/main/integration-tests/src/test/resources/apps/testwebapp) from [weblogic-kubernetes-operator](https://github.com/oracle/weblogic-kubernetes-operator) as sample application. 

Clone [weblogic-kubernetes-operator](https://github.com/oracle/weblogic-kubernetes-operator).

```bash
git clone https://github.com/oracle/weblogic-kubernetes-operator.git
```

The following is the structure of the application:

```text
.
├── META-INF
│   ├── MANIFEST.MF
│   └── maven
│       └── com.oracle.weblogic
│           └── testwebapp
│               ├── pom.properties
│               └── pom.xml
├── WEB-INF
│   ├── web.xml
│   └── weblogic.xml
└── index.jsp
```

### Modify sample application

This article uses metric `openSessionsCurrentCount` to scale up and scale down the WLS cluster. By default, the session timeout on WebLogic is 60 minutes.To observe the scaling down capability quickly, here sets a short `timeout`. The following example sets the session timeout with `150` seconds.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!-- ========================================================================
  == DISCLAIMER:
  ==    This script is provided for educational purposes only. It is NOT
  ==    supported by Oracle World Wide Technical Support.
  ==    The script has been tested and appears to work as intended.
  ==    You should always run new scripts on a test instance initially.
  ==
  ======================================================================== -->

<wls:weblogic-web-app xmlns:wls="http://xmlns.oracle.com/weblogic/weblogic-web-app" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd http://xmlns.oracle.com/weblogic/weblogic-web-app http://xmlns.oracle.com/weblogic/weblogic-web-app/1.4/weblogic-web-app.xsd">
    <wls:weblogic-version>12.2.1</wls:weblogic-version>
    <wls:jsp-descriptor>
    <wls:keepgenerated>false</wls:keepgenerated>
    <wls:debug>false</wls:debug>
  </wls:jsp-descriptor>
  <wls:context-root>testwebapp</wls:context-root>
  <wls:session-descriptor>
    <wls:timeout-secs>150</wls:timeout-secs>
 </wls:session-descriptor>
</wls:weblogic-web-app>
```

Now, you can use the provided script [build-war-app.sh](https://github.com/oracle/weblogic-kubernetes-operator/blob/main/integration-tests/src/test/resources/bash-scripts/build-war-app.sh) to package the application.

```bash
cd weblogic-kubernetes-operator/integration-tests/src/test/resources/bash-scripts
bash build-war-app.sh -s ../apps/testwebapp/ -d /tmp/testwebapp
```

After the script finishes without error, you are able to deploy the sample application in */tmp/testwebapp/testwebapp.war* to the WLS cluster.  

### Create an Azure Storage account and upload the application

Use the following steps to create a storage account and container. Some of these steps direct you to other guides. After completing the steps, you can upload a sample application to deploy on WLS.

1. Sign in to the [Azure portal](https://aka.ms/publicportal).
1. Create a storage account by following the steps in [Create a storage account](/azure/storage/common/storage-account-create). Use the following specializations for the values in the article
   - Create a new Resource group for the storage account.
   - For **Region**, select **East US**.
   - For **Storage account name** use the same value as the resource group name.
   - For **Performance** select **Standard**.
   - For **Redundancy** select **Locally-redundant storage (LRS)**.
   - The remaining tabs need no specializations.
1. Proceed to validate and create the account, then return to this article.
1. Create a storage container within the account following the steps in [Quickstart: Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal) Follow the steps in section **Create a container**.
1. In the same article, follow the steps in **Uplaod a block blob** to upload the */tmp/testwebapp/testwebapp.war* you built with `build-war-app.sh`. Then return to this article.

## Deploy WLS on AKS using Azure Marketplace Offer

In this section, you create WLS cluster on AKS using [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer. You can choose to either enable KEDA using the marketplace offer or install it after the offer deployment.

> [!NOTE]
> You can find more information of [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer from:
> * [Deploy a Java application with WebLogic Server on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-wls-app) 
> * [Oracle WebLogic user guide for AKS](https://aka.ms/wls-aks-docs)

First, open [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer in your browser and select **Create**. You should see Basics pane of the offer.

The following steps show you how to fill out the Basics pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-basis.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS Basics pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-basis.png":::

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *wlsaks-eastus-20240109*.
1. Under **Instance details**, for **Region**, select **East US**.
1. Under **Credentials WebLogic**, provide a password for **WebLogic Administrator** and **WebLogic Model encryption**, respectively. Write down the username and password for **WebLogic Administrator**.
1. Under **Optional Basic Configuration**, For **Accept defaults for optional configuration?**, select **No**. The optional configuration shows.

    :::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-basis-optional-config.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS Basics pane Optional Basic Configuration." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-basis-optional-config.png":::

1. For **Name prefix for Managed Server**, fill in `msp`. You configure WLS TLOG table with prefix `TLOG_${serverName}_ ` later. This article creates TLOG table with name `TLOG_msp${index}_WLStore`. If you want a different managed server name prefix, make sure the value matches Microsoft SQL Server Table Naming Conventions and the real table names.
1. Leave the defaults for the other fields.

Select **Next** and go to **AKS** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-aks-image-selection.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS pane - Image Selection." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-aks-image-selection.png":::

Under **Image selection**:

1. For **Username for Oracle Single Sign-On authentication**, fill in your Oracle SSO username from the preconditions. 
1. For **Password for Oracle Single Sign-On authentication**, fill in your Oracle SSO credentials from the preconditions.

:::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-aks-app-selection.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS pane - App Selection." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-aks-app-selection.png":::

Under **Application**:

1. In the **Application** section, next to **Deploy an application?**, select Yes. 
1. Next to **Application package (.war,.ear,.jar)**, select **Browse**.
1. Start typing the name of the storage account from the preceding section. When the desired storage account appears, select it.
1. Select the storage container from the preceding section.
1. Select the checkbox next to **testwebapp.war** uploaded from the preceding section. Select **Select**. 
1. Leave the defaults for the other fields.
1. Select **Next** 

Leave the defaults in **TLS/SSL Configuration** pane, select **Next** to go to **Load Balancing** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-appgateway-ingress.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Load Balancing pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-appgateway-ingress.png":::

1. Next to **Create ingress for Administration Console. Make sure no application with path /console\*, it will cause conflict with Administration Console path**, select **Yes**.
1. Leave the defaults for the other fields.
1. Select **Next**

Leave the defaults in **DNS** pane, select **Next** to go to **Database** pane.
Leave the defaults in **Database** pane, select **Next** to go to **Horizontal Autoscaling** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-database.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Database pane." lightbox="media/migrate-weblogic-to-aks-with-ha-geo-redundancy/wlsaks-offer-portal-database.png":::

### [Enable KEDA using Marketplace Offer](#tab/offer)

1. Next to **Provision resources for horizontal autoscaling?**, select **Yes**.
1. Under **Horizontal autoscaling settings**, next to **Select metric source. Autoscaling based on resource metrics from Kubernetes Metrics Server or exporting by WebLogic Monitoring Exporter.**, select **WebLogic Monitor Exporter**.
1. Select **Review + create**.

### [Enable KEDA manually](#tab/manual)

Leave the defaults in **Horizontal Autoscaling** pane. Select **Review + create**.

---

Wait until **Running final validation...** successfully completes, then select **Create**. After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again

## Enable Prometheus Metrics

### [Enable KEDA using Marketplace Offer](#tab/offer)

This step is already performed for you when you use the VM base image.

### [Enable KEDA manually](#tab/manual)

Steps to enable Prometheus.


## Enable KEDA

### [Use Marketplace Offer](#tab/offer)

This step is already performed for you when you use the VM base image.

### [Step by step](#tab/manual)

Steps to enable KEDA.

## Create KEDA scaler

### [Use Marketplace Offer](#tab/offer)

This step is already performed for you when you use the VM base image.

### [Step by step](#tab/manual)

Steps to create KEDA scaler.

## Test autoscaling

## Clean up resources

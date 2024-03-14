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
   - The remaining tabs need no specializations.
1. Proceed to validate and create the account, then return to this article.
1. Create a storage container within the account following the steps in [Quickstart: Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal) Follow the steps in section **Create a container**.
1. In the same article, follow the steps in **Upload a block blob** to upload the */tmp/testwebapp/testwebapp.war* you built with `build-war-app.sh`. Then return to this article.

## Deploy WLS on AKS using Azure Marketplace Offer

In this section, you create WLS cluster on AKS using [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer. You can choose to either enable KEDA using the marketplace offer or install it after the offer deployment.

> [!NOTE]
> You can find more information of [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer from:
> * [Deploy a Java application with WebLogic Server on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-wls-app) 
> * [Oracle WebLogic user guide for AKS](https://aka.ms/wls-aks-docs)

First, open [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer in your browser and select **Create**. You should see Basics pane of the offer.

The following steps show you how to fill out the Basics pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-basis.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS Basics pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-basis.png":::

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *wlsaks-eastus-20240109*.
1. Under **Instance details**, for **Region**, select **East US**.
1. Under **Credentials WebLogic**, provide a password for **WebLogic Administrator** and **WebLogic Model encryption**, respectively. Write down the username and password for **WebLogic Administrator**.
1. Leave the defaults for the other fields.

Select **Next** and go to **AKS** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-aks-image-selection.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS pane - Image Selection." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-aks-image-selection.png":::

Under **Image selection**:

1. For **Username for Oracle Single Sign-On authentication**, fill in your Oracle SSO username from the preconditions. 
1. For **Password for Oracle Single Sign-On authentication**, fill in your Oracle SSO credentials from the preconditions.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-aks-app-selection.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS pane - App Selection." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-aks-app-selection.png":::

Under **Application**:

1. In the **Application** section, next to **Deploy an application?**, select Yes. 
1. Next to **Application package (.war,.ear,.jar)**, select **Browse**.
1. Start typing the name of the storage account from the preceding section. When the desired storage account appears, select it.
1. Select the storage container from the preceding section.
1. Select the checkbox next to **testwebapp.war** uploaded from the preceding section. Select **Select**. 
1. Leave the defaults for the other fields.
1. Select **Next** 

Leave the defaults in **TLS/SSL Configuration** pane, select **Next** to go to **Load Balancing** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-appgateway-ingress.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Load Balancing pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-portal-appgateway-ingress.png":::

1. Next to **Create ingress for Administration Console. Make sure no application with path /console\*, it will cause conflict with Administration Console path**, select **Yes**.
1. Leave the defaults for the other fields.
1. Select **Next**

Leave the defaults in **DNS** pane, select **Next** to go to **Database** pane.

Leave the defaults in **Database** pane, select **Next** to go to **Horizontal Autoscaling** pane.

### [Enable KEDA using Marketplace Offer](#tab/offer)

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-autoscaling.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Horizontal Autoscaling pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-autoscaling.png":::

1. Next to **Provision resources for horizontal autoscaling?**, select **Yes**.
1. Under **Horizontal autoscaling settings**, next to **Select metric source. Autoscaling based on resource metrics from Kubernetes Metrics Server or exporting by WebLogic Monitoring Exporter.**, select **WebLogic Monitor Exporter**.
1. Select **Review + create**.

### [Enable KEDA manually](#tab/manual)

1. Leave the defaults in **Horizontal Autoscaling** pane. 
1. Select **Review + create**.

---

Wait until **Running final validation...** successfully completes, then select **Create**. After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again

## Connect to AKS cluster

The following sections require a Linux terminal with `kubectl` installed. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command. 

1. Open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
1. Select the AKS cluster from resource list. Select button **Connect**, you find the guidance of how to connect the AKS cluster.
1. Select **Azure CLI** and follow the steps to connect to the AKS cluster in your local terminal.

## Enable Prometheus Metrics

### [Use Horizontal Autoscaling feature of Marketplace Offer](#tab/offer)

This step is already performed for you when you use the offer.

### [Enable Horizontal Autoscaling manually](#tab/manual)

This section shows manual steps to:

- Export WebLogic metrics using WebLogic Monitoring Exporter.
- Enable AKS Promethues integration.
- Configure Promethues to scrape metrics from WLS.
- Query metrics from Azure Monitor Workspace.

#### Enable WebLogic Monitoring Exporter

This article uses the WebLogic Monitoring Exporter to scrape WebLogic Server metrics and feed them to Prometheus. The exporter uses the WebLogic Server 12.2.1.x [RESTful Management Interface](https://docs.oracle.com/middleware/1221/wls/WLRUR/overview.htm#WLRUR111) for accessing runtime state and metrics. 

This article configures WebLogic Monitoring Exporter to export the following WLS state and metrics. For a detailed description of WebLogic Monitoring Exporter configuration and usage, see [WebLogic Monitoring Exporter](https://blogs.oracle.com/weblogicserver/exporting-metrics-from-weblogic-server).

<!-- Diagram source -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-metrics.png" alt-text="WebLogic Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/weblogic-metrics.png" border="false":::

The offer runs a operator-managed WebLogic Server domain in Kubernetes. You can simply add the `monitoringExporter` configuration element in the domain resource to enable the Monitoring Exporter. For more information, see [Monitoring exporter](https://oracle.github.io/weblogic-kubernetes-operator/managing-domains/accessing-the-domain/monitoring-exporter/).

The following example patches the WLS domain with the exporter configuration using `kubectl patch`. The exporter image is `ghcr.io/oracle/weblogic-monitoring-exporter:2.1.9`. Here, the domain UID is `sample-domain1`, and the namespace is `sample-domain1-ns`, which were created by the offer with default settings. Replace with yours if you are using different domain UID and namespace.

```bash
WME_IMAGE_URL="ghcr.io/oracle/weblogic-monitoring-exporter:2.1.9"
WLS_DOMAIN_UID="sample-domain1"
WLS_NAMESPACE="sample-domain1-ns"
```

```bash
VERSION=$(kubectl -n ${WLS_NAMESPACE} get domain ${WLS_DOMAIN_UID} -o=jsonpath='{.spec.restartVersion}' | tr -d "\"")
VERSION=$((VERSION+1))
```

```bash
cat <<EOF >patch-file.json
[
    {
        "op": "replace",
        "path": "/spec/restartVersion",
        "value": "${VERSION}"
    },
    {
        "op": "add",
        "path": "/spec/monitoringExporter",
        "value": {
            "configuration": {
                "domainQualifier": true,
                "metricsNameSnakeCase": true,
                "queries": [
                    {
                        "applicationRuntimes": {
                            "componentRuntimes": {
                                "key": "name",
                                "prefix": "webapp_config_",
                                "servlets": {
                                    "key": "servletName",
                                    "prefix": "weblogic_servlet_",
                                    "values": [
                                        "invocationTotalCount",
                                        "reloadTotal",
                                        "executionTimeAverage",
                                        "poolMaxCapacity",
                                        "executionTimeTotal",
                                        "reloadTotalCount",
                                        "executionTimeHigh",
                                        "executionTimeLow"
                                    ]
                                },
                                "type": "WebAppComponentRuntime",
                                "values": [
                                    "deploymentState",
                                    "contextRoot",
                                    "sourceInfo",
                                    "openSessionsHighCount",
                                    "openSessionsCurrentCount",
                                    "sessionsOpenedTotalCount",
                                    "sessionCookieMaxAgeSecs",
                                    "sessionInvalidationIntervalSecs",
                                    "sessionTimeoutSecs",
                                    "singleThreadedServletPoolSize",
                                    "sessionIDLength",
                                    "servletReloadCheckSecs",
                                    "jSPPageCheckSecs"
                                ]
                            },
                            "workManagerRuntimes": {
                                "prefix": "workmanager_",
                                "key": "applicationName",
                                "values": [
                                    "pendingRequests", 
                                    "completedRequests", 
                                    "stuckThreadCount"]
                            },
                            "key": "name",
                            "keyName": "app"
                        },
                        "JVMRuntime": {
                            "key": "name",
                            "values": [
                                "heapFreeCurrent", 
                                "heapFreePercent", 
                                "heapSizeCurrent", 
                                "heapSizeMax", 
                                "uptime", 
                                "processCpuLoad"
                            ]
                        },
                        "key": "name",
                        "keyName": "server"
                    }
                ]
            },
            "image": "${WME_IMAGE_URL}",
            "port": 8080
        }
    }
]
EOF
```

Now, you are ready to apply tha patch file. 

The following example patches domain with *patch-file.json*.

```bash
kubectl -n ${WLS_NAMESPACE} patch domain ${WLS_DOMAIN_UID} \
    --type=json \
    --patch-file patch-file.json
```

The patch command causes a rolling update to the WLS cluster. It takes several minutes to complete. 
You can watch the status with command `kubectl -n ${WLS_NAMESPACE} get pod -w`.

Make sure all the pods are running as following before you move on.

```text
$ kubectl -n ${WLS_NAMESPACE} get pod -w
NAME                             READY   STATUS    RESTARTS   AGE
sample-domain1-admin-server      2/2     Running   0          4m29s
sample-domain1-managed-server1   2/2     Running   0          3m16s
sample-domain1-managed-server2   2/2     Running   0          112s
```

### Enable AKS Promethues integration

## Enable KEDA

## Examine the metrics

## Create KEDA scaler

### [Use Horizontal Autoscaling feature of Marketplace Offer](#tab/offer)

Enabling KEDA using the marketplace offer, you find a KEDA scaler sample from the deployment output. You can modify the sampe with your desired metircs and create a KEDA scaler.

Following the steps to get the output of scaler sample.

1. In the corner of any Azure portal page, select the hamburger menu and select **Resource groups**.

1. In the box with the text Filter for any field, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.

1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.

1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, whoes name starts with **oracle.20210620-wls-on-aks**.

1. The **shellCmdtoOutputKedaScalerSample** value is the base64 string of a scaler sample. Copy the value and run it in your terminal. The command should look similar to the following example:

    ```bash
    echo -e YXBpVm...XV0aAo= | base64 -d > scaler.yaml
    ```
    
    This command produces a *scaler.yaml* file in current directory, with contents similar to the following example:

    ```yaml
    apiVersion: keda.sh/v1alpha1
    kind: TriggerAuthentication
    metadata:
      name: azure-managed-prometheus-trigger-auth
      namespace: sample-domain1-ns
    spec:
      podIdentity:
          provider: azure-workload
          identityId: cc41aedb-8eeb-4006-acd1-03b75a1a2319
    ---
    apiVersion: keda.sh/v1alpha1
    kind: ScaledObject
    metadata:
      name: azure-managed-prometheus-scaler
      namespace: sample-domain1-ns
    spec:
      scaleTargetRef:
        apiVersion: weblogic.oracle/v1
        kind: Cluster
        name: sample-domain1-cluster-1
      minReplicaCount: 1
      maxReplicaCount: 5
      triggers:
      - type: prometheus
        metadata:
          serverAddress: https://amajtdxcfggepdbc-23bc.eastus.prometheus.monitor.azure.com
          metricName: webapp_config_open_sessions_high_count
          query: sum(webapp_config_open_sessions_high_count{app="<your-app-name>"}) # Note: query must return a vector/scalar single element response
          threshold: '10'
          activationThreshold: '1'
        authenticationRef:
          name: azure-managed-prometheus-trigger-auth

    ```

1. This article sums `openSessionsCurrentCount` of the sample application `testwebapp` as trigger query. When the sum of  `openSessionsCurrentCount` is more than `10`, scale up the WLS cluster until it reaches the maximum size. Ortherwise, scale down the WLS cluster until it reaches its minimum size. Modify the scaler sample as the following:

    ```yaml
    metricName: webapp_config_open_sessions_current_count
    query: sum(webapp_config_open_sessions_current_count{app="testwebapp"}) # Note: query must return a vector/scalar single
    ```
1. Create the KEDA scaler using *scaler.yaml*

   ```yaml
   kubectl apply -f scaler.yaml
   ```


### [Enable Horizontal Autoscaling manually](#tab/manual)

Steps to create KEDA scaler.

## Test autoscaling

## Clean up resources

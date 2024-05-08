---
title: "Tutorial: Migrate Oracle WebLogic Server to AKS with KEDA scaler based on Prometheus Metrics"
description: Shows how to deploy WebLogic Server to AKS and enable autoscaling with KEDA scaler based on Prometheus Metrics.
author: KarlErickson
ms.author: haiche
ms.topic: tutorial
ms.date: 05/03/2024
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, migration-java
---

# Tutorial: Migrate Oracle WebLogic Server to AKS with KEDA scaler based on Prometheus Metrics

This tutorial shows you how to migrate Oracle WebLogic Server (WLS) to Azure Kubernetes Service (AKS) and configure automatic horizontal scaling based on Prometheus metrics.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - What WebLogic application metrics can be exported using WebLogic Monitoring Exporter?
> - Deploy and run WebLogic applciation on AKS using Azure marketplace offer.
> - Enable Azure Monitor managed service for Prometheus using Azure marketplace offer.
> - Feed WLS metrics to Azure Monitor workspace using Azure marketplace offer.
> - Integrate Kubernetes Event-driven Autoscaling (KEDA) with AKS cluster using Azure marketplace offer.
> - Create KEDA scaler that is based on Prometheus Metrics.
> - Validate the scaler configuration.

## Overview

The following diagram illustrates the architecture you build:

<!-- https://github.com/oracle/weblogic-azure/blob/main/weblogic-azure-aks/src/main/resources/diagrams/wls-aks-diagram-autoscaling.vsdx -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/weblogic-aks-autoscaling-architecture.png" alt-text="Diagram of the solution architecture of WLS on AKS with KEDA scaler based on Prometheus Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/weblogic-aks-autoscaling-architecture.png" border="false":::

The [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer runs a WLS operator and a WLS domain on AKS. The WLS operator manages a WLS domain which is deployed using [model in image](https://oracle.github.io/weblogic-kubernetes-operator/samples/domains/model-in-image/) domain source type. To learn more about WLS operator, see [Oracle WebLogic Kubernetes Operator](https://oracle.github.io/weblogic-kubernetes-operator/).

The WebLogic Monitoring Exporter is to scrape WebLogic Server metrics and feed them to Prometheus. The exporter uses the WebLogic Server 12.2.1.x [RESTful Management Interface](https://docs.oracle.com/middleware/1221/wls/WLRUR/overview.htm#WLRUR111) for accessing runtime state and metrics. 

Azure Monitor managed service for Prometheus collects and saves metrics from WLS at scale using a Prometheus-compatible monitoring solution, based on the [Prometheus](https://aka.ms/azureprometheus-promio) project from the Cloud Native Computing Foundation. To learn more, see [Azure Monitor managed service for Prometheus](/azure/azure-monitor/essentials/prometheus-metrics-overview).

This article integrates KEDA with your AKS cluster to scale WLS cluster based on Prometheus metrics from the Azure Monitor workspace. KEDA acts to monitor Azure Monitor managed service for Prometheus and feed that data to AKS and the Horizontal Pod Autoscaler (HPA) to drive rapid scale of WLS workload.

The following WLS state and metrics are exported by default. You can configure the exporter to export other metrics on your demain. For a detailed description of WebLogic Monitoring Exporter configuration and usage, see [WebLogic Monitoring Exporter](https://blogs.oracle.com/weblogicserver/exporting-metrics-from-weblogic-server).

<!-- https://github.com/oracle/weblogic-azure/blob/main/weblogic-azure-aks/src/main/resources/diagrams/wls-aks-diagram-autoscaling.vsdx -->
:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/weblogic-metrics.png" alt-text="WebLogic Metrics." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/weblogic-metrics.png" border="false":::

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you have either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with either Windows with WSL, GNU/Linux, or macOS installed.
* Install Azure CLI version 2.54.0 or higher to run Azure CLI commands.
* Install and set up [kubectl](/cli/azure/aks#az-aks-install-cli).
* Have the credentials for an Oracle single sign-on (SSO) account. To create one, see [Create Your Oracle Account](https://aka.ms/wls-aks-create-sso-account).
* Accept the license terms for WLS.
  * Visit the [Oracle Container Registry](https://container-registry.oracle.com/) and sign in.
  * If you have a support entitlement, select **Middleware**, then search for and select **weblogic_cpu**.
  * If you don't have a support entitlement from Oracle, select **Middleware**, then search for and select **weblogic**.
  * Accept the license agreement.
* If you are running the 

## Prepare sample application

This article uses [testwebapp](https://github.com/oracle/weblogic-kubernetes-operator/tree/main/integration-tests/src/test/resources/apps/testwebapp) from [weblogic-kubernetes-operator](https://github.com/oracle/weblogic-kubernetes-operator) as sample application. 

Download the pre-built sample app and expand it into a directory. Because this article writes several files, let's create a top level directory to contain everything.

```bash
export BASE_DIR=$PWD/wlsaks
mkdir $BASE_DIR && cd $BASE_DIR
curl -L -o testwebapp.war https://aka.ms/wls-aks-testwebapp
unzip -d testwebapp testwebapp.war
```

### Modify sample application

This article uses metric `openSessionsCurrentCount` to scale up and scale down the WLS cluster. By default, the session timeout on WebLogic is 60 minutes. To observe the scaling down capability quickly, this article sets a short timeout. The following example specifies the session timeout with 150 seconds using `wls:timeout-secs`. The HEREDOC format is used to overwrite the file at `testwebapp/WEB-INF/weblogic.xml` with the desired content.

```xml
cat <<EOF > testwebapp/WEB-INF/weblogic.xml
<?xml version="1.0" encoding="UTF-8"?>

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
EOF
```

Rezip the sample app.

```bash
cd testwebapp && zip -r ../testwebapp.war * && cd ..
```

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
1. In the same article, follow the steps in **Upload a block blob** to upload the *testwebapp.war*. Then return to this article.

## Deploy WLS on AKS using Azure Marketplace Offer

In this section, you create a WLS cluster on AKS using [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer. The offer provides a full feature set for easily deploying WebLogic Server on AKS. This article focuses on the advanced dynamic scaling capabilities of the offer. For the complete reference documentation for this offer, see [the Oracle documentation](https://aka.ms/wls-aks-docs).

The offer implements two choices for horizontal autoscaling.

* Kubernetes Metrics Server. This choice sets up all necessary configuration at deployment time. A horizontol pod autoscaler (HPA) is deployed with a choice of metrics. You can further customize the HPA after deployment.
* WebLogic Monitoring Exporter. This choice provisions WebLogic Monitoring Exporter, Azure Monitor managed service for Prometheus, and KEDA automatically. After the offer deployment completes, the WLS metrics are exported and saved in Azure Monitor workspace. KEDA is installed with ability to retrieve metrics from the Azure Monitor workspace.
   **With this option, you must take additional action after deployment to complete the configuration.**
   
This article describes the second option and corresponding actions to complete configuration.
   
> [!NOTE]
> You can find more information of [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer from:
> * [Deploy a Java application with WebLogic Server on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-wls-app) 
> * [Oracle WebLogic user guide for AKS](https://aka.ms/wls-aks-docs)

First, open [Oracle WebLogic Server on AKS](https://aka.ms/wlsaks) offer in your browser and select **Create**. You should see Basics pane of the offer.

The following steps show you how to fill out the Basics pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-basis.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS Basics pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-basis.png":::

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *wlsaks-eastus-20240109*.
1. Under **Instance details**, for **Region**, select **East US**.
1. Under **Credentials WebLogic**, provide a password for **WebLogic Administrator** and **WebLogic Model encryption**, respectively. Write down the username and password for **WebLogic Administrator**.
1. Leave the defaults for the other fields.

Select **Next** and go to **AKS** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-aks-image-selection.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS pane - Image Selection." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-aks-image-selection.png":::

Under **Image selection**:

1. For **Username for Oracle Single Sign-On authentication**, fill in your Oracle SSO username from the preconditions. 
1. For **Password for Oracle Single Sign-On authentication**, fill in your Oracle SSO credentials from the preconditions.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-aks-app-selection.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server on AKS pane - App Selection." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-aks-app-selection.png":::

Under **Application**:

1. In the **Application** section, next to **Deploy an application?**, select Yes. 
1. Next to **Application package (.war,.ear,.jar)**, select **Browse**.
1. Start typing the name of the storage account from the preceding section. When the desired storage account appears, select it.
1. Select the storage container from the preceding section.
1. Select the checkbox next to **testwebapp.war** uploaded from the preceding section. Select **Select**. 
1. Leave the defaults for the other fields.
1. Select **Next**.

Leave the defaults in **TLS/SSL Configuration** pane. Select **Next** to go to the **Load Balancing** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-appgateway-ingress.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Load Balancing pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-portal-appgateway-ingress.png":::

1. Leave the default values for all option except **Create ingress for Administration Console. Make sure no application with path /console\*, it will cause conflict with Administration Console path**. For this option, select **Yes**.
1. Leave the defaults for the remaining fields.
1. Select **Next**.

Leave the defaults in **DNS** pane, select **Next** to go to **Database** pane.

Leave the defaults in **Database** pane, select **Next** to go to **Horizontal Autoscaling** pane.

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-autoscaling.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Horizontal Autoscaling pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wlsaks-offer-autoscaling.png":::

1. Next to **Provision resources for horizontal autoscaling?**, select **Yes**.
1. Under **Horizontal autoscaling settings**, next to **Select metric source. Autoscaling based on resource metrics from Kubernetes Metrics Server or exporting by WebLogic Monitoring Exporter.**, select **WebLogic Monitor Exporter**.
1. Select **Review + create**.

Wait until **Running final validation...** successfully completes, then select **Create**. After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again

## Connect to AKS cluster

The following sections require a terminal with `kubectl` installed to manage the WLS cluster. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command. 

Follow the steps to connect to AKS cluster.

1. Open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
1. Select the AKS cluster from resource list. Select button **Connect**, you find the guidance of how to connect the AKS cluster.
1. Select **Azure CLI** and follow the steps to connect to the AKS cluster in your local terminal. If running on macOS or Windows, save the `az aks get-credentials` command aside for use in Azure Cloud Shell later.

## Retrieve metrics from Azure Monitor Workspace

Now, you're able to query metrics in the Azure Monitor workspace. All data is retrieved from an Azure Monitor workspace by using queries that are written in Prometheus Query Language (PromQL).

Input your PromQL following steps:

1. Open the Azure Monitor workspace, the workspace locates at the resource group that created by [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
1. Select **Managed Prometheus** -> **Prometheus explorer**. 
1. Input `webapp_config_open_sessions_current_count` to query the current account of open sessions, as the screenshot shows.

    :::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/prometheus-explorer.png" alt-text="Screenshot of the Azure portal showing the Prometheus explorer." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/prometheus-explorer.png":::

> [!NOTE]
> You can access the metrics by exposing WebLogic Monitoring Exporter with command:
> ```
> cat <<EOF | kubectl apply -f -
> apiVersion: v1
> kind: Service
> metadata:
>   name: sample-domain1-cluster-1-exporter
>   namespace: sample-domain1-ns
> spec:
>   ports:
>   - name: default
>     port: 8080
>     protocol: TCP
>     targetPort: 8080
>   selector:
>     weblogic.domainUID: sample-domain1
>     weblogic.clusterName: cluster-1
>   sessionAffinity: None
>   type: LoadBalancer
> EOF
> 
> kubectl get svc -n sample-domain1-ns -w
> ```
> Access the `http://<exporter-public-ip>:8080/metrics` and login with WebLogic credentials. You will find all the metrics.


## Create KEDA scaler

Scalers define how and when KEDA should scale a deployment. This article uses [Prometheus scaler](https://keda.sh/docs/2.10/scalers/prometheus/) to retrieve Prometheus metrics from the Azure Monitor workspace. 

This article use `openSessionsCurrentCount` of the sample application as trigger query. When the average open session account is more than `10`, scale up the WLS cluster until it reaches the maximum replica size. Otherwise, scale down the WLS cluster until it reaches its minimum replica size. The table lists important parameters:

| Parameter Name | Value |
|-------------------|----------------------------------------------------|
| `serverAddress` |  The Query endpoint of your Azure Monitor workspace. |
| `metricName` | `webapp_config_open_sessions_current_count` |
| `query` | `sum(webapp_config_open_sessions_current_count{app="app1"}) ` |
| `threshold` | 10 |
| `minReplicaCount` | 1 |
| `maxReplicaCount` | The default value is 5. If you modified the maximum cluster size during offer deployment, replace with your maximum cluster size. |

> [!NOTE]
> The offer deploys *testwebapp.war* with name `app1` by default. You can access the WLS admin console to obtain the application name. 
>
> 1. Open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
> 1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.
> 1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, whose name starts with **oracle.20210620-wls-on-aks**.
> 1. The **adminConsoleExternalUrl** value is the fully qualified, public Internet visible link to the WLS admin consolt. Select the copy icon next to the field value to copy the link to your clipboard. 
> 1. Paste the value to your browser and open WLS admin console. 
> 1. Log in with WLS admin account, which you wrote down during [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
>   * Under **Domain Structure**, select **Deployments**. You find **app1** listed. 
>   * Select **app1**, you find the **Name** of the application is `app1`. Use `app1` as application name in the query.

After the offer deployment completes, you find a KEDA scaler sample from the deployment output. You can modify the sample on your demand and create a KEDA scaler.

Following the steps to get the output of scaler sample.

1. Open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, whose name starts with **oracle.20210620-wls-on-aks**.
1. The **kedaScalerServerAddress** value is the server address of that saves the WLS metrics. KEDA is able to access and retrieve metric from the address.
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

1. Modify the metric name. This article uses total `webapp_config_open_sessions_current_count` as query.

    ```yaml
    metricName: webapp_config_open_sessions_current_count
    query: sum(webapp_config_open_sessions_current_count{app="app1"})
    ```

Create the KEDA scaler by applying *scaler.yaml*.

```bash
kubectl apply -f scaler.yaml
```

It takes several minutes for KEDA to retrieve metrics from the Azure Monitor workspace. You can watch the scaler status with:

```bash
kubectl get hpa -n sample-domain1-ns -w
```

Once the scaler is ready to work, the output looks similar to the following content.

```text
$ kubectl get hpa -n sample-domain1-ns -w
NAME                                       REFERENCE                          TARGETS              MINPODS   MAXPODS   REPLICAS   AGE
keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   <unknown>/10 (avg)   1         5         0          10s
keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)           1         5         2          15s
```

## Test autoscaling

Now, you're ready to observe the scaling up and scaling down capability. This article opens new sessions using `curl` to access the application. Once average account is larger than 10, scaling up action happens. The sessions last for 150 seconds, the open session account decrease as the sessions expire. Once average account is less than 10, scaling down action happens. Follow the steps to cause scaling up and scaling down actions.

First, obtain the application URL.

  1. Open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
  1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.
  1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, whose name starts with **oracle.20210620-wls-on-aks**.
  1. The **clusterExternalUrl** value is the fully qualified, public Internet visible link to the sample app deployed in WLS on this AKS cluster. Select the copy icon next to the field value to copy the link to your clipboard. 
  1. The URL to access `testwebapp.war` is `${clusterExternalUrl}testwebapp`. For example, `http://wlsgw202403-wlsaks0314-domain1.eastus.cloudapp.azure.com/testwebapp/`.

Next, run `curl` command to access the application and cause new sessions. The following example opens 22 new sessions. The sessions will be expired after 150 seconds.

  Replace value of **WLS_CLUSTER_EXTERNAL_URL** with yours.

  ```bash
  COUNTER=0
  MAXCURL=22
  WLS_CLUSTER_EXTERNAL_URL="http://wlsgw202403-wlsaks0314-domain1.eastus.cloudapp.azure.com/"
  APP_URL="${WLS_CLUSTER_EXTERNAL_URL}testwebapp/"

  while [ $COUNTER -lt $MAXCURL ]; do curl ${APP_URL}; let COUNTER=COUNTER+1; sleep 1;done
  ```

Then, observe the scaler with `kubectl get hpa -n <wls-namespace> -w` and WLS pods with `kubectl get pod -n <wls-namespace> -w`.

  The output looks similar to the following content.

  ```text
  $ kubectl get hpa -n sample-domain1-ns -w
  NAME                                       REFERENCE                          TARGETS          MINPODS   MAXPODS   REPLICAS   AGE
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)       1         5         1          24m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)       1         5         1          24m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   5/10 (avg)       1         5         1          26m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   22/10 (avg)      1         5         1          27m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   7334m/10 (avg)   1         5         3          29m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)       1         5         3          30m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)       1         5         3          35m
  keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)       1         5         1          35m
  ```

  ```text
  $ kubectl get pod -n sample-domain1-ns -w
  NAME                             READY   STATUS              RESTARTS   AGE
  sample-domain1-admin-server      2/2     Running             0          28h
  sample-domain1-managed-server1   2/2     Running             0          28h
  sample-domain1-managed-server1   2/2     Running             0          28h
  sample-domain1-managed-server2   0/2     Pending             0          0s
  sample-domain1-managed-server2   0/2     Pending             0          0s
  sample-domain1-managed-server2   0/2     ContainerCreating   0          0s
  sample-domain1-managed-server3   0/2     Pending             0          0s
  sample-domain1-managed-server3   0/2     Pending             0          0s
  sample-domain1-managed-server3   0/2     ContainerCreating   0          0s
  sample-domain1-managed-server3   1/2     Running             0          1s
  sample-domain1-managed-server2   1/2     Running             0          2s
  sample-domain1-managed-server3   2/2     Running             0          46s
  sample-domain1-managed-server2   2/2     Running             0          56s
  sample-domain1-managed-server3   1/2     Running             0          7m5s
  sample-domain1-managed-server3   1/2     Terminating         0          7m9s
  sample-domain1-managed-server3   1/2     Terminating         0          7m9s
  sample-domain1-managed-server2   1/2     Running             0          7m11s
  sample-domain1-managed-server2   1/2     Terminating         0          7m15s
  sample-domain1-managed-server2   1/2     Terminating         0          7m15s
  sample-domain1-managed-server1   2/2     Running             0          28h
  ```

  The graph in the Azure Monitor workspace looks similar to the screenshot.

  :::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wls-autoscaling-graph.png" alt-text="Screenshot of the Azure portal showing the Prometheus explorer graph." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-prometheus-metrics/wls-autoscaling-graph.png":::

> [!NOTE]
> In this article, the script opens 22 sessions. The average session account is less than 10 when the replica number reaches 3. The cluster didn't hit the maximum size 5.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az-group-delete) command. The following command removes the resource group, container service, container registry, and all related resources:

```azurecli
az group delete --name <wls-resource-group-name> --yes --no-wait
az group delete --name <ama-resource-group-name> --yes --no-wait
```

## Next steps

Continue to explore the following references for more options to build autoscaling solutions and run WLS on Azure:

> [!div class="nextstepaction"]
> [Scaling options for applications in Azure Kubernetes Service (AKS)](/azure/aks/concepts-scale)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)
> [!div class="nextstepaction"]
> [Approaches for scaling WebLogic clusters in a Kubernetes environment](https://aka.ms/wlsoperator-scaling)
> [!div class="nextstepaction"]
> [Using Prometheus and Grafana to Monitor WebLogic Server on Kubernetes](https://blogs.oracle.com/weblogicserver/post/using-prometheus-and-grafana-to-monitor-weblogic-server-on-kubernetes)
> [!div class="nextstepaction"]
> [Oracle WebLogic Kubernetes Operator](https://aka.ms/wlsoperator)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

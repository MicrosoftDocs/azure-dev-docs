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

This article uses the WebLogic Monitoring Exporter to scrape WebLogic Server metrics and feed them to Prometheus. The exporter uses the WebLogic Server 12.2.1.x [RESTful Management Interface](https://docs.oracle.com/middleware/1221/wls/WLRUR/overview.htm#WLRUR111) for accessing runtime state and metrics. 

The following WLS state and metrics will be exported. You can configure the exporter to export other metrics on your demain. For a detailed description of WebLogic Monitoring Exporter configuration and usage, see [WebLogic Monitoring Exporter](https://blogs.oracle.com/weblogicserver/exporting-metrics-from-weblogic-server).

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

### [Use Horizontal Autoscaling feature of Marketplace Offer](#tab/offer)

:::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-autoscaling.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on AKS Horizontal Autoscaling pane." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wlsaks-offer-autoscaling.png":::

1. Next to **Provision resources for horizontal autoscaling?**, select **Yes**.
1. Under **Horizontal autoscaling settings**, next to **Select metric source. Autoscaling based on resource metrics from Kubernetes Metrics Server or exporting by WebLogic Monitoring Exporter.**, select **WebLogic Monitor Exporter**.
1. Select **Review + create**.

### [Enable Horizontal Autoscaling manually](#tab/manual)

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
- Query metrics in Azure Monitor Workspace.

#### Enable WebLogic Monitoring Exporter

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

> [!NOTE]
> You can access metrics from WebLogic Monitoring Exporter by exposing the exporter with a public IP. 
> Create a Loadbalancer service for the exporter with the following command. 
> ```bash
> cat <<EOF | kubectl apply -f -
> apiVersion: v1
> kind: Service
> metadata:
>   name: wls-exporter-cluster-external-lb
>   namespace: ${WLS_NAMESPACE}
> spec:
>   ports:
>   - name: default
>     port: 8080
>     protocol: TCP
>     targetPort: 8080
>   selector:
>     weblogic.domainUID: ${WLS_DOMAIN_UID}
>     weblogic.clusterName: cluster-1
>   sessionAffinity: None
>   type: LoadBalancer
> EOF
> 
>
> WME_IP=$(kubectl get svc wls-exporter-cluster-external-lb -n ${WLS_NAMESPACE} -o=jsonpath='{.status.loadBalancer.ingress[*].ip}')
> echo "Metric address: http://${WME_IP}:8080/metrics"
> ```
> Open the URL from output to access metrics, you will be required to input user name and password. The user name and password is the WLS admin account you set during the offer deployment.

### Install AKS Promethues metrics addon

Before you install the metrics add-on, you need an Azure Monitor Account. For more information, see [Enable monitoring for Kubernetes clusters](/azure/azure-monitor/containers/kubernetes-monitoring-enable).

Run [az monitor account create](/cli/azure/monitor/account) to create the workspace. Replace the resouce group name and azure monitor account name with your desired values. 

```azurecli
AMA_RG_NAME="wlsaksamarg20240314"
AMA_NAME="wlsaksama20240314"
LOCATION="eastus

# create a resorce group for azure monitor account
az group create -n ${AMA_RG_NAME} -l ${LOCATION}
# create azure monitor account
az monitor account create -n ${AMA_NAME} -g ${AMA_RG_NAME}
```

Enable metrics addon in existing AKS cluster with [az aks update](/cli/azure/aks#az-aks-update). The k8s-extension version 1.4.1 or higher is required. For more information, see [Enable Prometheus](/azure/azure-monitor/containers/kubernetes-monitoring-enable?tabs=cli#enable-prometheus-and-grafana).

Firstly, open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer). Obtain the AKS cluster name and the resource group name, and fill in the following variables `AKS_CLUSTER_NAME`, `AKS_CLUSTER_RG_NAME`.

```azurecli
AKS_CLUSTER_NAME=<your-aks-cluster-name>
AKS_CLUSTER_RG_NAME=<your-aks-cluster-resource-group>

AMA_ID=$(az monitor account show -n ${AMA_NAME} -g ${AMA_RG_NAME} --query id -otsv)

az extension remove --name aks-preview
az extension add --name k8s-extension

az aks update --enable-azure-monitor-metrics \
    --name ${AKS_CLUSTER_NAME} \
    --resource-group ${AKS_CLUSTER_RG_NAME} \
    --azure-monitor-workspace-resource-id "${AMA_ID}"
```

It takes 15 minutes to deploy the metrics addon. Make sure the command completes withour errors.

> [!NOTE]
> You can run `kubectl get ds ama-metrics-node --namespace=kube-system` to validate the metrics addon.
> This is a validation example:
>
> ```text
> $ kubectl get ds ama-metrics-node --namespace=kube-system
>   NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
>   ama-metrics-node   3         3         3       3            3           <none>          32m
> ```

### Configure Promethues to scrape metrics from WLS

Once the AKS metrics addon enabled, you can configure Promethues to scrape metrics from WLS. For more information, see [Customize scraping of Prometheus metrics in Azure Monitor managed service for Prometheus](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration).

Follow the steps to apply scrape configuration.

1. Create Prometheus scrape config file. For more information, see [Create Prometheus configuration file](/azure/azure-monitor/containers/prometheus-metrics-scrape-validate#create-prometheus-configuration-file).

    Promethues requires the WebLogic admin account to sign in WebLogic Monitoring Exporter and access metrics. The WebLogic admin account is set during offer deployment. Fill in `WLS_ADMIN_USERNAME` and `WLS_ADMIN_PASSWORD` with the user name and password. For more details, see `[scrape_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config)`.

    ```bash
    WLS_ADMIN_USERNAME="weblogic"
    WLS_ADMIN_PASSWORD="Secret123456"

    cat <<EOF >prometheus-config
    global:
    scrape_interval: 30s
    scrape_configs:
    - job_name: '${WLS_DOMAIN_UID}'
    kubernetes_sd_configs:
    - role: pod
      namespaces: 
        names: [${WLS_NAMESPACE}]
    basic_auth:
      username: ${WLS_ADMIN_USERNAME}
      password: ${WLS_ADMIN_PASSWORD}
    EOF
    ```

2. Validate the scrape config file. You can find more information of [Prometheus scrape validation](/azure/azure-monitor/containers/prometheus-metrics-scrape-validate#validate-the-scrape-config-file). 

    First, copy **promconfigvalidator** tool from the Azure Monitor metrics addon pod(s).

    ```bash
    for podname in $(kubectl get pods -l rsName=ama-metrics -n=kube-system -o json | jq -r '.items[].metadata.name'); do kubectl cp -n=kube-system "${podname}":/opt/promconfigvalidator ./promconfigvalidator;  kubectl cp -n=kube-system "${podname}":/opt/microsoft/otelcollector/collector-config-template.yml ./collector-config-template.yml; chmod 500 promconfigvalidator; done
    ```

    Next, validate the scrape config file using **promconfigvalidator**.

    ```bash
    ./promconfigvalidator --config "./prometheus-config" --otelTemplate "./collector-config-template.yml"
    ```

    You find similar output as following content if the validation passes.

    ```text
    prom-config-validator::Config file provided - ./prometheus-config
    prom-config-validator::Successfully generated otel config
    prom-config-validator::Loading configuration...
    prom-config-validator::Successfully loaded and validated prometheus config
    ```

    Next, deploy config file as configmap.

    ```bash
    kubectl create configmap ama-metrics-prometheus-config --from-file=prometheus-config -n kube-system
    ```

    This command creates a configmap named `ama-metrics-prometheus-config` in `kube-system` namespace. The Azure Monitor metrics replica pod restarts in 30-60 secs to apply the new config.

> [!NOTE]
> If you run into problems configuring Promethues scrape, see tips in [Troubleshooting](/azure/azure-monitor/containers/prometheus-metrics-scrape-validate#troubleshooting) to resolve.

---

## Query metrics in Azure Monitor Workspace

Now, you're able to query metrics in Azure Monitor Workspace with steps:

1. Open the azure monitor account.
    - If you use Horizontal Autoscaling feature of Marketplace Offer, the monitor account locates in the resource group that created by [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
    - If you enable Horizontal Autoscaling manually, the monitor account locates in the resource group that created by [Install AKS Promethues metrics addon](#install-aks-promethues-metrics-addon).

1. Select **Managed Prometheus** -> **Prometheus explorer**. 
1. Input `webapp_config_open_sessions_current_count` to query the current account of open sessions, as the screenshot shows.

    :::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/promethues-explorer.png" alt-text="Screenshot of the Azure portal showing the Promethues explorer." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/promethues-explorer.png":::

## Enable KEDA

### [Use Horizontal Autoscaling feature of Marketplace Offer](#tab/offer)

This step is already performed for you when you use the offer.

### [Enable Horizontal Autoscaling manually](#tab/manual)

This article uses KEDA to drive the scaling of WLS container in Kubernetes based on Promethues metrics. Follow the steps to integrate KEDA with your AKS cluster. To learn more, see [Integrate KEDA with your Azure Kubernetes Service cluster](/azure/azure-monitor/containers/integrate-keda).

1. Set up a workload identity.

    First, check if workload-identity or oidc-issuer enabled in your AKS cluster with `az aks show`.

    ```azurecli
    az aks show --resource-group $AKS_CLUSTER_RG_NAME --name $AKS_CLUSTER_NAME --query oidcIssuerProfile
    az aks show --resource-group $AKS_CLUSTER_RG_NAME --name $AKS_CLUSTER_NAME --query securityProfile.workloadIdentity
    ```

    If they are not set, enable workload identity and oidc-issuer.

    ```azurecli
    az aks update -g $AKS_CLUSTER_RG_NAME -n $AKS_CLUSTER_NAME --enable-workload-identity --enable-oidc-issuer
    ```

    Next, create a user assigned identity for KEDA. This identity is used by KEDA to authenticate with Azure Monitor.

    ```azurecli
    KEDA_IDENTITY_NAME="uami4keda20140315"

    az identity create --name $KEDA_IDENTITY_NAME --resource-group $AKS_CLUSTER_RG_NAME -l ${LOCATION}
    ```

    Next, assign the Monitoring Data Reader role to the identity for your Azure Monitor workspace.

    ```azurecli
    KEDA_UAMI_CLIENT_ID="$(az identity show \
        --resource-group $AKS_CLUSTER_RG_NAME \
        --name $KEDA_IDENTITY_NAME \
        --query 'clientId' -otsv)"

    az role assignment create \
        --assignee $KEDA_UAMI_CLIENT_ID \
        --role "Monitoring Data Reader" \
        --scope ${AMA_ID}
    ```

    Next, create the KEDA namespace and a Kubernetes service account. This service account is used by KEDA to authenticate with Azure.

    ```bash
    KEDA_NAMESPACE="keda"
    KEDA_SA_NAME="keda-operator"


    kubectl create namespace ${KEDA_NAMESPACE}

    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: $KEDA_UAMI_CLIENT_ID
      name: $KEDA_SA_NAME
      namespace: $KEDA_NAMESPACE
    EOF
    ```

    Next, establish a federated credential between the service account and the user assigned identity.

    ```azurecli
    FEDERATED_IDENTITY_CREDENTIAL_NAME="kedafederatedcredential20240315"
    AKS_OIDC_ISSUER="$(az aks show -n $AKS_CLUSTER_NAME -g $AKS_CLUSTER_RG_NAME --query "oidcIssuerProfile.issuerUrl" -otsv)"

    az identity federated-credential create \
        --name $FEDERATED_IDENTITY_CREDENTIAL_NAME \
        --identity-name $KEDA_IDENTITY_NAME \
        --resource-group $AKS_CLUSTER_RG_NAME \
        --issuer $AKS_OIDC_ISSUER \
        --subject system:serviceaccount:$KEDA_NAMESPACE:$KEDA_SA_NAME \
        --audience api://AzureADTokenExchange
    ```

1. Deploy KEDA.

    This article uses Helm charts to deploy KEDA. For more information, see [Deploying KEDA](https://keda.sh/docs/2.10/deploy/).

    ```bash
    helm repo add kedacore https://kedacore.github.io/charts
    helm repo update    
    ```

    Obtain tenant id.

    ```azurecli
    TENANT_ID="$(az identity show --resource-group $AKS_CLUSTER_RG_NAME --name $KEDA_IDENTITY_NAME --query 'tenantId' -otsv)"
    ```

    ```bash
    helm install keda kedacore/keda --namespace keda \
        --set serviceAccount.create=false \
        --set serviceAccount.name=keda-operator \
        --set podIdentity.azureWorkload.enabled=true \
        --set podIdentity.azureWorkload.clientId=$KEDA_UAMI_CLIENT_ID \
        --set podIdentity.azureWorkload.tenantId=$TENANT_ID
    ```

    Check KEDA deployment with `kubectl get pods -n ${KEDA_NAMESPACE} -w`. The final status should look like as following output.

    ```text
    $ kubectl get pods -n ${KEDA_NAMESPACE}
    NAME                                              READY   STATUS    RESTARTS      AGE
    keda-admission-webhooks-f7745ccd8-lwvw7           1/1     Running   0             69s
    keda-operator-74b9997b49-jrc94                    1/1     Running   1 (64s ago)   69s
    keda-operator-metrics-apiserver-6c984644d-95svb   1/1     Running   0             69s
    ```
---

## Create KEDA scaler

Scalers define how and when KEDA should scale a deployment. This article uses [Prometheus scaler](https://keda.sh/docs/2.10/scalers/prometheus/) to retrieve Prometheus metrics from Azure Monitor Workspace. 

This article sums `openSessionsCurrentCount` of the sample application `testwebapp` as trigger query. When the total account of  `openSessionsCurrentCount` is more than `10`, scale up the WLS cluster until it reaches the maximum size. Otherwise, scale down the WLS cluster until it reaches its minimum size. The important parameters are set as following:

| Parameter Name | Value |
|--|--|
| `serverAddress` |  The Query endpoint of your Azure Monitor workspace. |
| `metricName` | `webapp_config_open_sessions_current_count` |
| `query` | `sum(webapp_config_open_sessions_current_count{app="testwebapp"}) ` |
| `threshold` | `10` |
| `minReplicaCount` | `1` |
| `maxReplicaCount` | `5`. The default value is `5`. If you modified the maximum cluster size during offer deployment, replace with your maximum cluster size. |

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

1. Modify the metric name and query.

    ```yaml
    metricName: webapp_config_open_sessions_current_count
    query: sum(webapp_config_open_sessions_current_count{app="testwebapp"})
    ```
1. Create the KEDA scaler using *scaler.yaml*

   ```yaml
   kubectl apply -f scaler.yaml
   ```


### [Enable Horizontal Autoscaling manually](#tab/manual)

Create the scaler configuration with the following command.

First, obtain query endpoint of the Azure Monitor workspace.

```azurecli
SERVER_ADDRESS=$(az monitor account show -n ${AMA_NAME} -g ${AMA_RG_NAME} --query metrics.prometheusQueryEndpoint -otsv)
```

Obtain WLS cluster name.

```bash
WLS_CLUSTER_NAME=$(kubectl get cluster -n ${WLS_NAMESPACE} -o json | jq -r '.items[0].metadata.name')
```

Create scaler configuration.

```bash
cat <<EOF >scaler.yaml
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata:
  name: azure-managed-prometheus-trigger-auth
  namespace: ${WLS_NAMESPACE}
spec:
  podIdentity:
    provider: azure-workload
    identityId: ${KEDA_UAMI_CLIENT_ID}
---
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: azure-managed-prometheus-scaler
  namespace: ${WLS_NAMESPACE}
spec:
  scaleTargetRef:
    apiVersion: weblogic.oracle/v1
    kind: Cluster
    name: ${WLS_CLUSTER_NAME}
  minReplicaCount: 1
  maxReplicaCount: 5
  triggers:
  - type: prometheus
    metadata:
      serverAddress: ${SERVER_ADDRESS}
      metricName: webapp_config_open_sessions_current_count
      query: sum(webapp_config_open_sessions_current_count{app="testwebapp"})
      threshold: '10'
      activationThreshold: '1'
    authenticationRef:
      name: azure-managed-prometheus-trigger-auth
EOF
```

---

Create the KEDA scaler using *scaler.yaml*

```bash
kubectl apply -f scaler.yaml
```

It takes several minutes for KEDA to retrieve metrics from Azure Monitor Workspace. Once the scaler is ready to work, you find the scaler status with `kubectl get hpa -n <wls-namespace> -w`.

The output looks similar to the following content.

```text
$ kubectl get hpa -n sample-domain1-ns -w
NAME                                       REFERENCE                          TARGETS      MINPODS   MAXPODS   REPLICAS   AGE
keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)   1         5         2          2m57s
```

## Test autoscaling

Now, you are ready to observe the scaling up and scaling down capability.

First, obtain the application URL.

    1. Open Azure portal and go to the resource group that was provisioned in [Deploy WLS on AKS](#deploy-wls-on-aks-using-azure-marketplace-offer).
    1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.
    1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, whoes name starts with **oracle.20210620-wls-on-aks**.
    1. The **clusterExternalUrl** value is the fully qualified, public Internet visible link to the sample app deployed in WLS on this AKS cluster. Select the copy icon next to the field value to copy the link to your clipboard. 
    1. The URL to access `testwebapp.war` is `${clusterExternalUrl}testwebapp`. For example, `http://wlsgw202403-wlsaks0314-domain1.eastus.cloudapp.azure.com/testwebapp/`.

Next, run `curl` command to access the application and cause new sessions. The following example open 23 new sessions. The sessions will be expired after 150s.

    Replace `APP_URL` with yours.

    ```bash
    COUNTER=0
    MAXCURL=22
    APP_URL="http://wlsgw202403-wlsaks0314-domain1.eastus.cloudapp.azure.com/testwebapp/"

    while [ $COUNTER -lt $MAXCURL ]; do curl ${APP_URL}; let COUNTER=COUNTER+1; sleep 1;done
    ```

Then, observe the scaler with `kubectl get hpa -n <wls-namespace> -w` and WLS pods with `kubectl get pod -n <wls-namespace> -w`.

    The output looks similar to the following content.

    ```text
    $ kubectl get hpa -n sample-domain1-ns -w
    NAME                                       REFERENCE                          TARGETS      MINPODS   MAXPODS   REPLICAS   AGE
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)   1         5         1          24m
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)   1         5         1          24m
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   10/10 (avg)   1         5         1          26m
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   23/10 (avg)   1         5         1          26m
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   7667m/10 (avg)   1         5         3          27m
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   667m/10 (avg)    1         5         3          29m
    keda-hpa-azure-managed-prometheus-scaler   Cluster/sample-domain1-cluster-1   0/10 (avg)       1         5         3          30m
    ```

    ```text
    $ kubectl get pod -n sample-domain1-ns -w
    NAME                             READY   STATUS    RESTARTS   AGE
    sample-domain1-admin-server      2/2     Running   0          28h
    sample-domain1-managed-server1   2/2     Running   0          28h
    sample-domain1-managed-server1   2/2     Running   0          28h
    sample-domain1-managed-server2   0/2     Pending   0          0s
    sample-domain1-managed-server2   0/2     Pending   0          0s
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

    The graph in Azure Monitor Workspace looks similar to the screenshot.

    :::image type="content" source="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wls-autoscaling-graph.png" alt-text="Screenshot of the Azure portal showing the Promethues explorer graph." lightbox="media/migrate-weblogic-to-aks-with-keda-scaler-based-on-promethues-metrics/wls-autoscaling-graph.png":::

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az-group-delete) command. The following command removes the resource group, container service, container registry, and all related resources:

```azurecli
az group delete --name <wls-resource-group-name> --yes --no-wait
az group delete --name <ama-resource-group-name> --yes --no-wait
```

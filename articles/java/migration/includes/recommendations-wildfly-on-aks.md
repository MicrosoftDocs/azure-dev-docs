---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Recommendations

* Consider adding a DNS name to the IP address allocated to your ingress controller or application load balancer. For more information, see [Create an ingress controller with a static public IP address in AKS](/azure/aks/ingress-static-ip).

* Consider adding [HELM charts](https://helm.sh/docs/topics/charts/) for your application. A helm chart allows you to parameterize your application deployment for use and customization by a more diverse set of customers.

* Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider automating deployments and testing with Azure Pipelines. For more information, see [Build and deploy to AKS](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

* Enable Azure Monitoring for the cluster. For more information, see [Enable monitoring of AKS cluster already deployed](/azure/azure-monitor/insights/container-insights-enable-existing-clusters). This allows Azure monitor to collect container logs, track utilization, and so on.

* Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure Prometheus Metrics scraping in Azure Monitor instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions. For more information, see [Configure scraping of Prometheus metrics with Azure Monitor for containers](/azure/azure-monitor/insights/container-insights-prometheus-integration).

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a multi-region deployment architecture. For more information, see [Best practices for business continuity and disaster recovery in AKS](/azure/aks/operator-best-practices-multi-region).

* Review the [Kubernetes version support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep updating your AKS cluster to ensure that it's always running a supported version. For more information, see [Upgrade an AKS cluster](/azure/aks/upgrade-cluster).

* Have all team members responsible for cluster administration and application development review the pertinent AKS best practices. For more information, see [Cluster operator and developer best practices to build and manage applications on AKS](/azure/aks/best-practices).

* Make sure your deployment file specifies how rolling updates are done. For more information, see [Rolling Update Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment) in the Kubernetes documentation.

* Set up auto scaling to deal with peak time loads. For more information, see [Automatically scale a cluster to meet application demands on AKS](/azure/aks/cluster-autoscaler).

* Consider monitoring the code cache size and adding the JVM parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` in the Dockerfile to further optimize performance. For more information, see [Codecache Tuning](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) in the Oracle documentation.

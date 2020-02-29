---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Recommendations

1. Consider [adding a DNS name](/azure/aks/ingress-static-ip#configure-a-dns-name) to the IP address allocated to your ingress controller or application load balancer.

1. Consider [adding HELM charts for your application](https://helm.sh/docs/topics/charts/). A helm chart allows you to parameterize your application deployment for use and customization by a more diverse set of customers.

1. Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider automating deployments and testing with Azure Pipelines. For more information, see [Build and deploy to Azure Kubernetes Service](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

1. Enable Azure Monitoring for the cluster. For more information, see [Enable monitoring of Azure Kubernetes Service (AKS) cluster already deployed](/azure/azure-monitor/insights/container-insights-enable-existing-clusters). This allows Azure monitor to collect container logs, track utilization, and so on.

1. Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure Prometheus Metrics scraping in Azure Monitor instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions. For more information, see [Configure scraping of Prometheus metrics with Azure Monitor for containers](/azure/azure-monitor/insights/container-insights-prometheus-integration).

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/aks/operator-best-practices-multi-region).

1. Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

1. Have all team members responsible for cluster administration and application development review the pertinent [AKS best practices](/azure/aks/best-practices).

1. Make sure your deployment file specifies how rolling updates are done. See [Rolling Update Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment) for more information.

1. Set up auto scaling to deal with peak time loads. For more information, see [Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)](/azure/aks/cluster-autoscaler).

1. Consider [monitoring the code cache size](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) and adding the JVM parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` in the Dockerfile to further optimize performance.

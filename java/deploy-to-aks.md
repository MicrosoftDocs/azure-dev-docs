---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Deploy to AKS

[Create and apply your Kubernetes YAML file(s)](/azure/aks/kubernetes-walkthrough#run-the-application). If creating an external load balancer (whether to your application or to an ingress controller), be sure to provide the IP Address provisioned in the previous section as the `LoadBalancerIP`.

Include [externalized parameters as environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/). Don't include secrets (such as passwords, API keys, and JDBC connection strings). These are covered in the following section.

Be sure to include memory and CPU settings when creating your deployment YAML so your containers are properly sized.

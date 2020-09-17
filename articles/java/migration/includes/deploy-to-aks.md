---
author: mnriem
ms.author: manriem
ms.date: 2/28/2020
---

### Deploy to AKS

Create and apply your Kubernetes YAML file(s). For more information, see [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](/azure/aks/kubernetes-walkthrough#run-the-application). If you're creating an external load balancer (whether for your application or for an ingress controller), be sure to provide the IP address provisioned in the previous section as the `LoadBalancerIP`.

Include externalized parameters as environment variables. For more information, see [Define Environment Variables for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/). Don't include secrets (such as passwords, API keys, and JDBC connection strings). These are covered in the following section.

Be sure to include memory and CPU settings when creating your deployment YAML so your containers are properly sized.

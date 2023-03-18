---
title: 'Quickstart: Create a Kubernetes cluster with Azure Kubernetes Service (AKS) using Terraform'
description: Learn how to create a Kubernetes Cluster with Azure Kubernetes Service and Terraform.
keywords: azure devops terraform aks kubernetes
ms.topic: quickstart
ms.date: 03/18/2023
ms.custom: devx-track-terraform
---

# Quickstart: Create a Kubernetes cluster with Azure Kubernetes Service using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

[Azure Kubernetes Service (AKS)](/azure/aks/) manages your hosted Kubernetes environment. AKS allows you to deploy and manage containerized applications without container orchestration expertise. AKS also enables you to do many common maintenance operations without taking your app offline. These operations include provisioning, upgrading, and scaling resources on demand.

In this article, you learn how to:

> [!div class="checklist"]
> * Use HCL (HashiCorp Language) to define a Kubernetes cluster
> * Use Terraform and AKS to create a Kubernetes cluster
> * Use the kubectl tool to test the availability of a Kubernetes cluster

> [!NOTE]
> The example code in this article is located in the [Microsoft Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-k8s-cluster-with-tf-and-aks).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Azure service principal:** If you don't have a service principal, [create a service principal](authenticate-to-azure.md#create-a-service-principal). Make note of the `appId`, `display_name`, `password`, and `tenant`.

- **SSH key pair:** Use one of the following articles:

    - [Portal](/azure/virtual-machines/ssh-keys-portal#generate-new-keys)
    - [Windows](/azure/virtual-machines/linux/ssh-from-windows#create-an-ssh-key-pair)
    - [Linux/MacOS](/azure/virtual-machines/linux/mac-create-ssh-keys#create-an-ssh-key-pair)

- **Kubernetes command-line tool (kubectl):** [Download kubectl](https://kubernetes.io/releases/download/).

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/outputs.tf)]

1. Create a file named `terraform.tfvars` and insert the following code.

    [!code-terraform[master](~/../terraform_samples/quickstart/201-k8s-cluster-with-tf-and-aks/terraform.tfvars)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

1. Get the resource group name.

    ```console
    echo "$(terraform output resource_group_name)"
    ```

1. Browse to the [Azure portal](https://portal.azure.com).

1. Under **Azure services**, select **Resource groups** and locate your new resource group to see the following resources created in this demo:

    - **Solution:** By default, the demo names this solution **ContainerInsights**. The portal will show the solution's workspace name in parenthesis.
    - **Kubernetes service:** By default, the demo names this service **k8stest**. (A Managed Kubernetes Cluster is also known as an AKS / Azure Kubernetes Service.)
    - **Log Analytics Workspace:** By default, the demo names this workspace with a prefix of **TestLogAnalyticsWorkspaceName-** followed by a random number.

1. Get the Kubernetes configuration from the Terraform state and store it in a file that kubectl can read.

    ```console
    echo "$(terraform output kube_config)" > ./azurek8s
    ```

1. Verify the previous command didn't add an ASCII EOT character.

    ```console
    cat ./azurek8s
    ```

   **Key points:**

    - If you see `<< EOT` at the beginning and `EOT` at the end, remove these characters from the file. Otherwise, you could receive the following error message: `error: error loading config file "./azurek8s": yaml: line 2: mapping values are not allowed in this context`

1. Set an environment variable so that kubectl picks up the correct config.

    ```console
    export KUBECONFIG=./azurek8s
    ```

1. Verify the health of the cluster.

    ```console
    kubectl get nodes
    ```

    ![The kubectl tool allows you to verify the health of your Kubernetes cluster](./media/create-k8s-cluster-with-tf-and-aks/kubectl-get-nodes.png)

**Key points:**

- When the AKS cluster was created, monitoring was enabled to capture health metrics for both the cluster nodes and pods. These health metrics are available in the Azure portal. For more information on container health monitoring, see [Monitor Azure Kubernetes Service health](/azure/azure-monitor/insights/container-insights-overview).
- Several key values were output when you applied the Terraform execution plan. For example, the host address, AKS cluster user name, and AKS cluster password are output.
- To view all of the output values, run `terraform output`.
- To view a specific output value, run `echo "$(terraform output <output_value_name>)"`.

## Clean up resources

### Delete AKS resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

### Delete service principal

> [!CAUTION]
> Delete the service principal you used in this demo only if you're not using it for anything else.

1. Run [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) to get the object ID of the service principal.

    ```azurecli
    az ad sp list --display-name "<display_name>" --query "[].{\"Object ID\":id}" --output table

1. Run [az ad sp delete](/cli/azure/ad/sp#az-ad-sp-delete) to delete the service principal.

    ```azurecli
    az ad sp delete --id <service_principal_object_id>
    ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)

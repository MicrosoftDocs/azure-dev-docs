---
title: Create an Application Gateway ingress controller in Azure Kubernetes Service
description: Learn how to create a Kubernetes Cluster with Azure Kubernetes Service with Application Gateway as ingress controller.
keywords: azure devops terraform application gateway ingress aks kubernetes
ms.topic: how-to
ms.date: 08/29/2021
ms.custom: devx-track-terraform, devx-track-azurecli
---

# Create an Application Gateway ingress controller in Azure Kubernetes Service

[Azure Kubernetes Service (AKS)](/azure/aks/) manages your hosted Kubernetes environment. AKS makes it quick and easy to deploy and manage containerized applications without container orchestration expertise. AKS also eliminates the burden of taking applications offline for operational and maintenance tasks. Using AKS, these tasks - including provisioning, upgrading and scaling resources - can be accomplished on-demand.

An ingress controller provides various features for Kubernetes services. These features include reverse proxy, configurable traffic routing, and TLS termination. Kubernetes ingress resources are used to configure the ingress rules for individual Kubernetes services. Using an ingress controller and ingress rules, a single IP address can route traffic to multiple services in a Kubernetes cluster. All this functionality is provided by Azure [Application Gateway](/azure/Application-Gateway/), making it an ideal Ingress controller for Kubernetes on Azure.

In this article, you learn how:
> [!div class="checklist"]

> * Create a [Kubernetes](https://www.redhat.com/en/topics/containers/what-is-kubernetes) cluster using AKS with Application Gateway as Ingress Controller
> * Define a Kubernetes cluster
> * Create Application Gateway resource
> * Create a Kubernetes cluster
> * Test the availability of a Kubernetes cluster

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Azure service principal**: If you don't have a service principal, [create a service principal](authenticate-to-azure.md#create-a-service-principal). Make note of the values for the `appId`, `displayName`, `password`, and `tenant`.

- **Service principal object ID**: Run the following command to get the object ID of the service principal: `az ad sp list --display-name <displayName>`

## 2. Configure Azure storage to store Terraform state

Terraform tracks state locally via the `terraform.tfstate` file. This pattern works well in a single-person environment. However, in a more practical multi-person environment, you need to track state on the server using [Azure storage](/azure/storage/). In this section, you learn to retrieve the necessary storage account information and create a storage container. The Terraform state information is then stored in that container.

1. Browse to the [Azure portal](https://portal.azure.com).

1. Under **Azure services**, select **Storage accounts**. (If the **Storage accounts** option isn't visible on the main page, select **More services** to locate the option.)

1. On the **Storage accounts** page, select the name of the storage account into which Terraform is to store state. For example, you can use the storage account created when you opened Cloud Shell the first time. The storage account name created by Cloud Shell typically starts with `cs` followed by a random string of numbers and letters.

1. Note the selected storage account name.

1. On the storage account page, select **Access keys**.

    ![Storage account menu](./media/terraform-k8s-cluster-appgw-with-tf-aks/storage-account.png)

1. Note the **key1** **key** value. (Selecting the icon to the right of the key copies the value to the clipboard.)

    ![Storage account access keys](./media/terraform-k8s-cluster-appgw-with-tf-aks/storage-account-access-key.png)

1. Create a container in your Azure storage account. Replace the placeholders with the appropriate values for your Azure storage account.

    ```azurecli
    az storage container create -n tfstate --account-name <storage_account_name> --account-key <storage_account_key>
    ```

## 3. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/main.tf)]

1. Create a file named `variables.tf` to contain the project variables and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/variables.tf)]

1. Create a file named `resources.tf` and insert the following code.

    [!code-terraform[master](../../terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/resources.tf)]

    **Key points:**

    - The code in the `resources.tf` file sets the name of the cluster, location, and the resource_group_name.
    - The `dns_prefix` value - that forms part of the fully qualified domain name (FQDN) used to access the cluster - is set.
    - The `linux_profile` record allows you to configure the settings that enable signing into the worker nodes using SSH.
    - With AKS, you pay only for the worker nodes.
    - The `agent_pool_profile` record configures the details for these worker nodes.
    - The `agent_pool_profile record` includes the number of worker nodes to create and the type of worker nodes.
    - If you need to scale up or scale down the cluster in the future, modify the `count` value in `agent_pool_profile record` record.

1. Create a file named `output.tf` and insert the following code.

    [!code-terraform[master](../../terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/output.tf)]

    **Key points:**

    - [Terraform outputs](https://www.terraform.io/docs/configuration/outputs.html) allow you to define values that are highlighted to the user when Terraform applies a plan.
    - These values can be queried using the `terraform output` command. 
    - In this section, you create an output file that allows access to the cluster with [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/).

1. Create a file named `terraform.tfvars` and insert the following code.

    [!code-terraform[master](../../terraform_samples/quickstart/201-k8s-cluster-with-aks-applicationgateway-ingress/terraform.tfvars)]

    **Key points:**

    - Run `az account list-locations` to get the location value of your environment

## 4. Test the Kubernetes cluster

The Kubernetes tools can be used to verify the newly created cluster.

1. Run [az aks get-credentials](/cli/azure/aks#az_aks_get_credentials) to get the Kubernetes configuration and access credentials from Azure.

    ```azcli
    az aks get-credentials --name <aks_cluster_name>  --resource-group <resource_group_name>
    ```

1. Verify the health of the cluster.

    ```bash
    kubectl get nodes
    ```

    **Key points:**

    - The details of your worker nodes are displayed with a status of **Ready**.

    ![The kubectl tool allows you to verify the health of your Kubernetes cluster](./media/terraform-k8s-cluster-appgw-with-tf-aks/kubectl-get-nodes.png)

## 5. Install Azure AD Pod Identity

Azure Active Directory Pod Identity provides token-based access to [Azure Resource Manager](/azure/azure-resource-manager/resource-group-overview).

[Azure AD Pod Identity](https://github.com/Azure/aad-pod-identity) adds the following components to your Kubernetes cluster:

  - Kubernetes [CRDs](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/): `AzureIdentity`, `AzureAssignedIdentity`, `AzureIdentityBinding`
  - [Managed Identity Controller (MIC)](https://github.com/Azure/aad-pod-identity#managed-identity-controllermic) component
  - [Node Managed Identity (NMI)](https://github.com/Azure/aad-pod-identity#node-managed-identitynmi) component

If RBAC is **enabled**, run the following command to install Azure AD Pod Identity to your cluster:

```cmd
kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml
```

If RBAC is **disabled**, run the following command to install Azure AD Pod Identity to your cluster:

```cmd
kubectl create -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment.yaml
```

## 6. Install Helm

The code in this section uses [Helm](/azure/aks/kubernetes-helm) - Kubernetes package manager - to install the `application-gateway-kubernetes-ingress` package:

Run the follow helm commands to add the AGIC Helm repository:

```cmd
helm repo add application-gateway-kubernetes-ingress https://appgwingress.blob.core.windows.net/ingress-azure-helm-package/
helm repo update
```

## 7. Install Ingress Controller Helm Chart

1. Download `helm-config.yaml` to configure AGIC:

    ```bash
    wget https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/sample-helm-config.yaml -O helm-config.yaml
    ```

1. Edit the `helm-config.yaml` and enter appropriate values for `appgw` and `armAuth` sections.

    ```bash
    code helm-config.yaml
    ```

    The values are described as follows:

    - `verbosityLevel`: Sets the verbosity level of the AGIC logging infrastructure. See [Logging Levels](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/463a87213bbc3106af6fce0f4023477216d2ad78/docs/troubleshooting.md#logging-levels) for possible values.
    - `appgw.subscriptionId`: The Azure Subscription ID for the App Gateway. Example: `a123b234-a3b4-557d-b2df-a0bc12de1234`
    - `appgw.resourceGroup`: Name of the Azure Resource Group in which App Gateway was created. 
    - `appgw.name`: Name of the Application Gateway. Example: `applicationgateway1`.
    - `appgw.shared`: This boolean flag should be defaulted to `false`. Set to `true` should you need a [Shared App Gateway](https://github.com/Azure/application-gateway-kubernetes-ingress/blob/072626cb4e37f7b7a1b0c4578c38d1eadc3e8701/docs/setup/install-existing.md#multi-cluster--shared-app-gateway).
    - `kubernetes.watchNamespace`: Specify the name space, which AGIC should watch. The namespace can be a single string value, or a comma-separated list of namespaces. Leaving this variable commented out, or setting it to blank or empty string results in Ingress Controller observing all accessible namespaces.
    - `armAuth.type`: A value of either `aadPodIdentity` or `servicePrincipal`.
    - `armAuth.identityResourceID`: Resource ID of the managed identity.
    - `armAuth.identityClientId`: The Client ID of the Identity.
    - `armAuth.secretJSON`: Only needed when Service Principal Secret type is chosen (when `armAuth.type` has been set to `servicePrincipal`).

    **Key points:**

    - The `identityResourceID`  value is created in the terraform script and can be found by running: `echo "$(terraform output identity_resource_id)"`.
    - The `identityClientID` value is created in the terraform script and can be found by running: `echo "$(terraform output identity_client_id)"`.
    - The `<resource-group>` value is the resource group of your App Gateway.
    - The `<identity-name>` value is the name of the created identity.
    - All identities for a given subscription can be listed using: `az identity list`.

1. Install the Application Gateway ingress controller package:

    ```bash
    helm install -f helm-config.yaml application-gateway-kubernetes-ingress/ingress-azure --generate-name
    ```

### 8. Install a sample app

Once you have the App Gateway, AKS, and AGIC installed, install a sample app.

1. Use the curl command to download the YAML file:

    ```cmd
    curl https://raw.githubusercontent.com/Azure/application-gateway-kubernetes-ingress/master/docs/examples/aspnetapp.yaml -o aspnetapp.yaml
    ```

2. Apply the YAML file:

    ```cmd
    kubectl apply -f aspnetapp.yaml
    ```

## 9. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Application Gateway Ingress Controller](https://azure.github.io/application-gateway-kubernetes-ingress/)

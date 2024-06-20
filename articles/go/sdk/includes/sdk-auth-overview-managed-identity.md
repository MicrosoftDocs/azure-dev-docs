---
ms.topic: include
ms.date: 06/20/2024
---
Apps hosted in Azure should use a *managed identity service principal*. Managed identities are designed to represent the identity of an app hosted in Azure and can only be used with Azure-hosted apps.<br>
<br>
For example, a Django web app hosted in Azure App Service would be assigned a managed identity. The managed identity assigned to the app would then be used to authenticate the app to other Azure services.<br>
<br>
Apps running in Azure Kubernetes Service (AKS) can use a Workload identity credential. This credential is based on a managed identity that has a trust relationship with an AKS service account.<br>
,<br>
> [!div class="nextstepaction"]
> [Learn about auth from Azure-hosted apps](../authentication-azure-hosted-apps.md)

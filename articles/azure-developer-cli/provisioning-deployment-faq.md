---
title: Provisioning and deployment errors
description: Discover answers to frequently asked questions about common errors and troubleshooting in the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 03/03/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Azure Developer CLI Errors FAQ

This article provides solutions for common errors you might encounter when using the Azure Developer CLI (`azd`).

### Authorization failed for role assignment write

**Error message:**
`The template deployment failed with error: 'Authorization failed for template resource '<guid>' of type 'Microsoft.Authorization/roleAssignments'. The client '##Email##' with object id '<guid>' does not have permission to perform action 'Microsoft.Authorization/roleAssignments/write' at scope '<resourceId>'.'`

**Cause:**
You don't have sufficient permissions to assign roles in the target Azure subscription or resource group. This is common when your user account has `Contributor` access but not `Owner` or `User Access Administrator` access. `Contributor` allows you to create resources but not to grant permissions (assign roles) to those resources.

**Resolution:**
Ensure your account has the **Owner** or **User Access Administrator** role on the subscription or resource group you're deploying to. If you can't be granted these roles, ask an administrator to perform the initial deployment or role assignments for you.
For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

### Role assignment already exists

**Error message:**
`The role assignment already exists.`

**Cause:**
This error occurs when the deployment attempts to create a role assignment that already exists on the resource. While Azure Resource Manager (ARM) deployments are idempotent, certain configurations or race conditions in templates can trigger this error when redeploying.

**Resolution:**
This error is often intermittent or benign.

1. **Retry the deployment:** Run `azd up` or `azd deploy` again.
2. **Check Bicep templates:** If you maintain the template, ensure role assignments use valid `name` properties (often strictly deterministic GUIDs) to ensure idempotency. Use the [guid()](/azure/azure-resource-manager/bicep/bicep-functions-string#guid) Bicep function to generate deterministic names.

### Tenant ID, principal ID, or scope not allowed to be updated

**Error message:**
`Tenant ID, application ID, principal ID, and scope are not allowed to be updated.`

**Cause:**
You're attempting to redeploy a role assignment with properties that differ from the existing assignment. Role assignments are immutable; you can't change the principal ID (the user/app receiving the role) or the scope of an existing assignment ID.

**Resolution:**
1. **Verify parameters:** Ensure you aren't accidentally passing a different principal ID (for example, switching between a user and a service principal) for the same role assignment resource.
2. **Clean up:** If you need to change the assignment, manually delete the conflicting role assignment in the [Azure portal](https://portal.azure.com) or via CLI using [az role assignment delete](/cli/azure/role/assignment#az-role-assignment-delete), then redeploy.

### Region capacity or SKU unavailable

**Error message:**
`The region 'eastus2' currently does not have enough resources available to provision services with the SKU 'standard'.` (or 'basic')

**Cause:**
The selected Azure region is temporarily out of capacity for the requested service SKU. This is currently common with AI services (like Azure OpenAI) in popular regions like `eastus2`.

**Resolution:**
1. **Change location:** Run `azd env set AZURE_LOCATION <new-region>` to switch to a region with better availability (for example, `swedencentral`, `westus3`, `francecentral`).
2. **Check availability:** Use the [Azure Products by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) page or run `az account list-locations` to check for regions where the service and SKU are available.

### TPM quota exceeded for AI models

**Error message:**
`This operation require <amount> new capacity in quota Tokens Per Minute (thousands) - <model> - GlobalStandard, which is bigger than the current available capacity <available>.`

**Cause:**
Your subscription has reached its quota limit for Tokens Per Minute (TPM) for the specified Azure OpenAI model in the target region.

**Resolution:**
1. **Request Quota:** Request a quota increase via the [Azure AI Studio](https://ai.azure.com/) or Azure portal. For more information, see [Manage Azure OpenAI Service quota](/azure/ai-services/openai/how-to/quota).
2. **Change Models/Region:** Switch to a region where you have unused quota or use a different model version that fits within your limits.

### If-Match precondition failed

**Error message:**
`The specified precondition 'If-Match = ""&lt;guid&gt;""' failed.`

**Cause:**
This issue typically indicates a concurrency conflict. Two processes might be trying to update the same resource simultaneously, or your local state is out of sync with the cloud resource (stale ETag).

**Resolution:**
Retry the operation. If the error persists:
1. Ensure no other deployments (CI/CD pipelines, other colleagues) are targeting the same environment simultaneously.
2. If using Bicep, verify that your template correctly defines dependencies (`dependsOn`) to prevent parallel modifications to the same resource.

### Cognitive Services account in state Accepted

**Error message:**
`Call to Microsoft.CognitiveServices/accounts failed. Error message: Account <resourceId> in state Accepted.`

**Cause:**
This error is a timing issue where a dependent resource tries to interact with the Cognitive Services (Azure AI) account before it's fully provisioned and active.
 You can also add a [command hook](/azure/developer/azure-developer-cli/azd-extensibility) (for example, `postprovision`) in your `azure.yaml` to pause or check for resource readiness before proceeding.

### Container app revision provision expired

**Error message:**
`Failed to provision revision for container app <appName>. Error details: Operation expired.`

**Cause:**
The Azure Container App failed to start within the default timeout period. Common reasons include:
*   The container image is too large and takes too long to pull.
*   The application crashes on startup.
*   The application takes too long to listen on the configured port.

**Resolution:**
1. **Check Logs:** View the container logs in the Azure portal (Log Stream) or using `azd monitor` to see if the app is crashing.
1. **Review Configuration:** Ensure the `targetPort` in your configuration matches the port your app listens on. For more troubleshooting steps, see [Troubleshooting Azure Container Apps](/azure/container-apps/troubleshooting)
1. **Check Logs:** View the container logs in the Azure portal (Log Stream) or using `azd monitor` to see if the app is crashing.
1. **Review Configuration:** Ensure the `targetPort` in your configuration matches the port your app listens on.
3. **Optimize Image:** Reduce the size of your container image to speed up pulling.

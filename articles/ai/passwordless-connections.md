---
title: Use passwordless connections with Azure OpenAI
description: Use passwordless connections for authentication and authorization to Azure OpenAI.
ms.topic: how-to
ms.date: 05/15/2024
ms.reviewer: scaddie
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-js, devx-track-python, passwordless-dotnet, passwordless-java, passwordless-js, passwordless-python, passwordless-go, build-2024-intelligent-apps
#customer intent: As a developer, I want to use passwordless connections so that I don't leak secrets.
---

# Use Azure OpenAI without keys 

Application requests to most Azure services must be authenticated with keys or [passwordless connections](https://aka.ms/delete-passwords). Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Passwordless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.

Passwordless connections are enabled with the following steps: 

* Configure your authentication.
* Set environment variables, as needed. 
* Use an Azure Identity library credential type to create an Azure OpenAI client object.

## Authentication

Authentication to Microsoft Entra ID is required to use the Azure client libraries.

Authentication differs based on the environment in which the app is running:

* [Local development](#authenticate-for-local-development)
* [Azure](#authenticate-for-azure-hosted-environments)

### Authenticate for local development

#### [.NET](#tab/csharp)

Select a tool for [authentication during local development](/dotnet/api/overview/azure/identity-readme#authenticate-the-client).

#### [Go](#tab/go)

Select a tool for [authentication during local development](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity#authenticating-during-local-development).

#### [Java](#tab/java)

Select a tool for [authentication during local development](/java/api/overview/azure/identity-readme#authenticate-the-client).

#### [JavaScript](#tab/javascript)

Select a tool for [authentication during local development](/javascript/api/overview/azure/identity-readme#authenticate-the-client-in-development-environment).

#### [Python](#tab/python)

Select a tool for [authentication during local development](/python/api/overview/azure/identity-readme#authenticate-during-local-development).

---

### Authenticate for Azure-hosted environments

#### [.NET](#tab/csharp)

Learn about how to manage the [DefaultAzureCredential](/dotnet/api/overview/azure/identity-readme#defaultazurecredential) for applications deployed to Azure.

#### [Go](#tab/go)

Learn about how to manage the [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#readme-defaultazurecredential) for applications deployed to Azure.

#### [Java](#tab/java)

Learn about how to manage the [DefaultAzureCredential](/java/api/overview/azure/identity-readme#defaultazurecredential) for applications deployed to Azure.

#### [JavaScript](#tab/javascript)

Learn about how to manage the [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential) for applications deployed to Azure.

#### [Python](#tab/python)

Learn about how to manage the [DefaultAzureCredential](/python/api/overview/azure/identity-readme#defaultazurecredential) for applications deployed to Azure.

---

## Configure roles for authorization

1. Find the [role](/azure/role-based-access-control/built-in-roles#ai--machine-learning) for your usage of Azure OpenAI. Depending on how you intend to set that role, you'll need either the name or ID. 

    |Role name|Role ID|
    |--|--|
    |For Azure CLI or Azure PowerShell, you can use role name. |For Bicep, you need the role ID.|

1. For many Azure OpenAI chat completion use cases, the following role and ID are suggested. 

    |Role name|Role ID|
    |--|--|
    |`Cognitive Services OpenAI User`|`5e0bd9bd-7b93-4f28-af87-19fc36ad61bd`|

1. Select an identity type to use.

    * **Personal identity**: This is your personal identity tied to your sign in to Azure.
    * **Managed identity**: This is an identity managed by and created for use on Azure. For [managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity), create a [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity). When you create the managed identity, you need the `Client ID`, also known as the `app ID`.  

1. To find your personal identity, use one of the following commands. Use the ID as the `<identity-id>` in the next step.

    ### [Azure CLI](#tab/azure-cli)

    For local development, to get your own identity ID, use the following command. You need to sign in with `az login` before using this command.

    ```azurecli
    az ad signed-in-user show \
        --query id -o tsv
    ```

    ### [Azure PowerShell](#tab/azure-powershell)


    For local development, to get your own identity ID, use the following command. You need to sign in with `Connect-AzAccount` before using this command.

    ```azurepowershell
    (Get-AzContext).Account.ExtendedProperties.HomeAccountId.Split('.')[0]
    ```

    ### [Bicep](#tab/bicep)

    When using [Bicep](/azure/azure-resource-manager/bicep/) deployed with [Azure Developer CLI](/azure/developer/azure-developer-cli), the identity of the person or service running the deployment is set to the `principalId` parameter. 

    The following `main.parameters.json` variable is set to the identity running the process. 

    ```json
    "principalId": {
        "value": "${AZURE_PRINCIPAL_ID}"
      },
    ```

    For use in Azure, specify a user-assigned managed identity as part of the Bicep deployment process. Create a user-assigned managed identity separate from the identity running the process.

    ```bicep
    resource userAssignedManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
      name: managedIdentityName
      location: location
    }
    ```

    ### [Azure portal](#tab/portal)

    Use the steps found here: [find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id) in the Azure portal.

    ---

1. Assign the role-based access control (RBAC) role to the identity for the resource group.  

    ### [Azure CLI](#tab/azure-cli)

    To grant your identity permissions to your resource through RBAC, assign a role using the Azure CLI command [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

    ```azurecli
    az role assignment create \
        --role "Cognitive Services OpenAI User" \
        --assignee "<identity-id>" \
        --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
    ```

    ### [Azure PowerShell](#tab/azure-powershell)

    To grant your application permissions to your Azure OpenAI resource through RBAC, assign a role using the Azure PowerShell cmdlet [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment).

    ```azurepowershell
    New-AzRoleAssignment -ObjectId "<identity-id>" -RoleDefinitionName "Cognitive Services OpenAI User" -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>"
    ```

    ### [Bicep](#tab/bicep)

    Use the following Azure OpenAI Bicep template to create the resource and set the authentication for the `identityId`. Bicep requires the role ID. The `name` shown in this Bicep snippet isn't the Azure role; it's specific to the Bicep deployment. 

    ```bicep
    // main.bicep
    param environment string = 'production'

    // USER ROLES
    module openAiRoleUser 'core/security/role.bicep' = {
        scope: openAiResourceGroup
        name: 'openai-role-user'
        params: {
            principalId: (environment == 'development') ? principalId : userAssignedManagedIdentity 
            principalType: (environment == 'development') ? 'User' : 'ServicePrincipal'
            roleDefinitionId: '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
        }
    }
    ```

    The following generic Bicep is called from the `main.bicep` to create any role. 

    ```bicep
    // core/security/role.bicep
    metadata description = 'Creates a role assignment for an identity.'
    param principalId string // passed in from main.bicep identityId

    @allowed([
        'Device'
        'ForeignGroup'
        'Group'
        'ServicePrincipal'
        'User'
    ])
    param principalType string = 'ServicePrincipal'
    param roleDefinitionId string

    resource role 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
        name: guid(subscription().id, resourceGroup().id, principalId, roleDefinitionId)
        properties: {
            principalId: principalId
            principalType: principalType
            roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)
        }
    }
    ```


    ### [Azure portal](#tab/portal)

    Use the steps found at [open the Add role assignment page](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page) in the Azure portal.
    
    ---
    
    Where applicable, replace `<identity-id>`, `<subscription-id>`, and `<resource-group-name>` with your actual values. 

## Configure environment variables

To connect to Azure OpenAI, your code needs to know your resource endpoint, and _may_ need additional environment variables. 

1. Create an environment variable for your Azure OpenAI endpoint. 

    * `AZURE_OPENAI_ENDPOINT`: This URL is the access point for your Azure OpenAI resource.
    
2. Create environment variables based on the location in which your app runs:

    | Location | Identity| Description|
    |--|--|--|
    |Local|Personal|For local runtimes with your **personal identity**, [sign in](#authenticate-for-local-development) to create your credential with a tool.|
    |Azure cloud|User-assigned managed identity|Create an `AZURE_CLIENT_ID` environment variable containing the client ID of the user-assigned managed identity to authenticate as.|

## Install Azure Identity client library


### [.NET](#tab/csharp)

Install the .NET [Azure Identity client library](https://www.nuget.org/packages/Azure.Identity):

```dotnetcli
dotnet add package Azure.Identity
```

### [Go](#tab/go)

Install the Go [Azure Identity client library](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azidentity):

```bash
go get -u github.com/Azure/azure-sdk-for-go/sdk/azidentity
```

### [Java](#tab/java)

Install the Java [Azure Identity client library](https://mvnrepository.com/artifact/com.azure/azure-identity) with the following POM file:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-identity</artifactId>
            <version>1.10.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### [JavaScript](#tab/javascript)

Install the JavaScript [Azure Identity client library](https://www.npmjs.com/package/@azure/identity):

```console
npm install --save @azure/identity
```

### [Python](#tab/python)

Install the Python [Azure Identity client library](https://pypi.org/project/azure-identity/):

```console
pip install azure-identity
```

---

## Use DefaultAzureCredential

The Azure Identity library's `DefaultAzureCredential` allows the customer to run the same code in the local development environment and in the Azure Cloud.

### [.NET](#tab/csharp)

For more information on `DefaultAzureCredential` for .NET, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme#defaultazurecredential).

```csharp
using Azure;
using Azure.AI.OpenAI;
using Azure.Identity;
using System;
using static System.Environment;

string endpoint = GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");

OpenAIClient client = new(new Uri(endpoint), new DefaultAzureCredential());
```

### [Go](#tab/go)

For more information on `DefaultAzureCredential` for Go, see [Azure Identity client library for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#readme-defaultazurecredential).


```go
import (
	"log"

	"github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)

func main() {
	dac, err := azidentity.NewDefaultAzureCredential(nil)

	if err != nil {
		log.Fatalf("ERROR: %s", err)
	}

	client, err := azopenai.NewClient(os.Getenv("AZURE_OPENAI_ENDPOINT"), dac, nil)

	if err != nil {
		log.Fatalf("ERROR: %s", err)
	}

	_ = client
}
```


### [Java](#tab/java)

For more information on `DefaultAzureCredential` for Java, see [Azure Identity client library for Java](/java/api/overview/azure/identity-readme#defaultazurecredential).

```java
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.ai.openai.OpenAIClient;
import com.azure.ai.openai.OpenAIClientBuilder;

String endpoint = System.getenv("AZURE_OPENAI_ENDPOINT");

DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();
OpenAIClient client = new OpenAIClientBuilder()
    .credential(credential)
    .endpoint(endpoint)
    .buildClient();
```

### [JavaScript](#tab/javascript)

For more information on `DefaultAzureCredential` for JavaScript, see [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme#defaultazurecredential).


```javascript
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import { AzureOpenAI } from "openai";

const credential = new DefaultAzureCredential();
const scope = "https://cognitiveservices.azure.com/.default";
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] || "<endpoint>";
const deployment = "Your Azure OpenAI deployment";
const apiVersion = "2024-04-01-preview";
const options = { azureADTokenProvider, deployment, apiVersion, endpoint }

const client = new AzureOpenAI(options);
```

### [Python](#tab/python)

For more information on `DefaultAzureCredential` for Python, see [Azure Identity client library for Python](/python/api/overview/azure/identity-readme#defaultazurecredential).

```python
import openai
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

openai_client = openai.AzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    azure_ad_token_provider=token_provider
)
```

---

## Additional resources

* [Passwordless connections developer guide](/azure/developer/intro/passwordless-overview)
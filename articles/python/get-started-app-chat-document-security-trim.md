---
title: "Get started with chat document security trimming"
description: "Secure your chat app documents with user authentication and document security trimming to ensure users receive answers based on their permissions."
ms.date: 05/23/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-js, devx-track-js-ai, devx-track-extended-azdevcli, build-2024-intelligent-apps
# CustomerIntent: 
---

# Get started with chat document security for Python

When you build a [chat application using the RAG pattern](get-started-app-chat-template.md) with your own data, make sure that each user receives an answer based on their permissions. Follow the process in this article to add document access control to your chat app. 

An **authorized user** should have access to answers contained within the documents of the chat app.

:::image type="content" source="media/get-started-app-chat-document-security-trim/chat-answer-with-authorized-access.png" alt-text="Screenshot of chat app with answer with required authentication access.":::

An **unauthorized user** shouldn't have access to answers from secured documents they don't have authorization to see.

:::image type="content" source="media/get-started-app-chat-document-security-trim/chat-answer-with-no-access.png" alt-text="Screenshot of chat app with answer indicating user doesn't have access to data.":::

> [!NOTE]
> This article uses one or more [AI app templates](../ai/intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Architectural overview

Without document security feature, the enterprise chat app has a simple architecture using Azure AI Search and Azure OpenAI. An answer is determined from queries to Azure AI Search where the documents are stored, in combination with a response from an Azure OpenAI GPT model. No user authentication is used in this simple flow.

:::image type="content" source="media/get-started-app-chat-document-security-trim/simple-rag-chat-architecture.png" alt-text="Architectural diagram showing an answer determined from queries to Azure AI Search where the documents are stored, in combination with a prompt response from Azure OpenAI.":::

To add security for the documents, you need to update the enterprise chat app: 

* Add client authentication to the chat app with Microsoft Entra.
* Add server-side logic to populate a search index which corresponds to the authenticated user's identity that should have access to each document.

:::image type="content" source="media/get-started-app-chat-document-security-trim/trimmed-rag-chat-architecture.png" alt-text="Architectural diagram showing a use authenticating with Microsoft Entra ID, then passing that authentication to Azure AI Search.":::

Azure AI Search doesn't provide _native_ document-level permissions and can't vary search results from within an index by user permissions. Instead, your application can use search filters to ensure a document is accessible to a specific user or by a specific group. Within your search index, each document should have a filterable field that stores user or group identity information.

:::image type="content" source="media/get-started-app-chat-document-security-trim/azure-ai-search-with-user-authorization.png" alt-text="Architectural diagram showing that to secure the documents in Azure AI Search, each document includes user authentication, which is returned in the result set.":::

Because the authorization isn't natively contained in Azure AI Search, you need to add a field to hold user or group information, then trim any documents which don't match the user. To implement this technique, you need to:

* Create a document access control field in your index dedicated to storing the details of users or groups with document access. 
* Populate the document's access control field with the relevant user or group details.
* Update this access control field whenever there are changes in user or group access permissions.
* If your index updates are scheduled with an indexer, changes are picked up on the next indexer run. If you don't use an indexer, you need to manually reindex.

In this article, the process of securing documents in Azure AI Search, is made possible with _example_ scripts which you as the search administrator would run. The scripts associate a single document with a single user identity. You can take these [scripts](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main/scripts) and apply your own security and productionizing requirements to scale to your needs.

## Prerequisites

A [development container](https://containers.dev/) environment is available with all [dependencies](https://github.com/azure-samples/azure-search-openai-demo?tab=readme-ov-file#azure-deployment) required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need the following prerequisites:

* Azure subscription.  [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true) 
* Azure account permissions - Your Azure Account must have 
    * Permission to [manage applications in Microsoft Entra ID](/azure/active-directory/roles/permissions-reference#cloud-application-administrator).
    * Microsoft.Authorization/roleAssignments/write permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
* Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.

You need more prerequisites depending on your preferred development environment.

#### [Codespaces (recommended)](#tab/github-codespaces)

* [GitHub account](https://github.com/login)

#### [Visual Studio Code](#tab/visual-studio-code)
* [Azure Developer CLI](/azure/developer/azure-developer-cli)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running
* [Visual Studio Code](https://code.visualstudio.com/)
* [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Begin now with a development environment that has all the dependencies installed to complete this article. 

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Start the process to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.
1. Right-click on the following button, and select _Open link in new windows_ in order to have both the development environment and the documentation available at the same time. 

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-search-openai-demo)

1. On the **Create codespace** page, review the codespace configuration settings and then select **Create new codespace**

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```

1. Complete the authentication process.

1. The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Create a new local directory on your computer for the project. 

    ```bash
    mkdir my-intelligent-app && cd my-intelligent-app
    ```

1. Open Visual Studio Code in that directory:

    ```bash
    code .
    ```

1. Open a new terminal in Visual Studio Code.
1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```bash
    azd init -t azure-search-openai-demo
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing. 
1. Sign in to Azure with the Azure Developer CLI.

    ```bash
    azd auth login
    ```
    Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.
1. The remaining exercises in this project take place in the context of this development container.

---

## Get required information with Azure CLI

Get your subscription ID and tenant ID with the following Azure CLI command. Copy the value to use as your `AZURE_TENANT_ID`.

```azurecli
az account list --query "[].{subscription_id:id, name:name, tenantId:tenantId}" -o table
```

If you get an error about your tenant's conditional access policy, you need a second tenant without a conditional access policy.

* Your first tenant, associated with your user account, is used for the `AZURE_TENANT_ID` environment variable.
* Your second tenant, without conditional access, is used for the `AZURE_AUTH_TENANT_ID` environment variable to access Microsoft Graph. For tenants with a conditional access policy, find the ID of a second tenant without a conditional access policy or [create a new tenant](/entra/fundamentals/create-new-tenant).

## Determine security configuration

The solution provides environment variables which work together to provide distinct security profiles. Use the table below to select a security profile and understand which environment variables should be set. 

<!-->
|Profile|Description| Settings|
|--|--|--|
|**Enterprise**: Required account + document filter|Each user of the site **must** login, the site does contain content which is public to all users. The document level security filter is applied to all requests.|AZURE_USE_AUTHENTCIATION<br>AZURE_ENABLE_GLOBAL_DOCUMENTS_ACCESS<br>AZURE_ENFORCE_ACCESS_CONTROL|
|**Mixed use**: Optional account + document filter|Each user of the site **may** login, the site does contain content which is public to all users.The document level security filter is applied to all requests.|AZURE_USE_AUTHENTCIATION<br>AZURE_ENABLE_GLOBAL_DOCUMENTS_ACCESS<br>AZURE_ENFORCE_ACCESS_CONTROL<br> AZURE_ENABLE_UNAUTHENTICATED_ACCESS|
|**Public**: Optional account + optional document filter |Each user of the site **may** login, the site does contain secure documents. The document security may be applied.|AZURE_USE_AUTHENTCIATION|
-->

:::row:::
   :::column:::
      **Profile**
   :::column-end:::
   :::column:::
      **Description**
   :::column-end:::
   :::column:::
      **Settings**
   :::column-end:::
:::row-end:::

:::row:::
   :::column:::
      **Enterprise**: Required account + document filter
   :::column-end:::
   :::column:::
      Each user of the site **must** login, the site does contain content which is public to all users. The document level security filter is applied to all requests.
   :::column-end:::
   :::column:::
      :::row:::
         :::column:::
            AZURE_USE_AUTHENTCIATION
         :::column-end:::
         :::column:::
            AZURE_ENABLE_GLOBAL_DOCUMENTS_ACCESS
         :::column-end:::
         :::column:::
            AZURE_ENFORCE_ACCESS_CONTROL
         :::column-end:::
      :::row-end:::
   :::column-end:::
:::row-end:::

:::row:::
   :::column:::
      **Mixed use**: Optional account + document filter
   :::column-end:::
   :::column:::
      Each user of the site **may** login, the site does contain content which is public to all users.The document level security filter is applied to all requests.
   :::column-end:::
   :::column:::
      :::row:::
         :::column:::
            AZURE_USE_AUTHENTCIATION
         :::column-end:::
         :::column:::
            AZURE_ENABLE_GLOBAL_DOCUMENTS_ACCESS
         :::column-end:::
         :::column:::
            AZURE_ENFORCE_ACCESS_CONTROL
         :::column-end:::
         :::column:::
            AZURE_ENABLE_UNAUTHENTICATED_ACCESS
         :::column-end:::
      :::row-end:::
   :::column-end:::
:::row-end:::

:::row:::
   :::column:::
      **Public**: Optional account + optional document filter
   :::column-end:::
   :::column:::
      Each user of the site **may** login, the site does contain secure documents. The document security may be applied.
   :::column-end:::
   :::column:::
      :::row:::
         :::column:::
            AZURE_USE_AUTHENTCIATION
         :::column-end:::
      :::row-end:::
   :::column-end:::
:::row-end:::
<!-->
:::row:::
   :::column span="":::
      Content...
   :::column-end:::
   :::column span="":::
      :::row:::
   :::column span="":::
      Content...
   :::column-end::
   :::column span="":::
      More content...
   :::column-end:::
   :::column span="":::
      More content...
   :::column-end:::
:::row-end:::
   :::column-end:::
   :::column span="":::
      More content...
   :::column-end:::
:::row-end:::
-->

## Set environment variables

1. Run the following commands to configure environment variables for the sample to use authentication.

    ```console
    azd env set AZURE_USE_AUTHENTICATION true
    azd env set AZURE_ENFORCE_ACCESS_CONTROL true
    azd env set AZURE_TENANT_ID <REPLACE-WITH-YOUR-TENANT-ID>
    ```

    |Parameter|Purpose|
    |--|--|
    |`AZURE_USE_AUTHENTICATION`|Enables user sign-in to the chat app. Enables `Use oid security filter` in the chat app **Developer settings**.|
    |`AZURE_ENFORCE_ACCESS_CONTROL`|Requires authentication for any document access. The **Developer settings** for oid and group security will be turned on and disabled so they can't be disabled from the UI.|
    |`AZURE_TENANT_ID`|The tenant which authorizes your user sign in.|


1. If you need to use `AZURE_AUTH_TENANT_ID` due to a conditional access policy on your user tenant, run the following command to configure the sample to use a second tenant for application hosting. 

    ```console
    azd env set AZURE_AUTH_TENANT_ID <REPLACE-WITH-YOUR-TENANT-ID>
    ```

    |Parameter|Purpose|
    |--|--|
    |`AZURE_AUTH_TENANT_ID`|If `AZURE_AUTH_TENANT_ID` is set, it's the tenant that hosts the app.|
     

## Deploy chat app to Azure

Deployment includes creating the Azure resources, uploading the documents, creating the Microsoft Entra identity apps (client & server), and turning on identity for the hosting resource. 

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```bash
    azd up
    ```

1. Use the following table to answer the AZD deployment prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name| Use a short name with identifying information such as your alias and app: `tjones-secure-chat`.|
    |Subscription|Select a subscription to create the resources in.|
    |Location for Azure resources|Select a location near you. |
    |Location for `documentIntelligentResourceGroupLocation`|Select a location near you.|
    |Location for `openAIResourceGroupLocation`|Select a location near you. |

    Wait 5 or 10 minutes after the app is deployed to allow the app to start up.
1. After the application has been successfully deployed, you see a URL displayed in the terminal.
1. Select that URL labeled `(✓) Done: Deploying service webapp` to open the chat application in a browser.

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/azd-deployment-output.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::

1. Agree to the app authentication pop-up. 
1. When the chat app is displayed, notice in the top right corner that your user is signed in. 
1. Open **Developer settings** and notice both these options are selected and greyed out (disabled for change).

    * **Use oid security filter**
    * **Use groups security filter**

1. Select the card with `What does a product manager do?`.
1. You get an answer like: `The provided sources do not contain specific information about the role of a Product Manager at Contoso Electronics.`

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/role-library-access-denied.png" alt-text="Screenshot of chat app in browser showing the answer can't be returned":::

## Open access to a document for a user

Turn on your permissions for the exact document so you _can_ get the answer. These require several pieces of information:

* Azure Storage
    * Account name
    * Container name
    * Blob/document URL for `role_library.pdf`
* User's ID in Microsoft Entra ID

Once this information is known, update the Azure AI Search index `oids` field for the `role_library.pdf` document. 

### Get the URL for a document in storage

1. In the `.azure` folder at the root of the project, find the environment directory, and open the `.env` file with that directory. 
1. Search for the `AZURE_STORAGE_ACCOUNT` entry and copy its value. 
1. Use the following Azure CLI commands to get the URL of the **role_library.pdf** blob in the **content** container.

    ```azurecli
    az storage blob url \
        --account-name <REPLACE_WITH_AZURE_STORAGE_ACCOUNT \
        --container-name 'content' \
        --name 'role_library.pdf' 
    ```
    
    |Parameter|Purpose|
    |--|--|
    |--account-name|Azure Storage account name|
    |--container-name|The container name in this sample is `content`|
    |--name|The blob name in this step is `role_library.pdf` |

1. Copy the blob URL to use later.

### Get your user ID

1. In the chap app, select **Developer settings**.
1. In the **ID Token claims** section, copy your `objectidentifier`. This is known in the next section as the `USER_OBJECT_ID`.

### Provide user access to a document in Azure Search

1. Use the following script to change the `oids` field in Azure AI Search for **role_library.pdf** so you have access to it.

    ```bash
    ./scripts/manageacl.sh \
        -v \
        --acl-type oids \
        --acl-action add \
        --acl <REPLACE_WITH_YOUR_USER_OBJECT_ID> \
        --url <REPLACE_WITH_YOUR_DOCUMENT_URL>
    ```
    
    |Parameter|Purpose|
    |--|--|
    |-v|Verbose output.|
    |--acl-type|Group or user (oids): `oids`|
    |--acl-action|**Add** to a Search index field. Other options include `remove`, `remove_all`, `list`. |
    |--acl|Group or user's `USER_OBJECT_ID`|
    |--url|The file's location in Azure storage, such as `https://MYSTORAGENAME.blob.core.windows.net/content/role_library.pdf`. Don't surround URL with quotes in the CLI command.|

1. The console output for this command looks like: 

    ```console.
    Loading azd .env file from current environment...
    Creating Python virtual environment "app/backend/.venv"...
    Installing dependencies from "requirements.txt" into virtual environment (in quiet mode)...
    Running manageacl.py. Arguments to script: -v --acl-type oids --acl-action add --acl 00000000-0000-0000-0000-000000000000 --url https://mystorage.blob.core.windows.net/content/role_library.pdf
    Found 58 search documents with storageUrl https://mystorage.blob.core.windows.net/content/role_library.pdf
    Adding acl 00000000-0000-0000-0000-000000000000 to 58 search documents
    ```

1. Optionally, use the following command to verify your permission is listed for the file in Azure AI Search.

    ```bash
    ./scripts/manageacl.sh \
        -v \
        --acl-type oids \
        --acl-action list \
        --acl <REPLACE_WITH_YOUR_USER_OBJECT_ID> \
        --url <REPLACE_WITH_YOUR_DOCUMENT_URL>
    ```
    
    |Parameter|Purpose|
    |--|--|
    |-v|Verbose output.
    |--acl-type|Group or user (oids): `oids`|
    |--acl-action|**List** a Search index field `oids`. Other options include `remove`, `remove_all`, `list`. |
    |--acl|Group or user's `USER_OBJECT_ID`|
    |--url|The file's location in Azure storage, such as `https://MYSTORAGENAME.blob.core.windows.net/content/role_library.pdf`. Don't surround URL with quotes in the CLI command.|

1. The console output for this command looks like: 

    ```console.
    Loading azd .env file from current environment...
    Creating Python virtual environment "app/backend/.venv"...
    Installing dependencies from "requirements.txt" into virtual environment (in quiet mode)...
    Running manageacl.py. Arguments to script: -v --acl-type oids --acl-action view --acl 00000000-0000-0000-0000-000000000000 --url https://mystorage.blob.core.windows.net/content/role_library.pdf
    Found 58 search documents with storageUrl https://mystorage.blob.core.windows.net/content/role_library.pdf
    [00000000-0000-0000-0000-000000000000]
    ```

    The array at the end of the output includes your USER_OBJECT_ID and is used to determine if the document is used in the answer with Azure OpenAI. 


### Verify Azure AI Search contains your USER_OBJECT_ID

1. Open the [Azure portal](https://portal.azure.com) and search for your `AI Search`. 
1. Select your search resource from the list.
1. Select **Search management -> Indexes**. 
1. Select the **gptkbindex**. 
1. Select **View -> JSON view**.
1. Replace the JSON with the following JSON.

    ```json
    {
      "search": "*",
      "select": "sourcefile, oids",
      "filter": "oids/any()"
    }
    ```

    This searches all documents where the `oids` field has any value and returns the `sourcefile`, and `oids` fields. 

1. If the `role_library.pdf` doesn't have your oid, return to the [Provide user access to a document in Azure Search](#provide-user-access-to-a-document-in-azure-search) section and complete the steps.


### Verify user access to the document 

If you completed the steps but did not see the correct answer, verify your USER_OBJECT_ID is set correctly in Azure AI Search for that `role_library.pdf`.

1. Return to the chat app. You may need to sign in again. 
1. Enter the same query so that the `role_library` content is used in the Azure OpenAI answer: `What does a product manager do?`.
1. View the result which now includes the appropriate answer from the role library document.

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/role-library-access-granted.png" alt-text="Screenshot of chat app in browser showing the answer is returned.":::

## Clean up resources

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

Run the following Azure Developer CLI command to delete the Azure resources and remove the source code:

```bash
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/github-codespace-dashboard.png" alt-text="Screenshot of all the running Codespaces including their status and templates.":::

1. Open the context menu for the codespace and then select **Delete**.

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/github-codespace-delete.png" alt-text="Screenshot of the context menu for a single codespace with the delete option highlighted.":::

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-app-chat-document-security-trim/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

This sample repository offers [troubleshooting information](https://github.com/Azure-Samples/azure-search-openai-demo/tree/main#troubleshooting).

## Next steps

* [Build a chat app with Azure OpenAI](https://aka.ms/azai/chat) best practice solution architecture
* [Access control in Generative AI Apps with Azure AI Search](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/access-control-in-generative-ai-applications-with-azure/ba-p/3956408)
* [Build an Enterprise ready OpenAI solution with Azure API Management](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-an-enterprise-ready-azure-openai-solution-with-azure-api/bc-p/3935407)
* [Outperforming vector search with hybrid retrieval and ranking capabilities](https://techcommunity.microsoft.com/t5/azure-ai-services-blog/azure-cognitive-search-outperforming-vector-search-with-hybrid/ba-p/3929167)

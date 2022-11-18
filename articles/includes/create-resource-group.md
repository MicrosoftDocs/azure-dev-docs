### [Azure portal](#tab/azure-portal)

1. Open the Azure portal in a web browser. 
1. In the search bar, enter **resource groups** and select it.
1. Select **+ Create**.
1. Enter your resource group settings:

    |Property|Value|
    |--|--|
    |Subscription|Select your subscription.|
    |Resource group|Enter your resource group name. This resource group name is used as part of a resources URI when you access the Resource Manager (management plane). The name isn't used for control (such as creating a database) or data plane (inserting data into a table).|
    |Region|Select a geographical region for the resource group.|

1. Select **Review + create** to begin validation.
1. When validation successes, select **Create**.

### [Visual Studio Code](#tab/vscode)

1. Open the command palette, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>.
1. Search for **create resource group** and select it.
1. Answer the prompts using the following settings:

    |Prompt|Value|
    |--|--|
    |Select subscription|Sign in to Azure if prompted. Select an existing subscription or create an Azure account if you don't have one.|
    |Enter the name of the new resource group.|Enter your resource group name. This resource group name is used as part of a resources URI when you access the Resource Manager (management plane). The name isn't used for control (such as creating a database) or data plane (inserting data into a table).|
    |Select a location for new resources.|Select a geographical region for the resource group.|


### [Azure CLI](#tab/azure-cli)

1. Log in to Azure:

    ```azurecli
    az login
    ```

    Complete the authentication in a browser.

1. List your subscription names and IDs. Copy the **SubscriptionId** value to use the next command.

    ```azurecli
    az account subscription list --output table 
    ```

1. Set your default subscription, used by subsequent commands:

    ```azurecli
    az account set --subscription YOUR_SUBSCRIPTION_ID
    ```

1. Select from a list of locations supported for your subscription. Copy the **Name** value of a region close to you.

    ```azurecli
    az account list-locations --output table
    ```

1. Use the following Azure CLI to create a resource group with your subscription name or ID:

    ```azurecli
    az group create --name "YOUR_RESOURCE_GROUP_NAME" --location YOUR_REGION
    ```

    For example:

    ```azurecli
    az group create --name "my-azure-app" --location westus
    ```
### [Azure portal](#tab/azure-portal)

1. Open the Azure portal in a web browser. 
1. In the search bar, enter **resource groups** and select it.
1. Find and select your resource group.
1. On the resource group's **Overview** page, select **Delete resource group**.
1. On the panel, enter the resource group name and select **Delete**.

### [Visual Studio Code](#tab/vscode)

1. Open the command palette, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>.
1. Search for **delete resource group** and select it.
1. Select your resource group and select **OK**.

### [Azure CLI](#tab/azure-cli)

1. Log in to Azure:

    ```azurecli
    az login
    ```

    Complete the authentication in a browser.

1. Delete your resource group. 

    ```azurecli
    az group delete --name "YOUR-RESOURCE-GROUP-NAME" -y
    ```
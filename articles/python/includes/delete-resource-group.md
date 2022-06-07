You can delete a resource group by using using the [Azure portal](https://portal.azure.com), the Visual Studio Code extension for Azure, or the Azure CLI:

- In the [Azure portal](https://portal.azure.com), select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

- In the [Azure Resources extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups) for Visual Studio Code, sort resources by resource group. Then, find the resource group to be deleted, right-click and select **Delete Resource Group...**.

    ![Azure extension resources sort by in the Visual Studio Code](../media/deploy-azure/sort-by-resource-group.png)

 
- Run the following Azure CLI command (locally or using the [Cloud Shell](/azure/cloud-shell/overview)), replacing `<resource_group>` with the name of the group used in this tutorial:

    ```azurecli
    az group delete --no-wait --name <resource_group>
    ```

You can delete the resource group by using either using either the [Azure portal](https://portal.azure.com) or the Azure CLI:

- In the portal, select **Resource groups** from the left-side navigation pane, select the resource group that was created in the process of this tutorial, and then use the **Delete resource group** command.

- Run the following Azure CLI command (locally or using the [Cloud Shell](/azure/cloud-shell/overview)), replacing `<resource_group>` with the name of the group used in this tutorial:

    ```azurecli
    az group delete --name <resource_group>
    ```

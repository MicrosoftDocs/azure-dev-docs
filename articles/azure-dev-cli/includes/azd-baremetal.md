::: zone pivot="programming-language-nodejs"

[!INCLUDE [azd-baremetal-nodejs.md](azd-baremetal-nodejs.md)]

::: zone-end

::: zone pivot=""programming-language-python"

[!INCLUDE [azd-baremetal-python.md](azd-baremetal-python.md)]

::: zone-end

::: zone pivot=""programming-language-csharp"

[!INCLUDE [azd-baremetal-csharp.md](azd-baremetal-csharp.md)]

::: zone-end

### Run `up` command

The fastest way for you to get this application up and running on Azure is to use the `azd up` command. This single command will initialize the project, create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities.

1. In **File Explorer** or a terminal, create a new empty folder, and change into it. 
1. Run the following command:

    ```bash
    azd up --template todo-nodejs-mongo
    ```

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

You will see a progress indicator as it provisions and deploys your application.

> [!NOTE] 
> * This may take a while to complete as it performs three steps: `azd init` (initialize the project), `azd provision` (creates Azure services) and `azd deploy` (deploys code). 
> [!NOTE]
> **DevContainer support is coming soon** 

### Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:
- Azure Developer CLI (azd)
    ### [Windows](#tab/windows)

    ```
    powershell -c "Set-ExecutionPolicy Bypass Process -Force; irm 'https://aka.ms/install-azd.ps1' | iex"
    ```

    ### [Linux/MacOS](#tab/linuxmac)

    ```
    curl -fsSL https://aka.ms/install-azd.sh | bash 
    ```

    ---
- [Docker Desktop](https://aka.ms/azure-dev/docker-install) (other options coming soon.)
- [Remote - Containers VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### DevContainer

::: zone pivot="programming-language-nodejs"
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this application on your local machine. You can find the specification for this application's DevContainer [here](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

::: zone-end

::: zone pivot="programming-language-python"
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this application on your local machine. You can find the specification for this application's DevContainer [here](https://github.com/Azure-Samples/todo-python-mongo/blob/main/.devcontainer/Dockerfile).

::: zone-end

::: zone pivot="programming-language-csharp"
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this application on your local machine. You can find the specification for this application's DevContainer [here](https://github.com/Azure-Samples/todo-csharp-cosmos-sql/blob/main/.devcontainer/Dockerfile).

::: zone-end

### Azure subscription

You will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for [a free account](https://azure.microsoft.com/free/).

## Initialize Project

Open a terminal, create a new empty folder, and change into it.
Run the following command to initialize the project:

::: zone pivot="programming-language-nodejs"
```bash
azd init --template todo-nodejs-mongo
```

::: zone-end

::: zone pivot="programming-language-python"
```bash
azd init --template todo-python-mongo
```

::: zone-end

::: zone pivot="programming-language-csharp"
```bash
azd init --template todo-csharp-cosmos-sql
```

::: zone-end

You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

### Open DevContainer

Open the project in VS Code, hit F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`

## Run Up Command

The fastest way for you to get this application up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities. 

```bash
azd up
```

You will see a progress indicator as it provisions and deploys your application.

> [!NOTE]
> * This may take a while to complete as it performs two steps: `azd provision` (creates Azure services) and `azd deploy` (deploys code). 



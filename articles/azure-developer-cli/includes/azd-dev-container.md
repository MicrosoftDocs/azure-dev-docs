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
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. You can find the specification for this app's DevContainer [here](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile).

::: zone-end

::: zone pivot="programming-language-python"
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. You can find the specification for this app's DevContainer [here](https://github.com/Azure-Samples/todo-python-mongo/blob/main/.devcontainer/Dockerfile).

::: zone-end

::: zone pivot="programming-language-csharp"
A [DevContainer](https://code.visualstudio.com/docs/remote/containers) is a Docker image that includes all of the prerequisites you need to run this app on your local machine. You can find the specification for this app's DevContainer [here](https://github.com/Azure-Samples/todo-csharp-cosmos-sql/blob/main/.devcontainer/Dockerfile).

::: zone-end

### Initialize Project

Open a terminal, create a new empty directory, and change into it.
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

- `Environment Name`: Prefix for the resource group that will be created to hold all Azure resources.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

### Open DevContainer

Open the project in VS Code, hit F1 and choose: `Remote-Containers: Rebuild and Reopen in Container`

## Run Up Command

The fastest way for you to get this app up and running on Azure is to use the `azd up` command. This single command will create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities.

```bash
azd up
```

You see a progress indicator as it provisions and deploys your app.

> [!NOTE]
> * This may take a while to complete as it performs two steps: `azd provision` (creates Azure services) and `azd deploy` (deploys code).

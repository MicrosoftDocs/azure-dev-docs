
### Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
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

::: zone pivot="programming-language-nodejs"
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)

::: zone-end

::: zone pivot="programming-language-python"
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/downloads/)

### Python virtual environment

This application uses Python Virtual Environments to isolate Python package installations. Make sure you create and activate a virtual environment.

::: zone-end

::: zone pivot="programming-language-csharp"
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [.NET SDK 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

::: zone-end

### Azure subscription

You will create infrastructure and deploy code to Azure. If you don't have an Azure Subscription, sign up for [a free account](https://azure.microsoft.com/free/).

## Run `up` command

The fastest way for you to get this application up and running on Azure is to use the `azd up` command. This single command will initialize the project, create and configure all necessary Azure resources - including access policies and roles for your account and service-to-service communication with Managed Identities.

1. In **File Explorer** or a terminal, create a new empty folder, and change into it.

1. Run the following command:

::: zone pivot="programming-language-nodejs"

```bash
azd up --template todo-nodejs-mongo
```

::: zone-end

::: zone pivot="programming-language-python"

```bash
azd up --template todo-python-mongo
```

::: zone-end

::: zone pivot="programming-language-csharp"

```bash
azd up --template todo-csharp-cosmos-sql
```

::: zone-end

The command prompts for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

A progress indicator displays the current status azd provisions and deploys your application.

> [!NOTE] 
> * The operation could take several minutes to complete as it performs three steps: initializes the project (`azd init`), creates the Azure services (`azd provision`), and deploys the code (`azd deploy`). 
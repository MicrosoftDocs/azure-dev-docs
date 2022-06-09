
### Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:
- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
- Azure Dev CLI
    ```bash
    npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
    ```

::: zone pivot="programming-language-nodejs"
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)

::: zone-end

::: zone pivot="programming-language-python"
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/downloads/)

### Python virtual environment

This application uses Python Virtual Environments to isolate Python package installations. Make sure you:

1. Create a virtual environment by running `py -m venv .venv`
2. Activate the virtual environment by running `.venv\Scripts\activate`

::: zone-end

::: zone pivot="programming-language-csharp"
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [.NET SDK 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

::: zone-end

### Run `up` command

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


You'll be prompted for the following information:

- `Environment Name`: Prefix for all your Azure resources, make sure it's globally unique and under 15 characters.
- `Azure Location`: The Azure location where your resources will be deployed.
- `Azure Subscription`: The Azure Subscription where your resources will be deployed.

You will see a progress indicator as it provisions and deploys your application.

> [!NOTE] 
> * This may take a while to complete as it performs three steps: `azd init` (initialize the project), `azd provision` (creates Azure services) and `azd deploy` (deploys code). 
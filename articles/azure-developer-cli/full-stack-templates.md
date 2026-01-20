---
title: Full-stack deployment templates for Azure Developer CLI
description: Discover full-stack deployment templates for Azure Developer CLI (azd) that integrate front-end and back-end services. Start building your app today.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/20/2026
ms.service: azure-dev-cli
ms.topic: reference
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Full-stack deployment templates for Azure Developer CLI

This article introduces full-stack deployment templates for Azure Developer CLI (azd). Use these templates to quickly deploy applications with front-end and back-end services on Azure.

## What are full-stack templates?

Full-stack templates include:

- **Front-end**: A user-facing web application (React, Angular, Vue, Blazor, and so on)
- **Back-end**: An API or service layer (Node.js, ASP.NET Core, Python, Java, Go)
- **Infrastructure**: Bicep or Terraform files to provision Azure resources
- **Configuration**: An `azure.yaml` file that ties everything together

Each template in this list works with `azd` commands like `azd init`, `azd up`, and `azd deploy`.

## How to use these templates

To get started with any of the templates listed, run:

```azdeveloper
azd init --template <template-repo-name>
azd up
```

For example, to use the React + Node.js + MongoDB template:

```azdeveloper
azd init --template todo-nodejs-mongo
azd up
```

## JavaScript/TypeScript templates

### [React](#tab/react)

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + Node.js + MongoDB | React on App Service | Node.js on App Service | Azure Cosmos DB (MongoDB) | Bicep | - | [todo-nodejs-mongo](https://github.com/Azure-Samples/todo-nodejs-mongo) |
| React + Node.js + MongoDB (Container Apps) | React on Container Apps | Node.js on Container Apps | Azure Cosmos DB (MongoDB) | Bicep | ✅ | [todo-nodejs-mongo-aca](https://github.com/Azure-Samples/todo-nodejs-mongo-aca) |
| React + Node.js + MongoDB (Terraform) | React on App Service | Node.js on App Service | Azure Cosmos DB (MongoDB) | Terraform | - | [todo-nodejs-mongo-terraform](https://github.com/Azure-Samples/todo-nodejs-mongo-terraform) |
| React + Node.js + MongoDB (Static Web Apps) | React on Static Web Apps | Node.js on Azure Functions | Azure Cosmos DB (MongoDB) | Bicep | - | [todo-nodejs-mongo-swa-func](https://github.com/Azure-Samples/todo-nodejs-mongo-swa-func) |
| React + Node.js + MongoDB (Kubernetes) | React on AKS | Node.js on AKS | Azure Cosmos DB (MongoDB) | Bicep | - | [todo-nodejs-mongo-aks](https://github.com/Azure-Samples/todo-nodejs-mongo-aks) |

### [Angular](#tab/angular)

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| AI Travel Agents | Angular on Azure Container Apps | Multiple MCP servers (Python, Node.js, Java, .NET) on Azure Container Apps | Azure OpenAI, Azure Cosmos DB | Bicep | - | [azure-ai-travel-agents](https://github.com/Azure-Samples/azure-ai-travel-agents) |

**-**: Add additional Angular-specific full-stack templates when available.

### [Vue](#tab/vue)

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| Weather App (Vue + Java Quarkus) | Vue.js on Azure Container Apps | Java (Quarkus) microservices on Azure Container Apps | Azure Database for PostgreSQL, Azure Database for MySQL | Bicep | - | [java-on-aca-quarkus](https://github.com/Azure-Samples/java-on-aca-quarkus) |

---

## .NET templates

### [ASP.NET Core](#tab/aspnet)

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + C# + SQL Database | React on App Service | ASP.NET Core on App Service | Azure SQL Database | Bicep | - | [todo-csharp-sql](https://github.com/Azure-Samples/todo-csharp-sql) |
| React + C# + Cosmos DB | React on App Service | ASP.NET Core on App Service | Azure Cosmos DB (NoSQL) | Bicep | - | [todo-csharp-cosmos-sql](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) |
| React + C# + SQL (Static Web Apps) | React on Static Web Apps | C# on Azure Functions | Azure SQL Database | Bicep | - | [todo-csharp-sql-swa-func](https://github.com/Azure-Samples/todo-csharp-sql-swa-func) |

### [Blazor](#tab/blazor)

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| OpenAI MCP Agent (.NET) | Blazor (.NET) on Azure Container Apps | .NET MCP agent, TypeScript MCP server on Azure Container Apps | Azure OpenAI | Bicep | - | [openai-mcp-agent-dotnet](https://github.com/Azure-Samples/openai-mcp-agent-dotnet) |
| Data API Builder + Cosmos DB | Blazor (.NET) on Azure Container Apps | Data API Builder container | Azure Cosmos DB for NoSQL | Bicep | - | [dab-azure-cosmos-db-nosql-quickstart](https://github.com/azure-samples/dab-azure-cosmos-db-nosql-quickstart) |
| Cosmos DB Copilot | Blazor (.NET) on Azure App Service | .NET (Semantic Kernel, RAG, multi-tenant) | Azure Cosmos DB for NoSQL, Azure OpenAI | Bicep | - | [cosmosdb-nosql-copilot](https://github.com/AzureCosmosDB/cosmosdb-nosql-copilot) |

### [.NET Aspire](#tab/aspire)

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| Aspire Empty App | None | None | None | - | - | [Aspire Empty App Docs](https://aspire.dev/get-started/aspire-sdk-templates/?dev-environment=aspire-cli#solution-templates) |
| Aspire Starter App | Blazor (.NET) | ASP.NET Core Minimal API (.NET) | None | - | - | [Aspire Starter App Docs](https://aspire.dev/get-started/aspire-sdk-templates/?dev-environment=aspire-cli#solution-templates) |
| Aspire Starter App (React) | React | ASP.NET Core Minimal API (.NET) | None | - | - | [Aspire Starter App Docs](https://aspire.dev/get-started/aspire-sdk-templates/?dev-environment=aspire-cli#solution-templates) |
| Aspire Starter App (FastAPI + React) | React | FastAPI (Python) | None | - | - | [Aspire Starter App Docs](https://aspire.dev/get-started/aspire-sdk-templates/?dev-environment=aspire-cli#solution-templates) |

---

## Python templates

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + Python + MongoDB | React on App Service | Python (Flask/FastAPI) on App Service | Azure Cosmos DB (MongoDB) | Bicep | - | [todo-python-mongo](https://github.com/Azure-Samples/todo-python-mongo) |
| React + Python + MongoDB (Container Apps) | React on Container Apps | Python on Container Apps | Azure Cosmos DB (MongoDB) | Bicep | ✅ | [todo-python-mongo-aca](https://github.com/Azure-Samples/todo-python-mongo-aca) |
| React + Python + MongoDB (Terraform) | React on App Service | Python on App Service | Azure Cosmos DB (MongoDB) | Terraform | - | [todo-python-mongo-terraform](https://github.com/Azure-Samples/todo-python-mongo-terraform) |
| React + Python + MongoDB (Static Web Apps) | React on Static Web Apps | Python on Azure Functions | Azure Cosmos DB (MongoDB) | Bicep | - | [todo-python-mongo-swa-func](https://github.com/Azure-Samples/todo-python-mongo-swa-func) |

## Java templates

| Template | Front end | Back end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + Java + MongoDB | React on App Service | Java (Spring Boot) on App Service | Azure Cosmos DB (MongoDB) | Bicep | - | [todo-java-mongo](https://github.com/Azure-Samples/todo-java-mongo) |
| React + Java + MongoDB (Container Apps) | React on Container Apps | Java on Container Apps | Azure Cosmos DB (MongoDB) | Bicep | ✅ | [todo-java-mongo-aca](https://github.com/Azure-Samples/todo-java-mongo-aca) |

## Contributing templates

If you have a full-stack template that you'd like to contribute, see the [Azure Samples contribution guide](https://github.com/Azure-Samples/.github/blob/main/README.md).

Your template should:

- Include both front-end and back-end services
- Use Azure Verified Modules when possible
- Follow the [azd template structure](./azd-templates.md)
- Include a comprehensive README with setup instructions
- Be listed in the [Awesome AZD](https://azure.github.io/awesome-azd/) gallery

## Next steps

- [Full-stack deployment with Azure Developer CLI](./full-stack-deployment.md)
- [Azure Developer CLI templates overview](./azd-templates.md)
- [Deploy to Azure Container Apps using the Azure Developer CLI](./container-apps-workflows.md)
- [Explore the azd up workflow](./azd-up-workflow.md)
- [Browse all templates on Awesome AZD](https://azure.github.io/awesome-azd/)

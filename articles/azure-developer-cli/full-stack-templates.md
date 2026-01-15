---
title: Full-stack deployment templates for Azure Developer CLI
description: Explore full-stack application templates for Azure Developer CLI (azd) that combine front-end and back-end services across multiple languages and frameworks.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/13/2026
ms.service: azure-dev-cli
ms.topic: reference
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Full-stack deployment templates for Azure Developer CLI

This article provides a curated list of full-stack application templates that you can use with the Azure Developer CLI (`azd`). These templates demonstrate how to deploy applications with separate front-end and back-end services to Azure.

## What are full-stack templates?

Full-stack templates include:

- **Front-end**: A user-facing web application (React, Angular, Vue, Blazor, and so on)
- **Back-end**: An API or service layer (Node.js, ASP.NET Core, Python, Java, Go)
- **Infrastructure**: Bicep or Terraform files to provision Azure resources
- **Configuration**: An `azure.yaml` file that ties everything together

Each template in this list has been designed to work with `azd` commands like `azd init`, `azd up`, and `azd deploy`.

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

## Template categories

The templates are organized by programming language and framework. Each template includes:

- ✅ **Front-end**: The front-end framework and hosting service
- ✅ **Back-end**: The back-end language and hosting service
- ✅ **Database**: The database or data store used
- ✅ **IaC**: Infrastructure-as-code approach (Bicep or Terraform)
- ✅ **Freshness**: Last verified date (TBD)
- ✅ **AVM**: Indicates if Azure Verified Modules are used

## JavaScript/TypeScript templates

### [React](#tab/react)

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + Node.js + MongoDB | React on App Service | Node.js on App Service | Azure Cosmos DB (MongoDB) | Bicep | TBD | [todo-nodejs-mongo](https://github.com/Azure-Samples/todo-nodejs-mongo) |
| React + Node.js + MongoDB (Container Apps) | React on Container Apps | Node.js on Container Apps | Azure Cosmos DB (MongoDB) | Bicep | ✅ | [todo-nodejs-mongo-aca](https://github.com/Azure-Samples/todo-nodejs-mongo-aca) |
| React + Node.js + MongoDB (Terraform) | React on App Service | Node.js on App Service | Azure Cosmos DB (MongoDB) | Terraform | N/A | [todo-nodejs-mongo-terraform](https://github.com/Azure-Samples/todo-nodejs-mongo-terraform) |
| React + Node.js + MongoDB (Static Web Apps) | React on Static Web Apps | Node.js on Azure Functions | Azure Cosmos DB (MongoDB) | Bicep | TBD | [todo-nodejs-mongo-swa-func](https://github.com/Azure-Samples/todo-nodejs-mongo-swa-func) |
| React + Node.js + MongoDB (Kubernetes) | React on AKS | Node.js on AKS | Azure Cosmos DB (MongoDB) | Bicep | TBD | [todo-nodejs-mongo-aks](https://github.com/Azure-Samples/todo-nodejs-mongo-aks) |

### [Angular](#tab/angular)

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

**TBD**: Add Angular-specific full-stack templates when available.

### [Vue](#tab/vue)

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

**TBD**: Add Vue-specific full-stack templates when available.

---

## .NET templates

### [ASP.NET Core](#tab/aspnet)

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + C# + SQL Database | React on App Service | ASP.NET Core on App Service | Azure SQL Database | Bicep | TBD | [todo-csharp-sql](https://github.com/Azure-Samples/todo-csharp-sql) |
| React + C# + Cosmos DB | React on App Service | ASP.NET Core on App Service | Azure Cosmos DB (NoSQL) | Bicep | TBD | [todo-csharp-cosmos-sql](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) |
| React + C# + SQL (Static Web Apps) | React on Static Web Apps | C# on Azure Functions | Azure SQL Database | Bicep | TBD | [todo-csharp-sql-swa-func](https://github.com/Azure-Samples/todo-csharp-sql-swa-func) |

### [Blazor](#tab/blazor)

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

**TBD**: Add Blazor-specific full-stack templates when available.

### [.NET Aspire](#tab/aspire)

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

**TBD**: Add .NET Aspire full-stack templates with explicit front-end/back-end separation.

For .NET Aspire integration, see [.NET Aspire integration and deployment](/dotnet/aspire/deployment/azure/aca-deployment-azd-in-depth?toc=/azure/developer/azure-developer-cli/toc.json&bc=/azure/developer/azure-developer-cli/breadcrumb/toc.json).

---

## Python templates

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + Python + MongoDB | React on App Service | Python (Flask/FastAPI) on App Service | Azure Cosmos DB (MongoDB) | Bicep | TBD | [todo-python-mongo](https://github.com/Azure-Samples/todo-python-mongo) |
| React + Python + MongoDB (Container Apps) | React on Container Apps | Python on Container Apps | Azure Cosmos DB (MongoDB) | Bicep | ✅ | [todo-python-mongo-aca](https://github.com/Azure-Samples/todo-python-mongo-aca) |
| React + Python + MongoDB (Terraform) | React on App Service | Python on App Service | Azure Cosmos DB (MongoDB) | Terraform | N/A | [todo-python-mongo-terraform](https://github.com/Azure-Samples/todo-python-mongo-terraform) |
| React + Python + MongoDB (Static Web Apps) | React on Static Web Apps | Python on Azure Functions | Azure Cosmos DB (MongoDB) | Bicep | TBD | [todo-python-mongo-swa-func](https://github.com/Azure-Samples/todo-python-mongo-swa-func) |

## Java templates

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| React + Java + MongoDB | React on App Service | Java (Spring Boot) on App Service | Azure Cosmos DB (MongoDB) | Bicep | TBD | [todo-java-mongo](https://github.com/Azure-Samples/todo-java-mongo) |
| React + Java + MongoDB (Container Apps) | React on Container Apps | Java on Container Apps | Azure Cosmos DB (MongoDB) | Bicep | ✅ | [todo-java-mongo-aca](https://github.com/Azure-Samples/todo-java-mongo-aca) |

## Go templates

| Template | Front-end | Back-end | Database | IaC | AVM | Repository |
|----------|-----------|----------|----------|-----|-----|------------|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

**TBD**: Add Go-specific full-stack templates when available.

## AI and intelligent app templates

**TBD**: Add AI-powered full-stack templates that include Azure OpenAI, Azure AI Search, and other AI services.

## Template freshness and correctness

The templates listed in this article are maintained by Microsoft and the community. To ensure quality and relevance:

- **Freshness**: Templates should be verified to work with the latest `azd` version within the last 6 months.
- **Correctness**: Templates should follow `azd` best practices, use Azure Verified Modules when available, and include proper documentation.
- **Security**: Templates should use managed identities, secure secrets in Key Vault, and follow the principle of least privilege.

**TBD**: Add a freshness indicator (last verified date) for each template.

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

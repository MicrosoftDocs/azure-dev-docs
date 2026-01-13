---
title: Full-stack deployment with Azure Developer CLI
description: Learn how to design and build full-stack applications with front-end and back-end services using Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/13/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Full-stack deployment with Azure Developer CLI

Full-stack applications that combine front-end and back-end services are a common pattern in modern web development. The Azure Developer CLI (`azd`) supports deploying full-stack applications where the front-end (static content or single-page application) and back-end (API or service layer) are hosted as separate services. This article provides guidance on designing and building full-stack deployments with `azd`.

## What is a full-stack deployment?

A full-stack deployment with `azd` typically consists of:

- **Front-end service**: A user-facing web application, often built with frameworks like React, Angular, Vue, or Blazor. The front-end might be hosted as a static site or as a containerized application.
- **Back-end service**: An API or service layer that handles business logic, data access, and integrations. The back-end is typically hosted in containers or as serverless functions.
- **Shared resources**: Databases, storage accounts, key vaults, and other Azure resources that both services might use.

With `azd`, you can define both services in a single `azure.yaml` file and provision them together using infrastructure-as-code (Bicep or Terraform).

## Infrastructure design considerations

When designing a full-stack application with `azd`, consider the following architectural decisions:

### Hosting options

Choose the appropriate Azure hosting services for your front-end and back-end:

| Service type | Hosting options | Use case |
|-------------|----------------|----------|
| Front-end | [Azure Static Web Apps](/azure/static-web-apps/), [Azure App Service](/azure/app-service/), [Azure Container Apps](/azure/container-apps/) | Static sites, SPAs, server-rendered apps |
| Back-end | [Azure Container Apps](/azure/container-apps/), [Azure App Service](/azure/app-service/), [Azure Functions](/azure/azure-functions/), [Azure Kubernetes Service](/azure/aks/) | APIs, microservices, serverless functions |

**TBD**: Add specific guidance on when to choose each hosting option based on scalability, cost, and complexity requirements.

### Service communication

Front-end services need to communicate with back-end APIs. Consider these patterns:

- **Direct HTTP calls**: The front-end makes HTTP requests directly to the back-end API endpoint.
- **API Gateway**: Use [Azure API Management](/azure/api-management/) to provide a unified API layer, rate limiting, and authentication.
- **Service mesh**: For complex microservice architectures, consider a service mesh like [Dapr](/azure/container-apps/dapr-overview) or [Istio](https://istio.io/).

### Security considerations

- **Authentication and authorization**: Use [Microsoft Entra ID](/entra/identity/) (formerly Azure Active Directory) for user authentication. Configure your back-end to validate tokens.
- **CORS configuration**: Configure Cross-Origin Resource Sharing (CORS) to allow the front-end to make requests to the back-end. See [Configure CORS](#configure-cors) for details.
- **Secrets management**: Store connection strings, API keys, and other secrets in [Azure Key Vault](/azure/key-vault/). Reference them in your application using managed identities.
- **Network isolation**: Use [virtual networks](/azure/virtual-network/) and private endpoints to secure communication between services.

### Scalability and performance

- **Auto-scaling**: Configure auto-scaling rules for both front-end and back-end services based on CPU, memory, or HTTP request metrics.
- **Content delivery**: Use [Azure CDN](/azure/cdn/) or Azure Front Door to cache static assets and improve front-end load times.
- **Database optimization**: Choose the right database service ([Azure SQL Database](/azure/azure-sql/), [Azure Cosmos DB](/azure/cosmos-db/), [Azure Database for PostgreSQL](/azure/postgresql/)) and configure indexing and caching strategies.

## Configure front-end for static builds

For front-end applications that compile to static assets (HTML, CSS, JavaScript), you can configure `azd` to build and deploy these assets efficiently.

### Build configuration

1. In your `azure.yaml` file, define the front-end service with a `dist` or `build` output directory:

    ```yaml
    name: todo-app
    services:
      web:
        project: ./src/web
        language: js
        host: staticwebapp
        dist: ./build
    ```

2. The `dist` property tells `azd` where to find the compiled static assets after running the build command.

### Static Web Apps

For Azure Static Web Apps, the build happens during deployment. Configure the build settings in your `azure.yaml`:

```yaml
services:
  web:
    project: ./src/web
    language: js
    host: staticwebapp
```

**TBD**: Add specific examples for React, Angular, and Vue build configurations.

### App Service with static files

For App Service hosting, you might package your static files in a container or deploy them directly:

```yaml
services:
  web:
    project: ./src/web
    language: js
    host: appservice
    dist: ./build
```

**TBD**: Add detailed steps for configuring App Service to serve static files.

## Configure CORS

Cross-Origin Resource Sharing (CORS) allows your front-end application to make requests to your back-end API. You can configure CORS in several ways:

### Configure CORS in the host (Azure service)

Configure CORS settings directly in the Azure service hosting your back-end. This approach is useful when you want to manage CORS separately from your application code.

#### Azure Container Apps

For Container Apps, configure CORS in your Bicep file:

```bicep
resource api 'Microsoft.App/containerApps@2025-02-02-preview' = {
  name: 'api'
  properties: {
    configuration: {
      ingress: {
        corsPolicy: {
          allowedOrigins: [
            'https://myapp.azurestaticapps.net'
            'http://localhost:3000'
          ]
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
          allowedHeaders: ['*']
          allowCredentials: true
        }
      }
    }
  }
}
```

#### Azure App Service

For App Service, configure CORS in your Bicep file:

```bicep
resource api 'Microsoft.Web/sites@2022-03-01' = {
  name: 'api'
  properties: {
    siteConfig: {
      cors: {
        allowedOrigins: [
          'https://myapp.azurestaticapps.net'
          'http://localhost:3000'
        ]
        supportCredentials: true
      }
    }
  }
}
```

### Configure CORS in source code

Configure CORS middleware in your application code. This approach provides more flexibility and allows you to control CORS behavior programmatically.

#### Node.js (Express)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: ['https://myapp.azurestaticapps.net', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

#### ASP.NET Core

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://myapp.azurestaticapps.net", "http://localhost:3000")
              .AllowCredentials()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowFrontend");
```

#### Python (Flask)

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://myapp.azurestaticapps.net", "http://localhost:3000"], 
     supports_credentials=True)
```

**TBD**: Add examples for Java and Go.

### Configure CORS in both host and source

For production environments, you might want to configure CORS in both the Azure service and your application code:

- **Azure service CORS**: Provides a security boundary at the infrastructure level
- **Application CORS**: Provides fine-grained control and dynamic CORS policies

When using both approaches, ensure that the configurations are consistent to avoid conflicts.

## Component distribution: azure.yaml, Docker, and Bicep

Understanding what configuration goes where is essential for building maintainable full-stack applications with `azd`.

### azure.yaml

The `azure.yaml` file is the main configuration file for your `azd` template. It defines:

- **Services**: The front-end and back-end services that make up your application
- **Service metadata**: Language, host type, project path, and Docker configuration
- **Hooks**: Pre and post hooks for build, provision, and deploy steps

Example `azure.yaml` for a full-stack application:

```yaml
name: todo-fullstack
services:
  web:
    project: ./src/web
    language: js
    host: staticwebapp
    
  api:
    project: ./src/api
    language: js
    host: containerapp
    docker:
      path: ./src/api/Dockerfile
```

### Docker images

Docker images define how your services are containerized. Use Dockerfiles for:

- **Application packaging**: Install dependencies, copy source code, and configure the runtime environment
- **Build optimization**: Use multi-stage builds to reduce image size
- **Runtime configuration**: Set environment variables, expose ports, and define startup commands

Example Dockerfile for a Node.js back-end:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3100
CMD ["node", "index.js"]
```

### Bicep infrastructure

Bicep files define the Azure resources for your application. Use Bicep for:

- **Resource provisioning**: Create Azure services like App Service, Container Apps, databases, and storage accounts
- **Configuration**: Set resource properties, connection strings, and environment variables
- **Dependencies**: Define relationships between resources (for example, an API that depends on a database)

Example Bicep file for a full-stack application:

```bicep
param environmentName string
param location string

// Container Apps Environment
resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: 'cae-${environmentName}'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
    }
  }
}

// Front-end (Static Web App)
resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' = {
  name: 'swa-${environmentName}'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

// Back-end (Container App)
module api 'br/public:avm/ptn/azd/container-app-upsert:0.1.2' = {
  name: 'api'
  params: {
    name: 'api-${environmentName}'
    location: location
    containerAppsEnvironmentName: containerAppsEnvironment.name
    containerRegistryName: containerRegistry.name
    imageName: 'api:latest'
    targetPort: 3100
    env: [
      {
        name: 'DATABASE_URL'
        value: database.outputs.connectionString
      }
    ]
  }
}
```

**TBD**: Add more comprehensive examples showing how environment variables flow from Bicep to the application.

## Best practices

When building full-stack applications with `azd`, follow these best practices:

1. **Use Azure Verified Modules (AVM)**: Leverage AVM Bicep modules for common patterns like `container-app-upsert` to ensure consistency and reduce errors.
2. **Separate concerns**: Keep front-end and back-end code in separate directories with independent build processes.
3. **Environment variables**: Use `azd` environment variables to pass configuration between services and avoid hardcoding values.
4. **Local development**: Configure CORS to allow `localhost` origins during development, but restrict to production domains in production.
5. **CI/CD integration**: Use `azd pipeline config` to set up automated deployments with GitHub Actions or Azure DevOps.
6. **Monitoring**: Enable Application Insights for both front-end and back-end services to track errors, performance, and usage.
7. **Secure by default**: Use managed identities, private endpoints, and least-privilege access to secure your application.

## Next steps

- [Deploy to Azure Container Apps using the Azure Developer CLI](./container-apps-workflows.md)
- [Full-stack deployment templates](./full-stack-templates.md)
- [Azure Developer CLI templates overview](./azd-templates.md)
- [Explore the azd up workflow](./azd-up-workflow.md)

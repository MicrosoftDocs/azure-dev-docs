---
title: Introduction to Developing Serverless Node.js Apps with Azure Functions
description: Learn how to develop serverless Node.js applications using Azure Functions. This guide introduces Azure's serverless technologies, enabling you to create scalable, on-demand HTTP endpoints with JavaScript and TypeScript.
ms.date: 06/17/2026
ms.topic: concept-article
ms.custom:
  - devx-track-js, engagement-fy23, devx-track-ts
ai-usage: ai-assisted
---

# Developing serverless Node.js apps with Azure Functions

Build and run HTTP APIs and event-driven Node.js apps with Azure Functions. Then use the rest of this article to choose the right serverless hosting and integration path for your app.

- [Azure serverless community library of samples](https://serverlesslibrary.net/)

## What is a function app resource?

A function app is a logical unit for deploying and running your function code in a single Azure resource in a specific geographic location. The resource can contain a single function or many functions, which execute independently of each other but share the same compute resources, connectivity, and settings. Functions provides a full range of trigger-based templates to help you get started quickly. You can add your code, and potentially other output and input bindings.

The function app resource settings include common serverless configurations such as environment variables, authentication, logging, and CORS.

## Durable, stateful functions

While function executions in Azure are inherently stateless, [Durable Functions](/azure/azure-functions/durable/durable-functions-overview) retain *state* and manage long-running functions in Azure. Use them when you need orchestrations, retries, or multistep workflows that outlive a single request. To get started, see [Create your first durable function in JavaScript](/azure/azure-functions/durable/quickstart-js-vscode).

## Static web apps include functions

When you develop a static front-end client application (such as Angular, React, or Vue), which also need serverless APIs, use [Static Web apps](/azure/static-web-apps/getting-started?tabs=react) with functions to bundle both together.

### Proxy from client app to the API

If you intend to deploy your API with your static web app, you don't need to proxy your client application's API calls. The proxy is established for you when you deploy the function app as a managed app.

When you locally develop your static web app by using Azure Functions, the [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/) provides the local proxy.

## Common security settings you need to configure for your Azure Function

The following common settings should be configured to keep your Azure Function secure:

- **Authentication and authorization**:
  - Use [Microsoft Entra ID](../sdk/authentication/overview.md) (formerly Azure Active Directory) for robust authentication. Configure your function app to require OAuth2 tokens for production workloads.
  - Avoid using function keys for sensitive applications. Instead, integrate with Microsoft Entra ID or validate JWT tokens in your function code.
  - Use [managed identities](../sdk/authentication/system-assigned-managed-identity.md) to authenticate your function app with other Azure resources, ensuring each function gets only the access it needs.
- **Configuration settings**:
  - Application settings - create Application settings for settings that don't impact security.
  - Secrets and keys - for any settings that impact security, use this tiered approach:
    1. First, use [Microsoft Entra ID](../sdk/authentication/overview.md) for authentication where supported.
    1. For integrations that don't support Entra ID, store secrets in [Azure Key Vault](/azure/key-vault/) and [pull in those settings from your Key Vault](/azure/app-service/app-service-key-vault-references?toc=%2Fazure%2Fazure-functions%2Ftoc.json&tabs=azure-cli).
    1. Never embed secrets in code or configuration files.
  - For other platform security settings, see [Securing Azure Functions](/azure/azure-functions/security-concepts#platform-security).
- **Network security**:
  - CORS - configure your client domains. Don't use `*`, indicating all domains.
  - Virtual network integration - use private endpoints or virtual network integration to limit network exposure and restrict inbound traffic from trusted sources.
- **HTTPS and encryption**:
  - TLS/SSL setting for HTTPS - by default, your API accepts HTTP and HTTPS requests. Enable **HTTPS only** in the **TLS/SSL settings**. Because your Function app is hosted on a secure subdomain  (`*.azurewebsites.net`), you can use it immediately (with `https`) and delay purchasing a domain name, and using a certificate for the domain until you're ready.
- **Deployment and monitoring**:
  - Deployment Slots - create a deployment slot, such as `stage` or `preflight`, and push to that slot. Swap this stage slot to production when you're ready. Don't get in the habit of manually pushing to production. Your code base should be able to indicate the version or commit that is on a slot. If you're using Flex Consumption, use [zero downtime deployments](https://github.com/azure/azure-functions/flex-consumption-plan#zero-downtime-deployments) instead of slots.
  - Enable [Application Insights](/azure/azure-monitor/app/app-insights-overview) for real-time telemetry, alerting, and anomaly detection to monitor your functions and audit logs for suspicious activity.

For comprehensive security guidance, see [Securing Azure Functions](/azure/azure-functions/security-concepts).

<a id="hosting-options-for-azure-functions"></a>

## Host options for Azure Functions

You can host Azure Functions in different ways depending on your requirements:

### Azure Functions resource hosting plans

When you create a function app resource, choose from these Functions hosting plans:

* **Consumption plan (legacy)**: Pay only for the time your functions run with automatic scaling.
- **Flex Consumption plan**: Provides enhanced control with always-ready instances to reduce cold starts, virtual network integration, and configurable instance sizes (512 MB to 4 GB). This plan is recommended for new Linux-based workloads requiring enterprise security and performance features. This plan uses execution-based billing similar to the Consumption plan but with additional costs for features like always-ready instances.
- **Premium plan**: Provides enhanced performance with pre-warmed instances, virtual network connectivity, and longer execution durations.
- **Dedicated (App Service) plan**: Run functions on dedicated virtual machines for predictable costs and full control over the runtime environment.

For more information about choosing the right hosting plan, see [Azure Functions hosting options](/azure/azure-functions/functions-scale).

### Azure Container Apps resource

Alternatively, you can deploy Azure Functions to an Azure Container Apps resource as containerized workloads. This option provides full control over the container environment and is ideal when you need custom dependencies, long-running processes, or want to combine functions with other containerized microservices. See [Azure Functions on Azure Container Apps overview](/azure/container-apps/functions-overview) for more information.

## Prerequisites for developing Azure Functions

- [Node.js LTS](https://nodejs.org/) - Use the latest Long Term Support (LTS) version for the best compatibility and security updates with Azure Functions.
- [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) - Use the current major version for local development and debugging.

## A simple JavaScript function for HTTP requests

A function is an exported asynchronous function with request and context information. The following partial screenshot from the Azure portal shows the function code.

Use one of the following v4 programming model examples as the starting point for your function project.

### [TypeScript](#tab/v4-ts)

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return {
        status: 200,
        jsonBody: {
            env: process.env
        }
    };
};

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});
```

### [JavaScript](#tab/v4-js)

```javascript
import { app } from "@azure/functions";

async function status(request, context) {
    context.log(`Http function processed request for url "${request.url}"`);

    return {
        status: 200,
        jsonBody: {
            env: process.env
        }
    };
}

app.http('status', {
    route: "status",
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: status
});

module.exports = status;
```

---

After the app starts, browse to `http://localhost:7071/api/status` to test the endpoint locally.

## Develop functions locally with Visual Studio Code and extensions

Create your [first function](/azure/azure-functions/functions-create-first-function-vs-code) using Visual Studio Code. Visual Studio Code simplifies many of the details with the [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

This extension helps you create JavaScript and TypeScript functions with common templates.

## Integrate with other Azure services

Serverless functions remove much of the server configuration and management so you can focus on just the code you need.

- **Low-code functions**: With Azure Functions, you create functions triggered by other Azure services or that output to other Azure services using [trigger bindings](/azure/azure-functions/functions-triggers-bindings). The v4 programming model registers all triggers and bindings directly in your code, making configuration type-safe and intuitive.
- **High-code functions**: For more control, use the Azure SDKs to coordinate and control other Azure services. Use [managed identities](../sdk/authentication/system-assigned-managed-identity.md) to securely authenticate your functions with other Azure resources without managing credentials.

## Next steps

* Create and deploy your first HTTP trigger function using [Visual Studio Code](/azure/azure-functions/functions-create-first-function-vs-code).
* Compare [Azure Functions hosting options](/azure/azure-functions/functions-scale) before you deploy.
* Build a workflow with [Durable Functions for JavaScript](/azure/azure-functions/durable/quickstart-js-vscode).
* Review [Securing Azure Functions](/azure/azure-functions/security-concepts) before you connect to production resources.

## Related content

- [Store unstructured data using Azure Functions and Azure Cosmos DB](/azure/azure-functions/functions-integrate-store-unstructured-data-cosmosdb?tabs=javascript)
- [Node.js + Azure Functions samples](/samples/browse/?languages=javascript%2Cnodejs&products=azure-functions)

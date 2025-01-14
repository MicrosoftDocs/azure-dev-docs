---
ms.custom: devx-track-js
ms.topic: include
ms.date: 01/07/2025
---


When using Azure hosting services, you can select either to deploy a container to the host or select a Node.js version as the runtime for the host. In both cases, you need to align the version of the runtime, the application code, and the dependencies such as the Azure SDKs. 

To find runtime information, use the following table:

:::row:::
   :::column span="1":::
      **Service**
   :::column-end:::
   :::column span="2":::
      **Version information**
   :::column-end:::
:::row-end:::

:::row:::
   :::column span="1":::
      [Azure App Service](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support.md)
   :::column-end:::
   :::column span="2":::
      For Linux runtimes. You can also run the following Azure CLI command to see all supported versions.<br>
      <pre><code>az webapp list-runtimes | grep node</code></pre>
   :::column-end:::
:::row-end:::

:::row:::
   :::column span="1":::
      [Azure Functions](/azure/azure-functions/functions-reference-node?branch=main&tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4#supported-version)
   :::column-end:::
   :::column span="2":::
      New projects should use the most recent programming model.
   :::column-end:::
:::row-end:::

:::row:::
   :::column span="1":::
      [Azure Static Web Apps (SWA)](/azure/static-web-apps/languages-runtimes)
   :::column-end:::
   :::column span="2":::
      There are two different runtimes to consider: the front end and the API if you are hosting your API in Static Web Apps.
   :::column-end:::
:::row-end:::

:::row:::
   :::column span="1":::
      [SWA CLI](https://github.com/Azure/static-web-apps-cli)
   :::column-end:::
   :::column span="2":::
      The SWA CLI provides development environment functionality including proxy, authentication, and other configurations.
   :::column-end:::
:::row-end:::
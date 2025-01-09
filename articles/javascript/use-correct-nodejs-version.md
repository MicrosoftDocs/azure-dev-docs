---
title: Use correct version of Node.js for Azure
description: "[Article description]."
ms.topic: concept-article #Don't change.
ms.date: 01/07/2025
#customer intent: As a JavaScript developer new to Azure, I want understand which version of Node.js to use for a hosting service or Azure sdk.
---
# Choose the right Node.js Version for Azure

When developing JavaScript applications for deployment on Azure, it's crucial to align the version of Node.js used in your local development environment with the version supported by your intended host runtime and the Azure SDKs your application will utilize. This ensures compatibility, reduces the likelihood of runtime errors, and leverages the full capabilities of the Azure platform. In this article, we'll guide you through selecting the appropriate Node.js version for your Azure-hosted applications and services.

## Prerequisites

All Azure SDKS and hosting services use LTS versions of Node.js. If your application code has been running in a prior version of Node.js, no longer available for Long Term Support (LTS), you should update your application source code to run in an LTS runtime. 

You should also know which hosting service you intend to deploy to and any Azure services your deployed application uses.

## Compatibility across environments

Once you know which Azure services and SDKs your application uses, ensure all environments for the application can build and run the same version of Node.js:

* local development environment or development container
* CI/CD process environment
* Application host runtime
* Azure SDKs

For an explanation of issues related to using different versions across your environment, see [Compatibility issues](#compatibility-issues). 

## Hosting services

When using Azure hosting services, you can select either to deploy a container to the host or select a Node.js version as the runtime for the host. In both cases, you need to align the version of the runtime, the application code, and the dependencies such as the Azure SDKs. 

To find runtime information, use the following table:

|Service|Version information|
|--|--|
|[Azure App Service](/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support.md#support-timeline)|For Linux runtimes|
|[Azure Functions](/azure/azure-functions/functions-reference-node?tabs=javascript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4#supported-versions)|New projects should use the most recent programming model.|
|[Azure Static Web Apps (SWA)](/azure/static-web-apps/languages-runtimes)|There are two different runtimes to consider: the front end and the API if you are hosting your API in Static Web Apps.|
|[SWA CLI](https://github.com/Azure/static-web-apps-cli/blob/main/package.json#L138)|The SWA CLI provides development environment functionality including proxy, authentication, and other configurations.|

## Azure SDKs

The Azure SDKs also work with Node.js LTS versions as stated in the [support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#microsoft-support-policy), however there may be a period of time where the list of LTS versions for the hosting environment and the rumtime versions of the SDKs do not exactly match because it takes time to move verify each continues to run correctly on the next LTS version. Because there are usually 3 versions of Node.js marked as Long Term Support versions, you can usually target the middle version. This target allows you some time to test and verify your application can move to the next LTS version. 

## Compatibility issues

When developing and deploying JavaScript applications on Azure, using different versions of Node.js across your local development environment, CI/CD pipeline, application host runtime, and Azure SDKs can lead to various compatibility issues. Here are some common categories:

1. **Syntax Errors**:
   - Using modern JavaScript syntax that is not supported by older Node.js versions can cause syntax errors, preventing the application from running.

2. **Deprecated APIs**:
   - APIs that have been deprecated in newer Node.js versions may still be present in older versions, leading to unexpected behavior or runtime errors if the versions are not aligned.

3. **Performance Degradation**:
   - Newer Node.js versions often include performance improvements. Running your application on an older version may result in slower execution times and reduced performance.

4. **Security Vulnerabilities**:
   - Older Node.js versions may have known security vulnerabilities that have been patched in newer versions. Using an outdated version can expose your application to security risks.

5. **Inconsistent Behavior**:
   - Differences in how Node.js versions handle certain operations, such as buffer handling, event loop behavior, or module resolution, can lead to inconsistent behavior across environments.

6. **Dependency Conflicts**:
   - Node.js modules or packages that are compatible with one version of Node.js may not be compatible with another, causing dependency conflicts and runtime errors.

7. **Build Failures**:
   - CI/CD pipelines using a different Node.js version than the local development environment can lead to build failures, causing delays in the development and release process.

By ensuring that all environments use the same version of Node.js, you can mitigate these compatibility issues and ensure a smoother development and deployment process.

## Related content

- [App Service runtime support](/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support)
- [Azure SDK support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#microsoft-support-policy)

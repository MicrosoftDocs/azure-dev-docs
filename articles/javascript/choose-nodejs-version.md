---
title: Use correct version of Node.js for Azure
description: Learn how to choose the right Node.js version for developing and deploying JavaScript applications on Azure. Understand the importance of aligning Node.js versions across local and hosting environments to ensure compatibility, stability, and optimal performance.
ms.topic: concept-article #Don't change.
ms.date: 01/07/2025
#customer intent: As a JavaScript developer new to Azure, I want understand which version of Node.js to use for a hosting service or Azure sdk.
---
# Choose the right Node.js Version for Azure

When developing JavaScript applications for Azure, it's crucial to align the versions of Node.js in your local development environment and host runtime environment. This version alignment ensures compatibility, reduces the likelihood of runtime errors, and uses the full capabilities of the Azure platform. In this article, you learn how to select the appropriate Node.js version for your Azure-hosted applications and services.

## Node.js versions

Node.js follows a predictable release schedule that includes both Long Term Support (LTS) and Current releases. LTS versions are designated for long-term maintenance and stability, making them ideal for production environments. These versions receive critical bug fixes, security updates, and performance improvements for an extended period, typically 30 months. Node.js uses an even/odd numbering system to distinguish between LTS and Current releases: even-numbered versions (e.g., 18, 20) are LTS releases, while odd-numbered versions (e.g., 19, 21) are Current releases. Current releases include the latest features and improvements but are only supported for six months, after which they transition to an LTS release if they're even-numbered. 

You shouldn't use Current releases in production because the six month window can misalign with Azure hosting platform runtimes and SDKs. You will notice that the [development containers for Node.js](https://github.com/devcontainers/images/tree/main/src/javascript-node) do not offer odd-numbered/Current versions.

## Prerequisites

All Azure SDKS and hosting services use [LTS versions of Node.js](https://nodejs.org/). If your application code has been running in a prior version of Node.js, no longer available for Long Term Support (LTS), you should update your application source code to run in an LTS runtime. 

You should also know which hosting service you intend to deploy to and any Azure services your deployed application uses.

## Compatibility across environments

Once you know which Azure services and SDKs your application uses, ensure all environments for the application can build and run the same version of Node.js:

* local development environment or development container
* CI/CD process environment
* Application host runtime
* Azure SDKs

For an explanation of issues related to using different versions across your environment, see [Compatibility issues](#compatibility-issues). 

## Hosting services

[!INCLUDE [Azure services Node.js minimum version](./includes/nodejs-runtime-for-azure-services.md)]

## Azure SDKs

The Azure SDKs require Node.js LTS versions as stated in the [support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#microsoft-support-policy). There can be a brief period when the LTS versions supported by the hosting environment and the SDKs don't match, as it takes time to verify new Node.js LTS versions. Because there are usually three versions of Node.js marked as Long Term Support versions, you can usually target the middle version. This target allows you some time to test and verify your application can move to the next LTS version. 

### Manage multiple versions of Node.js

When you need to manage more than one version of Node.js across your local and remote environments, we recommend:

* [**Development Containers**](https://containers.dev/): Use a container with a specific Node.js version. You can manage the version of Node.js across several environments using containers. Visual Studio Code's [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) simplifies this process.
* **NVM (Node Version Manager)**: A command-line interface to set or switch your local version of Node.js.

### Download and install Node.js based on your intended use

You can download and install Node.js based on your requirements.

* [Node.js Download page](https://nodejs.org/)
* [Official Docker image](https://hub.docker.com/_/node/)
* [Development containers](https://github.com/devcontainers/images/tree/main/src/javascript-node)

## Compatibility issues

Here are some common categories of compatibility issues that can arise when Node.js versions don't match across environments:

- **Security Vulnerabilities**: Using an outdated version with known security vulnerabilities can expose your application to security risks.
- **Syntax Errors**: Applications which use the latest JavaScript syntax, not supported by older Node.js versions, can cause syntax errors. These errors prevent the application from running.
- **Deprecated APIs**: APIs which are deprecated in newer Node.js versions can still be present in older versions, leading to unexpected behavior or runtime errors if the versions aren't aligned.
- **Performance Degradation**: Newer Node.js versions often include performance improvements. Running your application on an older version can result in slower execution times and reduced performance.

- **Inconsistent Behavior**: Differences in how Node.js versions handle certain operations, such as buffer handling, event loop behavior, or module resolution, can lead to inconsistent behavior across environments.
- **Dependency Conflicts**: Node.js modules or packages that are compatible with one version of Node.js may not be compatible with another, causing dependency conflicts and runtime errors.
- **Build Failures**: CI/CD pipelines using a different Node.js version than the local development environment can lead to build failures, causing delays in the development and release process.

By ensuring that all environments use the same version of Node.js, you can mitigate these compatibility issues and ensure a smoother development and deployment process.

## Related content

- [App Service runtime support](https://github.com/Azure/app-service-linux-docs/blob/master/Runtime_Support/node_support.md)
- [Azure SDK support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md#microsoft-support-policy)

---
title: Contoso real estate developer tools
description: Learn modern cloud development with Contoso real estate, including tools to enable you to develop, debug, build, deploy, and test your application.
ms.topic: conceptual
ms.date: 08/10/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate, devx-track-extended-azdevcli
---

# Modern cloud development with Contoso real estate

[!INCLUDE [include](./includes/contoso-intro-paragraph.md)]
Modern cloud development used in the Contoso Real Estate solution includes tools to enable you to develop, debug, build, deploy, and test your application. 

## Developer Environment

An effective and efficient development team decides on and consistently maintains a development environment. 

### Development Containers

The development environment must be the same for every developer on your team. That environment also needs to mirror the production environment as much as possible. [Development Containers](https://containers.dev/) is the industry standard with community support, a specification, tools, guides and templates. The dev container should be maintained for operating system, languages, and other tools necessary for team efficiency.

[Visual Studio Code](https://code.visualstudio.com/docs/devcontainers/containers) provides a quick step-by-step dev container creation process to wrap around your source code, allowing you to write code instead of writing containers. If you want to develop your container, you can bring an existing container, or alter the provided dev container file.

* Contoso Dev Container - [devcontainer.json](https://github.com/Azure-Samples/contoso-real-estate/blob/main/.devcontainer/devcontainer.json)

### IDEs

An integrated developer environment (IDE) is a software application that provides comprehensive tools and features to developers for writing, testing, and debugging code more efficiently. It's designed to streamline the development process by consolidating various aspects of software development into a single environment. In an integrated development environment IDE, when combined with a development container, allows you to quickly onboard new team members while still supporting the rest of the team. Any modifications to the IDE including settings, extensions and other integrations can be specified in the dev container so all team members have the same environment without having to rely on manual steps. 

For cross-platform developer teams, use [Visual Studio Code](https://code.visualstudio.com/):

* Environment settings for Visual Studio Code - [./vscode](https://github.com/Azure-Samples/contoso-real-estate/tree/main/.vscode)
* Visual Studio Extensions installed in the [devcontainer.json](https://github.com/Azure-Samples/contoso-real-estate/blob/main/.devcontainer/devcontainer.json)

### Code quality tooling

Code quality tooling is applied during development to apply formatting and style guidelines and catch potential runtime issues by enforcing code standards. Code quality tools are unique the programming language and supported with a community to ensure support and progression. [Visual Studio Code](https://code.visualstudio.com/) provides integration with the common code quality tools.

Contoso uses the following code quality tools:

* [TypeScript](https://www.typescriptlang.org/) settings in the package `tsconfig.json` file.
* [Prettier](https://prettier.io/) settings in the root [package.json](https://github.com/Azure-Samples/contoso-real-estate/blob/main/package.json).
* [ESLint](https://eslint.org/) in the root [.eslintrc.js](https://github.com/Azure-Samples/contoso-real-estate/blob/main/.eslintrc.js)

### Automated testing

The development environment should allow the developer to quickly write code and test the impact it has on the project without having to push the changes to the _build and test_ pipeline. [Visual Studio Code](https://code.visualstudio.com/) provides integration with the automated testing tools. Use [PlayWright](https://playwright.dev/docs/intro) for end-to-end testing including browser and API testing.

Contoso uses:

* [Jest](https://jestjs.io/) for unit tests
* [Playwright](https://playwright.dev/docs/intro) for end to end testing

### CLIs

Command line interfaces allow developers to work quickly in their development environment and add the CLI to any automation tools for build and deploy pipelines. 

Contoso uses the following CLIs:

* [Static Web Apps (SWA) CLI](https://github.com/Azure/static-web-apps-cli)
* [Azure Functions core tools CLI (FUNC)](https://github.com/Azure/azure-functions-core-tools)
* [Azure Developer CLI (AZD)](https://github.com/Azure/azure-dev)
* [git](https://git-scm.com/downloads)

## Developer Compute

A developer's workstation can be located in the cloud or as a physical machine. Regardless of where the compute resource is, is easily integrates the components needed by a modern cloud developer.

### Codespaces

Codespaces is a developer container available with your GitHub repository. Open your repository in Codespaces, either in a browser, or your local IDE. Begin working immediately, in your typical developer flow, writing, debugging, testing, and pushing PRs back to the GitHub repository. Codespaces retains any specific changes to the environment such as environment variables, dependency installs, and CLIs. 

You can open the project from GitHub in a web browser, or you can open the container from a local version of [Visual Studio Code](https://code.visualstudio.com/). Both use the same dev container. 

## Cloud resources for developers

Developers need access to cloud resources while developing. Depending on the resource, the development team may choose to use a local emulator (if available), or use the same infrastructure as code files to provide developer resources. 

**Infrastructure as code**, with tools such as [Azure Dev CLI (AZD)](/azure/developer/azure-developer-cli/overview) allows you to create and tear down cloud resources quickly. 

This project has a root level file, [azure.yml](https://github.com/Azure-Samples/contoso-real-estate/blob/main/azure.yaml), defining the **_logical_ services**, which can be independently deployed. The resources supporting each service are defined in the [infra](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra) folder. 

* The [**infra/app**](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra/app) folder defines how the **_Azure_ services** are configured and stitched together.
* The [**infra/core**](https://github.com/Azure-Samples/contoso-real-estate/tree/main/infra/core) folder has the [**Bicep**](/azure/azure-resource-manager/bicep/) files used to create each Azure service.

[Azure Developer CLI (AZD)](https://github.com/Azure/azure-dev) provides resource creation, for all resources or just a logical service, through the `azd provision` command.

## Source control, continuous integration and deployment

**Source control** provides the ability to track changes during the development cycle. Contoso uses [git](https://git-scm.com/downloads) to manage version control and [GitHub](https://github.com/Azure-Samples/contoso-real-estate) to store source code.

**Continuous integration** allows for changes to source code to be verified before merging into the _main_ branch. Contoso uses the [.github/workflows](https://github.com/Azure-Samples/contoso-real-estate/tree/main/.github/workflows) file for continuous integration.

**Deployment** is the process of moving source code and related files to the cloud. [Azure Developer CLI (AZD)](https://github.com/Azure/azure-dev) provides that deployment through the `azd deploy` command.

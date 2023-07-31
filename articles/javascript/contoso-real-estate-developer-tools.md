---
title: Contoso real estate developer tools
description: Modern cloud development includes tools to enable you to develop, debug, build, deploy, and test your application.
ms.topic: Overview
ms.date: 05/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# What are modern cloud development tools and practices

Modern cloud development includes tools to enable you to develop, debug, build, deploy, and test your application. 

## 1. Developer Environment

An effective and efficient development team decides on and consistently maintains a development environment. 


### Development Containers

**What is it?** 

The development environment must be the same for every developer on your team. That environment also needs to mirror the production environment as much as possible. [Development Containers](https://containers.dev/) is the industry standard with community support, a specification, tools, guides and templates. The dev container should be maintained for operating system, languages, and other tools necessary for team efficiency.

**What do we provide?** 

[Visual Studio Code](https://code.visualstudio.com/docs/devcontainers/containers) provides a quick step-by-step dev container creation process to wrap around your source code, allowing you to write code instead of writing containers. If you want to develop your container, you can bring an existing container, or alter the provided dev container file.|

### IDEs

**What is it?** 

An integrated developer environment (IDE) is a software application that provides comprehensive tools and features to developers for writing, testing, and debugging code more efficiently. It's designed to streamline the development process by consolidating various aspects of software development into a single environment. In an integrated development environment IDE, when combined with a development container, allows you to quickly onboard new team members while still supporting the rest of the team. Any modifications to the IDE including settings, extensions and other integrations can be specified in the dev container so all team members have the same environment without having to rely on manual steps. 

**What do we provide?** 

For cross-platform developer teams, use [Visual Studio Code](https://code.visualstudio.com/). For comprehensive .NET and C++ development on Windows, use [Visual Studio](/visualstudio/windows).

### Code quality tooling

**What is it?** 

Code quality tooling is applied during development to apply formatting and style guidelines and catch potential runtime issues by enforcing code standards. Code quality tools are unique the programming language and supported with a community to ensure support and progression.<br><br>**What we provide**? Both [Visual Studio Code](https://code.visualstudio.com/) and [Visual Studio](/visualstudio/windows) provide integration with the common code quality tools.

### Automated testing

**What is it?** 

The development environment should allow the developer to quickly write code and test the impact it has on the project without having to push the changes to the _build and test_ pipeline. <br><br>**What we provide**? Both [Visual Studio Code](https://code.visualstudio.com/) and [Visual Studio](/visualstudio/windows) provide integration with the common code quality tools. Use [PlayWright](https://playwright.dev/docs/intro) for end-to-end testing including browser and API testing.

### CLIs

### Emulators

## 2. Developer Compute

A developer's workstation can be located in the cloud or as a local physical machine. Regardless of where the compute resource is, is will easily integrate the components a modern cloud developer needs.

### CodeSpaces

### Azure Dev Box

## 3. Cloud resources for developers

Developers need access to cloud resources while developing. Depending on the resource, the development team may choose to use a local emulator (if available), or use the same infrastructure as code files to provide developer resources. 

**Infrastructure as code**, with tools such as [Azure Dev CLI (AZD)](/azure/developer/azure-developer-cli/overview) allows you to create and tear down resources quickly. 


**Begin with one of templates**:

* [C#](/azure/developer/azure-developer-cli/azd-templates?tabs=csharp#choose-a-template)
* [Java](/azure/developer/azure-developer-cli/azd-templates?tabs=java#choose-a-template)
* [Node.js](/azure/developer/azure-developer-cli/azd-templates?tabs=nodejs#choose-a-template)
* [Python](/azure/developer/azure-developer-cli/azd-templates?tabs=python#choose-a-template)
* [Starter templates](/azure/developer/azure-developer-cli/azd-templates?tabs=starter-IaC#choose-a-template)
* [Community templates at Awesome AZD](https://aka.ms/awesome-azd)

Learn more about AZD:

* [AZD Supported Azure compute services (host)](/azure/developer/azure-developer-cli/supported-languages-environments#supported-azure-compute-services-host)
* [AZD Supported programming languages](/azure/developer/azure-developer-cli/supported-languages-environments#supported-programming-languages)


## 4. Source control, continuous integration and deployment



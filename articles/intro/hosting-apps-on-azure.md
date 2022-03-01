---
title: Hosting applications on Azure
description: An overview of the different ways to host your applications on Azure
keywords: azure app service, azure functions, azure virtual machines, azure container instances, azure container registry
ms.prod: azure
ms.topic: overview
ms.date: 2/22/2022
---

# Hosting applications on Azure

Azure provides a variety of different ways to host your app depending on your needs.  

## Azure App Service

[Azure App Service](/azure/app-service/) is the fastest and easiest way to host web applications and APIs in Azure.  Azure App Service provides a fully-managed, platform as a service hosting solution that supports .NET, Java, JavaScript, and Python applications.  Hosting options are available on both Windows and Linux depending on the application runtime.

Azure App Service automatically patches and maintains the OS and language frameworks for you.  App Service also supports autoscaling, high availability and deployment slots so you can spend your time building great apps rather than worrying about infrastructure concerns.

Azure App Service also supports running containerized web apps. Customized containers give apps hosted in app service full access to the underlying operating system and make it possible to host web apps using any application stack while still taking advantage of features like autoscaling and high availability provided by Azure App Service.

## Static Web Apps

[Azure Static Web Apps](/azure/static-web-apps/) is a service that automatically builds and deploys full stack web apps to Azure from a code repository. Azure Static Web Apps interacts directly with GitHub or Azure DevOps to automatically monitor, build, and deploy changes from a code repository whenever a commit or pull request occurs on a specified branch.

Static web apps are commonly built using libraries and frameworks like Angular, React, Svelte, Vue, or Blazor where server side rendering is not required. In addition, Azure Static Web Apps Azure support use of a serverless API architecture either through an integrated Azure Functions API or linking to an existing Azure Functions app.

## Azure Functions

[Azure Functions](/azure/azure-functions/) is a "serverless"-style offering that lets you write just the code you need to respond to events or run on a schedule.  Rather than worrying about building out and managing a whole application or the infrastructure to run your code, you write just the code you need to handle the event..With Functions, you can trigger code execution with HTTP requests, webhooks, cloud service events, or on a schedule. You can code in your development language of choice, such as C#, F#, Node.js, Python, or PHP. With consumption-based billing, you pay only for the time that your code executes, and Azure scales as needed.

## Azure Spring Cloud

For Spring Boot microservices, [Azure Spring Cloud](/azure/spring-cloud/) provides a managed service that makes it easy to run these services in Azure.  No code changes are required to run these services in Azure. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

## Azure Kubernetes Services

[Azure Kubernetes Service (AKS)](/azure/aks/) is a fully managed container orchestration service that can be used to deploy, scale and manage Docker containers and container-based applications in a cluster environment. Azure Kubernetes Service simplifies the deployment of managed Kubernetes clusters in Azure by offloading the operational overhead like health monitoring and maintenance so you only have to manage and maintain the agent nodes.

Azure Kubernetes Service allows you to build and run modern, portable, microservices-based applications using both stateless and stateful applications as teams progress through the adoption of microservices-based applications.

## Azure Container Instances

[Azure Container Instances (ACI)](/azure/container-instances/) is a managed service that allows you to run containers directly on Azure, without having to manage any virtual machines and without having to adopt a higher-level service. Azure Container Instances is a solution for any scenario that can operate in isolated containers, including simple applications, task automation, and build jobs. Azure Container Instances can start containers in Azure in seconds, without the need to provision and manage VMs.

## Azure Batch

[Azure Batch](/azure/batch/batch-technical-overview) is used to run large-scale parallel and high-performance computing (HPC) jobs in Azure. Azure Batch creates and manages a pool of compute nodes (virtual machines), installs the applications you want to run, and schedules jobs to run on the nodes. There's no cluster or job scheduler software to install, manage, or scale. Instead, you use Batch APIs and tools, command-line scripts, or the Azure portal to configure, manage, and monitor your jobs.

## Azure Virtual Machines

[Azure Virtual Machines](/azure/virtual-machines/) provide an Infrastructure as a Service (IaaS) solution for hosting your applications on either Windows or Linux VMs in the cloud. With Azure Virtual Machines, you have total control over the configuration of the machine. When using VMs, you're responsible for all server software installation, configuration, maintenance, and operating system patches.

Because of the level of control that you have with VMs, you can run a wide range of server workloads on Azure that don't fit into a PaaS model. For more information, see the [Virtual Machines documentation](/azure/virtual-machines/).

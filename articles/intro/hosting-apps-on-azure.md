---
title: Hosting applications on Azure
description: An overview of the different ways to host your applications on Azure
keywords: azure app service, azure functions, azure virtual machines, azure container instances, azure container registry
ms.service: azure
ms.custom: devx-track-extended-java
ms.topic: overview
ms.date: 09/25/2025
#CustomerIntent: As an experienced developer, I want to select the correct hosting services for my applications so that I can get the level of control versus responsibility to meet my business and team needs.
---

# Hosting applications on Azure

This article is part three in a series of seven articles that help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: **Hosting applications on Azure**
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: [How am I billed?](azure-developer-billing.md)

Azure offers several ways to host your application. This article suggests services that match your requirements. It isn't prescriptive. Mix and match services to meet your needs. Most production environments combine services to meet business and organizational needs.

The services you choose often come down to two considerations:
- Do you prefer simplicity or control?
- Do you prefer cloud-native (containers) or Azure-native (tailored tools and integrations)?

The following video explains the first consideration: simplicity versus control.

> [!VIDEO c3791642-781c-49cc-8319-8798e9b3659f]

## Simplicity and control

Azure hosting services involve two key considerations:

* **Simplicity versus control**
    * Simple hosting platforms need less configuration and management but give you less control over the underlying infrastructure.
    * Complex hosting platforms need more configuration and management but give you more control over the underlying infrastructure.
* **Cloud-native versus Azure-native**
    * Cloud-native can be thought of as cloud-portable. Use open-source workloads like containers and technologies like Dapr so you can deploy the applications you build to any cloud provider.
    * Azure-native focuses on Azure-specific tools and technologies to manage infrastructure. These services include containers, code-first, low-code, and infrastructure tooling that emphasizes integration across Azure services.

## Simplified hosting

Simplified hosting solutions are fully managed by Azure. You're responsible for code and environment configuration. Azure manages the underlying runtime and infrastructure, including updates and patches. Simplified hosting is the Azure-native approach.

* [Logic Apps][azure-logic-apps]: Create and run automated workflows with little to no code.
* [Power Automate][power-automate]: Automate business processes and workflows.
* [Azure Static Web Apps][azure-static-web-apps]: Deploy static web apps built with frameworks like Blazor or React.
* [Azure Functions Apps][azure-functions]: Run serverless code or containers. 

## Balanced hosting

Balanced hosting solutions balance the need for simplicity with the need for control. You're responsible for functionality such as code and environment configuration. Azure manages the underlying runtime and infrastructure, including updates and patches. You can also bring your own container to the service. Balanced hosting is both Azure-native and cloud-native.

* [Azure App Service][azure-app-service]: Full-service web hosting including language runtimes, containers, and automation workloads.
* [Azure Container Apps][azure-container-apps]: Serverless container hosting. 
* [Azure Spring Apps][azure-spring-apps]: Migrate Spring Boot applications to the Azure cloud.

## Controlled hosting

Controlled hosting solutions give you full control over the underlying infrastructure. You're responsible for updates, patches, code, assets, and environment configuration. Controlled hosting is the cloud-native approach.

* [Azure Virtual Machines][azure-virtual-machines]: Full control of the virtual machine.
* [Azure Kubernetes Service][azure-kubernetes]: Full control of the Kubernetes cluster. 

## Source code hosting

For developers new to Azure who want to start **new development**, use the following chart to find the suggested hosting solution.

:::image type="content" source="media/hosting-apps-on-azure/source-code-suggested-compute.png" alt-text="Diagram showing no code, low code in the first box, code in the second box and container in the third box with recommended services for each box.":::

### No code or low code

Azure supports no-code solutions as part of its cloud approach. 

* [Logic Apps][azure-logic-apps]: Use a visual designer with prebuilt operations to develop a workflow for your enterprise and business-to-business scenarios.
* [Power Automate][power-automate] such as [Power apps][power-apps]: Use when you need to automate business processes and workflows within the Microsoft 365 organization.

### Code vs container

**Low-code** hosting solutions are designed to allow you to bring your code functionality without having to manage the application infrastructure.

* [Azure Static Web Apps][azure-static-web-apps]: Deploy generated static web apps.
* [Azure Functions][azure-functions]: Deploy code functions in supported languages without managing application infrastructure.

**Code-first** hosting solutions host code so you deploy directly to the service.

* [Azure App Service][azure-app-service]: Full-service web hosting.
* [Azure Spring Apps][azure-spring-apps]: Spring Boot applications.

**Container-first** hosting solutions are designed to host containers. The service provides container-specific configuration options and features. You're responsible for the compute used inside the container. The services which host containers move from managed control to full responsibility so you only take on the amount of container management you want.

**Kubernetes-centric** orchestration hosting includes:

|Service|Focus|Use|
|--|--|--|
|[Azure Kubernetes Service][azure-kubernetes]|Cloud-native| Use for Kubernetes clusters with a **declarative** approach using configuration files and external artifacts.|
|[Azure Service Fabric][azure-service-fabric]|Azure-native|Use an **imperative** approach to deploying microservices across clusters of machines. It provides a programming model that allows developers to write code that describes the desired state of the system, and the Service Fabric runtime takes care of making the system match that state.|

**Preconfigured** container hosting means the orchestration options are preconfigured for you. Your ability to communicate between containers or container clusters might require an additional service such as [Dapr](https://docs.dapr.io/).

|Service|Use|
|--|--|
|[Azure App Service][azure-app-service]|Full-service web hosting|
|[Azure Spring Apps][azure-spring-apps]|Spring Boot applications|
|[Azure Container Apps][azure-container-apps]|Serverless container hosting|
|[Azure Container Instances][azure-container-instances]|Simple single-container hosting|

Azure provides a container registry to store and manage your container images or you can use a third-party container registry.

|Service|Use|
|--|--|
|[Azure Container Registry][azure-container-registry]|Use when you build and host your own container images, which can be triggered with source code commits and base image updates.|

## Serverless 

**Serverless** hosting solutions are designed to run stateless code, which includes a consumption-based pricing tier that scales to zero when not used. 

|Service|Use|
|--|--|
|[Azure Container Apps][azure-container-apps]|Container hosting|
|[Azure Functions][azure-functions]|Code or container hosting|

## Microservices

Microservices hosting solutions run small, independent services that work together to form a larger application. Microservices are typically deployed as containers.

|Service|Use|
|--|--|
|[Azure Container Apps][azure-container-apps]|Use for serverless containerized microservices.|
|[Azure Functions][azure-functions]|Use for serverless code or containerized microservices.|

## Cloud edge

Cloud edge is a term to indicate if the cloud service is located to benefit the user (client) or the application (server).

### Client compute

Client compute runs on the client outside Azure. Client compute is typically used for client-side rendering and client-side processing such as browser-based or mobile applications.

|Service|Use|
|--|--|
|[Azure Static Web Apps][azure-static-web-apps]|Use for static web apps that use client-side rendering such as React, Angular, Svelte, Vue, and Blazor.|

### Client availability

|Service|Use|
|--|--|
|[Azure Front Door][azure-frontdoor]|Use for all internet-facing applications to provide a global cached and secure network to your static and dynamic assets including DDoS protection, end-to-end TLS encryption, application firewalls, and geo-filtering.|

### Server compute

Server compute assets are files that are processed by the server before being served to the client. Dynamic assets are developed using back-end server compute, optionally integrated with other Azure services. 

|Service|Use|
|--|--|
|[Azure App Service][azure-app-service]|Use this service for typical web hosting. This supports a wide set of functionality API endpoints, full-stack applications, and background tasks. This service comes with many programming language runtimes and the ability to provide your own stack, language, or workload from a container.|
|[Azure Functions][azure-functions]|Use this service to provide your own code in the supported languages for either HTTP endpoints or event-based triggers from Azure services.|
|[Azure Spring Apps][azure-spring-apps]|Use to deploy Spring Boot applications without code changes.|
|[Azure Container Apps][azure-container-apps]|Use to host managed microservices and containerized applications on a serverless platform.|
|[Azure Container Instances][azure-container-instances]|Use this for simple container scenarios that don't need container orchestration.|
|[Azure Kubernetes Service][azure-kubernetes]|Use this service when you need a Kubernetes cluster. The control plane to manage the cluster is created and provided for you at no extra cost.|

### Server endpoint management

Server endpoint management lets you manage server endpoints through a gateway that adds versioning, caching, transformation, API policies, and monitoring.

|Service|Use|
|--|--|
|[Azure API Management][azure-apim]|Use this service when you productize your **REST, OpenAPI, and GraphQL APIs** with an API gateway including quotas and rate limits, authentication and authorization, transformation, and cached responses.|
|[Azure Application Gateway][azure-application-gateway]|Use for **regional load balancing** (OSI layer 7). It can be used to route traffic based on URL path or host headers, and it supports SSL offloading, cookie-based session affinity, and Web Application Firewall (WAF) capabilities.|
|[Azure Front Door][azure-frontdoor]|Use for **global load balancing** (OSI layer 7) to provide a global cached and secure network to your static and dynamic assets including DDoS protection, end-to-end TLS encryption, application firewalls, and geo-filtering.|
|[Azure Traffic Manager][azure-traffic-manager]|Use for distributing traffic by **DNS** (OSI layer 7) to your public facing applications across the global Azure regions. Traffic Manager uses DNS to direct client requests to the appropriate service endpoint based on a traffic-routing method. It supports various traffic-routing methods such as priority, performance, and geographic routing. It's ideal for managing traffic across multiple regions or data centers.|

### Automated compute

Automated compute is automated by an event such as a timed schedule or another Azure service and is typically used for background processing, batch processing, or long-running processes. 

|Service|Use|
|--|--|
|[Power Automate][power-automate]| Use when you need to automate business processes and workflows.|
|[Azure Functions][azure-functions]|Use when you need to run code based on a timed schedule or in response to events in other Azure services.|
|Container services ([Azure Container Instances][azure-container-instances], [Azure Kubernetes Service][azure-kubernetes], [Azure Container Apps][azure-container-apps])|Use for standard automatable workloads|
|[Azure Batch][azure-batch]|Use when you need high-performance automation.|

## Hybrid cloud

Hybrid cloud is a computing environment that connects a company's on-premises private cloud services and third-party public cloud into a single, flexible infrastructure for running the organization's applications and workloads. 

|Service|Use|
|--|--|
|[Azure Arc][azure-arc]|Use when need to manage your entire environment, both cloud and on-premises resources including security, governance, inventory, and management. |

If you don't need to maintain your own infrastructure, use Azure Stack HCI to run virtual machines on-premises.

## High-performance computing

High-performance computing (HPC) is the use of parallel processing for running advanced application programs efficiently, reliably and quickly. The term applies especially to systems that function above a teraflop or 10^12 floating-point operations per second. 

|Service|Use|
|--|--|
|[Azure Batch][azure-batch]|Azure Batch creates and manages a pool of compute nodes (virtual machines), installs the applications you want to run, and schedules jobs to run on the nodes. Developers can use Batch as a platform service to build SaaS applications or client apps where large-scale execution is required.|
|[Azure BareMetal Instances][azure-bare-metal]|Use when you need to run in a nonvirtualized environment with root-level access to the operating system, storage, and network.|
|[Azure Quantum workspace][quantum]|Use when you need to develop and experiment with quantum algorithms.|
|[Microsoft Genomics][microsoft-genomics]|Use for ISO-certified, HIPAA-compliant genomic processing.|

To learn more, see [High-performance computing on Azure](/azure/architecture/topics/high-performance-computing).

## Event-based compute

Event-based compute is compute that is triggered by an event such as a timed schedule or another Azure service. Event-based compute is typically used for background processing, batch processing, or long-running processes.

|Service|Use|
|--|--|
|[Microsoft Copilot Studio][power-virtual-agents]|Use when you need to create chatbots with a no-code interface.|
|[Azure Functions][azure-functions]|Use when you need to run code based on a timed schedule or in response to events in other Azure services.|
|[Azure Service Bus Messaging][azure-service-bus-messaging]|Use when you need to decouple applications and services.|

## CI/CD compute

CI/CD compute is compute that is used to build and deploy your application. 

| Service| Description| 
|--|--|
|[Azure DevOps][azure-devops]|Use Azure DevOps for tight integration with the Azure cloud including authentication and authorization to the hosted agents, which build and deploy your application.|
|[GitHub Actions][github-actions]| Use GitHub Actions to build and deploy your GitHub repository applications. Use the Azure CLI to securely access Azure within the action.|
|[Azure Virtual Machines][azure-virtual-machines]|If you use another CI/CD system, you can use Azure Virtual Machines to host your CI/CD system.|

## Java resources

* [Java hosting options](/azure/architecture/guide/technology-choices/service-for-java-comparison)
* [Java migration to Azure](/azure/developer/java/migration/)

## Additional resources

* [Azure Architecture Center: Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree)

[azure-apim]:/azure/api-management
[azure-app-service]:/azure/app-service
[azure-application-gateway]:/azure/application-gateway
[azure-arc]:/azure/azure-arc
[azure-bare-metal]:/azure/baremetal-infrastructure
[azure-batch]:/azure/batch/batch-technical-overview
[azure-container-apps]:/azure/container-apps
[azure-container-instances]:/azure/container-instances
[azure-container-registry]:/azure/container-registry
[azure-devops]:/azure/devops
[azure-frontdoor]:/azure/frontdoor
[azure-functions]:/azure/azure-functions
[azure-kubernetes]:/azure/aks
[azure-logic-apps]:/azure/logic-apps/logic-apps-overview
[azure-service-bus-messaging]:/azure/service-bus-messaging
[azure-service-fabric]:/azure/service-fabric
[azure-spring-apps]:/azure/spring-apps
[azure-static-web-apps]:/azure/static-web-apps
[azure-traffic-manager]:/azure/traffic-manager
[azure-virtual-machines]:/azure/virtual-machines

[github-actions]:/azure/developer/github/github-actions

[microsoft-genomics]:/azure/genomics

[power-apps]:/power-apps
[power-automate]:/power-automate
[power-virtual-agents]:/power-virtual-agents

[quantum]:/azure/quantum


> [!div class="nextstepaction"]
> [Continue to part 4: Connect your app to Azure services](connect-to-azure-services.md)


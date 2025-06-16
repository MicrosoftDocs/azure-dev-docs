---
title: Scale with End-to-End Security, Monitoring, and Automation
titleSuffix: Azure
description: This article provides an overview of some key Azure services and features that you can use to build scalable Java applications.
author: KarlErickson
ms.author: karler
ms.reviewer: asirveda
ms.topic: article
ms.date: 09/30/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Scale with end-to-end security, monitoring, and automation

While designing applications, we need to determine how to adapt to changes in workload, recover from unexpected failures, minimize security risks, and so on. While one could start with a trial-and-error approach, that takes time away from other organizational objectives, and could adversely affect our reputation. Azure provides architectural guidance needed to get things right from the start. You also have everything you need to build a scalable application - from state-of-the-art security and auto-scaling to supporting services for data, messaging, caching, performance monitoring, and automation. Many of these supporting services are based on popular open-source software as well - such as PostgreSQL, Redis, JMS, and Kafka - so you don't get locked into proprietary solutions.

:::image type="content" source="media/platform-services.png" alt-text="Diagram with the heading 'Platform Services' and the logos for the services described in this article." border="false" lightbox="media/platform-services.png":::

Now let's take a look at some key Azure services and features - and how you can put them to use to build scalable Java applications.

## Extend the capabilities for Java applications - databases and messaging

In addition to providing several options for running your Java code, Azure offers a broad range of fully managed services to support your database needs - including [Azure Database for PostgreSQL](/azure/postgresql), [Azure Database for MySQL](/azure/mysql), [MongoDB Atlas](https://www.mongodb.com/mongodb-on-azure), [Azure Cosmos DB](/azure/cosmos-db), [Azure SQL Database](/azure/azure-sql/database), and [Azure SQL Managed Instance](/azure/azure-sql/managed-instance). The same holds true for messaging, with options that include [Azure Service Bus](/azure/service-bus-messaging), [Azure Event Hubs](/azure/event-hubs), and [Apache Kafka for Confluent Cloud](/azure/partner-solutions/apache-kafka-confluent-cloud/overview).

Azure Service Bus Premium tier supports JMS, the Java Messaging Service programming model. Regardless of whether your applications are running on VMs, in Kubernetes, or on fully managed PaaS services, you can quickly provision and use these fully managed data and messaging services using open-source clients, Azure Java SDKs, Spring starters, and application server integrations. They all provide the compliance, availability, and reliability guarantees that you would expect from Microsoft and Azure. Many Java and Spring developers want to use idiomatic libraries to simplify connections to their preferred cloud services. Microsoft maintains a comprehensive list of [libraries, drivers, and modules](../sdk/libraries-drivers-modules.md) that let you easily interact with Azure services across data, messaging, cache, storage, eventing, directory, and secrets management. For more information, see the [Spring Cloud Azure developer guide](../spring-framework/developer-guide-overview.md).

:::image type="content" source="media/spring-cloud-azure.png" alt-text="Diagram that lists the features of Spring Cloud Azure and the associated Azure services." border="false" lightbox="media/spring-cloud-azure.png":::

:::image type="content" source="media/extend-capabilities.png" alt-text="Diagram that shows the feature categories and associated Azure platform services supported by various Java libraries, drivers, and Spring modules." border="false" lightbox="media/extend-capabilities.png":::

## Zero Trust - secure network

You can secure your Java applications by deploying them in an Azure Virtual Network - the fundamental building block for your own private networks in Azure. Virtual networks enable many types of Azure resources to securely communicate with each other, with the internet, and with your on-premises networks and systems. You can use a virtual network to isolate your applications and supporting backend services from the Internet and place them on your private networks. You can assume full control of ingress and egress for your applications and backend systems.

:::image type="content" source="media/azure-container-apps-landing-zone-accelerator.png" alt-text="Diagram of the Azure Container Apps Landing Zone Accelerator." border="false" lightbox="media/azure-container-apps-landing-zone-accelerator.png":::

## Zero Trust - secure communications end-to-end

Implementing secure communications as part of a solution architecture can be challenging. Many companies manually rotate their certificates or build their own solutions to automate provisioning and configuration. Even then, there are still data exfiltration risks, such as unauthorized copying or data transfer.

With Azure, you can secure communications end-to-end or terminate transport-level security at any communication point. You can also automate the provisioning and configuration for all the Azure resources needed for securing communications.

Based on the principle of "never trust, always verify, and credential-free," [Zero Trust](/security/zero-trust) helps to secure all communications by eliminating unknown and unmanaged certificates, and by only trusting certificates that are shared by verifying identity prior to granting access to those certificates. You can use any type of TLS/SSL certificate, including certificates issued by a certificate authority, extended validation certificates, wildcard certificates with support for any number of sub-domains, or self-signed certificates for development and test environments.

Java or Spring Boot apps can securely load certificates from [Azure Key Vault](/azure/key-vault) (discussed next). With Azure Key Vault, you control the storage and distribution of certificates to reduce accidental leakage. Applications and services can securely access certificates using managed identities, role-based access control, and the principle of least privilege. This secure loading is powered using the Azure Key Vault [JCA](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-jca) (Java Cryptography Architecture) Provider.

:::image type="content" source="media/secure-communications.png" alt-text="Diagram of the architecture for secure end-to-end communications for Spring Boot apps." border="false" lightbox="media/secure-communications.png":::

## Zero Trust - manage secrets

Many Java applications connect to supporting services using URLs and credentials - information that, if exposed, could be used to gain unauthorized access to sensitive data. Embedding such information in an app itself presents a huge security risk for many reasons, including discovery via a code repository. Many developers externalize such credentials using environment variables, so that multiple applications can load them, but this only shifts the risk from the code itself to the execution environment.

:::image type="content" source="media/zero-trust.png" alt-text="Diagram with the heading 'Zero Trust - manage secrets using Azure Key Vault' and including a summary of the features described in this section." border="false" lightbox="media/zero-trust.png":::

[Azure Key Vault](/azure/key-vault) provides a better, safer, and more secure way to safeguard secrets. It gives you full control over the storage and distribution of application secrets, using Role Based Access Control (RBAC) and the principle of least privilege to limit access. You keep control over your application secrets - just grant permission for your applications to use them as needed. Upon application startup, prior to granting access to secrets, the application authenticates with Microsoft Entra ID and Azure Key Vault authorizes using Azure RBAC. Azure Key Vault includes full audit capabilities and has two service tiers: Standard, which encrypts with a software key, and a Premium tier, which includes hardware security module (HSM)-protected keys.

## End-user authentication and authorization

Most enterprise Java applications require user authentication and authorization, which you can implement using [Microsoft Entra ID](/entra/identity) - a complete identity and access management solution with integrated security. End-user accounts can be organizational identities or social identities from Facebook, Twitter, or Gmail using Microsoft Entra ID and Azure Active Directory B2C. You can implement Microsoft Entra ID based solutions using the [Microsoft Authentication Library for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java) or [Spring Boot Starter for Microsoft Entra](../spring-framework/spring-boot-starter-for-entra-developer-guide.md). You can also use any identity provider of your choice - such as ForgeRock, Auth0, Ping, or Okta.

## Monitor end-to-end

With Azure, you can monitor your Java applications end-to-end, using any tool and platform. Alternately, you can implement fully managed, native monitoring - including application performance monitoring (APM) - by using [Application Insights](/azure/azure-monitor/app/app-insights-overview), a feature of [Azure Monitor](/azure/azure-monitor). It provides strong support for Java, Spring, and frameworks like Micrometer and Spring Boot, enabling you to quickly identify and troubleshoot issues. Features include live metrics streaming, request rate and response time tracking, event tracing, and external dependency rates - everything you need to monitor the availability, performance, reliability, and usage of your Java applications running on Azure or on-premises.

You can monitor end-to-end by aggregating logs and metrics in [Log Analytics](/azure/azure-monitor/logs/log-analytics-tutorial), a tool in the Azure portal, which can be used to edit and run queries on logs and metrics data in Azure Monitor. You can write a query that returns a set of records and then use Log Analytics to sort, filter, and analyze them. Or you can write a more advanced query to perform statistical analysis and visualize the results in a chart, as might be needed to identify a particular trend. Whether you work with the results of your queries interactively or use them with other Azure Monitor features such as log query alerts or workbooks, Log Analytics is a good tool to use for writing and testing your queries.

That said, we realize that customers who are bringing their Java applications to Azure might want to continue using the same APM tools they're using to monitor their on-premises applications. To support this usage, we partnered with New Relic, AppDynamics, Dynatrace, and Elastic to integrate their monitoring solutions with Azure App Service and Azure Container Apps. Monitoring agents run side-by-side with your code, and we install and keep the agents updated for you. When you deploy to Azure Container Apps, Azure Kubernetes Service, or Virtual Machines, you can run any of these agents (including New Relic, AppDynamics, Dynatrace, Elastic and Datadog) alongside your applications, but you need to install and manage them on your own. Likewise, you can monitor end-to-end by aggregating logs and metrics in Elastic and Splunk.

:::image type="content" source="media/monitor-end-to-end.png" alt-text="Diagram with heading 'Monitor end-to-end using any tool and platform', an example screenshot, and logos for the tools described in this article." border="false" lightbox="media/monitor-end-to-end.png":::

We also realize that many customers want to continue using Grafana to query, visualize, alert on, and understand their metrics. For this reason, we partnered with Grafana Labs to deliver [Azure Managed Grafana](/azure/managed-grafana), a fully managed service that lets customers run Grafana natively on Azure. The service makes it easy to deploy secure and scalable Grafana instances and connect them to open-source, cloud, and third-party data sources for visualization and analysis. The service is optimized for Azure-native data sources like Azure Monitor and Azure Data Explorer, and it includes application performance monitoring (APM) integrations with Azure compute services like Azure App Service, Azure Container Apps, Azure Kubernetes Service, Splunk, Datadog, and Azure Virtual Machines.

## Accelerate Java applications using caching

As the workloads for your Java applications grow, you can increase performance by using [Azure Cache for Redis](/azure/azure-cache-for-redis) to implement an in-memory caching layer for query results, session states, and static content. It's a great way to improve application throughput and reduce latency without having to rearchitect your underlying database. Azure Cache for Redis Enterprise tiers, developed in partnership with Redis and fully managed by Microsoft, is the most highly available and scalable deployment option for running Redis on Azure - including features such as active geo-replication, externalized session management, and high-speed search and indexing.

:::image type="content" source="media/accelerate-scale.png" alt-text="Diagram with the heading 'Accelerate and Scale Java apps with Redis Cache' and including a summary of the features described in this section." border="false" lightbox="media/accelerate-scale.png":::

## Automatic scaling

All Azure compute services for running Java applications support automatic scaling (auto-scaling), which can help you maximize cost-efficiency and adapt to changing workloads without paying for more capacity than you need. Once enabled, you can rest assured that auto-scale takes care of your underlying infrastructure and your application workloads.

:::image type="content" source="media/drive-higher-utilization.png" alt-text="Diagram with the heading 'Drive higher utilization of apps with Autoscale' and including a summary of the features described in this section." border="false" lightbox="media/drive-higher-utilization.png":::

You can automatically scale in or out based on load or schedule. In load-based (or metric-based) mode, your applications are horizontally scaled out to the resources needed to handle the load, up to the limits that you set. Similarly, when load decreases, resources are horizontally scaled-in, never falling below the minimums that you set.

In schedule-based mode, your applications are scaled-in and scaled-out based on a defined schedule and limits. Schedule-based mode is useful for workloads that follow a predictable pattern and can be used to establish a baseline for more load-based scaling.

## Automation from idea to production

As you move your applications to the cloud, you want to automate everything - as needed for Java development at enterprise scale. You need to consider auto-scaling to address application workloads, as covered previously. But you also need to scale and automate your cloud environment as a whole - ideally from idea to production - including how to rapidly provision of new environments for test, QA, production, blue/green deployments, geographic expansion, and so on.

:::image type="content" source="media/automate-idea-production.png" alt-text="Diagram that shows boxes for Provision, Build, and Deploy categories with associated logos for the tools described in this section." border="false" lightbox="media/automate-idea-production.png":::

Azure lets you automate from idea to production using a broad range of tools and platforms. At a high level, such automation pipelines can be broken down into three categories:

- Provisioning pipelines - You can provision Azure resources using Terraform, Azure Resource Manager (ARM) templates, Bicep templates, or the Azure CLI, as needed to create repeatable scripts for consistently spinning-up and spinning-down environments.

- Build pipelines - Based on tools such as Maven or Gradle, as discussed earlier in this documentation.

- Deployment pipelines - You can use GitHub Actions, Azure Pipelines, Jenkins Pipelines, GitLab Pipelines, or the Azure CLI to automate code deployments, including blue/green deployments that keep critical systems in production as you deploy code updates.

## Continue to use existing practices and systems

As you migrate or build and then scale your Java applications on Azure, you can use your existing investments in networking, monitoring, automation, identity providers, on-premises systems, development and build tool, and app libraries. The following table provides some examples:

| Category           | Java ecosystem products and services                                                                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Networking         | F5, Palo Alto, Cloudflare, Checkpoint, Infoblox                                                                                                                            |
| Monitoring         | New Relic, Dynatrace, AppDynamics, Elastic, Splunk                                                                                                                         |
| Automation         | GitHub Actions, Azure Pipelines, Jenkins, GitLab                                                                                                                           |
| Identity providers | Microsoft Entra ID, ForgeRock, Auth0, Ping, Okta                                                                                                                           |
| On-premises system | Databases (such as Oracle DB or IBM DB2), messaging (such as IBM MQ or TIBCO EMS), eventing (such as Kafka), directories (such as Microsoft Entra ID, OpenLDAP, or IBM ID) |
| Development tools  | IntelliJ, Visual Studio Code, Eclipse, Spring Tool Suite, Maven, Gradle                                                                                                    |

## Reference architectures

The [Azure Architecture Center](/azure/architecture) provides guidance for building solutions on Azure using established patterns and practices, including how to put these capabilities to use. These reference architectures are based on what we learned from customer engagements, taking into consideration cost optimization, operational excellence, performance efficiency, reliability, scalability, security, monitoring, smoke-testing, and more. They also address solution design components such as Azure landing zones - environments for hosting your workloads that are pre-provisioned through infrastructure-as-code, as needed to enable Java application migrations and greenfield development at enterprise scale.

For example, here's a [landing zone accelerator for Azure Container Apps](/azure/cloud-adoption-framework/scenarios/app-platform/container-apps/landing-zone-accelerator), showing how to implement a hub-and-spoke design in which Azure Container Apps is deployed in a single spoke that's dependent on shared services hosted in the hub. This project is built with components to achieve the tenets in the [Microsoft Azure Well-Architected Framework](/azure/well-architected). To explore an implementation of this architecture, see the [Azure Container Apps Landing Zone Accelerator](https://github.com/Azure/ACA-Landing-Zone-Accelerator) repository on GitHub. You can apply the same approach to any Java applications deployed to any Azure compute destination - such as Azure App Service or Azure Kubernetes Service. In addition, if you're looking at migrating existing Java applications to Azure, we have a comprehensive set of migration guides and recommended strategies.

:::image type="content" source="media/scale-end-to-end.png" alt-text="Diagram with the heading 'Scale with end-to-end security, monitoring and automation' and logos for the tools described in this article." border="false" lightbox="media/scale-end-to-end.png":::

## Next step

[Choose the right Azure services for your Java applications](choose.md)

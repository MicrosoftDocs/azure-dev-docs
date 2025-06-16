---
title: Migrate JBoss EAP applications to Azure Red Hat OpenShift
description: This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on Azure Red Hat OpenShift.
author: KarlErickson
ms.author: karler
ms.topic: upgrade-and-migration-article
ms.date: 09/20/2024
ms.custom: template-how-to, devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-aro, migration-java, devx-track-extended-java, linux-related-content
---

# Migrate JBoss EAP applications to Azure Red Hat OpenShift

This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on Azure Red Hat OpenShift.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [vm-aro-tradeoffs-eap](includes/vm-aro-tradeoffs-eap.md)]

### Determine whether the prebuilt Azure Marketplace offer is a good starting point

First, decide that Azure Red Hat OpenShift is the appropriate deployment target. Next, decide whether or not the prebuilt [Azure Marketplace offer](https://aka.ms/eap-aro-portal) is a good starting point. Consider the following points about the prebuilt Azure Marketplace offer:

- Red Hat and Microsoft created this offer to enable quickly provisioning JBoss EAP on Azure Red Hat OpenShift.
- At a high level, the offer automates the following steps for you.
  - Install the EAP Operator on Azure Red Hat OpenShift.
  - Build an application image using eap-s2i-build template. For more information about Source-to-image (S2I), see [Using OpenJDK 11 source-to-image for OpenShift](https://docs.redhat.com/en/documentation/red_hat_build_of_openjdk/11/html/using_source-to-image_for_openshift_with_red_hat_build_of_openjdk_11/index).
  - Deploy the Java application using the EAP Operator. For more information, see the reference documentation for EAP Operator at [Red Hat](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_online/eap-operator-for-automating-application-deployment-on-openshift_default).

If you don't use the prebuilt Azure Marketplace offer, you must learn how to use the EAP Operator directly. Mastering the operator is beyond the scope of this article. The complete documentation for the EAP Operator is available at [Red Hat](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_online/eap-operator-for-automating-application-deployment-on-openshift_default).

The remainder of this section provides some considerations for deciding to use the prebuilt Azure Marketplace offer or using the operator directly.

### Determine whether the JBoss EAP version is compatible

Your existing JBoss EAP version must be one of the versions supported by the operator. For more information, see [Version Compatibility and Support](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_container_platform/introduction#version_compatibility_support) in the Red Hat documentation.

### Inventory server capacity

Document the hardware (memory, CPU, disk) of the current production server(s) and the average and peak request counts and resource utilization. You need this information regardless of the migration path you choose. The following aspects, and more, benefit from having a detailed inventory of server capacity.

- To help guide selection of the size of the VMs in your node pool.
- To understand the amount of memory to be used by the container.
- To know how many CPU shares the container needs.

It's possible to resize node pools in Azure Red Hat OpenShift. For more information, see [Resizing a cluster--Microsoft Azure](https://access.redhat.com/documentation/en-us/red_hat_advanced_cluster_management_for_kubernetes/2.0/html/manage_cluster/resizing-a-cluster#microsoft-azure) in the Red Hat documentation.

### Inventory all secrets

Before the advent of "configuration as a service" technologies such as Azure Key Vault, there wasn't a well-defined concept of "secrets". Instead, you had a disparate set of configuration settings that effectively functioned as what we now call "secrets". With app servers such as JBoss EAP, these secrets are in many different config files and configuration stores. Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check configuration files like **custom-config.xml** or **jboss-web.xml** in your applications. Configuration files containing passwords or credentials may also be found inside your application. For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).

Once you have a solid inventory of secrets, consult the EAP Operator documentation regarding secrets. For more information, see [Creating a Secret](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_online/eap-operator-for-automating-application-deployment-on-openshift_default#creating-a-secret_default) in the Red Hat documentation.

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

Once you have a solid inventory of certificates, you can configure them in Azure Red Hat OpenShift. For more information, see [TLS configuration in OpenShift Container Platform(replace)](https://access.redhat.com/articles/5348961) in the Red Hat documentation.

### Validate that the supported Java version works correctly

All of the migration paths for JBoss EAP to Azure Red Hat OpenShift require a specific Java version, which varies for each path. You need to validate that your application is able to run correctly using that supported version.

[!INCLUDE [note-obtain-your-current-java-version](includes/note-obtain-your-current-java-version.md)]

### Inventory JNDI resources

Inventory all JNDI resources. For example, datasources such as databases may have an associated JNDI name that allows JPA to correctly bind instances of `EntityManager` to a particular database. For more information on JNDI resources and databases, see [Datasource Management](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/configuration_guide/datasource_management#doc-wrapper) in the Red Hat documentation. Other JNDI-related resources, such as ActiveMQ Artemis message brokers, may require migration or reconfiguration. For more information on ActiveMQ Artemis configuration, see [Configuring Messaging](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/configuring_messaging/index) in the Red Hat documentation.

### Determine whether session replication is used

If your application relies on session replication, with or without [Infinispan](https://infinispan.org/), you have three options:

- Infinispan works well in Azure virtual machines, but if you're using a profile that provides high availability capabilities, be aware of the `JGroups` configuration. Determine whether your system is operating as a managed domain or standalone server.
  - If in a managed domain, the `ha` or `full-ha` profiles deal with JGroups.
  - If in a standalone server, the **standalone-ha.xml** or **standalone-full-ha.xml** configuration files deal with JGroups.
  - Microsoft Azure doesn't support JGroups discovery protocols that are based on UDP multicast. For more information, see [Using JBoss EAP High Availability in Microsoft Azure](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.0/html/using_jboss_eap_in_microsoft_azure/using_jboss_eap_high_availability_in_microsoft_azure#doc-wrapper) in the Red Hat documentation.
- Refactor your application to use a database for session management.
- Refactor your application to externalize the session to Azure Redis Service. For more information, see [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

For all of these options, it's a good idea to master how JBoss EAP does HTTP Session State Replication. For more information, see [About HTTP Session Replication](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/development_guide/clustering_in_web_applications#about_http_session_replication) in the Red Hat documentation.

### Document datasources

If your application uses any databases, you need to capture the following information:

- What is the datasource name?
- What is the connection pool configuration?
- Where can I find the JDBC driver JAR file?

For more information on JDBC drivers in JBoss EAP, see [Datasource Management](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/configuration_guide/datasource_management) in the Red Hat documentation.

### Determine whether JBoss EAP has been customized

Determine which of the following customizations have been made, and capture what's been done.

- Have the startup scripts been changed? Such scripts include **host**, **eap_env**, **standalone**, and **domain**.
- Are there any specific parameters passed to the JVM?
- Are there JARs added to the server classpath?

These customizations need to be captured in the container image running on Azure Red Hat OpenShift. For more information, see [Configuring the JBoss EAP for OpenShift Image for Your Java Application](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_container_platform/configuring_eap_openshift_image) in the Red Hat documentation.

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

### Determine whether Java Message Service (JMS) Queues or Topics are in use

If your application is using JMS Queues or Topics, you may want to migrate them to an externally hosted JMS server. Azure Service Bus and the Advanced Message Queuing Protocol can be a great migration strategy for those using JMS. For more information, see [Use Java Message Service 1.1 with Azure Service Bus standard and AMQP 1.0](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp).

If JMS persistent stores have been configured, you must capture their configuration and apply it after the migration.

For more information, see [Configuring Messaging](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html-single/configuring_messaging/index) in the Red Hat documentation.

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

You can handle these libraries using the same techniques as described in the [Determine whether JBoss EAP has been customized](#determine-whether-jboss-eap-has-been-customized) section.

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

Azure Red Hat OpenShift runs on OpenShift 4 using Red Hat Enterprise Linux CoreOS (RHCOS) as the operating system for all control plane and worker nodes. Any OS-specific code must be compatible with RHCOS.

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to capture their configurations.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Account for load-balancing requirements

The best way to account for load balancing is to use the App Gateway integration. For more information, see [What is Azure Application Gateway?](/azure/application-gateway/overview)

## Migration

The steps in this section assume that your analysis has lead you to decide to use the prebuilt Azure Marketplace offer.

### Provision the offer

To open the offer in the Azure portal, see [JBoss EAP on Azure Red Hat OpenShift](https://aka.ms/eap-aro-portal). Select **Create**, and then follow the instructions in the offer.

### Migrating your applications

The offer supports the Source-to-Image (S2I) process to build and run a Java application on the JBoss EAP for OpenShift image. Red Hat has a sample that shows how to do it manually if you'd like to deploy later by yourself. For more information, see [Chapter 2. Build and Run a Java Application on the JBoss EAP for OpenShift Image](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_container_platform/build_run_java_app_s2i) in the Red Hat documentation.

## Post-migration

After you've reached the migration goals you defined in the [pre-migration](#pre-migration) step, perform some end-to-end acceptance testing to verify that everything works as expected. For information about some potential post-migration enhancements, see the following articles:

- Implement scaling. Dynamic scaling is a key value proposition to justify the complexity of using Azure Red Hat OpenShift. For information about achieving your scaling solution, see [Applying autoscaling to an OpenShift Container Platform cluster](https://docs.openshift.com/container-platform/4.12/machine_management/applying-autoscaling.html) in the OpenShift documentation.

- You may want to do more configuration on the Application Gateway. For more information, see [Application Gateway configuration overview](/azure/application-gateway/configuration-overview).

- Enhance your network topology with advanced load balancing services. For more information, see [Using load-balancing services in Azure](/azure/traffic-manager/traffic-manager-load-balancing-azure).

- Get Java-optimized application performance monitoring with Azure Monitor and Application Insights. For more information, see [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](/azure/azure-monitor/app/kubernetes-codeless).

- Deploy your applications to your migrated Azure Red Hat OpenShift cluster with Azure DevOps. For more information, see [Get started with Azure DevOps documentation](/azure/devops/get-started).

- Use Azure Managed Identities to manage  secrets and assign role-based access to Azure resources. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

- Integrate Java EE authentication and authorization with Microsoft Entra ID. For more information, see [Integrating Microsoft Entra ID with applications getting started guide](/azure/active-directory/manage-apps/plan-an-application-integration).

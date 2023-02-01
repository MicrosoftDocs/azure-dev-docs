---
title: Passwordless connections for Azure services
description: Describes the security challenges with passwords and introduces passwordless connections for Azure services.
ms.topic: overview
ms.date: 01/12/2023
ms.author: asirveda
author: KarlErickson
ms.service: azure
ms.custom: devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-javaee-wls-vm, passwordless-dotnet, passwordless-java, passwordless-js, passwordless-python
---

# Passwordless connections for Azure services

> [!NOTE]
> Passwordless connections is a language-agnostic feature spanning multiple Azure services. Although the current documentation focuses on a few languages and services, we're currently in the process of producing additional documentation for other languages and services.

This article describes the security challenges with passwords and introduces passwordless connections for Azure services.

## Security challenges with passwords

Passwords should be used with caution, and developers must never place passwords in an unsecure location. Many applications connect to backend data, cache, messaging, and eventing services using usernames and passwords. If exposed, these credentials could be used to gain unauthorized access to sensitive information such as a sales catalog that you built for an upcoming campaign, or customer data that must be private.

Embedding passwords in an application itself presents a huge security risk for many reasons, including discovery through a code repository. Many developers externalize such passwords using environment variables so that applications can load them from different environments. However, this only shifts the risk from the code itself to an execution environment. Anyone who gains access to the environment can steal passwords, which in turn, increases your data exfiltration risk.

Many companies have strict security requirements to connect to Azure services without exposing passwords to developers, operators, or anyone else. They often use a vault to store and load passwords into applications, and they further reduce the risk by adding password-rotation requirements and procedures. This approach, in turn, increases the operational complexity and, at times, leads to application connection outages.

## Passwordless connections and Zero Trust

You can now use passwordless connections in your apps to connect to Azure-based services without any need to rotate passwords. All you need is configuration - no new code is required.

Zero Trust uses the principle of "never trust, always verify, and credential-free". This means securing all communications by trusting machines or users only after verifying identity and prior to granting them access to backend services.

The recommended authentication option for secure, passwordless connections is to use managed identities and Azure role-based access control (RBAC) in combination. With this approach, you don't have to manually track and manage many different secrets for managed identities because these tasks are securely handled internally by Azure.

You can configure passwordless connections to Azure services using Service Connector or you can configure them manually. Service Connector enables managed identities in app hosting services like Azure Spring Apps, App Service, and Azure Container Apps. Service Connector configures backend services with passwordless connections using managed identities and Azure RBAC, and hydrates applications with necessary connection information.

If you inspect the running environment of an application configured for passwordless connections, you can see the full connection string. The connection string carries, for example, a database server address, a database name, and an instruction to delegate authentication to a Microsoft Azure authentication plugin.

The following video illustrates passwordless connections from apps to Azure services, using Java applications as an example. Similar coverage for other languages is forthcoming.

<br>

> [!VIDEO https://www.youtube.com/embed/X6nR3AjIwJw]

## See also

For a more detailed explanation of passwordless connections, see the developer guide [Configure passwordless connections between multiple Azure apps and services](/azure/storage/common/multiple-identity-scenarios?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json).

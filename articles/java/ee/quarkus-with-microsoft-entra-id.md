---
title: "Quarkus with Microsoft Entra ID"
description: Shows how to secure Quarkus applications with Microsoft Entra ID using OpenID Connect.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 06/14/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, devx-track-javaee-quarkus-entra-id, devx-track-extended-java, devx-track-azurecli
---

# Secure Quarkus applications with Microsoft Entra ID using OpenID Connect

This article shows you how to secure Red Hat Quarkus applications with Microsoft Entra ID using OpenID Connect with a simple web application.

In this article, you learn how to:

> [!div class="checklist"]
> - Set up an OpenID Connect provider with Microsoft Entra ID.
> - Protect a Quarkus app by using OpenID Connect.
> - Run and test the Quarkus app.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- The Azure account must be at least a [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator).
- If you don't have an existing Microsoft Entra tenant, [set up a tenant](/entra/identity-platform/quickstart-create-new-tenant).
- Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, or Windows Subsystem for Linux).
- Install and set up [Git](/devops/develop/git/install-and-set-up-git).
- Install a Java SE implementation, version 21 or later - for example, [the Microsoft build of OpenJDK](/java/openjdk).
- Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.


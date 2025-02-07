---
title: Get Started with the Spring Boot Admin Component of the Java Diagnostic Tool (diag4j) on Azure Kubernetes Service.
description: Shows you how to get started with the Spring Boot Admin component of the Java Diagnostic Tool (diag4j) on Azure Kubernetes Service.
author: KarlErickson
ms.author: xuycao
ms.topic: article
ms.date: 02/07/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Get started with the Spring Boot Admin component of the Java Diagnostic Tool (diag4j) on Azure Kubernetes Service

This article provides step-by-step instructions to set up and start using the Spring Boot Admin component of the Java Diagnostic Tool (diag4j) on Azure Kubernetes Service (AKS). By following these steps, you can monitor and diagnose your Java applications efficiently.

## Prerequisites

- A running AKS cluster with necessary permissions.
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed and configured to access your AKS cluster.
- [Helm](https://helm.sh/docs/intro/install/) installed on your local machine.
- Java applications deployed in AKS. For more information, see [Deploy Spring Boot Application to Azure Kubernetes Service](../spring-framework/deploy-spring-boot-java-app-on-kubernetes.md). The tool works better when Spring Boot actuator endpoints are enabled.
- Developer access to the namespace hosting diag4j. Ensure that you can execute `kubectl port-forward`.

## Install diag4j in your cluster

Use the following command to install diag4j in the desired namespace:

```bash
helm install my-diag4j oci://diag4j.azurecr.io/helm/diag4j --version 1.1.5 -n <namespace> --create-namespace
```

## Create a Spring Boot Admin component

Use the following commands to create a Spring Boot Admin (SBA) component:

1. Apply a custom resource (CR) to create a Spring Boot Admin component. Create a file named **spring-boot-admin.yaml**, and then add the following contents. Replace `<namespace>` with the namespace that your Spring Boot apps are running in. SBA will auto-discover apps whose actuator endpoints are exposed. Others will show with the `DOWN` status on the dashboard.

   ```yaml
   apiVersion: diagtool4j.microsoft.com/v1alpha1
   kind: Component
   metadata:
       name: spring-boot-admin
       namespace: <namespace>
   spec:
       type: SpringBootAdmin
   ```

1. Use the following command to apply the CR:

   ```bash
   kubectl apply -f spring-boot-admin.yaml
   ```

## Access the diag4j dashboard

Use the following steps to access the dashboard:

1. Use the following command to configure local port forwarding to the SBA server:

   ```bash
   kubectl port-forward svc/spring-boot-admin-azure-java -n <namespace> 8080:8080
   ```

1. Navigate to `http://localhost:8080` in your browser to view the SBA dashboard. All applications in the same namespace should be registered automatically.

   :::image type="content" source="media/java-diagnostic-tool/spring-boot-admin-dashboard.png" alt-text="Screenshot of the Spring Boot Admin dashboard." lightbox="media/java-diagnostic-tool/spring-boot-admin-dashboard.png":::

## Use the diagnostic features

To view application metrics, click on the application in the SBA dashboard. You can view real-time metrics including the following metrics:

- CPU & memory usage
- Garbage collection (GC) status
- Active threads and environment variables

:::image type="content" source="media/java-diagnostic-tool/app-details.png" alt-text="Screenshot of the Spring Boot Admin dashboard page that shows application metrics." lightbox="media/java-diagnostic-tool/app-details.png":::

To adjust log levels, navigate to the **Loggers** section. You can then modify log levels dynamically for specific packages or classes in order to isolate issues.

:::image type="content" source="media/java-diagnostic-tool/log-level-change.png" alt-text="Screenshot of the Spring Boot Admin dashboard page that shows the Loggers section." lightbox="media/java-diagnostic-tool/log-level-change.png":::

To perform advanced diagnostics, generate heap dumps and thread dumps for in-depth analysis.

## Next step

[Get started with the Java Diagnostic Agent](java-diagnostic-tools-jda-quickstart.md)

---
title: Get Started with Java Diagnostic Agent
description: The quickstart guide for Java Diagnostic Agent
author: 
ms.author: xuycao
ms.topic: article
ms.date: 12/17/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Get Started with Java Diagnostic Tool (diag4j) on AKS

## Introduction
This guide provides step-by-step instructions to set up and start using the Spring Boot Admin component of the Java Diagnostic Tool (diag4j) on Azure Kubernetes Service (AKS). By following these steps, developers can monitor and diagnose their Java applications efficiently.

## Prerequisites

Before starting, ensure the following prerequisites are met:

1. Kubernetes Cluster: A running AKS cluster with necessary permissions.
2. kubectl: Installed and configured to access the AKS cluster.
3. Helm: Installed on your local machine.
4. Java Applications: Applications deployed in AKS (better with Spring Boot actuator endpoints enabled.)
5. Permissions: Developer access to the namespace hosting diag4j. Ensure you can execute `kubectl port-forward`.

## Steps

### Step 1: Install diag4j in Your Cluster

1. Add the diag4j Helm repository:
    ```bash
    helm repo add diag4j-repo https://microsoft.github.io/diag4j
    helm repo update
    ```

2. Install diag4j in the desired namespace:

    ```bash
    helm install diag4j diag4j-repo/diag4j --version 1.1.5 -n <namespace> --create-namespace
    ```

>  **Note:** If you need help to deploy your Java application to AKS, please refer to this guide to deploy a sample Java app to your AKS: [Deploy an app on AKS](../spring-framework/deploy-spring-boot-java-app-on-kubernetes.md)

### Step 2: Create a Spring Boot Admin component

1. Apply the following CR to create a Spring Boot Admin component:

    > **Note**: Replace `<namespace>` with the namespace where Spring Boot apps are running in. SBA will auto-discover apps whose actuator endpoints are exposed. Others will show as `DOWN` status on the dashboard.
    ```yaml
    apiVersion: diagtool4j.microsoft.com/v1alpha1
    kind: Component
    metadata:
        name: spring-boot-admin
        namespace: <namespace>
    spec:
        type: SpringBootAdmin
    ```

    Save the file as `spring-boot-admin.yaml` and apply it:

    ```bash
    kubectl apply -f spring-boot-admin.yaml
    ```

### Step 3: Access the diag4j Dashboard

1. Port Forwarding
    
    Access the Spring Boot Admin (SBA) server locally by forwarding its port:

    ```bash
    kubectl port-forward svc/spring-boot-admin-azure-java -n <namespace> 8080:8080
    ```

2. Navigate to http://localhost:8080 in your browser to view the SBA dashboard, all applications in the same namespace should be registered automatically.

![sba-dashboard](images/sba-dashboard.png)

### Step 4: Use Diagnostic Features

1. View Application Metrics:

- Click on the application in the SBA dashboard to access real-time metrics like:
  - CPU & memory usage.
  - Garbage collection (GC) status.
  - Active threads and environment variables.

![sba-app-details](images/app-details.png)

2. Adjust Log Levels:

- Navigate to the Loggers section.
- Modify log levels dynamically for specific packages or classes to isolate issues.

![sba-change-log-level](images/log-level-change.png)

3. Perform Advanced Diagnostics:

- Generate heap dumps and thread dumps for in-depth analysis.

## Next Steps

- Explore diagnostic agent of diag4j tool [Quick Start Guide](java-diagnostic-tools-jda-quickstart.md)
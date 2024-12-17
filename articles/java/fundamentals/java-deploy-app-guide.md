---
title: Tutorial: Deploy a Java application on AKS
description: This guide shows how to deploy a Java application on Azure Kubernetes Service (AKS)
author: 
ms.author: xuycao
ms.topic: article
ms.date: 12/17/2024
ms.custom: devx-track-java, devx-track-extended-java
---

# Tutorial: Deploy a Java application on AKS
This guide will walk you through how to deploy a Java application on Azure Kubernetes Service (AKS). After deployment, 
you can use Java Diagnostic Tool (diag4j) to do some troubleshooting and monitoring.

## Prerequisites
- Prepare a container registry to store the application image.
- Run Docker in your local environment.
- Have Maven installed

## Steps
1. Build the application with Spring Boot maven plugin and generate a Docker image.

- Add the following Spring Boot maven plugin dedenedency to the pom.xml in your Java application.
    ```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <image>
                        <name>{your-image-name}:{your-image-tag}</name>
                    </image>
                </configuration>
            </plugin>
        </plugins>
    </build>
    ```

- Run `mvn` command to build the image
    ```bash
    # Pack OCI image with [Spring Boot Maven Plugin](https://docs.spring.io/spring-boot/maven-plugin/build-image.html)
    mvn spring-boot:build-image
    ```


2. Push the Docker image to the container registry.
```bash
# Replace the image name with your own container registry.
docker push {your-image-name}:{your-image-tag}
```

3. Deploy the application on AKS.

- here is a template yaml file for the application: 

```bash
# replace the placeholders <namespace> & <container-image> in template yml file with your own container image just created.
kubectl apply -f sample-app.yml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
  name: sample-app
  # Please replace the placeholder
  namespace: <namespace>
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: sample-app
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      annotations:
      labels:
        app: sample-app
    spec:
      containers:
      # Please replace the placeholder
      - image: <container-image>
        imagePullPolicy: Always
        name: sample-app
        resources:
          limits:
            cpu: 500m
            memory: 1Gi
          requests:
            cpu: 220m
            memory: 1Gi
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
---
apiVersion: v1
kind: Service
metadata:
  name: sample-app
  # Please replace the placeholder
  namespace: <namespace>
  labels:
    app: sample-app
spec:
  ports:
    # Please double confirm your app is listening to port 8080
    - port: 8080
      targetPort: 8080
  selector:
    app: sample-app
  type: ClusterIP

```



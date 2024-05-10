---
title: Deploy a Java MicroProfile service 
titleSuffix: Azure Web App for Containers
description: Learn how to deploy a MicroProfile service using Docker and Azure Web App for Containers. Build tiny Java applications that can be quickly and easily deployed.
author: KarlErickson
ms.author: jialuogan
ms.date: 06/02/2022
ms.topic: how-to
ms.custom: devx-track-java, kr2b-contr-experiment, devx-track-extended-java
---

# Deploy a Java-based MicroProfile service to Azure Web App for Containers

MicroProfile is a great way to build tiny Java applications that can be quickly and easily deployed to services such as [Azure Web App for Containers](https://azure.microsoft.com/services/app-service/containers/). In this article, you create a MicroProfile-based microservice. Then, you containerize it into a Docker container, deploy it into [Azure Container Registry](https://azure.microsoft.com/services/container-registry/), and host it using Azure Web App for Containers.

> [!NOTE]
> This procedure works with any implementation of MicroProfile as long the Docker container image is self-executable, that is, includes the runtime.

This sample uses [Payara Micro](https://www.payara.fish/products/payara-micro/) and [MicroProfile 1.3](https://microprofile.io/) to create a tiny Java *.war* file, which is only 5,085 bytes. You then page it into a Docker image, which is approximately 174 megabytes. This Docker image contains everything needed for a fully containerized deployment of this webapp.

The entire 174 megabyte Docker image often doesn't need to be redeployed whenever the application source code is changed. Docker only uploads the differences. Therefore, the process of running a new release of a MicroProfile application by using a CI/CD pipeline is efficient and quick, reducing friction and enabling rapid development iteration.

Start by creating and running the code locally. Then deploy it as a web app on Azure. In both cases, use Docker to simplify and standardize your efforts. Before you begin, create an Azure Container Registry to store Docker containers.

## Create an Azure Container Registry

Use the [Azure portal](https://portal.azure.com) for creating the Azure Container Registry. There are alternate choices, such as the Azure CLI. Follow the steps below to create a new Azure Container Registry:

1. Sign in to the [Azure portal](https://portal.azure.com) and create a new Azure Container Registry resource. Provide a registry name. This name is the one that should be set as the `docker.registry` property in the *pom.xml* file. Customize the defaults, and then select **Create**.

1. Once the container registry is live, which takes about 30 seconds, select the container registry. Select **Access keys** in the left menu. Enable the **admin user** setting, so that this container registry can be accessed from your computer. This setting also enables access from the Azure Web Apps for the Containers instance you set up.

1. While you are in the **Access keys** area, note the `username` and `password` values. Copy these values into the global Maven *settings.xml* file. For more information on Maven settings, see the [Apache Maven Project](https://maven.apache.org/settings.html). Here's a sample of the *${user.home}/.m2/settings.xml* file:

    ```xml
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
          <server>
            <id>username.azurecr.io</id>
            <username>username</username>
            <password>your-password</password>
          </server>
        </servers>
    </settings>
    ```

## Creating our MicroProfile application

Next, build and run the MicroProfile application locally. This example is based on a sample application available on GitHub. Clone that and then step through the code. Follow these steps to get the code:

```cmd
git clone https://github.com/Azure-Samples/microprofile-docker-helloworld.git
cd microprofile-docker-helloworld
```

In this directory, there's a *pom.xml* file that specifies the project in the format used by the Maven build tool. You can edit this file to suit your needs. In particular, change the `docker.registry` and `docker.name` property values created when you set up the Azure Container Registry.

Another file of note in this directory is the *dockerfile*, which is reproduced below:

```dockerfile
FROM payara/micro

ARG WAR_FILE
COPY target/${WAR_FILE} $DEPLOY_DIR

EXPOSE 8080
```

This *dockerfile* creates a new Docker container based on the Payara Micro Docker Container. It copies the *.war* file that is created as part of the build process. It also exposes port 8080 so that you can access the service once it's up and running within a Docker container.

Diving into the *src* directory, you find the `Application` class reproduced below:

```java
package com.microsoft.azure.samples.microprofile.docker.helloworld;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class Application extends javax.ws.rs.core.Application { }
```

The `@ApplicationPath("/api")` annotation specifies the base endpoint for this microservice. All endpoints have `/api` precede the rest of the URL required to access any specific REST endpoint.

Inside the `api` package is a class named `API`, which contains the following code:

```java
package com.microsoft.azure.samples.microprofile.docker.helloworld.api;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import static javax.ws.rs.core.MediaType.TEXT_HTML;

@ApplicationScoped
@Path("/")
public class API {

    @GET
    @Path("/helloworld")
    @Produces(TEXT_HTML)
    public String info() {
        return "Hello, world!";
    }
}
```

By using the `@Path("/helloworld")` annotation, you can see that this REST endpoint, when combined with the `/api` specified in the `Application` class, is `/api/helloworld`. When this endpoint is called using an HTTP GET request, the method produces `text/html`. It's a hard-coded string "Hello, world!".

This code is all the code required to create a microservice using MicroProfile. Use Maven to build it, containerize it into a Docker container, and run it locally. Use the following steps:

1. Run `mvn clean package` and wait until it successfully completes.

1. Run `docker run -it --rm -p 8080:8080 <docker.registry>/<docker.name>:latest`.

1. Try accessing `http://localhost:8080/microprofile/api/helloworld` and `http://localhost:8080/health` in your web browser. If you see the expected "Hello, world!" response and health-related information for the `/health` endpoint, you've successfully deployed the MicroProfile application on your local machine.

## Push to the Azure Container Registry

Now that you've successfully built and run our MicroProfile application locally, the next step is to push this container into our container registry. For this article, you use the Azure Container Registry, but any container registry works, as long as the *pom.xml* file is edited to point to the relevant location.

1. Run `mvn clean package` to clean, compile, and create a local docker image.

2. Run `mvn dockerfile:push` to push to the Azure Container Registry.

## Create an Azure Web App for Containers instance

You now have your Docker container image uploaded to the Azure Container Registry. It isn't running yet. Next, deploy it into an Azure Web App for Containers instance.

1. Return to the [Azure portal](https://portal.azure.com) and create a new Web App for Containers instance. Keep the following pointers in mind:

   - The name you specify is the public URL of the web app. It's a good idea to pick a name that you can easily remember. You can add a custom domain later.

   - When you get to the **Configure container** section, you can select **Azure Container Registry** for the **Image source**, and then select the correct image from the drop-down lists.

   - You don't need to specify any value in the **Startup File** field.

1. Once the instance is created, select it and then select the **Application Settings** menu item. Add a new application setting, where the key is `WEBSITES_PORT` and the value is `8080`. This setting tells Azure which port you want to expose in the container, and it's mapped to port 80 externally.

1. Optionally, select **Docker Container** link. Enable **Continuous Deployment**. Whenever you update the Azure Container Registry image, the value is updated in the Azure Web App for Containers instance.

1. You should be able to access the Azure-hosted instances at `http://<appname>.azurewebsites.net/microprofile/api/helloworld` and `http://<appname>.azurewebsites.net/health`.

## Next steps

In this article, you created a simple MicroProfile-based microservice, containerized it into a Docker container, then ran it locally and published it to Azure. There's a wealth of tutorials and advice on MicroProfile on the internet. Review this article for more content:

- [MicroProfile.io](https://microprofile.io/)

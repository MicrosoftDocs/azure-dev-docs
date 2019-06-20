---
title: Deploy a Java-based MicroProfile service to Azure Web App for Containers
description: Learn how to deploy a MicroProfile service using Docker and Azure Web App for Containers
services: container-registry;app-service
documentationcenter: java
author: jonathangiles
manager: routlaw
editor: jonathangiles

ms.assetid:
ms.author: jogiles
ms.date: 09/07/2018
ms.devlang: java
ms.service: container-registry;app-service
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
---

# Deploy a Java-based MicroProfile service to Azure Web App for Containers

MicroProfile is a great way to build exceedingly tiny Java applications that can be quickly and easily deployed to services such as [Azure Web App for Containers](https://azure.microsoft.com/services/app-service/containers/). In this tutorial we will create a simple MicroProfile-based microservice that is then containerized into a Docker container, deployed into an [Azure Container Registry](https://azure.microsoft.com/services/container-registry/), and then hosted using Azure Web App for Containers.

> [!NOTE]
>
> This procedure works with any implementation of MicroProfile.io as long the Docker container image is self-executable (i.e. includes the runtime).

More concretely, this sample makes use of [Payara Micro](https://www.payara.fish/payara_micro) and [MicroProfile 1.3](https://microprofile.io/) to create a tiny Java war file (5,085 bytes on the authors machine), and then packages it up into a Docker image (which is approximately 174 megabytes). This Docker image contains everything necessary for a fully-containerised deployment of this webapp.

Because of the way Docker works, it is often the case that the entire 174 megabyte Docker image does not need to be redeployed whenever the application source code is changed, as Docker will only upload the differences (which is significantly smaller). This makes the process of executing a new release of a MicroProfile application via a CI/CD pipeline extremely efficient and quick, reducing friction and enabling rapid development iteration.

We will work through this tutorial firstly by creating and running the code locally, and then we will deploy this as a web app on Azure. In both cases we will depend on Docker to simplify and standardize our efforts. Before we begin, we will create an Azure Container Registry to store our Docker containers in.

## Creating an Azure Container Registry

We will use the [Azure Portal](http://portal.azure.com) for creating the Azure Container Registry, but note that there are alternate choices such as the Azure CLI. Follow the steps below to create a new Azure Container Registry:

1. Log in to the [Azure Portal](http://portal.azure.com) and create a new Azure Container Registry resource. Provide a registry name (note that this is the name that should be set as the `docker.registry` property in `pom.xml`). Change the defaults as you wish, and then click 'create'.

1. Once the container registry is live (which is about 30 seconds after clicking 'create'), click on the container registry, and click on the 'Access keys' link in the left-menu area. In here, you need to enable the 'admin user' setting, so that this container registry can be accessed from our machines (to push docker containers into), and also to enable access from the Azure Web Apps for Containers instance we will setup soon.

1. Whilst you are in the 'Access keys' area, note the `username` and `password` values. We will copy / paste these into our global Maven `settings.xml` file  (for more information on Maven settings, refer to the [Apache Maven Project](https://maven.apache.org/settings.html) website). For reference, here is an obfuscated version of the `${user.home}/.m2/settings.xml` file on the authors system:

    ```xml
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
        <servers>
          <server>
            <id>jogilescr.azurecr.io</id>
            <username>jogilescr</username>
            <password>ojoirshois.this-isn't-real.hrihslirhlishrglih</password>
          </server>
        </servers>
    </settings>
    ```

Now that this is complete, we can move on with building and running our MicroProfile application locally.

## Creating our MicroProfile application

This example is based on a sample application available on GitHub, so we will clone that and then step through the code. Follow the steps below to get the code cloned onto your machine:

1. `git clone https://github.com/Azure-Samples/microprofile-docker-helloworld.git`
1. `cd microprofile-docker-helloworld`

In this directory there is a `pom.xml` file that is used to specify the project in the format used by the Maven build tool. This file can be edited to suit your own needs. In particular, the `docker.registry` and `docker.name` properties should be changed to the `docker.registry` and `docker.name` created when the Azure Container Registry was setup.

Another file of note in this directory is the Dockerfile, which is reproduced below:

```dockerfile
FROM payara/micro

ARG WAR_FILE
COPY target/${WAR_FILE} $DEPLOY_DIR

EXPOSE 8080
```

This Dockerfile simply creates a new Docker container based on the Payara Micro Docker Container, and copies in the .war file that is created as part of our build process. It also exposes port 8080 so that we may access the service once it is up and running within a Docker container.

Diving into the `src` directory, we will eventually discover the `Application` class reproduced below:

```java
package com.microsoft.azure.samples.microprofile.docker.helloworld;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class Application extends javax.ws.rs.core.Application { }
```

The `@ApplicationPath("/api")` annotation specifies the base endpoint for this microservice - that is, that all endpoints will have `/api` preceed the rest of the URL required to access any specific REST endpoint.

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

Through the use of the `@Path("/helloworld")` annotation, we can see that this REST endpoint, when combined with the `/api` specified in the `Application` class, will be `/api/helloworld`. When this endpoint is called using an HTTP GET request, we can see that the method will produce text/html, and in fact it is simply a hard-coded string "Hello, world!".

We have now covered all the code required to create a microservice using MicroProfile. We can now use Maven to build it, containerize it into a Docker container, and run it locally. We can do that with the following steps:

1. Run `mvn clean package` and wait until it successfully completes.

1. Run `docker run -it --rm -p 8080:8080 <docker.registry>/<docker.name>:latest`, for example, `docker run -it --rm -p 8080:8080 jogilescr.azurecr.io/samples/docker-helloworld:latest`, if your `docker.registry` is `jogilescr.azurecr.io` and `docker.name` is `samples/docker-helloworld`.

1. Try accessing [http://localhost:8080/microprofile/api/helloworld](http://localhost:8080/microprofile/api/helloworld) and [http://localhost:8080/health](http://localhost:8080/health) in your web browser. If you see the expected "Hello, world!" response (and health-related information for the [/health](http://localhost:8080/health) endpoint), you have successfully deployed the MicroProfile application on your local machine.

## Pushing to the Azure Container Registry

Now that we have successfully built and run our MicroProfile application on our local machine, the next step is to push this container into our container registry. In this tutorial we are using the Azure Container Registry, but any container registry will work (as long as the `pom.xml` file is edited to point to the relevant location).

1. Run `mvn clean package` to clean, compile, and create a local docker image.
2. Run `mvn dockerfile:push` to push to the Azure Container Registry.

At this stage you now have your docker container image uploaded to the Azure Container Registry, but it is not yet
running as we now have to deploy it into an Azure Web App for Containers instance. We will now do that.

## Creating an Azure Web App for Containers instance

1. Return to the [Azure Portal](http://portal.azure.com) and create a new Web App for Containers instance (located under the 'Web + Mobile' heading in the menu). A few pointers:

   1. The name you specify here will be the public URL of the web app (although a custom domain can be added later if desired), so it is a good idea to pick a name that you can easily remember.

   1. When you get to the 'Configure container' section, you can select 'Azure Container Registry' for the 'Image source', and then select the correct image from the drop-down lists.

   1. You do not need to specify any value in the 'Startup File' field.

1. Once the instance is created (again, it is very quick), click on it and then click on the 'Application Settings' menu item. In here you need to add a new application setting, where the key is `WEBSITES_PORT` and the value is `8080`. This tells Azure which port you want to expose in the container, and it will be mapped to port 80 externally.

1. Optionally, click on the 'Docker Container' link, and enable 'Continuous Deployment', so that whenever you update the Azure Container Registry image it is automatically updated in the Azure Web App for Containers instance.

1. You should be able to access the Azure-hosted instances at `http://<appname>.azurewebsites.net/microprofile/api/helloworld` and `http://<appname>.azurewebsites.net/health`.

## Summary

Through this tutorial we have stepped through the process of creating a simple MicroProfile-based microservice, containerized it into a Docker container, and we have run it locally and published it to Azure. Extending our microservice to provide more useful functionality is outside the scope of this tutorial, but there is a wealth of tutorials and advice on MicroProfile on the internet, and readers are encouraged to review [MicroProfile.io](https://microprofile.io/) for more content.

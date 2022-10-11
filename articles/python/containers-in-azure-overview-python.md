---
title: Overview of Python Container Apps in Azure
description: How to get started with Python container apps in Azure using VS Code, PyCharm, and the Azure and Docker CLI.
ms.topic: conceptual
ms.date: 10/10/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Overview of Python Container Apps in Azure

This article describes how to go from Python project code (for example, a web app) to a deployed Docker container in Azure. Discussed are the general process of containerization, deployment options for containers in Azure, and Python-specific configuration of containers in Azure.

The nature of Docker containers is that the process of creating a Docker image from code and deploying that image to a container in Azure is the same across languages. The language-specific considerations - for Python in this case - are in the containerization process in Azure, in particular the Dockerfile structure and any configuration around Python web frameworks used.

## Example container workflows

For Python development, some typical workflows for moving from code to container are:

**Dev environment** and building Docker image build in this environment.

1. Start: Dev environment code repo (with Docker).
1. Build: Use Docker, VS Code (with extensions), PyCharm (with plugin).
1. Run: In dev environment in Docker container.
1. Push: To registry like Azure Container Registry, Docker Hub, or private registries.
1. Deploy: To Azure service from registry.

**Hybrid** - Start in dev environment but image is built in Azure, without the need to install Docker.

1. Start: Dev environment code repo (without Docker, build in Azure Cloud).
1. Build: VS Code (with extensions), Azure CLI
1. Push: Azure Container Registry
1. Deploy: To Azure service from registry.

**Azure** - All in the cloud, using Azure Cloud Shell to build code from GitHub repo.

1. Start: In Azure Cloud Shell
1. Build: Azure CLI, Docker
1. Push: To registry like Azure Container Registry, Docker Hub, etc.
1. Deploy: To Azure service from registry.

The end goal of these workflows is a container running in one of the Azure resources supporting Docker containers as listed in the next section.

A "dev environment" can be your local workstation with Visual Studio Code or PyCharm, [Codespaces][1] (a development environment that's hosted in the cloud), or [Visual Studio Dev Containers][2] (a container as a development environment).

## Deployment container options in Azure

Python container apps are supported in the following services.

[Web App for Containers][3] provides an easy on-ramp for developers to take advantage of the fully managed Azure App Service platform, but who also want a single deployable artifact containing an app and all of its dependencies. Containerized web apps on Azure App Service can scale as needed and use streamlined CI/CD workflows with Docker Hub, Azure Container Registry, and GitHub. For an example, see [Containerized Python web app on Azure App Service][4].

[Azure Container Apps (ACA)][5] is a fully managed serverless container service for containers. Container Apps provides many application-specific concepts on top of containers, including certificates, revisions, scale, and environments. Container Apps are a good for web applications including web sites and web APIs. For an example, see …

[Azure Container Instances (ACI)][6] is a serverless offering, billed on consumption rather than provisioned resources. Concepts like scale, load balancing, and certificates aren't provided with ACI containers, and ACI is a lower-level "building block" option compared to ACA. For an example, see the tutorial [Create a container image for deployment to Azure Container Instances][7]. The tutorial isn't Python-specific, but the concepts show apply to all languages.

[Azure Kubernetes Service (AKS)][8] is an open source container and cluster management tool that is often referred to as an orchestration system. For an example, see the tutorial, [Deploy an Azure Kubernetes Service cluster using the Azure CLI][9].

[Azure Functions][10] is an event-driven, serverless functions-as-a-service solution, optimized for running event-driven applications using the functions programming model. Azure Functions shares many characteristics with Azure Container Apps around scale and integration with events, but is optimized for ephemeral functions deployed as either code or containers. For an example, see [Create a function on Linux using a custom container][11].

Other container solutions are shown in the comparison article, [Comparing Container Apps with other Azure container options][12].

## Virtual environments and containers

When you're running a Python project in a dev environment, using a virtual environment is a common way of managing dependencies and ensuring reproducibility of your project setup. A virtual environment has a Python interpreter, libraries, and scripts installed that are required by the project code running in that environment. Dependencies for Python projects are managed through the *requirements.txt* file.

You can think of Docker containers as providing similar capabilities as virtual environments, but with further improvements in reproducibility and portability as a Docker container can be run anywhere containers can be run, regardless of OS.

Containers are a lightweight, immutable infrastructure for application packaging and deployment. An application or service, its dependencies, and its configuration are packaged together as a container image. The containerized application can be tested as a unit and deployed as a container image instance to the host operating system.

Container images become containers at runtime. A container contains your Python project code and everything that code needs to run. To get to that point, you need to build your Python project code into a Docker image and then create a container instance of the image to run. For containerizing Python projects, a *requirements.txt* file is still needed and is used during the building of the Docker image to get the correct dependencies into the container image. In addition, a *Dockerfile* is used to specify how to build the Docker image.

## Container settings for web frameworks

Web frameworks have default ports on which they listen for web requests. When working with some Azure container solutions, you need to specify the port your container is listening on that will receive traffic. For Django, it's port 8000. For Flask, it's port 5000 or 5002. For Fast API ([uvicorn][13]), it's port 8000.

| Azure Container Solution | How to set web app port |
| ------------------------ | ----------------------- |
| Web App for Containers | By default, App Service assumes your custom container is listening on either port 80 or port 8080. If your container listens to a different port, set the WEBSITES_PORT app setting in your App Service app. For more information, see [Configure a custom container for Azure App Service][14]. |
| Azure Containers Apps | Azure Container Apps allows you to expose your container app to the public web, to your VNET, or to other container apps within your environment by enabling ingress. Set the ingress `targetPort` to the port your container listens to for incoming requests. Application ingress endpoint is always exposed on port 443. For more information, see [Set up HTTPS or TCP ingress in Azure Container Apps][15]. |
| Azure Container Instances, Azure Kubernetes | Set port during creation of a container. You need to ensure your solution has a web framework, application server (for example, gunicorn, uvicorn), and web server (for example, nginx). For example, you can create two containers, one container with a web framework and application server, and another framework with a web server. The two containers communicate on one port, and the web server container exposes 80/443 for external requests. |

## Dockerfile instructions for Python

A Dockerfile is a text file that contains instructions for building a Docker image. The first line states the base image to begin with and then is followed by instructions to install required programs, copy files, and other instructions to create a working environment. For example, some Python-specific values for key Dockerfile instructions are:

| Instruction | Purpose | Example |
| ----------- | ------- | ------- |
| [FROM][16] | Sets the base image for subsequent instructions. | `FROM python:3.8-slim` |
| [EXPOSE][17] | Tells Docker that the container listens on the specified network ports at runtime. | `EXPOSE 5000` |
| [RUN][18] | Runs a command inside the Docker image. For example, pull in dependencies. The command runs once at build time. | `RUN python -m pip install -r requirements.txt`|
| [CMD][19] | The command provides the default for executing a container. There can only be one CMD instruction. | `CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]` |

The Docker build command builds Docker images from a Dockerfile and a context. A build’s context is the set of files located in the specified path or URL. Typically, you'll build an image from the root of your Python project and the path for the build command is "." as shown in the following example.

```bash
docker build --rm --pull  --file "Dockerfile"  --tag "mywebapp:latest"  .
```

The build process can refer to any of the files in the context. For example, your build can use a COPY instruction to reference a file in the context. Here's an example of a Dockerfile for a Python project using the Flask framework:

```Dockerfile
FROM python:3.8-slim

EXPOSE 5000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY . /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
```

You can create a Dockerfile by hand or create it automatically with VS Code and the Docker extension. For more information, see [Generating Docker files][20].

The Docker build command is part of the Docker CLI. When you use IDEs like VS Code or PyCharm, the UI commands for working with Docker images call the build command for you and automate specifying options.

## Working with Docker images and containers

### VS Code and PyCharm

Working in an integrated development environment (IDE) with containers isn't strictly necessary but can simplify many container-related tasks.

#### [VS Code](#tab/vscode-ide)

Visual Studio Code provides Docker support with the [Docker extension][21], you can:

* Add Docker files, including a Dockerfile and compose file, to your workspace automatically that are tailored for your Python project.

* Download and build Docker images.
  * Build images your developer environment or build Docker images in Azure (Docker not required).

* Create and run Docker containers from pulled image or directly from a Dockerfile.

* Run multicontainer applications with Docker Compose.

* Connect and work with container registries like Azure Container Registry and Docker Hub, GitLab, or any other private registry.

The following image shows running a container in Visual Studio Code.

:::image type="content" source="media/containers-overview/vs-code-running-container-example.png" alt-text="Screenshot showing an example of running a container in VS Code." lightbox="media/containers-overview/vs-code-running-container-example.png":::

To connect your account and use the Docker extension in VS Code:

**Step 1**: Navigate to the Azure Explorer

[IMAGE]

**Step 2**: Select **Sign in to Azure** and follow the prompts.

[IMAGE]

**Step 3**: Go to **Extensions** and add the Docker extension.

[IMAGE]

**Step 4**: Navigate to the Docker extension and confirm it's connected to Azure

[IMAGE]

If you have trouble accessing your Azure subscription this may be because you are behind a proxy. To resolve this issue, see [Network Connections in Visual Studio Code][23].

#### [PyCharm](#tab/pycharm-ide)

PyCharm provides Docker support with the [Docker plugin][22], where you can:

* Download and build Docker images.

* Create and run Docker containers from pulled images or directly from a Dockerfile.

* Run multicontainer applications with Docker Compose

* Connect and work with container registries like Docker Hub, GitLab, JetBrains Space, Docker V2, and other self-hosted Docker registries.

The following image shows running a container in PyCharm.

:::image type="content" source="media/containers-overview/pycharm-running-container-example.png" alt-text="Screenshot showing an example of running a container in VS Code." lightbox="media/containers-overview/pycharm-running-container-example.png":::

To use the Docker extension in PyCharm:

**Step 1**: Go the **CTRL** + **ALT**  + **S** to bring up plugins and add Docker.

[IMAGE]

**Step 2**: Go to the Docker plugin.

[IMAGE]

---

### Azure CLI and Docker CLI

Instead of, or often along with an IDE, you can work with Docker images and containers using [Azure CLI][24] and [Docker CLI][25]. Both VS Code and PyCharm have terminals where you can run these CLIs.

Using a CLI is useful when you want finer control over build/run arguments and for automation. For example, the following command shows how to use the Azure CLI to specify the Docker image name.

```bash
az acr build --registry <registry-name> \
  --resource-group <resource-group> \
  --target pythoncontainerwebapp:latest .
```

As another example, consider the following command that shows how to use the Docker CLI to run a Docker container that communicates to a MongoDB instance in your dev environment, outside the container. The different values to complete the command are often easier to automate when specified in a command line and you can share commands.

```bash
docker run --rm -it \
  --publish <port>:<port> --publish 27017:27017 \
  --add-host mongoservice:<your-server-IP-address> \
  --env CONNECTION_STRING=mongodb://mongoservice:27017 \
  --env DB_NAME=<database-name> \
  --env COLLECTION_NAME=<collection-name> \
  containermongo:latest  
```

For more information on this scenario, see [Build and test a containerized Python web app locally][26].

### Environment variables in containers

Python projects often make use of environment variables to pass data to code. For example, you might specify database connection information in an environment variable so that different users of the code can set the value differently. Or, when deploying the project to production, the database connection can be changed to refer to a production instance.  

Packages like [python-dotenv][27] are often used to key-value pairs from an *.env* file and set them as environment variables. This is useful when running in a virtual environment but isn't recommended when working with containers because you don't want to copy the *.env* file into the container, especially if the file has sensitive information and the container will be made public.

Containers can accept environment variables passed or hardwired into the Dockerfile and built in the Docker image,  passed in with the Docker build command, or passed in with the Docker run command. The first two options at the build phase have the same drawback as noted above with *.env* file, namely that you're hardcoding potentially sensitive information into the Docker image. For example, you can inspect a container created from the Docker image with the command [docker container inspect][28].

The third option of passing in environment variables with the Docker run command is better in that the values aren't hardcoded into the image. Another way to handle secrets is to use the [BuildKit][29] functionality of Docker.

Here's an example of passing environment variables using the Docker CLI run command and using the "--env" option.

```bash
# PORT=8000 for Django and 5000 for Flask
export PORT=<port-number>

docker run --rm -it \
  --publish $PORT:$PORT \
  --env CONNECTION_STRING=<connection-info> \
  --env DB_NAME=<database-name> \
  <dockerimagename:tag>
```

If you're using VS Code or PyCharm, there are tasks, and UI that you typically work with but in the end runs a command like the one shown above.

Finally, specifying environment variables in your dev environment is slightly different when deploying the container to Azure. For example:

* For Web App for Containers, you configure application settings during configuration of App Service. These settings are available to your app code as environment variables and accessed using the standard [os.environ][30] pattern. You can change values after initial deployment when needed. For more information, see [Access app settings as environment variables][31].

* For Azure Container Apps, you configure environment variables during initial configuration of the container app. Subsequent modification of environment variables creates a [*revision*][32] of the container.  In addition, Azure Container Apps allows you to define secrets at the application level and then reference them in environment variables. For more information, see [Manage secrets in Azure Container Apps][33].

As another option, you can use [Service Connector][34] to help you connect Azure compute services to other backing services. This service configures the network settings and connection information (for example, generating environment variables) between compute services and target backing services in management plane.

[1]: https://github.com/features/codespaces
[2]: https://code.visualstudio.com/docs/remote/containers
[3]: https://azure.microsoft.com/products/app-service/containers/
[4]: ./tutorial-containerize-deploy-python-web-app-azure-01
[5]: https://azure.microsoft.com/products/container-apps/
[6]: https://azure.microsoft.com/products/container-instances
[7]: /azure/container-instances/container-instances-tutorial-prepare-app
[8]: https://azure.microsoft.com/products/kubernetes-service/
[9]: /azure/aks/learn/quick-kubernetes-deploy-cli
[10]: https://azure.microsoft.com/products/functions/
[11]: /azure/azure-functions/functions-create-function-linux-custom-image?pivots=programming-language-python
[12]: /azure/container-apps/compare-options
[13]: https://www.uvicorn.org/
[14]: /azure/app-service/configure-custom-container?pivots=container-linux##configure-port-number
[15]: /azure/container-apps/ingress
[16]: https://docs.docker.com/engine/reference/builder/#from
[17]: https://docs.docker.com/engine/reference/builder/#expose
[18]: https://docs.docker.com/engine/reference/builder/#run
[19]: https://docs.docker.com/engine/reference/builder/#cmd
[20]: https://code.visualstudio.com/docs/containers/overview#_generating-docker-files
[21]: https://code.visualstudio.com/docs/containers/overview
[22]: https://plugins.jetbrains.com/plugin/7724-docker
[23]: https://code.visualstudio.com/docs/setup/network
[24]: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
[25]: https://docs.docker.com/engine/reference/commandline/cli/
[26]: ./tutorial-containerize-deploy-python-web-app-azure-02.md
[27]: https://pypi.org/project/python-dotenv/
[28]: https://docs.docker.com/engine/reference/commandline/container_inspect/
[29]: https://docs.docker.com/develop/develop-images/build_enhancements/
[30]: https://docs.python.org/3/library/os.html#os.environ
[31]: /azure/app-service/configure-language-python#access-app-settings-as-environment-variables
[32]: /azure/container-apps/revisions
[33]: /azure/container-apps/manage-secrets
[34]: /azure/service-connector/overview
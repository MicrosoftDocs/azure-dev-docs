---
title: Overview of Python Container Apps in Azure
description: How to get started with Python container apps in Azure using VS Code, PyCharm, and the Azure and Docker CLI.
ms.topic: article
ms.date: 04/21/2025
ms.custom: devx-track-python, py-fresh-zinc
---

# Overview of Python Container Apps in Azure

This article explains how to take a Python project—such as a web application—and deploy it as a Docker container in Azure. It covers the general containerization workflow, Azure deployment options for containers, and Python-specific container configurations within Azure. Building and deploying Docker containers in Azure follows a standard process across languages, with Python-specific configurations in the Dockerfile, requirements.txt, and settings for web frameworks like [Django][35], [Flask][36], and [FastAPI][37].

## Container workflow scenarios

For Python container development, some typical workflows for moving from code to container are discussed in the following table.

|Scenario|Description|Workflow|
|--------|-----------|-----|
|**Dev**|Build Python Docker images locally in your development environment.|**Code**: Clone your app code locally using Git (with Docker installed). <br><br> **Build**: Use Docker CLI, VS Code (with extensions), PyCharm (with Docker plugin). Described in section [Working with Python Docker images and containers](#working-with-python-docker-images-and-containers). <br><br> **Test**: Run and test the container locally. <br><br> **Push**: Push the image to a container registry like Azure Container Registry, Docker Hub, or private registry. <br><br> **Deploy**: Deploy the container from the registry to an Azure service.|
|**Hybrid**|Build Docker images in Azure, but initiate the process from your local environment.|**Code**: Clone the code locally (not necessary for Docker to be installed).<br><br> **Build**: To trigger builds in Azure, use VS Code (with remote extensions) or the Azure CLI. <br><br> **Push**: Push the built image to Azure Container Registry. <br><br> **Deploy**: Deploy the container from the registry to an Azure service.|
|**Azure**|Use Azure Cloud Shell to build and deploy containers entirely in the cloud.| **Code**: Clone the GitHub repo in Azure Cloud Shell.<br><br>**Build**: Use Azure CLI or Docker CLI in Cloud Shell.<br><br>**Push**: Push the image to a registry like Azure Container Registry, Docker Hub, or private registry.<br><br>**Deploy**: Deploy the container from the registry to an Azure service.|

The end goal of these workflows is to have a container running in one of the Azure resources supporting Docker containers as listed in the next section.

A dev environment can be:

* Your local workstation with Visual Studio Code or PyCharm
* [Codespaces][1] (a development environment hosted in the cloud)
* [Visual Studio Dev Containers][2] (a container as a development environment)

## Deployment container options in Azure

Python container apps are supported in the following services.

| Service | Description |
|---------|-------------|
|[Web App for Containers][3]| Azure App Service is a fully managed hosting platform for containerized web applications, including websites and web APIs. It supports scalable deployments and integrates seamlessly with CI/CD workflows using Docker Hub, Azure Container Registry, and GitHub. This service is ideal for developers who want a simple and efficient path to deploy containerized apps, while also benefiting from the full capabilities of the Azure App Service platform. By packaging your application and all its dependencies into a single deployable container, you gain both portability and ease of management—without needing to manage infrastructure. </br></br>Example: [Deploy a Flask or FastPI web app on Azure App Service][4]. |
|[Azure Container Apps (ACA)][5] | Azure Container Apps (ACA) is a fully managed serverless container service powered by Kubernetes and open-source technologies like [Dapr](https://dapr.io/), [KEDA](https://keda.sh/), and [envoy](https://www.envoyproxy.io/). Its design incorporates industry best practices and is optimized for executing general-purpose containers. ACA abstracts away the complexity of managing a Kubernetes infrastructure—direct access to the Kubernetes API isn't required or supported. Instead, it offers higher-level application constructs such as revisions, scaling, certificates, and environments to simplify development and deployment workflows. This service is ideal for development teams looking to build and deploy containerized microservices with minimal operational overhead, allowing them to focus on application logic instead of infrastructure management.</br></br>Example: [Deploy a Flask or FastPI web app on Azure Container Apps][52]. |
|[Azure Container Instances (ACI)][6] | Azure Container Instances (ACI) is a serverless offering that provides a single pod of Hyper-V isolated containers on demand. Billing is based on actual resource consumption rather than pre-allocated infrastructure, making it well-suited for short-lived or burstable workloads. Unlike other container services, ACI doesn't include built-in support for concepts like scaling, load balancing, or TLS certificates. Instead, it typically functions as a foundational container building block, often integrated with Azure services like Azure Kubernetes Service (AKS) for orchestration. ACI excels as a lightweight choice when the higher-level abstractions and features of Azure Container Apps aren't needed </br></br> Example: [Create a container image for deployment to Azure Container Instances][7]. (The tutorial isn't Python-specific, but the concepts shown apply to all languages.) |
|[Azure Kubernetes Service (AKS)][8] | Azure Kubernetes Service (AKS) is a fully managed Kubernetes option in Azure that gives you complete control over your Kubernetes environment. It supports direct access to the Kubernetes API and can run any standard Kubernetes workload. The full cluster resides in your subscription, with the cluster configurations and operations within your control and responsibility. ACI is ideal for teams seeking a fully managed container solution, while AKS gives you full control over the Kubernetes cluster, requiring you to manage configurations, networking, scaling, and operations. Azure handles the control plane and infrastructure provisioning, but the day-to-day operation and security of the cluster are within your team's control. This service is ideal for teams that want the flexibility and power of Kubernetes with the added benefit of Azure’s managed infrastructure, while still maintaining full ownership over the cluster environment. </br></br>Example: [Deploy an Azure Kubernetes Service cluster using the Azure CLI][9].|
| [Azure Functions][10] | Azure Functions offers an event-driven, serverless Functions-as-a-Service (FaaS) platform that lets you run small pieces of code (functions) in response to events—without managing infrastructure. Azure Functions shares many characteristics with Azure Container Apps around scale and integration with events, but is optimized for short-lived functions deployed as either code or containers. al for teams looking to trigger the execution of functions on events; for example, to bind to other data sources. Like Azure Container Apps, Azure Functions supports automatic scaling and integration with event sources (for example, HTTP requests, message queues, or blob storage updates). This service is ideal for teams building lightweight, event-triggered workflows, such as processing file uploads or responding to database changes, in Python or other languages. </br></br>Example: [Create a function on Linux using a custom container][11].|

For a more detailed comparison of these services, see [Comparing Container Apps with other Azure container options][12].

## Virtual environments and containers

Virtual environments in Python isolate project dependencies from system-level Python installations, ensuring consistency across development environments. A virtual environment includes its own isolated Python interpreter, along with the libraries and scripts needed to run the specific project code within that environment. Dependencies for Python projects are managed through the *requirements.txt* file. By specifying dependencies in a *requirements.txt* file, developers can reproduce the exact environment needed for their project. This approach facilitates smoother transitions to containerized deployments like Azure App Service, where environment consistency is essential for reliable application performance.

> [!TIP]
> In containerized Python projects, virtual environments are typically unnecessary because Docker containers provide isolated environments with their own Python interpreter and dependencies. However, you might use virtual environments for local development or testing. To keep Docker images lean, exclude virtual environments using a *.dockerignore* file, which prevents copying unnecessary files into the image.

You can think of Docker containers as offering capabilities similar to Python virtual environments—but with broader advantages in reproducibility, isolation, and portability. Unlike virtual environments, Docker containers can run consistently across different operating systems and environments, as long as a container runtime is available.

A Docker container includes your Python project code along with everything it needs to run, such as dependencies, environment settings, and system libraries. To create a container, you first build a Docker image from your project code and configuration, and then start a container, which is a runnable instance of that image.

For containerizing Python projects, the key files are described in the following table:

| Project file | Description |
|--------------| ----------- |
|*requirements.txt* | This file contains the definitive list of Python dependencies needed for your application. Docker uses this list during the image build process to install all required packages. This ensures consistency between development and deployment environments.|
|*Dockerfile* | This file contains instructions for building your Python Docker image, including the base image selection, dependency installation, code copying, and container startup commands. It defines the complete execution environment for your application. For more information, see the section [Dockerfile instructions for Python](#python-dockerfile).|
|*\.dockerignore* | This file specifies the files and directories that should be excluded when copying content to the Docker image with the `COPY` command in the Dockerfile. This file uses patterns similar to .gitignore for defining exclusions. The *\.dockerignore* file supports exclusion patterns similar to *\.gitignore* files. For more information, see [\.dockerignore file][40]. <br><br> Excluding files helps image build performance, but should also be used to avoid adding sensitive information to the image where it can be inspected. For example, the *\.dockerignore* should contain lines to ignore *\.env* and *\.venv* (virtual environments).|

## Container settings for web frameworks

Web frameworks typically bind to default ports (such as 5000 for Flask, 8000 for FastAPI). When you are deploying containers to Azure services, such as Azure Container Instances, Azure Kubernetes Service (AKS), or App Service for Containers, it's crucial that you explicitly expose and configure the container's listening port to ensure proper routing of inbound traffic. Configuring the correct port ensures that Azure’s infrastructure can direct requests to the correct endpoint inside your container.

| Web framework  | Port |
| -------------- | ---- |
| [Django][35] | 8000 |
| [Flask][36] | 5000 or 5002 |
| [FastAPI][37] ([uvicorn][13]) | 8000 or 80 |

The following table shows how to set the port for different Azure container solutions.

| Azure container solution | How to set web app port |
| ------------------------ | ----------------------- |
| Web App for Containers | By default, App Service assumes your custom container is listening on either port 80 or port 8080. If your container listens to a different port, set the `WEBSITES_PORT` app setting in your App Service app. For more information, see [Configure a custom container for Azure App Service][14]. |
| Azure Containers Apps | Azure Container Apps lets you expose your container app to the public web, to your virtual network, or to other container apps within the same environment by enabling ingress. Set the ingress `targetPort` to the port your container listens to for incoming requests. Application ingress endpoint is always exposed on port 443. For more information, see [Set up HTTPS or TCP ingress in Azure Container Apps][15]. |
| Azure Container Instances, Azure Kubernetes | You define the port on which your app is listening during container or pod creation. Your container image should include a web framework, an application server (for example, gunicorn, uvicorn), and optionally a web server (for example, nginx). In more complex scenarios, you might split responsibilities across two containers—one for the application server and another for the web server. In that case, the web server container typically exposes ports 80 or 443 for external traffic. |

## Python Dockerfile

A Dockerfile is a text file that contains instructions for building a Docker image for a Python application. The first instruction typically specifies the base image to start from. Subsequent instructions then detail actions such as installing necessary software, copying application files, and configuring the environment to create a runnable image. 
The following table provides Python-specific examples for commonly used Dockerfile instructions.

| Instruction | Purpose | Example |
| ----------- | ------- | ------- |
| [FROM][16] | Sets the base image for subsequent instructions. | `FROM python:3.8-slim` |
| [EXPOSE][17] | Tells Docker that the container listens to a specified port at runtime. | `EXPOSE 5000` |
| [COPY][38] | Copies files or directories from the specified source and adds them to the filesystem of the container at the specified destination path. | `COPY . /app` |
| [RUN][18] | Runs a command inside the Docker image. For example, pull in dependencies. The command runs once at build time. | `RUN python -m pip install -r requirements.txt`|
| [CMD][19] | The command provides the default for executing a container. There can only be one CMD instruction. | `CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]` |

The Docker build command builds Docker images from a Dockerfile and a context. A build’s context is the set of files located in the specified path or URL. Typically, you build an image from the root of your Python project and the path for the build command is "." as shown in the following example.

```bash
docker build --rm --pull  --file "Dockerfile"  --tag "mywebapp:latest"  .
```

The build process can refer to any of the files in the context. For example, your build can use a COPY instruction to reference a file in the context. Here's an example of a Dockerfile for a Python project using the [Flask][36] framework:

```Dockerfile
FROM python:3.8-slim

EXPOSE 5000

# Keeps Python from generating .pyc files in the container.
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Install pip requirements.
COPY requirements.txt .
RUN python -m pip install -r requirements.txt

WORKDIR /app
COPY . /app

# Creates a non-root user with an explicit UID and adds permission to access the /app folder.
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Provides defaults for an executing container; can be overridden with Docker CLI.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
```

You can create a Dockerfile by hand or create it automatically with VS Code and the Docker extension. For more information, see [Generating Docker files][20].

The Docker build command is part of the Docker CLI. When you use IDEs like VS Code or PyCharm, the UI commands for working with Docker images call the build command for you and automate specifying options.

## Working with Python Docker images and containers

### VS Code and PyCharm

Integrated development environments (IDEs) like Visual Studio Code (VS Code) and PyCharm streamline Python container development by integrating Docker tasks into your workflow. With extensions or plugins, these IDEs simplify building Docker images, running containers, and deploying to Azure services like App Service or Container Instances. Here are some of the things you can do with VS Code and PyCharm.

* Download and build Docker images.
  * Build images in your dev environment.
  * Build Docker images in Azure without Docker installed in dev environment. (For PyCharm, use the Azure CLI to build images in Azure.)

* Create and run Docker containers from an existing image, a pulled image, or directly from a Dockerfile.

* Run multicontainer applications with Docker Compose.

* Connect and work with container registries like Docker Hub, GitLab, JetBrains Space, Docker V2, and other self-hosted Docker registries.

* (VS Code only) Add a Dockerfile and Docker compose files that are tailored for your Python project.

To set up VS Code and PyCharm to run Docker containers in your dev environment, use the following steps.

#### [VS Code](#tab/vscode-ide)

If you haven't already, install [Azure Tools for VS Code][41].

| Instructions    | Screenshot |
|:----------------|-----------:|
| **Step 1**: Use **SHIFT** + **ALT**  + **A** to open the **Azure** extension and confirm you're connected to Azure. <br><br> You can also select the **Azure** icon on the VS Code extensions bar. <br><br> If you aren't signed in, select **Sign in to Azure** and follow the prompts.<br><br> If you have trouble accessing your Azure subscription, it may be because you're behind a proxy. To resolve connection issues, see [Network Connections in Visual Studio Code][23]. | :::image type="content" source="media/containers-overview/vs-code-azure-tools-signed-in-small.png" alt-text="Screenshot showing how Azure Tools looks once signed in." lightbox="media/containers-overview/vs-code-azure-tools-signed-in.png"::: :::image type="content" source="media/containers-overview/vs-code-azure-tools-sign-in-small.png" alt-text="Screenshot showing how Azure Tools looks if you aren't signed in." lightbox="media/containers-overview/vs-code-azure-tools-sign-in.png":::|
|**Step 2**: Use **CTRL** + **SHIFT**  + **X** to open **Extensions**, search for the [Docker extension][21], and install the extension.<br><br> You can also select the **Extensions** icon on the VS Code extensions bar.|:::image type="content" source="media/containers-overview/vs-code-add-docker-extension-small.png" alt-text="Screenshot showing how to add Docker extension to VS Code." lightbox="media/containers-overview/vs-code-add-docker-extension.png":::|
|**Step 3**: Select the **Docker** icon in the  extension bar, expand images, and right-click a Docker image run it as a container.|:::image type="content" source="media/containers-overview/vs-code-docker-extension-run-image-small.png" alt-text="Screenshot showing how to use the Docker extension in VS Code to run a container from a Docker image." lightbox="media/containers-overview/vs-code-docker-extension-run-image.png":::
|**Step 4**: Monitor the Docker run output in the **Terminal** window.|:::image type="content" source="media/containers-overview/vs-code-running-container-example-small.png" alt-text="Screenshot showing an example of running a container in VS Code." lightbox="media/containers-overview/vs-code-running-container-example.png":::|

#### [PyCharm](#tab/pycharm-ide)

| Instructions    | Screenshot |
|:----------------|-----------:|
|**Step 1**: Use **CTRL** + **ALT**  + **S** to bring up the **Plugins** setting.<br><br>You can also go to **File** \> **Settings** \> **Plugins**.|:::image type="content" source="media/containers-overview/pycharm-open-plugins-small.png" alt-text="Screenshot showing how to open plugins in PyCharm." lightbox="media/containers-overview/pycharm-open-plugins.png":::|
|**Step 2**: Under **Marketplace**, search for the [Docker plugin][22], and add it.<br><br>If you're using Docker for Windows, enable connecting to Docker via the TCP protocol. For more information, see [Enable Docker support][39].|:::image type="content" source="media/containers-overview/pycharm-plugin-add-small.png" alt-text="Screenshot showing how to add plugins in PyCharm." lightbox="media/containers-overview/pycharm-plugin-add.png":::|
|**Step 3**: Under the **Services**, select **Docker**, expand images, right-click an image and select **Create Container** to start a container.|:::image type="content" source="media/containers-overview/pycharm-plugin-start-container-small.png" alt-text="Screenshot showing how to start container from Docker image in PyCharm." lightbox="media/containers-overview/pycharm-plugin-start-container.png":::|
|**Step 4**: Monitor the output in the **Log** window.|:::image type="content" source="media/containers-overview/pycharm-running-container-example-small.png" alt-text="Screenshot showing an example of running a container in PyCharm." lightbox="media/containers-overview/pycharm-running-container-example.png":::|

---

### Azure CLI and Docker CLI

You can also work with Python Docker images and containers using the [Azure CLI][24] and [Docker CLI][25]. Both VS Code and PyCharm have terminals where you can run these CLIs.

Use a CLI when you want finer control over build and run arguments, and for automation. For example, the following command shows how to use the Azure CLI [az acr build][50] to specify the Docker image name.

```bash
az acr build --registry <registry-name> \
  --resource-group <resource-group> \
  --target pythoncontainerwebapp:latest .
```

As another example, consider the following command that shows how to use the Docker CLI [run][43] command. The example shows how to run a Docker container that communicates to a MongoDB instance in your dev environment, outside the container. The different values to complete the command are easier to automate when specified in a command line.

```bash
docker run --rm -it \
  --publish <port>:<port> --publish 27017:27017 \
  --add-host mongoservice:<your-server-IP-address> \
  --env CONNECTION_STRING=mongodb://mongoservice:27017 \
  --env DB_NAME=<database-name> \
  --env COLLECTION_NAME=<collection-name> \
  containermongo:latest  
```

For more information about this scenario, see [Build and test a containerized Python web app locally][26].

### Environment variables in containers

Python projects commonly use environment variables to pass configuration data into the application code. This approach allows for greater flexibility across different environments. For instance, database connection details can be stored in environment variables, making it easy to switch between development, testing, and production databases without modifying the code. This separation of configuration from code promotes cleaner deployments and enhances security and maintainability.  

Packages like [python-dotenv][27] are often used to read key-value pairs from an *.env* file and set them as environment variables. An *.env* file is useful when running in a virtual environment but isn't recommended when working with containers. **Don't copy the *.env* file into the Docker image, especially if it contains sensitive information and the container will be made public.** Use the *\.dockerignore* file to exclude files from being copied into the Docker image. For more information, see the section [Virtual environments and containers](#virtual-environments-and-containers) in this article.

You can pass environment variables to containers in a few ways:

1. Defined in the Dockerfile as [ENV][45] instructions.
1. Passed in as `--build-arg` arguments with the Docker [build][42] command.
1. Passed in as  `--secret` arguments with the Docker build command and [BuildKit][29] backend.
1. Passed in as `--env` or `--env-file` arguments with the Docker [run][43] command.

The first two options have the same drawback as noted with *\.env* files, namely that you're hardcoding potentially sensitive information into a Docker image. You can inspect a Docker image and see the environment variables, for example, with the command [docker image inspect][28].

The third option with BuildKit allows you to pass secret information to be used in the Dockerfile for building docker images in a safe way that won't end up stored in the final image.

The fourth option of passing in environment variables with the Docker run command means the Docker image doesn't contain the variables. However, the variables are still visible inspecting the container instance (for example, with [docker container inspect][51]). This option may be acceptable when access to the container instance is controlled or in testing or dev scenarios.

Here's an example of passing environment variables using the Docker CLI run command and using the `--env` argument.

```bash
# PORT=8000 for Django and 5000 for Flask
export PORT=<port-number>

docker run --rm -it \
  --publish $PORT:$PORT \
  --env CONNECTION_STRING=<connection-info> \
  --env DB_NAME=<database-name> \
  <dockerimagename:tag>
```

In VS Code (Docker extension) or PyCharm (Docker plugin), UI tools simplify managing Docker images and containers by executing standard docker CLI commands (such as docker build, docker run) in the background.

Finally, specifying environment variables  when deploying a container in Azure is different than using environment variables in your dev environment. For example:

* For Web App for Containers, you configure application settings during configuration of App Service. These settings are available to your app code as environment variables and accessed using the standard [os.environ][30] pattern. You can change values after initial deployment when needed. For more information, see [Access app settings as environment variables][31].

* For Azure Container Apps, you configure environment variables during initial configuration of the container app. Subsequent modification of environment variables creates a [*revision*][32] of the container. In addition, Azure Container Apps allows you to define secrets at the application level and then reference them in environment variables. For more information, see [Manage secrets in Azure Container Apps][33].

As another option, you can use [Service Connector][34] to help you connect Azure compute services to other backing services. This service configures the network settings and connection information (for example, generating environment variables) between compute services and target backing services in management plane.

## Viewing container logs

View container instance logs to see diagnostic messages output from code and to troubleshoot issues in your container's code. Here are several ways you can view logs when running a container in your ***dev environment***:

* Running a container with VS Code or PyCharm, as shown in the section [VS Code and PyCharm](#vs-code-and-pycharm), you can see logs in terminal windows opened when Docker run executes.

* If you're using the Docker CLI [run][43] command with the interactive flag `-it`, you see output following the command.

* In [Docker Desktop][44], you can also view logs for a running container.

When you deploy a container in ***Azure***, you also have access to container logs. Here are several Azure services and how to access container logs in Azure portal.

| Azure service | How to access logs in Azure portal |
| -------------- | --------------------------- |
| Web App for Containers | Go to the **Diagnose and solve problems** resource to view logs. [Diagnostics][46] is an intelligent and interactive experience to help you troubleshoot your app with no configuration required. For a real-time view of logs, go to the **Monitoring** - **Log stream**. For more detailed log queries and configuration, see the other resources under **Monitoring**. |
| Azure Container Apps | Go to the environment resource **Diagnose and solve problems** to troubleshoot environment problems. More often, you want to see container logs. In the container resource, under **Application** - **Revision management**, select the revision and from there you can view system and console logs. For more detailed log queries and configuration, see the resources under **Monitoring**. |
| Azure Container Instances | Go to the **Containers** resource and select **Logs**. |

For these services, here are the Azure CLI commands to access logs.

| Azure service | Azure CLI command to access logs |
| -------------- | -------------------------------- |
| Web App for Containers | [az webapp log][48] |
| Azure Container Apps | [az containerapps logs][47] |
| Azure Container Instances | [az container logs][49] |

There's also support for viewing logs in VS Code. You must have [Azure Tools for VS Code][41] installed. Below is an example of viewing Web Apps for Containers (App Service) logs in VS Code.

:::image type="content" source="media/containers-overview/vs-code-logging-example.png" alt-text="Screenshot showing how to view logs in VS Code for Web Apps for Containers." lightbox="media/containers-overview/vs-code-logging-example.png":::

## Next steps

* [Containerized Python web app on Azure with MongoDB](./tutorial-containerize-deploy-python-web-app-azure-01.md)
* [Deploy a Python web app on Azure Container Apps with PostgreSQL](./tutorial-deploy-python-web-app-azure-container-apps-01.md)

[1]: https://github.com/features/codespaces
[2]: https://code.visualstudio.com/docs/remote/containers
[3]: https://azure.microsoft.com/products/app-service/containers/
[4]: ./tutorial-containerize-simple-web-app-for-app-service.md
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
[24]: /cli/azure/install-azure-cli
[25]: https://docs.docker.com/engine/reference/commandline/cli/
[26]: ./tutorial-containerize-deploy-python-web-app-azure-02.md
[27]: https://pypi.org/project/python-dotenv/
[28]: https://docs.docker.com/engine/reference/commandline/image_inspect/
[29]: https://docs.docker.com/develop/develop-images/build_enhancements/
[30]: https://docs.python.org/3/library/os.html#os.environ
[31]: /azure/app-service/configure-language-python#access-app-settings-as-environment-variables
[32]: /azure/container-apps/revisions
[33]: /azure/container-apps/manage-secrets
[34]: /azure/service-connector/overview
[35]: https://www.djangoproject.com/
[36]: https://flask.palletsprojects.com/en/stable/
[37]: https://fastapi.tiangolo.com/
[38]: https://docs.docker.com/engine/reference/builder/#copy
[39]: https://www.jetbrains.com/help/pycharm/docker.html#enable_docker
[40]: https://docs.docker.com/engine/reference/builder/#dockerignore-file
[41]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack
[42]: https://docs.docker.com/engine/reference/commandline/build/
[43]: https://docs.docker.com/engine/reference/commandline/run/
[44]: https://www.docker.com/products/docker-desktop/
[45]: https://docs.docker.com/engine/reference/builder/#env
[46]: /azure/app-service/overview-diagnostics
[47]: /cli/azure/containerapp/logs
[48]: /cli/azure/webapp/log
[49]: /cli/azure/container#az-container-logs
[50]: /cli/azure/acr#az-acr-build
[51]: https://docs.docker.com/engine/reference/commandline/image_inspect/
[52]: ./tutorial-containerize-simple-web-app.md

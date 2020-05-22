---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Build and push the Docker image to Azure Container Registry

After you've created the Dockerfile, you'll need to build the Docker image and publish it to your Azure container registry.

If you used our [WildFly Container Quickstart GitHub repo](https://github.com/Azure/wildfly-container-quickstart), the process of building and pushing your image to your Azure container registry would be the equivalent of invoking the following three commands.

In these examples, the `MY_ACR` environment variable holds the name of your Azure container registry and the `MY_APP_NAME` variable holds the name of the web application you want to use on your Azure container registry.

Build the WAR file:

```shell
mvn package
```

Log into your Azure container registry:

```shell
az acr login -n ${MY_ACR}
```

Build and push the image:

```shell
az acr build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME} -f src/main/docker/Dockerfile .
```

Alternatively, you can use Docker CLI to first build and test the image locally, as shown in the following commands. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires you to install the Docker CLI and ensure the Docker daemon is running.

Build the image:

```shell
docker build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Run the image locally:

```shell
docker run -it -p 8080:8080 ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Your can now access your application at `http://localhost:8080`.

Log into your Azure container registry:

```shell
az acr login -n ${MY_ACR}
```

Push the image to your Azure container registry:

```shell
docker push ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

For more in-depth information on building and storing container images in Azure, see the Learn module [Build and store container images with Azure Container Registry](/learn/modules/build-and-store-container-images/).

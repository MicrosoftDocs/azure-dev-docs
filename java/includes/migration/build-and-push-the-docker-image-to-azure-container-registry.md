---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Build and push the Docker image to Azure Container Registry

Once you have created the Dockerfile you will need to build the Docker image and publish it to your Azure Container Registry.

If you used our [WildFly Container Quickstart GitHub repository](https://github.com/Azure/wildfly-container-quickstart) the process of building and pushing your image to your Azure Container Registry would be the equivalent of invoking the following 3 command lines below.

Build the WAR file:

```shell
mvn package
```

Log into your Azure Container Registry:

```shell
az acr login -n ${MY_ACR}
```

Build and push he image:

```shell
az acr build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME} -f src/main/docker/Dockerfile .
```

Where `MY_ACR` is the name of your Azure Container Registry and `MY_APP_NAME` is the name of the web application you want to use on your Azure Container Registry.

Or alternatively, you can use Docker CLI to first build and test the image locally. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires Docker CLI to be installed and Docker daemon to be running.

Build the image:

```shell
docker build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Run the image locally:

```shell
docker run -it -p 8080:8080 ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Your application can now be accessed with a browser at http://localhost:8080.

Log into your Azure Container Registry:

```shell
az acr login -n ${MY_ACR}
```

Push the image to your Azure Container Registry:

```shell
docker push ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Where `MY_ACR` is the name of your Azure Container Registry and `MY_APP_NAME` is the name of the web application you want to use on your Azure Container Registry.

For more in-depth information on building and storing container images in Azure, see the respective [Microsoft Learn course](https://docs.microsoft.com/learn/modules/build-and-store-container-images/).

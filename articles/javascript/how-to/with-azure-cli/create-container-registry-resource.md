
## Hosting a private Docker registry

DockerHub provides an amazing experience for distributing your container images, but there may be scenarios where you'd prefer to host your own private Docker registry - such as for security/governance or performance benefits. For this purpose, Azure provides the [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) (ACR) that allows you to spin up your own Docker registry whose backing storage is located in the same data center as your web app (which makes pulls quicker). The ACR also provides you with full control over the contents and access controls - such as who can push or pull images.

Provisioning a custom registry can be accomplished by running the following command. (Replace the **<NAME** placeholder with a globally unique value as ACR uses specified value to generate the registry's login server URL.

```azurecli
ACR_NAME=<NAME>
az acr create -n $ACR_NAME -l westus --admin-enabled
```

> [!NOTE]
> While this topic's example uses the **admin account** to keep things simple, it is not recommended for production registries.

The `az acr create` commands displays the login server URL (via the `LOGIN SERVER` column) that you use to log in using the Docker CLI (for example, `ninademo.azurecr.io`). Additionally, the command generates admin credentials that you can use in order to authenticate against it. To retrieve those credentials, run the following command and note the displayed username and password:

```azurecli
az acr credential show -n $ACR_NAME
```

Using the credentials from the previous step, and your individual login server, you can log in to the registry using the standard Docker CLI workflow.

```console
docker login <LOGIN_SERVER> -u <USERNAME> -p <PASSWORD>
```

You can now tag your Docker container to indicate that it's associated with your private registry using the following command (replacing `lostintangent/node` with the name you gave the container image.

```console
docker tag lostintangent/node <LOGIN_SERVER>/lostintangent/node
```

Finally, push the tagged image to your private Docker registry.

```console
docker push <LOGIN_SERVER>/lostintangent/node
```

Your container is now stored in your own private registry, and the Docker CLI was happy to allow you to continue working in the same way as you did when using DockerHub. In order to instruct the App Service web app to pull from your private registry, you need only run the following command:

```azurecli
az appservice web config container set \
    -r <LOGIN_SERVER> \
    -c <LOGIN_SERVER>/lostintangent/node \
    -u <USERNAME> \
    -p <PASSWORD>
```

Make sure to add the `https://` prefix to the beginning of the `-r` option. However, don't add the prefix to the container image name.

If you refresh the app in your browser, everything should look and work the same. However, it's now running your app via your private Docker registry. Once you update your app, tag and push the changes as done above, and update the tag in your App Service container configuration.
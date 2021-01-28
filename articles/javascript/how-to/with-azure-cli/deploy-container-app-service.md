
## Deploying the app

Now that you created the app Dockerized and pushed to DockerHub, you need to deploy it to the cloud so the world can see it. For deployment, you can use Azure App Service, which is Azure's PaaS offering. App Service has two capabilities that are relevant to Node.js developers:

- Support for Linux-based VMs, which reduces incompatibilities for apps that are built using native Node modules, or other tools that might not support Windows and/or may behave differently.
- Support for Docker-based deployments, which allows you to specify the name of your Docker image, and allow App Service to pull, deploy, and scale the image automatically.

To get started, open up the Visual Studio terminal. You'll use the new Azure CLI 2.0 to manage your Azure account and provision the necessary infrastructure to run the to-do app. Once you've logged into your account from the CLI using the `az login` command (as mentioned in the pre-reqs), perform the following steps to provision the App Service instance and deploy the to-do app container:

1. Create a resource group, which you can think of as a *namespace* or *directory* to help organize Azure resources. The `-n` option is used to specify the name of the group and can be anything you want.

    ```azurecli
    az group create -n nina-demo -l westus
    ```

    The `-l` option indicates the location of the resource group. While in preview, the App Service on Linux support is available only in select regions. Therefore, if you aren't located in the Western US, and you want to check which other regions are available, run `az appservice list-locations --linux-workers-enabled` from the CLI to view your datacenter options.

1. Set the newly created resource group as the default resource group so that you can continue to use the CLI without needing to explicitly specify the resource group with each Azure CLI call:

   ```azurecli
   az configure -d group=nina-demo
   ```

1. Create the App Service *plan*, which manages the creation and scaling of the underlying virtual machines to which your app is deployed. Once again, specify any value that you'd like for the `n` option.

    ```azurecli
    az appservice plan create -n nina-demo-plan --is-linux
    ```

    The `--is-linux option` indicates that you want Linux-based virtual machines. Without it, the CLI defaults to provisioning Windows-based virtual machines.

1. Create the App Service web app, which represents the actual to-do app that will be running within the plan and resource group just created. You can think of a web app as being synonymous with a process or container, and the plan as being the virtual machine/container host that they're running on. Additionally, as part of creating the web app, you'll need to configure it to use the Docker image you published to DockerHub:

    ```azurecli
    az webapp create -n nina-demo-app -p nina-demo-plan -i lostintangent/node
    ```

    > [!NOTE]
    > If instead of using a custom container, you'd prefer a Git deployment, refer to the article, [Create a Node.js web app in Azure](/azure/app-service-web/app-service-web-get-started-nodejs).

1. Set the web app as the default web instance:

    ```azurecli
    az configure -d web=nina-demo-app
    ```

1. Launch the app to view the deployed container, which will be available at an `*.azurewebsites.net` URL:

    ```azurecli
    az webapp browse
    ```

    It may take few minutes to load app the first time as App Service has to pull the Docker image from DockerHub and then start it.

    ![to-do app running in the browser](../media/node-howto-e2e/deployed-container-app.png)

At this point, you've just deployed and run the to-do app. However, the spinning icon indicates that the app can't connect to the database. This problem is due to the fact that you were using a local instance of MongoDB during development, which obviously isn't reachable from within the Azure datacenters. Since you modified the app to accept the connection string via an environment variable, you need only start a MongoDB server and reconfigure the App Service instance to reference the environment variable. These actions are explained in the next section.

## Scaling up and out

At some point, your web app may become popular enough that its allocated resources (CPU and RAM) aren't sufficient for handling the increase in traffic and operational demands. The App Service Plan that you created earlier (**B1**) comes with one CPU core and 1.75 GB of RAM, which can easily become overloaded. The **B2** plan comes with twice as much RAM and CPU, so if you notice that your app is beginning to run out of either, you can scale up the underlying virtual machine by running the following command:

```azurecli
az appservice plan update -n nina-demo-plan --sku B2
```

> [!NOTE]
> For Azure App Plan pricing details and specs, see the article, [App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/)

After just a few moments, your web app will be migrated to the requested hardware, and can begin taking advantage of the associated resources. In addition to scaling up, you can also scale down by running the same command as above, specifying a `--sku` option that provides less resources at a lower price.

In addition to scaling up the virtual machine specs, as long as your web app is stateless, you also have the option to *scale out* by adding more underlying virtual machine instances. The App Service Plan you created earlier included only a single virtual machine (a *worker*), and therefore, all incoming traffic is ultimately bound by the limits of the available resources of that one instance. If you want to add a second virtual machine instance, you could run the same command you ran earlier, but instead of scaling up the SKU, you scale out the number of worker virtual machines.

```azurecli
az appservice plan update -n nina-demo-plan --number-of-workers 2
```

When you scale out a web app like this, incoming traffic will be transparently load balanced between all instances, which allows you to immediately increase your capacity without any code changes or worrying about the needed infrastructure.

Stateless web apps are considered a best practice as they make the ability to scale them (up, down, out) entirely deterministic as no single virtual machine or app instance includes state that is necessary in order to function.

> [!NOTE]
> While this article illustrates running a single web app as part of an App Service Plan, you can create and deploy multiple web apps into the same plan, allowing you to provision and pay for a single plan.
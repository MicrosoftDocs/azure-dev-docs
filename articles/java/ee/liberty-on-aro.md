---
title: Manually Deploy a Java Application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift Cluster
recommendations: false
description: Shows you how to deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift cluster.
author: KarlErickson
ms.author: karler
ms.reviewer: jiangma
ms.topic: install-set-up-deploy
ms.date: 04/29/2025
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aro, devx-track-javaee-websphere, devx-track-extended-java, linux-related-content
---

# Manually deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Red Hat OpenShift cluster

This article provides step-by-step manual guidance for running Open/WebSphere Liberty on an Azure Red Hat OpenShift cluster. It walks you through preparing a Liberty application, building the application Docker image, and running the containerized application on an Azure Red Hat OpenShift cluster.

Specifically, you learn how to accomplish the following tasks:

> [!div class="checklist"]
>
> - Prepare the Liberty application
> - Build the application image
> - Run the containerized application on an Azure Red Hat OpenShift cluster using the GUI and the CLI

For a more automated solution that accelerates your journey to Azure Red Hat OpenShift, see [Deploy IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-liberty-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json).

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing WebSphere on Azure solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

[!INCLUDE [aro-support](includes/aro-support.md)]
[!INCLUDE [aro-quota](includes/aro-quota.md)]

## Prerequisites

- A local machine with Unix-like operating system installed - for example, Ubuntu, macOS, or Windows Subsystem for Linux.
- A Java Standard Edition (SE) implementation, version 17 - for example, [Eclipse Open J9](https://www.eclipse.org/openj9/).
- [Maven](https://maven.apache.org/download.cgi), version 3.9.8 or higher.
- [Docker](https://docs.docker.com/get-docker/) for your OS.
- [Azure CLI](/cli/azure/install-azure-cli), version 2.61.0 or later.
- An Azure Red Hat OpenShift 4 cluster. To create the cluster, follow the instructions in [Create an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-create-cluster), while paying attention to the following differences:

  - Though instructions related to pull secrets are labeled optional, the pull secret is required for this article, especially for cluster creation. The pull secret enables your Azure Red Hat OpenShift cluster to find the Open Liberty Operator.
  - This article uses Azure MySQL as the demo database. Azure MySQL SKUs aren't available in all regions, so you should pick an Azure region that works, such as `westus`. You can check whether a given Azure region has available MySQL SKUs by using the following command:

    ```azurecli
    az mysql flexible-server list-skus --location <location>
    ```

  - The following environment variables defined in [Create an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-create-cluster) are used later in this article:

    - `RESOURCEGROUP` - the name of the resource group in which the cluster is deployed.
    - `CLUSTER`- the name of the cluster.

  - If you plan to run memory-intensive applications on the cluster, specify the proper virtual machine size for the worker nodes using the `--worker-vm-size` parameter. For more information, see the following articles:

    - [Azure CLI to create a cluster](/cli/azure/aro#az-aro-create)
    - [Supported virtual machine sizes for memory optimized](/azure/openshift/support-policies-v4#memory-optimized)

- Connect to the cluster by following the steps in [Connect to an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-connect-cluster) while using the following instructions:

  - Be sure to follow the steps in "Install the OpenShift CLI" because you use the `oc` command later in this article.
  - Save aside the cluster console URL. It should look like `https://console-openshift-console.apps.<random>.<region>.aroapp.io/`.
  - Take note of the `kubeadmin` credentials.
  - Be sure to follow the steps in "Connect using the OpenShift CLI" with the `kubeadmin` credentials.

### Install the Open Liberty Operator

After you create and connect to the cluster, use the following steps to install the Open Liberty Operator. The main starting page for the Open Liberty Operator is on [GitHub](https://github.com/OpenLiberty/open-liberty-operator).

1. Sign in to the OpenShift web console from your browser using the `kubeadmin` credentials.
1. Navigate to **Operators** > **OperatorHub** and search for **Open Liberty**.
1. Select **Open Liberty** from the search results.
1. Select **Install**.
1. On the **Install Operator** page, use the following steps:
   1. For **Update channel**, select the latest channel **v1.4**.
   1. For **Installation mode**, select **All namespaces on the cluster (default)**.
   1. For **Update approval**, select **Automatic**.

   :::image type="content" source="media/liberty-on-aro/install-operator.png" alt-text="Screenshot of the OpenShift web console that shows the Install Operator page." lightbox="media/liberty-on-aro/install-operator.png":::

1. Select **Install** and wait a few minutes until the installation completes.
1. Observe that the Open Liberty Operator is successfully installed and ready for use. If it isn't ready, diagnose and resolve the problem before continuing.

   :::image type="content" source="media/liberty-on-aro/open-liberty-operator-installed.png" alt-text="Screenshot of the OpenShift web console that shows the Installed operator dialog box." lightbox="media/liberty-on-aro/open-liberty-operator-installed.png":::

> [!NOTE]
> This guide installs the Open Liberty Operator to manage Liberty applications on the Azure Red Hat OpenShift cluster. If you want to use the WebSphere Liberty Operator, follow the steps in [Installing the WebSphere Liberty operator](https://www.ibm.com/docs/was-liberty/nd?topic=operator-installing-websphere-liberty) to install the WebSphere Liberty Operator on the cluster.

### Create an OpenShift namespace for the Java app

Use the following steps to create an OpenShift namespace for use with your app:

1. Make sure you signed in to the OpenShift web console from your browser using the `kubeadmin` credentials.
1. Navigate to **Administration** > **Namespaces** > **Create Namespace**.
1. For **Name**, fill in **open-liberty-demo**, and then select **Create**, as shown in the following screenshot.

   :::image type="content" source="media/liberty-on-aro/create-namespace.png" alt-text="Screenshot of the OpenShift web console that shows the Create Namespace dialog box." lightbox="media/liberty-on-aro/create-namespace.png":::

### Create an Azure Database for MySQL Flexible Server

Azure Database for MySQL Flexible Server deployment model is a deployment mode designed to provide more granular control and flexibility over database management functions and configuration settings than the Azure Database for MySQL single server deployment mode. This section shows you how to create an Azure Database for MySQL Flexible Server instance using the Azure CLI. For more information, see [Quickstart: Create an instance of Azure Database for MySQL - Flexible Server by using the Azure CLI](/azure/mysql/flexible-server/quickstart-create-server-cli).

Use the following command in your terminal to create an Azure Database for MySQL Flexible Server instance. Replace `<location>` with the Azure region that has available SKUs in which you want to create the server - for example, `westus`. Replace `<server-admin-password>` with a password that meets the password complexity requirements for Azure Database for MySQL Flexible Server.

```azurecli
export LOCATION=<location>
export ADMIN_PASSWORD='<server-admin-password>'
export ADMIN_USER=adminuser
export DATABASE_NAME=${RESOURCEGROUP}db
az mysql flexible-server create \
    --name ${CLUSTER} \
    --resource-group ${RESOURCEGROUP} \
    --location $LOCATION \
    --admin-user $ADMIN_USER \
    --admin-password $ADMIN_PASSWORD \
    --database-name $DATABASE_NAME \
    --public-access 0.0.0.0 \
    --yes
```

> [!NOTE]
> This article guides you to create an Azure Database for MySQL Flexible Server with MySQL authentication. A more secure practice is to use [Microsoft Entra authentication](/azure/mysql/flexible-server/concepts-azure-ad-authentication) for authenticating the database server connection. Azure Red Hat OpenShift doesn't currently support [Microsoft Entra Workload ID](/entra/workload-id/workload-identities-overview), so MySQL authentication is the only available option.
>
> If you receive an error message `No available SKUs in this location`, specify a different location using the `--location` parameter and try again. Use the following command to list available SKUs in a specific location:
>
> ```azurecli
> az mysql flexible-server list-skus --location <location>
> ```
>
> Find a location that has available SKUs and then repeat the preceding `az mysql flexible-server create` command.

It takes a few minutes to create the server, database, admin user, and firewall rule that accepts connections from all Azure resources. If the command is successful, the output looks similar to the following example:

```output
{
  "connectionString": "mysql <database-name> --host <server-name>.mysql.database.azure.com --user <server-admin-username> --password=<server-admin-password>",
  "databaseName": "<database-name>",
  "firewallName": "<firewall-name>",
  "host": "<server-name>.mysql.database.azure.com",
  "id": "/subscriptions/REDACTED/resourceGroups/<resource-group-of-the-OpenShift-cluster>/providers/Microsoft.DBforMySQL/flexibleServers/<server-name>",
  "location": "<location>",
  "password": "<server-admin-password>",
  "resourceGroup": "<resource-group-of-the-OpenShift-cluster>",
  "skuname": "Standard_B1ms",
  "username": "<server-admin-username>",
  "version": "8.0.21"
}
```

## Prepare the Liberty application

We use a Jakarta EE 10 application as our example in this guide. Open Liberty is Jakarta EE 10 full profile compatible. For more information, see the [Jakarta EE Platform API](https://jakarta.ee/specifications/platform/10/apidocs/).

### Run the application on Open Liberty

To run the application on Open Liberty, you need to create an Open Liberty server configuration file so that the [Liberty Maven plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin) can package the application for deployment. The Liberty Maven plugin isn't required to deploy the application to OpenShift. However, we use it in this example with Open Liberty's developer (dev) mode. Developer mode lets you easily run the application locally. To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

Follow the steps in this section to prepare the sample application for later use in this article.

#### Check out the application

Use the following commands to clone the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aro).

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aro.git
cd open-liberty-on-aro
export BASE_DIR=$PWD
git checkout 20250429
cd ${BASE_DIR}/3-integration/connect-db/mysql
```

If you see a message about being in `detached HEAD` state, this message is safe to ignore. It just means you checked out a tag.

There are a few samples in the repository. We use **open-liberty-on-aro/3-integration/connect-db/mysql**. Here's the file structure of the application:

```
open-liberty-on-aro/3-integration/connect-db/mysql
├─ src/main/
│  ├─ aro/
│  │  ├─ db-secret.yaml
│  │  ├─ openlibertyapplication.yaml
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ Dockerfile
├─ Dockerfile-wlp
├─ pom.xml
```

The directories **java**, **resources**, and **webapp** contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the **aro** directory, we placed two deployment files. **db-secret.xml** is used to create [Secrets](https://docs.openshift.com/container-platform/4.6/nodes/pods/nodes-pods-secrets.html) with database connection credentials. The file **openlibertyapplication.yaml** is used to deploy the application image.

In the root directory, we placed two Dockerfiles. **Dockerfile** and **Dockerfile-wlp** are used for local debugging and to build the image for an Azure Red Hat OpenShift deployment, working with Open Liberty and WebSphere Liberty, respectively.

In the **liberty/config** directory, the **server.xml** is used to configure the database connection for the Open Liberty and WebSphere Liberty cluster.

#### Build the project

Using the environment variables defined previously, run the following commands in your terminal to build the project. The POM file for the project reads many properties from the environment.

```bash
cd ${BASE_DIR}/3-integration/connect-db/mysql

# The following variables are used for deployment file generation
export DB_SERVER_NAME=$CLUSTER.mysql.database.azure.com
export DB_PORT_NUMBER=3306
export DB_NAME=$DATABASE_NAME
export DB_USER=$ADMIN_USER
export DB_PASSWORD=$ADMIN_PASSWORD
export NAMESPACE=open-liberty-demo

mvn clean install
```

#### (Optional) Test your application locally

Optionally, you can run the application locally to verify that it works as expected. First, you need to add a firewall rule to allow your local machine to connect to the Azure Database for MySQL Flexible Server instance. Use the following steps to add the firewall rule:

1. Sign in to the Azure portal and navigate to the Azure Database for MySQL Flexible Server instance you created earlier.
1. In the left pane, select **Settings** > **Networking**.
1. Select **Add current client IP address**.
1. Select **Save** and wait for the firewall rule to be added.

Use the following steps to run the `liberty:devc` command to locally run and test the project and container image before dealing with any Azure complexity. For more information on `liberty:devc`, see the [Liberty Plugin documentation](https://github.com/OpenLiberty/ci.maven/blob/main/docs/dev.md#devc-container-mode).

1. Start your local Docker environment if needed. The instructions for starting the environment vary depending on the host operating system.

1. Use the following commands to start the application in `liberty:devc` mode:

   ```bash
   cd ${BASE_DIR}/3-integration/connect-db/mysql

   # If you are running with Open Liberty
   mvn liberty:devc -DcontainerRunOpts="-e DB_SERVER_NAME=${DB_SERVER_NAME} -e DB_PORT_NUMBER=${DB_PORT_NUMBER} -e DB_NAME=${DB_NAME} -e DB_USER=${DB_USER} -e DB_PASSWORD=${DB_PASSWORD}" -Dcontainerfile=Dockerfile

   # If you are running with WebSphere Liberty
   mvn liberty:devc -DcontainerRunOpts="-e DB_SERVER_NAME=${DB_SERVER_NAME} -e DB_PORT_NUMBER=${DB_PORT_NUMBER} -e DB_NAME=${DB_NAME} -e DB_USER=${DB_USER} -e DB_PASSWORD=${DB_PASSWORD}" -Dcontainerfile=Dockerfile-wlp
   ```

1. Verify the application works as expected. You should see a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds.` in the command output if successful. Go to `https://localhost:9443/` in your browser and verify the application is accessible and all functions are working.

1. To stop `liberty:devc` mode, press <kbd>Control</kbd>+<kbd>C</kbd>.

## Prepare the application image

To deploy and run your Liberty application on an Azure Red Hat OpenShift cluster, containerize your application as a Docker image using [Open Liberty container images](https://github.com/OpenLiberty/ci.docker) or [WebSphere Liberty container images](https://www.ibm.com/docs/was-liberty/base?topic=images-liberty-container#cntr_r_images__wlicr__title__1).

### Build the application and push to the image stream

Since you already successfully ran the app in the Liberty Docker container using the `liberty:devc` command, you're going to build the image remotely on the cluster by using the following steps:

1. Make sure you sign in to the OpenShift CLI using the `kubeadmin` credentials.
1. Use the following commands to identify the source directory and Dockerfile:

   ```bash
   cd ${BASE_DIR}/3-integration/connect-db/mysql

   # If you are building with the Open Liberty base image, the existing Dockerfile is ready for you

   # If you are building with the WebSphere Liberty base image, uncomment and execute the following two commands to rename Dockerfile-wlp to Dockerfile
   # mv Dockerfile Dockerfile.backup
   # mv Dockerfile-wlp Dockerfile
   ```

1. Use the following command to change the project to `open-liberty-demo`:

   ```bash
   oc project $NAMESPACE
   ```

1. Use the following command to create an image stream:

   ```bash
   oc create imagestream javaee-cafe-mysql
   ```

1. Use the following command to create a build configuration that specifies the image stream tag of the build output:

   ```bash
   oc new-build --name javaee-cafe-mysql-config --binary --strategy docker --to javaee-cafe-mysql:v1
   ```

1. Use the following command to start the build to upload local contents, containerize, and output to the image stream tag specified before:

   ```bash
   oc start-build javaee-cafe-mysql-config --from-dir . --follow
   ```

## Deploy application on the Azure Red Hat OpenShift cluster

Now you can deploy the sample Liberty application to the Azure Red Hat OpenShift cluster you created earlier when working through the prerequisites.

### [Web console](#tab/deploy-console)

### Deploy the application from the web console

Because we use the Open Liberty Operator to manage Liberty applications, we need to create an instance of its Custom Resource Definition, of type `OpenLibertyApplication`. The Operator takes care of all aspects of managing the OpenShift resources required for deployment. Use the following steps to create this instance:

1. Sign in to the OpenShift web console from your browser using the `kubeadmin` credentials.
1. Select the project by visiting **Home** > **Projects** > **open-liberty-demo**.
1. Navigate to **Workloads** > **Secrets**.
1. Select **Create** > **From YAML**.
1. Replace the generated YAML with yours, which is located at **\<path-to-repo\>/3-integration/connect-db/mysql/target/db-secret.yaml**.
1. Select **Create**. This selection returns you to the **Secret details** page.
1. Navigate to **Operators** > **Installed Operators**.
1. In the middle of the page, you see **Open Liberty**.
1. From **Provided APIs**, select **OpenLibertyApplication**. The navigation of items in the user interface mirrors the actual containment hierarchy of technologies in use.

   <!-- Diagram source https://github.com/Azure-Samples/open-liberty-on-aro/blob/master/diagrams/aro-java-containment.vsdx -->
   :::image type="content" source="media/liberty-on-aro/aro-java-containment.png" alt-text="Diagram of Azure Red Hat OpenShift Java Containment." border="false" lightbox="media/liberty-on-aro/aro-java-containment.png":::

1. Select **Create OpenLibertyApplication**.
1. Select **YAML view** for **Configure via**.
1. Replace the generated yaml with yours, which is located at **\<path-to-repo\>/3-integration/connect-db/mysql/target/openlibertyapplication.yaml**.
1. Select **Create**. You're returned to the list of OpenLibertyApplications.
1. Navigate to **Operators** > **Installed Operators** > **Open Liberty** > **OpenLibertyApplication**.
1. Select **javaee-cafe-mysql**.
1. In the middle of the page, select **Resources**.
1. In the table, select the link for **javaee-cafe-mysql** with the **Kind** of **Route**.
1. On the page that opens, select the link below **Location**.

The application home page opens in the browser.

### Delete the application from the web console

When you're done with the application, use the following steps to delete the application from Open Shift:

1. In the left navigation pane, expand the entry for **Operators**.
1. Select **Installed Operators**.
1. Select **Open Liberty**.
1. In the middle of the page, select **OpenLibertyApplication**.
1. For **javaee-cafe-mysql**, select the vertical ellipsis (three vertical dots) then select **Delete OpenLibertyApplication**.
1. Select **Delete** to delete the application.

Use the following steps to delete the secret from Open Shift:

1. Navigate to **Workloads** > **Secrets**.
1. Select **db-secret-mysql**.
1. Select **Actions** > **Delete Secret**.
1. Select **Delete** to delete the secret.

### [CLI](#tab/deploy-cli)

### Deploy the application from the CLI

Instead of using the web console GUI, you can deploy the application from the CLI. Download and install the `oc` command-line tool if needed by following the steps in Red Hat documentation: [Getting Started with the CLI](https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html).

You can now deploy the sample Liberty application to the Azure Red Hat OpenShift cluster by using the following steps:

1. Make sure you sign in to the OpenShift CLI using the `kubeadmin` credentials.
1. Use the following commands deploy the application:

   ```bash
   # Change directory to "<path-to-repo>/3-integration/connect-db/mysql/target"
   cd ${BASE_DIR}/3-integration/connect-db/mysql/target

   # Change project to "open-liberty-demo"
   oc project $NAMESPACE

   # Create database secret
   oc create -f db-secret.yaml

   # Create the deployment
   oc create -f openlibertyapplication.yaml

   # Check if OpenLibertyApplication instance is created
   oc get openlibertyapplication javaee-cafe-mysql

   # Check if deployment created by Operator is ready. All three pods must be ready. Press Ctrl + C to exit
   oc get deployment javaee-cafe-mysql --watch

   # Get host of the route
   export HOST=$(oc get route javaee-cafe-mysql --template='{{ .spec.host }}')
   echo "Route Host: https://$HOST"
   ```

After the Liberty application is up and running, open the output of **Route Host** in your browser to visit the application home page.

### Delete the application from CLI

Use the following commands to delete the application and secret from the CLI:

```bash
oc delete -f openlibertyapplication.yaml
oc delete -f db-secret.yaml
```

---

## Clean up resources

Delete the Azure Red Hat OpenShift cluster by following the steps in [Tutorial: Delete an Azure Red Hat OpenShift 4 cluster](/azure/openshift/tutorial-delete-cluster). Make sure the database and any associated resources are deleted too.

## Next steps

You can learn more from references used in this guide:

* [Open Liberty](https://openliberty.io/)
* [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
* [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
* [Open Liberty Container Images](https://github.com/OpenLiberty/ci.docker)
* [WebSphere Liberty Container Images](https://www.ibm.com/docs/was-liberty/base?topic=images-liberty-container#cntr_r_images__wlicr__title__1)

To explore options to run WebSphere products on Azure, see [What are solutions to run the WebSphere family of products on Azure?](websphere-family.md)

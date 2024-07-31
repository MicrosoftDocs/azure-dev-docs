--- 
title: Build custom virtual machine images with GitHub Actions and Azure  
description: Learn how to build custom virtual machine images with GitHub Actions and Azure
author: juliakm 
ms.author: jukullam 
ms.topic: quickstart
ms.service: azure-virtual-machines
ms.subservice: imaging
ms.date: 06/09/2023
ms.custom: github-actions-azure, devx-track-azurecli, mode-portal, devx-track-extended-java, linux-related-content
---


# Build custom virtual machine images with GitHub Actions and Azure

Get started with the [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) by creating a workflow to build a virtual machine image.


With GitHub Actions, you can speed up your CI/CD process by creating custom virtual machine images with artifacts from your workflows. You can both build images and distribute them to a [Shared Image Gallery](/azure/virtual-machines/shared-image-galleries).

 You can then use these images to create [virtual machines](https://azure.microsoft.com/services/virtual-machines/) and [virtual machine scale sets](/azure/virtual-machine-scale-sets/overview).

The build virtual machine image action uses the [Azure Image Builder service](/azure/virtual-machines/image-builder-overview).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account with an active repository. If you don't have one, sign up for [free](https://github.com/join). 
    - This example uses the [Java Spring PetClinic Sample Application](https://github.com/spring-projects/spring-petclinic).
- An Azure Compute Gallery with an image.
    - [Create an Azure Compute Gallery](/azure/virtual-machines/create-gallery?tabs=cli).
    - [Create an image](/azure/virtual-machines/image-version).


## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Add a user-managed identity. <br /> 2. Set up a service principal or Open ID Connect.  <br /> 3. Create a GitHub secret. |
|**Build** | 1. Set up the environment. <br /> 2. Build the app. |
|**Image** | 1. Create a VM Image. <br /> 2. Create a virtual machine. |


## Create a user-managed identity

You'll need a user-managed identity for Azure Image Builder(AIB) to distribute images. Your Azure user-assigned managed identity will be used during the image build to read and write images to a Shared Image Gallery. 

1. Create a user-managed identity with [Azure CLI](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli) or the [Azure portal](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal). Write down the name of your managed identity. 

1. Customize this JSON code. Replace the placeholders for `{subscriptionID}` and `{rgName}`with your subscription ID and resource group name.

    ```yaml
    {
    "properties": {
        "roleName": "Image Creation Role",
        "IsCustom": true,
        "description": "Azure Image Builder access to create resources for the image build",
        "assignableScopes": [
          "/subscriptions/{subscriptionID}/resourceGroups/{rgName}"
        ],
        "permissions": [
            {
                "actions": [
                    "Microsoft.Compute/galleries/read",
                    "Microsoft.Compute/galleries/images/read",
                    "Microsoft.Compute/galleries/images/versions/read",
                    "Microsoft.Compute/galleries/images/versions/write",
                    "Microsoft.Compute/images/write",
                    "Microsoft.Compute/images/read",
                    "Microsoft.Compute/images/delete"
                ],
                "notActions": [],
                "dataActions": [],
                "notDataActions": []
            }
        ]
        } 
    } 
    ```

1. Use this JSON code to create a [new custom role](/azure/role-based-access-control/custom-roles-portal#start-from-scratch#start-from-json) with JSON.

1. In Azure portal, open your Azure Compute Gallery and go to **Access control (IAM)**. 

1. Select **Add role assignment** and assign the Image Creation Role to your user-managed identity.

## Generate deployment credentials

[!INCLUDE [include](~/../articles/reusable-content/github-actions/generate-deployment-credentials.md)]

## Create GitHub secrets

[!INCLUDE [include](~/../articles/reusable-content/github-actions/create-secrets-with-openid.md)]


## Use the Azure login action

Use your GitHub secret with the [Azure Login action](https://github.com/Azure/login) to authenticate to Azure.

# [Service principal](#tab/principal)

In this workflow, you authenticate using the Azure login action with the service principal details stored in `secrets.AZURE_CREDENTIALS`. Then, you run an Azure CLI action. For more information about referencing GitHub secrets in a workflow file, see [Using encrypted secrets in a workflow](https://docs.github.com/en/actions/reference/encrypted-secrets#using-encrypted-secrets-in-a-workflow) in GitHub Docs.


```yaml
on: [push]

name: Create Custom VM Image

jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
      - name: Log in with Azure
        uses: azure/login@v1
        with:
          creds: '${{ secrets.AZURE_CREDENTIALS }}'
```

# [Open ID Connect](#tab/openid)

For Open ID Connect you'll use a federated credential associated with your Active Directory app.

For more information about referencing GitHub secrets in a workflow file, see [Using encrypted secrets in a workflow](https://docs.github.com/en/actions/reference/encrypted-secrets#using-encrypted-secrets-in-a-workflow) in GitHub Docs.


```yaml
on: [push]

name: Create Custom VM Image

jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
      - name: Log in with Azure
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

___

## Configure Java

Set up the Java environment with the [Java Setup SDK action](https://github.com/marketplace/actions/setup-java-jdk). For this example, you'll set up the environment, build with Maven, and then output an artifact.

[GitHub artifacts](https://docs.github.com/en/actions/guides/storing-workflow-data-as-artifacts) are a way to share files in a workflow between jobs. You'll create an artifact to hold the JAR file and then add it to the virtual machine image.

# [Service principal](#tab/principal)

```yaml
on: [push]

name: Create Custom VM Image

jobs:
  build-image:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        java: [ '17' ]

    steps:
    - name: Checkout
      uses: actions/checkout@v3    

    - name: Login via Az module
      uses: azure/login@v1
      with:
        creds: ${{secrets.AZURE_CREDENTIALS}}

    - name: Set up JDK ${{matrix.java}}
      uses: actions/setup-java@v2
      with:
        java-version: ${{matrix.java}}
        distribution: 'adopt'
        cache: maven
    - name: Build with Maven Wrapper
      run: ./mvnw -B package
        
    - name: Build Java
      run: mvn --batch-mode --update-snapshots verify

    - run: mkdir staging && cp target/*.jar staging
    - uses: actions/upload-artifact@v2
      with:
        name: Package
        path: staging
```

# [Open ID Connect](#tab/openid)

```yaml
on: [push]

name: Create Custom VM Image

jobs:
  build-image:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        java: [ '17' ]

    steps:
    - name: Checkout
      uses: actions/checkout@v3    

    - name: Login via Az module
      uses: azure/login@v1
      with:
        creds: ${{secrets.AZURE_CREDENTIALS}}

    - name: Set up JDK ${{matrix.java}}
      uses: actions/setup-java@v2
      with:
        java-version: ${{matrix.java}}
        distribution: 'adopt'
        cache: maven
    - name: Build with Maven Wrapper
      run: ./mvnw -B package
        
    - name: Build Java
      run: mvn --batch-mode --update-snapshots verify

    - run: mkdir staging && cp target/*.jar staging
    - uses: actions/upload-artifact@v2
      with:
        name: Package
        path: staging
```

___

## Build your image 

Use the [Build Azure Virtual Machine Image action](https://github.com/marketplace/actions/build-azure-virtual-machine-image) to create a custom virtual machine image.

Replace the placeholders for `{subscriptionID}`, `{rgName}`and `{Identity}` with your subscription ID, resource group name, and managed identity name. Replace the values of `{galleryName}` and `{imageName}` with your image gallery name and your image name.

> [!NOTE]
> If the Create App Baked Image action fails with a permission error, verify that you have assigned the Image Creation Role to your user-managed identity.



```yaml
    - name: Create App Baked Image
      id: imageBuilder
      uses: azure/build-vm-image@v0
      with:
        location: 'eastus2'
        resource-group-name: '{rgName}'
        managed-identity: '{Identity}' # Managed identity
        source-os-type: 'windows'
        source-image-type: 'platformImage'
        source-image: MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest #unique identifier of source image
        dist-type: 'SharedImageGallery'
        dist-resource-id: '/subscriptions/{subscriptionID}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{imageName}/versions/0.1.${{ GITHUB.RUN_ID }}' #Replace with the resource id of your shared image  gallery's image definition
        dist-location: 'eastus2'
```

### Virtual Machine action arguments

| Input  | Required  | Description  |
|---|---|---|
| `resource-group-name`  | Yes  | The resource group used for storage and saving artifacts during the build process.  |
|  `image-builder-template-name` |  No |  The name of the image builder template resource used.  |
|  `location` | Yes  | The location where Azure Image Builder will run. See [supported locations](/azure/virtual-machines/image-builder-overview#regions).  |
| `build-timeout-in-minutes`  |  No | Time after which the build is canceled. Defaults to 240. |
| `vm-size`  | Optional  | By default, `Standard_D1_v2` will be used.  See [virtual machine sizes](/azure/virtual-machines/sizes).|
|  `managed-identity` |  Yes | The user-managed identity you created earlier. Use the full identifier if your identity is in a different resources group. Use the name if it is in the same resource group. |
|  `source-os` | Yes  | The OS type of the base image (Linux or Windows) |
|  `source-image-type` | Yes  | The base image type that will be used for creating the custom image.  |
|  `source-image` | Yes  | The resource identifier for base image. A source image should be present in the same Azure region set in the input value of location. |
|  `customizer-source` | No  | The directory where you can keep all the artifacts that need to be added to the base image for customization. By default, the value is `${{ GITHUB.WORKSPACE }}/workflow-artifacts.` |
|  `customizer-destination` | No  | This is the directory in the customized image where artifacts are copied to. |
|  `customizer-windows-update` | No  | For Windows only. Boolean value. If `true`, the image builder will run Windows update at the end of the customizations.|
|  `dist-location` | No  | For SharedImageGallery, this is the `dist-type`.|
|  `dist-image-tags` | No  | These are user-defined tags that are added to the custom image created (example: `version:beta`). |


## Create your virtual machine

As a last step, create a virtual machine from your image. 

1. Replace the placeholders for `{rgName}`with your resource group name.

1. Add a GitHub secret with the virtual machine password (`VM_PWD`). Be sure to write down the password because you will not be able to see it again. The username is `myuser`.

```yaml
    - name: CREATE VM
      uses: azure/CLI@v1
      with:
        azcliversion: 2.0.72
        inlineScript: |
        az vm create --resource-group ghactions-vMimage  --name "app-vm-${{ GITHUB.RUN_NUMBER }}"  --admin-username myuser --admin-password "${{ secrets.VM_PWD }}" --location  eastus2 \
            --image "${{ steps.imageBuilder.outputs.custom-image-uri }}"              
```

### Complete YAML

# [Service principal](#tab/principal)

```yaml
  on: [push]

  name: Create Custom VM Image

  jobs:
    build-image:
      runs-on: ubuntu-latest    
      steps:
      - name: Checkout
        uses: actions/checkout@v2    

      - name: Login via Az module
        uses: azure/login@v1
        with:
          creds: ${{secrets.AZURE_CREDENTIALS}}

      - name: Setup Java 1.8.x
        uses: actions/setup-java@v1
        with:
          java-version: '1.8.x'
          
      - name: Build Java
        run: mvn --batch-mode --update-snapshots verify

      - run: mkdir staging && cp target/*.jar staging
      - uses: actions/upload-artifact@v2
        with:
          name: Package
          path: staging

      - name: Create App Baked Image
        id: imageBuilder
        uses: azure/build-vm-image@v0
        with:
          location: 'eastus2'
          resource-group-name: '{rgName}'
          managed-identity: '{Identity}' # Managed identity
          source-os-type: 'windows'
          source-image-type: 'platformImage'
          source-image: MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest #unique identifier of source image
          dist-type: 'SharedImageGallery'
          dist-resource-id: '/subscriptions/{subscriptionID}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{imageName}/versions/0.1.${{ GITHUB.RUN_ID }}' #Replace with the resource id of your shared image  gallery's image definition
          dist-location: 'eastus2'

      - name: CREATE VM
        uses: azure/CLI@v1
        with:
          azcliversion: 2.0.72
          inlineScript: |
          az vm create --resource-group ghactions-vMimage  --name "app-vm-${{ GITHUB.RUN_NUMBER }}"  --admin-username myuser --admin-password "${{ secrets.VM_PWD }}" --location  eastus2 \
              --image "${{ steps.imageBuilder.outputs.custom-image-uri }}"              
```

# [Open ID Connect](#tab/openid)

```yaml
  on: [push]

  name: Create Custom VM Image

  jobs:
    build-image:
      runs-on: ubuntu-latest    
      steps:
      - name: Checkout
        uses: actions/checkout@v2    

      - name: Login via Az module
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Setup Java 1.8.x
        uses: actions/setup-java@v1
        with:
          java-version: '1.8.x'
          
      - name: Build Java
        run: mvn --batch-mode --update-snapshots verify

      - run: mkdir staging && cp target/*.jar staging
      - uses: actions/upload-artifact@v2
        with:
          name: Package
          path: staging

      - name: Create App Baked Image
        id: imageBuilder
        uses: azure/build-vm-image@v0
        with:
          location: 'eastus2'
          resource-group-name: '{rgName}'
          managed-identity: '{Identity}' # Managed identity
          source-os-type: 'windows'
          source-image-type: 'platformImage'
          source-image: MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest #unique identifier of source image
          dist-type: 'SharedImageGallery'
          dist-resource-id: '/subscriptions/{subscriptionID}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{imageName}/versions/0.1.${{ GITHUB.RUN_ID }}' #Replace with the resource id of your shared image  gallery's image definition
          dist-location: 'eastus2'

      - name: CREATE VM
        uses: azure/CLI@v1
        with:
          azcliversion: 2.0.72
          inlineScript: |
          az vm create --resource-group ghactions-vMimage  --name "app-vm-${{ GITHUB.RUN_NUMBER }}"  --admin-username myuser --admin-password "${{ secrets.VM_PWD }}" --location  eastus2 \
              --image "${{ steps.imageBuilder.outputs.custom-image-uri }}"              
```
---


## Next steps
- Learn how to [deploy to Azure](deploy-to-azure.md).

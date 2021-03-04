--- 
title: Build custom virtual machine images with GitHub Actions  
description: Learn how to Build custom virtual machine images with Azure and GitHub Actions   
author: juliakm 
ms.author: jukullam 
ms.topic: quickstart
ms.service: azure 
ms.date: 03/03/2021
ms.custom: github-actions-azure
---


# Build custom virtual machine images with GitHub Actions and Azure

Get started with the [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions) build Azure virtual machine image action. You can use GitHub Actions to create custom virtual machine images with artifacts from your workflows that include pre-installed software. With GitHub Actions, you can both build images and distribute them with [Shared Image Gallery](/azure/virtual-machines/shared-image-galleries). You can use these images to create [virtual machines](https://azure.microsoft.com/services/virtual-machines/) and [virtual machine scale sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview).

The Build Virtual Machine Image action uses the [Azure Image Builder service](/azure/virtual-machines/image-builder-overview).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account with an active repository. If you don't have one, sign up for [free](https://github.com/join). 
    - This example uses the [Java Spring PetClinic Sample Application](https://github.com/spring-projects/spring-petclinic).
- A Shared Image Gallery.
    - [Create a Shared Image Gallery with the Azure CLI](/azure/virtual-machines/shared-images-cli)
    - Create an Azure Shared Image Gallery using the portal ([Windows](/azure/virtual-machines/windows/shared-images-portal), [Linux](/azure/virtual-machines/linux/shared-images-portal))

## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has three sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Add a user managed identity. <br /> 2. Define a service principal or publish profile.  <br /> 3. Create a GitHub secret. |
|**Build** | 1. Set up the environment. <br /> 2. Build the app. |
|**Image** | 1. Create a VM Image. <br /> 2. Create a virtual machine. |


## Create a user managed identity

You need a user managed identity for Azure Image Builder(AIB) to distribute images using a Shared Image Gallery. Your Azure user-assigned managed identity will be used during the image build to read and write images. 

1. Create a user managed identity with [Azure CLI](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli) or the [Azure portal](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal). Write down the name of your managed identity. 

1. Customize this JSON code. Replace the placeholders for `{subscriptionID}` and `{rgName}`with your subscription ID and resource group name.

    ```yaml
    {
        "Name": "Image Creation Role",
        "IsCustom": true,
        "Description": "Azure Image Builder access to create resources for the image build",
        "Actions": [
            "Microsoft.Compute/galleries/read",
            "Microsoft.Compute/galleries/images/read",
            "Microsoft.Compute/galleries/images/versions/read",
            "Microsoft.Compute/galleries/images/versions/write",

            "Microsoft.Compute/images/write",
            "Microsoft.Compute/images/read",
            "Microsoft.Compute/images/delete"
        ],
        "NotActions": [
    
        ],
        "AssignableScopes": [
        "/subscriptions/{subscriptionID}/resourceGroups/{rgName}"
        ]
    }
    ```

1. Use this JSON code to create a [new custom role](/azure/role-based-access-control/custom-roles-portal#start-from-scratch#start-from-json) with JSON.


## Create a service principal and add it to GitHub secret

To use [Azure login](https://github.com/marketplace/actions/azure-login), you first need to add your Azure service principal as a secret to your GitHub repository.

In this example, you will create a secret named `AZURE_CREDENTIALS` that you can use to authenticate with Azure.  

1. If you do not have an existing application, register a [new Active Directory application](/azure/active-directory/develop/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal&preserve-view=true) to use with your service principal.

    ```azurecli-interactive
        appName="myApp"

        az ad app create \
        --display-name $appName \
        --homepage "http://localhost/$appName" \
        --identifier-uris http://localhost/$appName
    ```

1. [Create a new service principal](/cli/azure/create-an-azure-service-principal-azure-cli) in the Azure portal for your app. 

    ```azurecli-interactive
        az ad sp create-for-rbac --name "myApp" --role contributor \
                                    --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                                    --sdk-auth
    ```

1. Copy the JSON object for your service principal.

    ```json
    {
        "clientId": "<GUID>",
        "clientSecret": "<GUID>",
        "subscriptionId": "<GUID>",
        "tenantId": "<GUID>",
        (...)
    }
    ```

1. Open your GitHub repository and go to **Settings**.

    :::image type="content" source="media/github-repo-settings.png" alt-text="Select Settings in the navigation":::

1. Select **Secrets** and then **New Secret**.

    :::image type="content" source="media/select-secrets.png" alt-text="Choose to add a secret":::

1. Paste in your JSON object for your service principal with the name `AZURE_CREDENTIALS`. 

    :::image type="content" source="media/azure-secret-add.png" alt-text="Add a secret in GitHub":::

1. Save by selecting **Add secret**.


## Use the Azure login action

Use your service principal secret with the [Azure Login action](https://github.com/Azure/login) to authenticate to Azure.

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

## Configure environment and artifact

Set up the Java environment with the [Java Setup SDK action](https://github.com/marketplace/actions/setup-java-jdk). For this example, you'll setup the environment, build with Maven, and then output an artifact.

[GitHub artifacts](https://docs.github.com/en/actions/guides/storing-workflow-data-as-artifacts) are a way to share files in a workflow between jobs. You'll create an artifact to hold the JAR file and then add it to the virtual machine image.


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

```

## Create image 

Use the [Build Azure Virtual Machine Image action](https://github.com/marketplace/actions/build-azure-virtual-machine-image) to create a custom virtual machine image.

Replace the placeholders for `{subscriptionID}`, `{rgName}`and `{Identity}` with your subscription ID, resource group name, and managed identity name. Replace the values of `{galleryName}` and `{imageName}` with your image gallery name and your image name.

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
|  `managed-identity` |  Yes | The user managed identity you created earlier. Use the full identifier if your identity is in a different resources group. Use the name if it is in the same resource group. |
|  `source-os` | Yes  | The OS type of the base image (Linux or Windows) |
|  `source-image-type` | Yes  | The base image type that will be used for creating the custom image.  |
|  `source-image` | Yes  | The resource identifier for base image. A source image should be present in the same Azure region set in the input value of location. |
|  `customizer-source` | No  | The directory where you can keep all the artifacts that need to be added to the base image for customization. By default, the value is `${{ GITHUB.WORKSPACE }}/workflow-artifacts.` |
|  `customizer-destination` | No  | This is the directory in the customized image where artifacts are copied to. |
|  `customizer-windows-update` | No  | For Windows only. Boolean value. If `true`, the image builder will run Windows update at the end of the customizations.|
|  `dist-location` | No  | For SharedImageGallery, this is the `dist-type`.|
|  `dist-image-tags` | No  | These are user defined tags that are added to the custom image created (example: `version:beta`). |


## Create virtual machine

As a last step, create a virtual machine from your image. Replace the placeholders for `{rgName}`with your resource group name.

Add a GitHub secret for the virtual machine password (`VM_PWD`).

```yaml
    - name: CREATE VM
      uses: azure/CLI@v1
      with:
        azcliversion: 2.0.72
        inlineScript: |
        az vm create --resource-group ghactions-vMimage  --name "app-vm-${{ GITHUB.RUN_NUMBER }}"  --admin-username myuser --admin-password "${{ secrets.VM_PWD }}" --location  eastus2 \
            --image "${{ steps.imageBuilder.outputs.custom-image-uri }}"              
```
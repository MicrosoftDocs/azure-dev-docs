---
title: Secure JS website with domain and certificates
description:  Learn how to create a web app on Azure with a custom domain name secured with an TLS/SSL certificate. 
ms.topic: how-to
ms.date: 03/23/2021
ms.custom: devx-track-js
---

# Secure JavaScript websites with custom domains and certificates

Learn how to create a web app on Azure with a custom domain name secured with an TLS/SSL certificate.

## Create a new App Service Domain

The domain resource is a separate resource from the web app resource. 

1. In the Azure portal, use [this link](https://ms.portal.azure.com/#create/Microsoft.Domain) to begin creating a new domain. 
1. Create a new resource group to contain all the resources for you secure and named web app. 
1. In the **Domain Details**, enter the domain name you want, such as `cats-flying-dogs.com`. You should have a few domain name choices with variations to try. 

    :::image type="content" source="../media/custom-domain/create-new-app-service-domain.png" alt-text="A new creation page opens. Create a new **App Service domain**.":::

1. Continue filling out the creation tabs for the service:

    |Tab name|Select|
    |--|--|
    |Contact information|Personal or corporate information about web site ownership.|
    |Hostname assignment|Keep the default settings.|
    |Advanced|Keep the default settings so your domain name renews next year and your contact information is kept private.|

1. When you are done, select **Review + create** at the bottom of the web site. 

    The domain name is purchased for you and billed to your subscription.

## Create a new web app service

When creating one of the following types of web app, **do not select the free pricing tier**: 

|Service|
|--|
|[Azure App service](https://ms.portal.azure.com/#create/Microsoft.WebSite) (web app)|
|[Azure Function](https://ms.portal.azure.com/#create/Microsoft.FunctionApp)|

## Configure App Service for new domain

1. In the Azure portal, for your new web app, Select the **Custom domains** setting, then select **+ Add custom domain**. 

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain-add-custom-domain.png" alt-text="Select the **Custom domains** setting, then select **+ Add custom domain**. ":::

1. In the right panel, enter the new domain name, such as `cats-flying-dogs.com`, then select **Validate**.
1. Select the **Add custom domain** to connect the domain name to the app service's IP address. 

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain-validate-custom-domain.png" alt-text="Select the **Add custom domain** to connect the domain name to the app service's IP address.":::

## Create free managed private certificate

1. Select **TSL/SSL Settings** from the **Settings** area. 

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-select-tsl-ssl-settings.png" alt-text="Select **TSL/SSL Settings** from the **Settings** area.":::

1. Select **Private Key Certificates** then select **+ Create App Service Managed Certificate**

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-create-private-managed-certificate-button.png" alt-text="Select **Private Key Certificates** then select **+ Create App Service Managed Certificate**":::

1. Select the new domain name then select **Create**.

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-add-app-service-managed-certificate-create-certificate.png" alt-text="Select the new domain name then select **Create**.":::

    This may take a minute or two to complete.

## Add binding between certificate and domain

1. Select the **Custom domains** setting, then select **Add binding** for the new domain name. 

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain-add-binding.png" alt-text="Select the **Custom domains** setting, then select **Add binding** for the new domain name.":::

1. In the right panel, select the new domain, the private certificate, and the TLS/SSL type.

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain-add-binding-panel.png" alt-text="In the right panel, select the new domain, the private certificate, and the TLS/SSL type.":::

1. The process completes and the Custom Domain page shows the custom domain name is secure. 

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain-add-binding-complete.png" alt-text="The process completes and the Custom Domain page shows the custom domain name is secure.":::

1. Select the app's **Overview** page and see the URL for your web app uses the new domain name. 

## Learn more about securing your web app service

You can use existing domain names and certificates or you can create new domain names and certificates on your hosting services:

|Azure host service|Custom domain name| Certificates|
|--|--|--|
|[Azure Static Web Apps](/azure/static-web-apps/)|[Use existing custom domain](/azure/static-web-apps/custom-domain)||
|[Azure Functions](/azure/azure-functions/) & [Apps](/azure/app-service)|[Buy custom domain name on Azure](/azure/app-service/manage-custom-dns-buy-domain)</br>[Map existing domain name](/app-service/app-service-web-tutorial-custom-domain)<br>[Map with Traffic Manager](/azure/app-service/configure-domain-traffic-manager)|[Create free managed certificate](/azure/app-service/configure-ssl-certificate#create-a-free-managed-certificate-preview)</br>[Import existing certificate from Key Vault](/azure/app-service/configure-ssl-certificate#import-a-certificate-from-key-vault)</br>[Upload private certificate](/azure/app-service/configure-ssl-certificate#upload-a-private-certificate)</br>[Upload public certificate](/azure/app-service/configure-ssl-certificate#upload-a-public-certificate)</br>[Configure SSL bindings](/azure/app-service/configure-ssl-bindings)|
|[Container Instances](/azure/container-instances)||[Using sidecar container](/azure/container-instances/container-instances-container-group-ssl)|

## Next steps

* [Deploy a web app](deploy-web-app.md)
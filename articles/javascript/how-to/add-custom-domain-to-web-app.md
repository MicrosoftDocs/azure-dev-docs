---
title: 
description:   
ms.topic: how-to
ms.date: 
ms.custom: devx-track-js
---

# Secure JavaScript websites with custom domains and certificates

To add a custom domain name and secure certificate to your web app, you need to add those at the resource level. 

When you create a hosting resource on Azure, the endpoint is **immediately secure** with HTTPS at no extra cost. While secure, your hosted web apps are using subdomains of Microsoft-owned domain names. This may be fine for new or smaller web apps but as your user base grows, they need to know they are using the correct and secure web app.

Applying custom domains and certificates lets your users know that they are using **your secure website**. 

## Securing your web app service

You can use existing domain names and certificates or you can create new domain names and certificates on your hosting services:

|Azure host service|Custom domain name| Certificates|
|--|--|--|
|[Azure Static Web Apps](/azure/static-web-apps/)|[Use existing custom domain](/azure/static-web-apps/custom-domain)||
|[Azure Functions](/azure/azure-functions/) & [Apps](/azure/app-service)|[Buy custom domain name on Azure](https://docs.microsoft.com/en-us/azure/app-service/manage-custom-dns-buy-domain)</br>[Map existing domain name](/app-service/app-service-web-tutorial-custom-domain)<br>[Map with Traffic Manager](/azure/app-service/configure-domain-traffic-manager)|[Create free managed certificate](/azure/app-service/configure-ssl-certificate#create-a-free-managed-certificate-preview)</br>[Import existing certificate from Key Vault](/azure/app-service/configure-ssl-certificate#import-a-certificate-from-key-vault)</br>[Upload private certificate](/azure/app-service/configure-ssl-certificate#upload-a-private-certificate)</br>[Upload public certificate](/azure/app-service/configure-ssl-certificate#upload-a-public-certificate)</br>[Configure SSL bindings](/azure/app-service/configure-ssl-bindings)|
|[Container Instances](/azure/container-instances)||[Using sidecar container](/azure/container-instances/container-instances-container-group-ssl)|

## 10-minute to a domain name and certificate

The following app services allow you purchase a domain name and create a free certificate all within the Azure portal: 

* Azure App service
* Azure Functions
 
1. [Create your Azure app service](https://ms.portal.azure.com/#create/Microsoft.WebSite) (web app). Do not select the free pricing tier. 
1. Once your web app resource is created, select the **Custom domains** setting. The same setting form is used for the services: App service, Functions.

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain.png" alt-text="Once your web app resource is created, select the **Custom Domain** setting. The same setting form is used for the services: App service, Functions.":::

1. Select the **+ Buy App Service domain**. 

    :::image type="content" source="../media/custom-domain/azure-portal-app-service-setting-custom-domain-buy-app-service-domain.png" alt-text="Select the **+ Buy App Service domain**.":::

1. In the side panel, 
---
title: Configure app service for custom domain
description: Configure app
ms.topic: how-to
ms.date: 06/25/2017
ms.custom: seo-javascript-september2019, seo-javascript-october2019, devx-track-js, devx-track-azurecli
---

## Configuring a custom domain name

Your app service has a convenient DNS name, great for testing, in the form of `YOUR-RESOURCE-NAME.azurewebsites.net`. At some point you may want to add a custom domain name to your web app. 

## Purchase a domain name and configure for your web app

1. Purchase a domain name from a registrar. 
1. Add an `A` record to your DNS record that points at your web app's external IP (which is actually a load balancer). You can retrieve this IP by running the following command:

```azurecli
az webapp config hostname get-external-ip --name
```

In addition to add an `A` record, you also need to add a `TXT` record to your domain that points at the `*.azurewebsites.net` domain you've been using thus far. The combination of the `A` and `TXT` records allows Azure to verify that you own the domain.

Once those records are created and the DNS changes have propagated, register the custom domain with Azure so that it knows to expect the incoming traffic correctly.

```azurecli
az webapp config hostname add --hostname <DOMAIN>
```

> [!NOTE]
> The command will not work until the DNS changes have propagated.

Open a browser and navigate to your custom domain to see that it now resolves to your deployed app on Azure.
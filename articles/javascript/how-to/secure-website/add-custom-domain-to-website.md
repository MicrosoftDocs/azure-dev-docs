---
title: 
description:   
ms.topic: how-to
ms.date: 
ms.custom: devx-track-js
---

# Add custom domain and certificate to JavaScript app on Azure

- Start with client
- Start with full-stack


* Service type decision tree
    * Don't need all the web server features
        * Start with Client
        * Deploy from GitHub
        * App environment variables
        * Custom domain/SSL
        * Application Insights (logs)
        * Fully or mostly public website with API integration -> SWA
        * Auth is on the route and roles, not the server
        * Web jobs would be Functions with timers
        * Public URL isn't friendly -> need a custom domain name
    * Need many web server features
        * Client, server, and background tasks
        * Authenticated full-stack with public, private, or mixed environment 

* Don't use F1 or D1 (what is D1?) pricing tier for app service if you want
    * custom domain
    * SSL cert
    * How cheap can I do this for? S1 or B1? 
    * When do webtasks or https triggers need custom domains? If Azure already provides SSL? Already get SSL with azurewebsites
* CUSTOM DOMAIN: Create an [App Service Domain](https://ms.portal.azure.com/#create/Microsoft.Domain) resource
    * Good for 1 year
    * ? Why doesn't the Overview page have links:
        * Create new web app for domain
        * Add domain to existing web app
    * Difference between SWA/Fn and Full-stack App/Containered App
        * Web service mgmt complexity
        * Authentication at service level
* WEB APP: Create new Web App resource 
* CERTIFICATE: 
    * Create an free managed certificate with [App Service Managed Certificate](https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#create-a-free-managed-certificate-preview)
    * Store in Key Vault
    * Map custom domain

---
author: KarlErickson
ms.author: karler
ms.date: 9/30/2024
---

### Create an Azure Container Apps environment and deploy apps

Provision an Azure Container Apps instance in your Azure subscription. Its secure hosting environment is created along with it. For more information, see [Quickstart: Deploy your first container app using the Azure portal](/azure/container-apps/quickstart-portal).

[!INCLUDE [ensure-console-logging-and-configure-diagnostic-settings-azure-container-apps](ensure-console-logging-and-configure-diagnostic-settings-azure-container-apps.md)]

[!INCLUDE [configure-persistent-storage-azure-container-apps](configure-persistent-storage-azure-container-apps.md)]

[!INCLUDE [migrate-all-certificates-to-keyvault-azure-container-apps](migrate-all-certificates-to-keyvault-azure-container-apps.md)]

### Configure application performance management (APM) integrations

Whether your app is deployed from a container image or from code, Azure Container Apps doesn't interfere with your image or code. Therefore, integrating your application with an APM tool depends on your own preferences and implementation.

If your application isn't using a supported APM, Azure Application Insights is one option. For more information, see [Using Azure Monitor Application Insights with Spring Boot](/azure/azure-monitor/app/java-spring-boot).

### Deploy the application

Deploy each of the migrated microservices (not including Spring Cloud Config Server and Spring Cloud Service Registry), as described in [Deploy Azure Container Apps with the az containerapp up command](/azure/container-apps/containerapp-up).

### Configure per-service secrets and externalized settings

You can inject configuration settings into each application as environment variables. You can set these variables as manually entries or as references to secrets. For more information about configuration, see [Manage environment variables on Azure Container Apps](/azure/container-apps/environment-variables).

### Migrate and enable the identity provider

If any of the Spring Cloud applications require authentication or authorization, ensure they're configured to access the identity provider:

* If the identity provider is Microsoft Entra ID, no changes should be necessary.
* If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Microsoft Entra ID. For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
* If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Microsoft Entra Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Microsoft Entra ID. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/reference/index.html) or [SAML](https://docs.spring.io/spring-security/reference/index.html).

### Expose the application

By default, an application deployed to Azure Container Apps is accessible via an application URL. If your app is deployed in the context of a managed environment with its own virtual network, you need to determine the app's accessibility level to allow public ingress or ingress from your virtual network only. For more information, see [Networking in Azure Container Apps environment](/azure/container-apps/networking).

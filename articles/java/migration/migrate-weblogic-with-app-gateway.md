---
title: Tutorial Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer
description: This tutorial walks you through deploying WebLogic Server to Azure with Azure Application Gateway as a load balancer
author: edburns
ms.author: edburns
ms.topic: tutorial
ms.date: 08/05/2020
---

# Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer

Load balancing is an essential part of migrating your Oracle WebLogic Server cluster to Azure.  The easiest solution is to use the built-in support for [Azure Application Gateway](/azure/application-gateway/overview).  App Gateway is included as part of the WebLogic Cluster support on Azure.  For an overview of WebLogic Cluster support on Azure, see [What is Oracle WebLogic Server on Azure?](/azure/virtual-machines/workloads/oracle/oracle-weblogic).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Key Vault
> * Create an SSL certificate
> * Store the SSL certificate in the Key Vault
> * Deploy WebLogic Server with Azure Application Gateway to Azure
> * Validate successful deployment of WLS and App Gateway

## Prerequisites

* [OpenSSL](https://www.openssl.org/) on a computer running a UNIX-like command-line environment.

   While there could be other tools available for certificate management, this tutorial uses OpenSSL. You can find OpenSSL bundled with many GNU/Linux distributions, such as Ubuntu.
* An active Azure subscription.
  * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/).
* The ability to deploy one of the WLS Azure Applications listed at [Oracle WebLogic Server Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic).

## Migration context

Here are some things to consider about migrating on-premise WLS installations and Azure Application Gateway.

* If you have an existing load-balancing solution, ensure that its capabilities are met or exceeded by Azure Application Gateway.  For a summary of the capabilities of Azure Application Gateway compared to other Azure load-balancing solutions, see [Overview of load-balancing options in Azure](/azure/architecture/guide/technology-choices/load-balancing-overview)
* If your existing load-balancing solution provides security protection from common exploits and vulnerabilities, the Application Gateway has you covered. Application Gateway's built-in Web Application Firewall (WAF) implements the [OWASP (Open Web Application Security Project) core rule sets](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project).  For more information on WAF support in Application Gateway, see [Application Gateway Features](/azure/application-gateway/features#web-application-firewall)
* If your existing load-balancing solution requires end-to-end SSL encryption, you'll need to do additional configuration after following the steps in this guide.  See [Overview of TLS termination and end to end TLS with Application Gateway](/azure/application-gateway/ssl-overview#end-to-end-tls-encryption) and the Oracle documentation on [Configuring SSL in Oracle Fusion Middleware](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.3/asadm/configuring-ssl1.html#GUID-623906C0-B1FD-423F-AE51-061B5800E927).
* If you`re optimizing for the cloud, this guide shows you how to start from scratch with Azure App Gateway and WLS.

## Create an Azure Key Vault

This section shows how to use the Azure portal to create an Azure Key Vault.

1. From the Azure portal menu, or from the **Home** page, select **Create a resource**.
1. In the Search box, enter **Key Vault**.
1. From the results list, choose **Key Vault**.
1. On the Key Vault section, choose **Create**.
1. On the **Create key vault** section provide the following information:
    * **Subscription**: Choose a subscription.
    * Under **Resource group**, choose **Create new** and enter a resource group name.  Take note of the key vault name.  *You'll need it later when deploying WLS.*
    * **Key Vault Name**: A unique name is required.  Take note of the key vault name.  *You'll need it later when deploying WLS.*
    > [!NOTE]
    > You may use the same name for both **Resource group** and **Key vault name**.
    * In the **Location** pull-down menu, choose a location.
    * Leave the other options to their defaults.
1. Select **Next: Access Policy**.
1. Under **Enable Access to**, select **Azure Resource Manager for template deployment**.
1. Select **Review + Create**.
1. Select **Create**.

Key vault creation is fairly lightweight, typically completing in less than two minutes.  When deployment completes, select **Go to resource** and continue to the next section.

## Create an SSL certificate

This section shows how to create a self-signed SSL certificate in a format suitable for use by Application Gateway.  The certificate must have a non-empty password.  If you already have a valid, non-empty password SSL certificate in *.pfx* format, you can skip this section and move on to the next.  If your existing, valid, non-empty password SSL certificate is not in the *.pfx* format, first convert it to a *.pfx* file before skipping to the next section.  Otherwise, open a command shell and enter the following commands.

1. Create an `RSA PRIVATE KEY`

   ```bash
   openssl genrsa 2048 > private.pem
   ```
1. Create a corresponding public key.

   ```bash
   openssl req -x509 -new -key private.pem -out public.pem
   ```

   You'll have to answer several questions when prompted by the OpenSSL tool.  These values will be included in the certificate.  This tutorial uses a self-signed certificate, therefore the values are irrelevant.  The following literal values are fine.
     1. For **Country Name**, enter a two letter code.
     1. For **State or Province Name**, enter WA.
     1. For **Organization Name**, enter Contoso.  For Organizational Unit Name enter billing.
     1. For **Common Name**, enter Contoso.
     1. For **Email Address**, enter billing@contoso.com.

1. Export the certificate as a *.pfx* file

   ```bash
   openssl pkcs12 -export -in public.pem -inkey private.pem -out mycert.pfx
   ```

   Enter the password twice.  Take note of the password.  *You'll need it later when deploying WLS.*

1. Base 64 encode the *mycert.pfx* file

   ```bash
   base64 mycert.pfx > mycert.txt
   ```

Now that you have created a Key Vault and have a valid SSL certificate with a non-empty password, you can store the certificate in the Key Vault.

## Store the SSL certificate in the Key Vault

This section shows how to store the certificate and its password in the Key Vault created in the preceding sections.

Store the certificate.

1. From the Azure portal, put the cursor in the search bar at the top of the page and type the name of the Key Vault you created earlier in the tutorial.
1. Your Key Vault should appear under the **Resources** heading.  Select it.
1. In the **Settings** section, select **Secrets**.
1. Select **Generate/Import**.
1. Under **Upload options**, leave the default value.
1. Under **Name**, enter `myCertSecretData`.
1. Under **Value**, enter the content of the *mycert.txt* file.  The length of the value, and the presence of newlines, aren't a problem for the text field.
1. Leave the remaining values at their defaults and select **Create**.

Store the password for the certificate.

1. You'll be returned to the **Secrets** page.  Select **Generate/Import**.
1. Under **Upload options**, leave the default value.
1. Under **Name**, enter `myCertSecretPassword`.
1. Under **Value**, enter the password for the certificate.
1. Leave the remaining values at their defaults and select **Create**.
1. you'll be returned to the **Secrets** page.

## Deploy WebLogic Server with Application Gateway to Azure

This section will show you how to use the Key Vault, SSL certificate, and password created in the preceding sections.  You'll provision a WLS cluster with Azure Application Gateway automatically created as the load balancer for the cluster nodes.  The Application Gateway will use the provided SSL certificate for SSL termination.  For advanced details on SSL termination with Application Gateway, see [Overview of TLS termination and end to end TLS with Application Gateway](/azure/application-gateway/ssl-overview).

1. Start following the steps to provision a WebLogic Server Cluster as described [in the Oracle documentation](https://aka.ms/arm-oraclelinux-wls-cluster-oracle-docs), but come back to this page when you reach the **Azure Application Gateway** blade.
1. At the **Azure Application Gateway** blade, select **Yes**.
1. Under **Resource group name in current subscription containing the KeyVault**, enter the name of the resource group containing the Key Vault you created earlier.
1. Under **Name of the Azure KeyVault containing secrets for the Certificate for SSL Termination**, enter the name of the Key Vault.
1. Under **The name of the secret in the specified KeyVault whose value is the SSL Certificate Data**, enter `myCertSecretData`.
1. Under **The name of the secret in the specified KeyVault whose value is the password for the SSL Certificate**, enter `myCertSecretData`.
1. Select **Review + Create**.
1. Select **Create**.  This will do a validation the certificate can be obtained from the Key Vault, and that its password matches the value you stored in for the password in the Key Vault.  If this validation step fails, review the properties of the Key Vault, ensure the certificate was entered correctly, and ensure the password was entered correctly.
1. Once you see **Validation passed**, select **Create**.

This will cause the WLS cluster and its front-end Application Gateway to be created.  This process may take about 15 minutes.  When the deployment completes, select **Go to resource group**. From the list of resources in the resource group, select **myAppGateway**.

## Validate successful deployment of WLS and App Gateway

This section shows a technique to quickly validate the successful deployment of the WLS cluster and Application Gateway.

If you had selected **Go to resource group** and then **myAppGateway** at the end of the preceding section, you'll be looking at overview page for the Application Gateway.  If not, you can find this page by typing `myAppGateway` in the text box at the top of the Azure portal, and then selecting the correct one that appears.  Be sure to select the one within the resource group you created for the WLS cluster.

1. In the left pane of the overview page for **myAppGateway**, scroll down to the **Monitoring** section and select **Backend health**.
1. After the **loading** message disappears, you should see a table in the middle of the screen showing the nodes of your cluster configured as nodes in the backend pool.
1. Verify that the status shows **Healthy** for each node.

## Clean up resources

If you're not going to continue to use the WLS cluster, delete the Key Vault and the WLS Cluster with the following steps:

1. Visit the overview page for **myAppGateway** as shown in the preceding section.
1. At the top of the page, under the text **Resource group**, select the resource group.
1. Select **Delete resource group**.
1. The input focus will be set to the field labeled **TYPE THE RESOURCE GROUP NAME**.  Type the resource group name as requested.
1. This will cause the **Delete** button to become enabled.  Select the **Delete** button.  This operation will take some time, but you can continue to the next step while the deletion is processing.
1. Locate the Key Vault by following the first step of the section [Store the SSL certificate in the Key Vault]().
1. Select **Delete**.
1. Select **Delete** in the pane that appears.

## Next steps

Continue to explore options to run WLS on Azure.
> [!div class="nextstepaction"]
> [What is Oracle WebLogic on Azure?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

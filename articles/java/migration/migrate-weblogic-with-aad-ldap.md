---
title: End-user Authorization and Authentication with Azure Active Directory for Migrating Java Apps on WebLogic Server to Azure
description: This guide describes how to configure Oracle WebLogic Server to connect with Azure Active Directory Domain Services via LDAP
author: edburns
ms.author: edburns
ms.topic: conceptual
ms.date: 07/09/2020
---

# End-user authorization and authentication for migrating Java apps on WebLogic Server to Azure

This guide will help you to enable enterprise grade end-user authentication and authorization for Java apps on WebLogic Server using Azure Active Directory.

Java EE developers expect the [standard platform security mechanisms](https://javaee.github.io/tutorial/security-intro.html#BNBWJ) to "just work", even when moving their workloads to Azure.  [Oracle WebLogic Server (WLS) Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic) let you populate the built-in security realm with users from Azure Active Directory Domain Services (Azure AD DS).  Use the standard `<security-role>` element, in your Java EE on Azure applications; the user information flows from Azure AD DS through Lightweight Directory Access Protocol (LDAP).

This guide is divided into two parts.  If you already have Azure AD DS with secure LDAP exposed, you may skip straight to the second part.

* [Azure Active Directory configuration](#azure-active-directory-configuration)
* [WLS configuration](#wls-configuration)

In this guide you learn how to:

> [!div class="checklist"]
> * Create and configure an Azure Active Directory Domain Services managed domain
> * Configure secure Lightweight Directory Access Protocol (LDAP) for an Azure AD DS managed domain
> * Enable WebLogic Server to access LDAP as its default security realm

This guide doesn't help you reconfigure an existing Azure AD deployment, but it should be possible to follow along with this guide and see which steps can be skipped.

## Prerequisites

* An active Azure subscription.
  * If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy one of the WLS Azure Applications listed at [Oracle WebLogic Server Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic).

## Migration context

Here are some things to consider about migrating on-premise WLS installations and Azure AD.

* If you already have an Azure AD tenant without Domain Services exposed via LDAP, this guide will show how to expose the LDAP capability and integrate it with WLS.
* If your scenario involves an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure AD.  For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/)
* If you already have on-premises Active Directory Domain Services (AD DS) deployment, explore migration paths by visiting [Compare self-managed Active Directory Domain Services, Azure Active Directory, and managed Azure Active Directory Domain Services](/azure/active-directory-domain-services/compare-identity-solutions).
* If you're optimizing for the cloud, this guide shows you how to start from scratch with Azure AD DS LDAP and WLS.
* For a comprehensive survey of migrating WebLogic Server to Azure Virtual Machines, see [Migrate WebLogic Server applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md).

## Azure Active Directory configuration

This section walks you through all the steps to stand up an Azure AD DS instance integrated with WLS.  Azure Active Directory doesn't support the Lightweight Directory Access Protocol (LDAP) protocol or Secure LDAP directly. Instead, support is enabled through the Azure AD Domain Services (Azure AD DS) instance within your Azure AD tenant.

>[!NOTE]
> This guide uses the "cloud-only" user account feature of Azure AD DS.  Other user account types are supported, but not described in this guide.

### Create and configure an Azure Active Directory Domain Services managed domain

This section walks you through a separate tutorial to stand up an Azure AD DS managed domain.

Complete the tutorial [Create and configure an Azure Active Directory Domain Services managed domain](/azure/active-directory-domain-services/tutorial-create-instance) up to but not including the section [Enable user accounts for Azure AD DS](/azure/active-directory-domain-services/tutorial-create-instance#enable-user-accounts-for-azure-ad-ds).  That section requires special treatment in the context of this tutorial, as described in the next section.  Be sure to complete the DNS actions completely and correctly.

Note down the value you specify when completing the step "Enter a DNS domain name for your managed domain."  You'll use it later in this article.

### Create users and reset passwords

This section includes steps to create users and change their password, which is required to cause the users to propagate successfully through LDAP.  If you have an existing Azure AD DS installation, this step may not be necessary.

1. Within the Azure portal, ensure the directory corresponding to the Azure AD tenant is the currently active directory.  To learn how to select the correct directory see [Associate or add an Azure subscription to your Azure Active Directory tenant](/azure/active-directory/fundamentals/active-directory-how-subscriptions-associated-directory).  If the incorrect directory is selected, you either won't be able to create users, or you'll create users in the wrong directory.
1. In the search box at the top of the Azure portal, enter "Users".
1. Select **New user**.
1. Ensure **Create user** is selected.
1. Fill in values for User name, name, First name, and Last name.  Leave the remaining fields at their default values.
1. Select **Create**.
1. Select the newly created user in the table.
1. Select **Reset password**.
1. In the panel that appears, select **Reset password**.
1. Note down the temporary password.
1. In an "incognito" browser window, visit [the Azure portal](https://portal.azure.com/) and log in with the user's credentials and password.
1. Change the password when prompted.  Note down the new password.  You'll use it later.
1. Log out and close the "incognito" window.

Repeat the steps from "Select **New user**" through "Log and out close" for each user you want to enable.

### Allow LDAP in Azure AD DS

This section walks you through a separate tutorial to extract values for use in configuring WLS.

First, open the tutorial [Configure secure LDAP for an Azure Active Directory Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps) in a separate browser window so you can look at the below variations as you run through the tutorial.  

When you reach the section, [Export a certificate for client computers](/azure/active-directory-domain-services/tutorial-configure-ldaps#export-a-certificate-for-client-computers), take note of where you save the certificate file ending in *.cer*.  We'll use the certificate as input to the WLS configuration.

When you reach the section, [Lock down secure LDAP access over the internet](/azure/active-directory-domain-services/tutorial-configure-ldaps#lock-down-secure-ldap-access-over-the-internet), specify **Any** as the source.  We'll tighten the security rule with a specific IP address later in this guide.

Before you execute the steps in [Test queries to the managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps#test-queries-to-the-managed-domain), do the following steps to enable the testing to succeed.

   1. In the portal, visit the overview page for the Azure AD Domain Services instance.
   1. In the Settings area, select **Properties**.
   1. In the right of the page, scroll down until you see **Admin group**.  Under this heading should be a link for **AAD DC Administrators**.  Select that link.
   1. In the **Manage section**, select **Members**.
   1. Select **Add members**.
   1. In the **Search** text field, enter some characters to locate one of the users you created in a preceding step.
   1. Select the user, then activate the **Select** button.
   1. This user is the one you must use when executing the steps in the **Test queries to the managed domain** section.
   >[!NOTE]
   >
   > Here are some tips about querying the LDAP data, which you'll need to do to collect some values necessary for WLS configuration.
   >
   > * The tutorial advises use of the Windows program *LDP.exe*.  It's also possible to use [Apache Directory Studio](https://directory.apache.org/studio/downloads.html) for the same purpose.
   > * When logging in to LDAP with *LDP.exe*, the username is just the part before the @.  For example, if the user is `alice@contoso.onmicrosoft.com`, the username for the *LDP.exe* bind action is `alice`.  Also, leave *LDP.exe* running and logged in for use in subsequent steps.
   >
In the section [Configure DNS zone for external access](/azure/active-directory-domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access), note down the value for **Secure LDAP external IP address**.  You'll use it later.

Do not execute the steps in [Clean-up resources](/azure/active-directory-domain-services/tutorial-configure-ldaps#clean-up-resources) until instructed to do so in this guide.

With the above variations in mind, complete [Configure secure LDAP for an Azure Active Directory Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps).  We can now collect the values necessary to provide to the WLS Configuration.

## WLS Configuration

This section helps you collect the parameter values from the Azure AD DS deployed earlier.

When you deploy any of the Azure Applications listed in [Oracle WebLogic Server Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic), you can choose to have the deployment automatically connect to a pre-existing LDAP server.  Alternatively, you can configure the LDAP connection later by invoking the Active Directory integration subtemplate.  This approach is described in Appendix A of [the official documentation](https://wls-eng.github.io/arm-oraclelinux-wls/).  Either way, you must have the necessary parameter values to pass to the ARM template.

| Parameter name | Description   | Details | 
|----------------|---------------|---------|
| `aadsServerHost` | Server Host | This value is the public DNS name you saved when completing [Create and configure an Azure Active Directory Domain Services managed domain](/azure/active-directory-domain-services/tutorial-create-instance). |
| `aadsPublicIP` | Secure LDAP external IP address | This value is the **Secure LDAP external IP address** you saved in the [Configure DNS zone for external access](/azure/active-directory-domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access) section.|
| `wlsLDAPPrincipal` | Principal   | Return to *LDP.exe*.  Do the following steps to obtain additional value for `wlsLDAPPrincipal`. <ol><li>In the **View** menu, select **Tree**.</li><li>In the **Tree View** dialog, leave **BaseDN** blank and select **OK**.</li><li>Right-click in the right side pane and select **Clear output**.</li><li>Expand the tree view on the left and select the entry that starts with "OU=AADDC Users".</li><li>In the **Browse** menu, select **Search**.</li><li>In the dialog that appears, accept the defaults and select **Run**.</li><li>After output appears in the right side pane, select **Close**, next to **Run**.</li><li>Scan the output for the **Dn** entry corresponding to the user you added to the "AAD DC Administrators" group.  It will start with **Dn: CN=&lt;user name&gt;OU=AADDC Users"**.</li></ol> |
| `wlsLDAPGroupBaseDN` and `wlsLDAPUserBaseDN` | User Base DN and Group Base DN | For the purposes of this tutorial, the values for both of these properties are the same: the part of the **wlsLDAPPrincipal** after the first comma.|
| `wlsLDAPPrincipalPassword` | Password for Principal | This value is the password for the user that has been added to the **AAD DC Administrators** group. |
| `wlsLDAPProviderName` | Provider Name | This value can be left at its default.  It's used as the name of the authentication provider in WLS. |
| `wlsLDAPSSLCertificate` | Trust Keystore for SSL Configuration | This value is the base 64 encoded *.cer* file you were asked to save aside when you completed the step, [Export a certificate for client computers](/azure/active-directory-domain-services/tutorial-configure-ldaps#export-a-certificate-for-client-computers).  This value can be obtained with the following UNIX or PowerShell commands. <br /> bash: <br /> `base64 your-certificate.cer -w 0 >temp.txt` <br /> PowerShell: <br /> `$Content = Get-Content -Path .\your-certificate.cer -Encoding Byte`<br /> `$Base64 = [System.Convert]::ToBase64String($Content)` <br /> `$Base64 | Out-File .\temp.txt`

### Integrating Azure AD DS LDAP with WLS

With the above configuration values in hand, and the Azure AD DS LDAP deployed, it's now possible to launch the configuration.  There are two approaches to complete this process.

#### During WLS deployment

Visit [Oracle WebLogic Server Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic) and select the admin or either of the cluster offers.  While deploying the offer, one of the tabs in the deployment process will be **Azure Active Directory**.  Toggle the **Connect to Azure Active Directory** to **Yes**.  Fill out the values based using the information collected in the preceding section.  For the certificate, you must upload the `.cer` file directly.

#### After WLS deployment

If you didn't toggle the **Connect to Azure Active Directory** to **Yes** at deployment time, you can use the values you collected in the preceding section to do the configuration later.  More details are in [the official documentation](https://wls-eng.github.io/arm-oraclelinux-wls/).

### Validate the deployment

After deploying WLS and configuring LDAP using one of the above two methods, follow these steps to verify the integration was successful.

1. Visit the WLS Admin console.
1. In the left navigator, expand the tree to select **Security Realms** -> **myrealm** -> **Providers**.
1. If the integration was successful, you'll find the AAD provider for example `AzureActiveDirectoryProvider`.
1. In the left navigator, expand the tree to select **Security Realms** -> **myrealm** -> **Users and Groups**.
1. If the integration was successful, you'll find users from the AAD provider.

### Lock down and secure LDAP access over the internet

While standing up the secure LDAP in the preceding steps, we had set the source as **Any** for the `AllowLDAPS` rule in the network security group.  Now that the WLS Admin Server has been deployed and connected to LDAP, obtain its public IP address using the Azure portal.  Revisit [Lock down secure LDAP access over the internet](/azure/active-directory-domain-services/tutorial-configure-ldaps?branch=pr-en-us-778#lock-down-secure-ldap-access-over-the-internet) and change **Any** to the specific IP address of the WLS Admin server.

## Clean up resources

Now it's time to follow the steps on the [Clean up resources](/azure/active-directory-domain-services/tutorial-configure-ldaps#clean-up-resources) section in [Configure secure LDAP for an Azure Active Directory Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps#clean-up-resources).

## Next steps

Explore other aspects of migrating WebLogic Server apps to Azure.

> [!div class="nextstepaction"]
> [Migrate WebLogic Server applications to Azure Virtual Machines](/azure/developer/java/migration/migrate-weblogic-to-virtual-machines)

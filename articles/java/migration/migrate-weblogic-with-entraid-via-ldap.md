---
title: End-user Authorization and Authentication with Azure Entra ID for Migrating Java Apps on WebLogic Server to Azure
description: This guide describes how to configure Oracle WebLogic Server to connect with Azure Entra ID Domain Services via LDAP
author: KarlErickson
ms.author: edburns
ms.topic: tutorial
ms.date: 06/27/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java
---

# End-user authorization and authentication for migrating Java apps on WebLogic Server to Azure

This guide will help you to enable enterprise grade end-user authentication and authorization for Java apps on WebLogic Server using Azure Entra ID.

Java EE developers expect the [standard platform security mechanisms](https://javaee.github.io/tutorial/security-intro.html#BNBWJ) to "just work", even when moving their workloads to Azure.  [Oracle WebLogic Server (WLS) Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic) let you populate the built-in security realm with users from Azure Entra Domain Services.  Use the standard `<security-role>` element, in your Java EE on Azure applications; the user information flows from Azure Entra Domain Services through Lightweight Directory Access Protocol (LDAP).

This guide is divided into two parts.  If you already have Azure Entra Domain Services with secure LDAP exposed, you may skip straight to the second part.

* [Azure Entra Domain Services managed domain configuration](#azure-entra-domain-services-managed-domain-configuration)
* [WLS configuration](#wls-configuration)

In this guide you learn how to:

> [!div class="checklist"]
> * Create and configure an Azure Entra Domain Services managed domain
> * Configure secure Lightweight Directory Access Protocol (LDAP) for an Azure Entra Domain Services managed domain
> * Enable WebLogic Server to access LDAP as its default security realm

This guide doesn't help you reconfigure an existing Azure Entra ID Domain Services deployment, but it should be possible to follow along with this guide and see which steps can be skipped.

## Prerequisites

* An active Azure subscription.
  * If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy Azure Entra Domain Services, see [Create and configure a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-create-instance).
* The ability to deploy one of the WLS Azure Applications listed at [Oracle WebLogic Server Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic).
* Prepare a local machine with either Windows with WSL, GNU/Linux, or macOS installed.
* Install Azure CLI version 2.54.0 or higher to run Azure CLI commands.

## Migration context

Here are some things to consider about migrating on-premise WLS installations and Azure Entra ID.

* If you already have an Azure Entra ID tenant without Domain Services exposed via LDAP, this guide will show how to expose the LDAP capability and integrate it with WLS.
* If your scenario involves an on-premises Active Directory forest, consider implementing a hybrid identity solution with Azure AD.  For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/)
* If you already have on-premises Active Directory Domain Services (AD DS) deployment, explore migration paths by visiting [Compare self-managed Active Directory Domain Services, Microsoft Entra ID, and managed Microsoft Entra Domain Services](/azure/active-directory-domain-services/compare-identity-solutions).
* If you're optimizing for the cloud, this guide shows you how to start from scratch with Azure Entra ID Domain Services LDAP and WLS.
* For a comprehensive survey of migrating WebLogic Server to Azure Virtual Machines, see [Migrate WebLogic Server applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md).
* For more information of Active Directory and Microsoft Entra ID, see [Compare Active Directory to Microsoft Entra ID](/entra/fundamentals/compare).

## Azure Entra Domain Services managed domain configuration

This section walks you through all the steps to stand up an Azure Entra Domain Services managed domain integrated with WLS.  Azure Entra ID doesn't support the Lightweight Directory Access Protocol (LDAP) protocol or Secure LDAP directly. Instead, support is enabled through the Azure Entra Domain Services managed domain instance within your Azure Entra ID tenant.

>[!NOTE]
> This guide uses the "cloud-only" user account feature of Azure Entra Domain Services. Other user account types are supported, but not described in this guide.

### Create and configure an Azure Entra Domain Services managed domain

This section walks you through a separate tutorial to stand up an Azure Entra Domain Services managed domain.

Complete the tutorial [Create and configure a Microsoft Entra Domain Services managed domain](/azure/active-directory-domain-services/tutorial-create-instance) up to but not including the section [Enable user accounts for Domain Services](/azure/active-directory-domain-services/tutorial-create-instance#enable-user-accounts-for-azure-ad-ds).  That section requires special treatment in the context of this tutorial, as described in the next section.  Be sure to complete the DNS actions completely and correctly.

Note down the value you specify when completing the step "Enter a DNS domain name for your managed domain."  You'll use it later in this article.

### Create users and reset passwords

This section includes steps to create users and change their password, which is required to cause the users to propagate successfully through LDAP.  If you have an existing Azure Entra Domain Services managed domain, this step may not be necessary.

1. Within the Azure portal, ensure the subscription corresponding to the Azure Entra ID tenant is the currently active directory.  To learn how to select the correct directory see [Associate or add an Azure subscription to your Microsoft Entra tenant](/azure/active-directory/fundamentals/active-directory-how-subscriptions-associated-directory).  If the incorrect directory is selected, you either won't be able to create users, or you'll create users in the wrong directory.
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

### Configure secure LDAP for a Microsoft Entra Domain Services managed domain

This section walks you through a separate tutorial to extract values for use in configuring WLS.

First, open the tutorial [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps) in a separate browser window so you can look at the below variations as you run through the tutorial.  

When you reach the section, [Export a certificate for client computers](/azure/active-directory-domain-services/tutorial-configure-ldaps#export-a-certificate-for-client-computers), take note of where you save the certificate file ending in *.cer*.  We'll use the certificate as input to the WLS configuration.

When you reach the section, [Lock down secure LDAP access over the internet](/azure/active-directory-domain-services/tutorial-configure-ldaps#lock-down-secure-ldap-access-over-the-internet), specify **Any** as the source.  We'll tighten the security rule with a specific IP address later in this guide.

Before you execute the steps in [Test queries to the managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps#test-queries-to-the-managed-domain), do the following steps to enable the testing to succeed.

   1. In the portal, visit the overview page for the Azure Entra Domain Services instance.
   1. In the Settings area, select **Properties**.
   1. In the right of the page, scroll down until you see **Admin group**.  Under this heading should be a link for **AAD DC Administrators**.  Select that link.
   1. In the **Manage** section, select **Members**.
   1. Select **Add members**.
   1. In the **Search** text field, enter some characters to locate one of the users you created in a preceding step.
   1. Select the user, then activate the **Select** button.
   1. This user is the one you must use when executing the steps in the **Test queries to the managed domain** section.
   >[!NOTE]
   >
   > Here are some tips about querying the LDAP data, which you'll need to do to collect some values necessary for WLS configuration.
   >
   > * The tutorial advises use of the Windows program *LDP.exe*.  This program is only available on Windows.  For non-Windows users, it's also possible to use [Apache Directory Studio](https://directory.apache.org/studio/downloads.html) for the same purpose.
   > * When logging in to LDAP with *LDP.exe*, the username is just the part before the @.  For example, if the user is `alice@contoso.onmicrosoft.com`, the username for the *LDP.exe* bind action is `alice`.  Also, leave *LDP.exe* running and logged in for use in subsequent steps.
   >

In the section [Configure DNS zone for external access](/azure/active-directory-domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access), note down the value for **Secure LDAP external IP address**.  You'll use it later.

If the value of the **Secure LDAP external IP address** is not readily apparent, follow these steps to get the IP address.

1. In the portal, find the resource group that contains the Azure Entra Domain Services resource.
1. In the list of resources, select the public IP resource for the Azure Entra Domain Services resource, as shown next.  The public IP will likely start with `aads`.
   :::image type="content" source="media/migrate-weblogic-to-entraid-via-ldap/alternate-secure-ip-address-technique.png" alt-text="Browser showing how to select the public IP.":::
1. The public IP is shown next to the label, **IP address**.

Do not execute the steps in [Clean-up resources](/azure/active-directory-domain-services/tutorial-configure-ldaps#clean-up-resources) until instructed to do so in this guide.

With the above variations in mind, complete [Configure secure LDAP for an Azure Entra Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps).  We can now collect the values necessary to provide to the WLS Configuration.

>[!NOTE]
> Please wait for the secure LDAP configuration to complete processing before moving on to the next section.

### Disable weak TLS v1

By default, Azure Entra Domain Services enables the use of TLS v1, which is considered weak and not supported in WebLogic Server 14 and later. 

This section walks you through how to disable TLS v1 cipher.

First, get the resource ID of the Azure Entra Domain Service managed domain that enables LDAP. The following example gets the ID of an Azure Domain Service instance named `aaddscontoso.com` in a resource group named `aadds-rg`.

```azurecli
AADDS_ID=$(az resource show --resource-group aadds-rg --resource-type "Microsoft.AAD/DomainServices" --name aaddscontoso.com --query "id" --output tsv)
```

Run the following command to disable TLS v1:

```azurecli
az resource update --ids $AADDS_ID --set properties.domainSecuritySettings.tlsV1=Disabled
```

The output will display `"tlsV1": "Disabled"` for `domainSecuritySettings`, as shown in the following example:

```text
"domainSecuritySettings": {
      "ntlmV1": "Enabled",
      "syncKerberosPasswords": "Enabled",
      "syncNtlmPasswords": "Enabled",
      "syncOnPremPasswords": "Enabled",
      "tlsV1": "Disabled"
}
```

For more information, see [Harden a Microsoft Entra Domain Services managed domain](/azure/active-directory-domain-services/secure-your-domain).

>[!NOTE]
> Please note that if you add a lock to the resource or resource group, you will encounter an error message when attempting to update the managed domain, such as: "Message: The scope '/subscriptions/xxxxx/resourceGroups/aadds-rg/providers/Microsoft.AAD/domainServices/aaddscontoso.com' cannot perform write operation because the following scope(s) are locked: '/subscriptions/xxxxx/resourceGroups/aadds-rg'. Please remove the lock and try again." 

Write down the information of the Azure Entra Domain Service managed domain that will be used in later section.

| Description   | Details | 
|---------------|---------|
| Server Host | This value is the public DNS name you saved when completing [Create and configure an Azure Entra ID Domain Services managed domain](/azure/active-directory-domain-services/tutorial-create-instance). |
| Secure LDAP external IP address | This value is the **Secure LDAP external IP address** you saved in the [Configure DNS zone for external access](/azure/active-directory-domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access) section.|
| Principal   | Return to *LDP.exe*.  Do the following steps to obtain additional value for `wlsLDAPPrincipal`. <ol><li>In the **View** menu, select **Tree**.</li><li>In the **Tree View** dialog, leave **BaseDN** blank and select **OK**.</li><li>Right-click in the right side pane and select **Clear output**.</li><li>Expand the tree view on the left and select the entry that starts with "OU=AADDC Users".</li><li>In the **Browse** menu, select **Search**.</li><li>In the dialog that appears, accept the defaults and select **Run**.</li><li>After output appears in the right side pane, select **Close**, next to **Run**.</li><li>Scan the output for the **Dn** entry corresponding to the user you added to the "AAD DC Administrators" group.  It will start with **Dn: CN=&lt;user name&gt;OU=AADDC Users**.</li></ol> |
| User Base DN and Group Base DN | For the purposes of this tutorial, the values for both of these properties are the same: the part of the **wlsLDAPPrincipal** after the first comma.|
| Password for Principal | This value is the password for the user that has been added to the **AAD DC Administrators** group. |
| Public key for Azure Entra Domain Service LDAPS connection | This value *.cer* file you were asked to save aside when you completed the step, [Export a certificate for client computers](/azure/active-directory-domain-services/tutorial-configure-ldaps#export-a-certificate-for-client-computers).

## WLS Configuration

This section helps you collect the parameter values from the Azure Entra Domain Service managed domain deployed earlier.

When you deploy any of the Azure Applications listed in [Oracle WebLogic Server Azure Applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic), you can follow the steps to integrate Azure Entra Domain Service managed domain with WLS.

After the Azure Application deployment finishes, you can find the URL to access WebLogic Administration Console with steps:

1. Open the Azure portal and go to the resource group that you provisioned.
1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the previous section. Select the oldest deployment, whose name starts with something similar to `oracle.`.
1. Select **Outputs**. This option shows the list of outputs from the deployment.
1. The **adminConsole** value is the fully qualified, public Internet visible link to the WLS admin console. Select the copy icon next to the field value to copy the link to your clipboard and save it in a file.

>[!NOTE]
> This tutorial demonstrates how to use TLS v1.2 to connect to the Azure Entra Domain Service managed domain LDAP server. To ensure compatibility, you need to enable TLS v1.2 for deployments on JDK 8. 
> You can verify your JDK version with steps:
> - Paste the value of **adminConsole** to your browser and log into the WLS admin console. 
> - Under **Domain Structure**, select **Environment** -> **Servers** -> **admin** -> **Monitoring** -> **General**. You will find Java version next to label **Java Version**.
> :::image type="content" source="media/migrate-weblogic-to-entraid-via-ldap/wlsconsole-java-version.png" alt-text="Browser showing how to find the Java Version.":::
> 
> If your Java version is 8, enable TLS v1.2 with steps:
> - Under **Domain Structure**, select **Environment** -> **Servers** -> **admin** -> **Configuration** -> **Server Start**.
> - In **Arguments** section, fill in option `-Djdk.tls.client.protocols=TLSv1.2`
> - Select **Save** to save the change.
> - Under **Change Center**, select **Activate Changes** to enable the option.
> :::image type="content" source="media/migrate-weblogic-to-entraid-via-ldap/wlsconsole-enable-tls-v12.png" alt-text="Browser showing how to set TLS v1.2.":::

### Integrating Azure Entra Domain Service managed domain with WLS

With the WebLogic admin server running, and the Azure Entra Domain Service managed domain deployed and secured with LDAPs, it's now possible to launch the configuration. 

#### Upload and import the public CA

WLS communicates with the managed domain using Secure LDAP (LDAPS), which is LDAP over Secure Sockets Layer (SSL) or Transport Layer Security (TLS). To establish this connection, you must upload and import the public Certificate Authority (CA) certificate (.cer file) into the WLS trust keystore. 

Upload and import the certificate to the VM that runs admin server with steps:

* Enable access to **adminVM** following [Connect to the virtual machine](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#connect-to-the-virtual-machine).
* Open a Bash terminal, run the following command to upload the certificate. Replace value of the **ADMIN_PUBLIC_IP** with the real value (you can find it from Azure portal) . You are required to input the password that used to connect the machine.

   ```bash
   export CER_FILE_NAME=azure-ad-ds-client.cer
   export ADMIN_PUBLIC_IP="<admin-public-ip>"
   export ADMIN_VM_USER="weblogic"
   ```

   ```bash
   #cd <path-to-cert>
   scp ${CER_FILE_NAME} "$ADMIN_VM_USER@$ADMIN_PUBLIC_IP":/home/${ADMIN_VM_USER}/${CER_FILE_NAME}
   ```
* Once the certificate is uploaded, you need to move it to the WLS domain folder `/u01/domains` and change its ownership with `oracle:oracle`.

   ```bash
   export RESOURCE_GROUP_NAME=contoso-rg
   export ADMIN_VM_NAME=adminVM
   export CA_PATH=/u01/domains/${CER_FILE_NAME}
   ```

   ```azurecli
   az vm run-command invoke \
      --resource-group $RESOURCE_GROUP_NAME \
      --name ${ADMIN_VM_NAME} \
      --command-id RunShellScript \
      --scripts "mv /home/${ADMIN_VM_USER}/${CER_FILE_NAME} /u01/domains; chown oracle:oracle ${CA_PATH}"
   ```
* Import the certificate to your keysore. The Azure application provisions WLS with default trust store in `<jvm-path-to-security>/cacerts`. The specific path may vary depending on the JDK version. You can import the Entra Domain Service managed domain public CA using the following commands. 

   Query the script that used to set domain environment variables.

   ```azurecli
   export DOMIAN_FILE_PATH=$(az vm run-command invoke \
      --resource-group $RESOURCE_GROUP_NAME \
      --name ${ADMIN_VM_NAME} \
      --command-id RunShellScript \
      --scripts "find /u01/domains -name setDomainEnv.sh" \
      --query value[*].message -otsv \
      | sed -n '/\[stdout\]/!b; n; p')

   echo $DOMIAN_FILE_PATH
   ```

   Import the CA. Pay attention to your Java version, which you have checked in previous section. 

   ##### [Java 11 and above](#tab/java11)

   ```azurecli
   az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts ". ${DOMIAN_FILE_PATH};export JVM_CER_PATH=\${JAVA_HOME}/lib/security/cacerts;\${JAVA_HOME}/bin/keytool -noprompt -import -alias aadtrust -file ${CA_PATH} -keystore \${JVM_CER_PATH} -storepass changeit"
   ```

   ##### [Java 8](#tab/oldjava)

   ```azurecli
   az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts ". ${DOMIAN_FILE_PATH};export JVM_CER_PATH=\${JAVA_HOME}/jre/lib/security/cacerts;\${JAVA_HOME}/bin/keytool -noprompt -import -alias aadtrust -file ${CA_PATH} -keystore \${JVM_CER_PATH} -storepass changeit"
   ```

   ---

   You will find output similar to content:

   ```txt
   {
   "value": [
     {
       "code": "ProvisioningState/succeeded",
       "displayStatus": "Provisioning succeeded",
       "level": "Info",
       "message": "Enable succeeded: \n[stdout]\n\n[stderr]\nCertificate was added to keystore\n",
       "time": null
     }
    ]
   }
   ```

>[!NOTE]
> If you customize the trust store, you must import the Entra Domain Service managed domain public CA into your trust keystore. There is no need to import the certificate to the WLS managed servers. For more details, see [Configuring WebLogic to use LDAP](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/secmg/ldap_atn.html#GUID-A064C103-85EB-4A7B-ADAE-F01ACDC8E0B8).

#### Config WLS Hostname Verification

Since [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps) uses a wildcard `*.aaddscontoso.com` for the hostname in the certificate, you must configure the WLS admin server with appropriate hostname verification. This tutorial disables the verification. For WLS 14 and above, you can select **Wildcard Hostname Verification**.

- Paste the value of **adminConsole** to your browser and log into the WLS admin console.
- In the **Change Center**, select **Lock & Edit**.
- Select **Environment** -> **Servers** -> **admin** -> **SSL** -> **Advanced**.
- Next to **Hostname Verification**, select **None**.
- Select **Save** and **Activate Changes** to save the configuration.

#### Resolve traffic for secure LDAP access

With secure LDAP access enabled over the internet, you can update the your DNS zone so that client computers can find this managed domain. The **Secure LDAP external IP address** is listed on the **Properties** tab for your managed domain, see [Configure DNS zone for external access](/entra/identity/domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access).

If you don't have a registerd DNS zone, you can add an entry in the **adminVM** hosts file,to resolves traffic for `ldaps.<managed-domain-dns-name>` (here is `ldaps.aaddscontoso.com`) to the external IP address. Change the value with yours before running the command.

```bash
export LDAPS_DNS=ldaps.aaddscontoso.com
export LDAPS_EXTERNAL_IP=<entra-domain-services-manged-domain-external-ip>
```

```azurecli
az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts "echo \"${LDAPS_EXTERNAL_IP} ${LDAPS_DNS}\" >> /etc/hosts"
```

Run the following command to restart the admin server to load the configurations:

```azurecli
az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts "systemctl stop wls_admin"
```

```azurecli
az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts "systemctl start wls_admin"
```

#### Create and configure LDAP authentication provider

With certifcate imported and secure LDAP access traffic resolved, you are able to configure LDAP provider from WLS console.

* Paste the value of **adminConsole** to your browser and login the WLS admin console. 
* Under **Change Center**, select **Lock & Edit**.
* Under **Domain Structure**, select **Security Realms** -> **myrealm** -> **Providers** -> **New**, to create a new authentication provider.
  - For **Name**, fill in `AzureEntraIDLDAPProvider`
  - For **Type**, select `ActiveDirectoryAuthenticator`
  - Select **OK** to save the change.
* In the provider list, select **AzureEntraIDLDAPProvider**.
  - For **Configuration** -> **Common**:
    - For **Control Flag**, select **SUFFICIENT**.
    - Select **Save** to save the change.
  - For **Configuration** -> **Provider Specific**, input the Entra Domain Services managed domain connection information you obtained previously. Steps to obtain the value are listed in the table of [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](#create-and-configure-an-azure-entra-domain-services-managed-domain).
    - Under **Connection** section:

      | Item | Value | Sample Value |
      |-------|--------------|-------------|
      | **Host** | managed domain LDAP sever DNS, `ldaps.<managed-domain-dns-name>` | `ldaps.aaddscontoso.com` |
      | **Port** | `636` | `636` |
      | **Principal** | Principal of your cloud only user | `CN=WLSTest,OU=AADDC Users,DC=aaddscontoso,DC=com` |
      | **Credential** | Credential of your cloud only user | - |
      | **SSLEnabled** | Checked. | - |

    - Under **Users** section:

      | Item | Value | Sample Value |
      |-------|------------|-------------|
      | **User Base DN** | Your user base DN | `OU=AADDC Users,DC=aaddscontoso,DC=com` |
      | **User From Name Filter** | `(&(sAMAccountName=%u)(objectclass=user))` | - |
      | **User Name Attribute** | `sAMAccountName` | - |
      | **User Object Class** | `user` | - |

    - Under **Groups** section:
      - For **Group Base DN**, fill in group base DN with your DN, this tutorial uses the sample value with user base DN `OU=AADDC Users,DC=aaddscontoso,DC=com`
      - Keep other fields with default vaule.
    - Selec **Save** to save the configuration.
* Seelct **Performance** next to **Configuration**:
    - Check **Enable Group Membership Lookup Hierarchy Caching**.
    - Check **Enable SID To Group Lookup Caching**.
  - Select **Save** to save the configuration.
* Select **Activate Changes** to invoke the changes.

>[!NOTE]
> Pay attention to the hostname of the LDAP server; it should be in the format `ldaps.<managed-domain-dns-name>`. In this example, the value is `ldaps.aaddscontoso.com`.

The WLS admin server must be restarted for the changes to take effect.

Run the following command to restart the admin server:

```azurecli
az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts "systemctl stop wls_admin"
```

```azurecli
az vm run-command invoke \
         --resource-group $RESOURCE_GROUP_NAME \
         --name ${ADMIN_VM_NAME} \
         --command-id RunShellScript \
         --scripts "systemctl start wls_admin"
```

### Validation

After restarting admin server, follow these steps to verify the integration was successful.

1. Visit the WLS Admin console.
1. In the left navigator, expand the tree to select **Security Realms** -> **myrealm** -> **Providers**.
1. If the integration was successful, you'll find the Azure AD provider for example `AzureEntraIDLDAPProvider`.
1. In the left navigator, expand the tree to select **Security Realms** -> **myrealm** -> **Users and Groups**.
1. If the integration was successful, you'll find users from the Azure AD provider.

>[!NOTE]
> It takes minutes to load users the fist time you access **Users and Groups**. WLS will cache the users and will be faster the next access.

### Lock down and secure LDAP access over the internet

While standing up the secure LDAP in the preceding steps, we had set the source as **Any** for the `AllowLDAPS` rule in the network security group.  Now that the WLS Admin Server has been deployed and connected to LDAP, obtain its public IP address using the Azure portal.  Revisit [Lock down secure LDAP access over the internet](/azure/active-directory-domain-services/tutorial-configure-ldaps#lock-down-secure-ldap-access-over-the-internet) and change **Any** to the specific IP address of the WLS Admin server.

## Clean up resources

Now it's time to follow the steps on the [Clean up resources](/azure/active-directory-domain-services/tutorial-configure-ldaps#clean-up-resources) section in [Configure secure LDAP for an Azure Entra Domain Services managed domain](/azure/active-directory-domain-services/tutorial-configure-ldaps#clean-up-resources).

## Next steps

Explore other aspects of migrating WebLogic Server apps to Azure.

> [!div class="nextstepaction"]
> [Migrate WebLogic Server applications to Azure Virtual Machines](./migrate-weblogic-to-virtual-machines.md)
> 

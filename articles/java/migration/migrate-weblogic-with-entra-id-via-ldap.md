---
title: Enable end-user Authorization and Authentication with Microsoft Entra ID when Migrating Java Apps on WebLogic Server to Azure
description: This guide describes how to configure Oracle WebLogic Server to connect with Microsoft Entra ID Domain Services via LDAP.
author: KarlErickson
ms.author: edburns
ms.topic: tutorial
ms.date: 10/21/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java
---

# Enable end-user authorization and authentication when migrating Java apps on WebLogic Server to Azure

This guide helps you to enable enterprise grade end-user authentication and authorization for Java apps on WebLogic Server using Microsoft Entra ID.

Java EE developers expect the [standard platform security mechanisms](https://javaee.github.io/tutorial/security-intro.html) to work as expected, even when moving their workloads to Azure. [Oracle WebLogic Server (WLS) Azure applications](/azure/virtual-machines/workloads/oracle/oracle-weblogic) let you populate the built-in security realm with users from Microsoft Entra Domain Services. When you use the standard `<security-role>` element in your Java EE on Azure applications, the user information flows from Microsoft Entra Domain Services through Lightweight Directory Access Protocol (LDAP).

This guide is divided into two parts. If you already have Microsoft Entra Domain Services with secure LDAP exposed, you can skip to the [Configure WLS](#configure-wls) section.

In this guide you, learn how to:

> [!div class="checklist"]
> * Create and configure a Microsoft Entra Domain Services managed domain.
> * Configure secure Lightweight Directory Access Protocol (LDAP) for a Microsoft Entra Domain Services managed domain.
> * Enable WebLogic Server to access LDAP as its default security realm.

This guide doesn't help you reconfigure an existing Microsoft Entra ID Domain Services deployment. However, it should be possible to follow along with this guide and see which steps you can skip.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy Microsoft Entra Domain Services. For more information, see [Create and configure a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-create-instance).
* The ability to deploy one of the WLS Azure applications listed in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
* A local machine with either Windows with Windows Subsystem for Linux (WSL), GNU/Linux, or macOS installed.
* [Azure CLI](/cli/azure/install-azure-cli) version 2.54.0 or higher.

## Consider the migration context

The following list describes some things to consider about migrating on-premises WLS installations and Microsoft Entra ID:

* If you already have a Microsoft Entra ID tenant without Domain Services exposed via LDAP, this guide shows how to expose the LDAP capability and integrate it with WLS.
* If your scenario involves an on-premises Active Directory forest, consider implementing a hybrid identity solution with Microsoft Entra ID. For more information, see the [Hybrid identity documentation](/entra/identity/hybrid/).
* If you already have an on-premises Active Directory Domain Services (AD DS) deployment, explore the migration paths in [Compare self-managed Active Directory Domain Services, Microsoft Entra ID, and managed Microsoft Entra Domain Services](/entra/identity/domain-services/compare-identity-solutions).
* If you're optimizing for the cloud, this guide shows you how to start from scratch with Microsoft Entra ID Domain Services LDAP and WLS.
* For a comprehensive survey of migrating WebLogic Server to Azure Virtual Machines, see [Migrate WebLogic Server applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md).
* For more information about Active Directory and Microsoft Entra ID, see [Compare Active Directory to Microsoft Entra ID](/entra/fundamentals/compare).

## Configure Microsoft Entra Domain Services managed domain

This section walks you through all the steps to stand up a Microsoft Entra Domain Services managed domain integrated with WLS. Microsoft Entra ID doesn't support the Lightweight Directory Access Protocol (LDAP) protocol or Secure LDAP directly. Instead, support is enabled through the Microsoft Entra Domain Services managed domain instance within your Microsoft Entra ID tenant.

> [!NOTE]
> This guide uses the "cloud-only" user account feature of Microsoft Entra Domain Services. Other user account types are supported, but aren't described in this guide.

### Create and configure a Microsoft Entra Domain Services managed domain

This article uses a separate tutorial to stand up a Microsoft Entra Domain Services managed domain.

Complete the tutorial [Create and configure a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-create-instance) up to but not including the section [Enable user accounts for Domain Services](/entra/identity/domain-services/tutorial-create-instance#enable-user-accounts-for-domain-services). That section requires special treatment in the context of this tutorial, as described in the next section. Be sure to complete the DNS actions completely and correctly.

Note down the value that you specify when completing the step "Enter a DNS domain name for your managed domain." You use it later in this article.

### Create users and reset passwords

The following steps show you how to create users and change their passwords, which is required to cause the users to propagate successfully through LDAP. If you have an existing Microsoft Entra Domain Services managed domain, these steps might not be necessary.

1. Within the Azure portal, ensure the subscription corresponding to the Microsoft Entra ID tenant is the currently active directory. To learn how to select the correct directory, see [Associate or add an Azure subscription to your Microsoft Entra tenant](/entra/fundamentals/how-subscriptions-associated-directory). If the incorrect directory is selected, you either aren't able to create users, or you create users in the wrong directory.
1. In the search box at the top of the Azure portal, enter *Users*.
1. Select **New user**.
1. Ensure that **Create user** is selected.
1. Fill in values for **User name**, **name**, **First name**, and **Last name**. Leave the remaining fields at their default values.
1. Select **Create**.
1. Select the newly created user in the table.
1. Select **Reset password**.
1. In the panel that appears, select **Reset password**.
1. Note down the temporary password.
1. In an "incognito" or private browser window, visit [the Azure portal](https://portal.azure.com/) and sign in with the user's credentials and password.
1. Change the password when prompted. Note down the new password. You use it later.
1. Sign out and close the "incognito" window.

Repeat the steps from "Select **New user**" through "Sign and out close" for each user you want to enable.

### Configure secure LDAP for a Microsoft Entra Domain Services managed domain

This section walks you through a separate tutorial to extract values for use in configuring WLS.

First, open the tutorial [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-configure-ldaps) in a separate browser window so you can look at the variations below as you run through the tutorial.

When you reach the section [Export a certificate for client computers](/entra/identity/domain-services/tutorial-configure-ldaps#export-a-certificate-for-client-computers), take note of where you save the certificate file ending in *.cer*. You use the certificate as input to the WLS configuration.

When you reach the section [Lock down secure LDAP access over the internet](/entra/identity/domain-services/tutorial-configure-ldaps#lock-down-secure-ldap-access-over-the-internet), specify **Any** as the source. You tighten the security rule with a specific IP address later in this guide.

Before you execute the steps in [Test queries to the managed domain](/entra/identity/domain-services/tutorial-configure-ldaps#test-queries-to-the-managed-domain), use the following steps to enable the testing to succeed:

1. In the Azure portal, visit the overview page for the Microsoft Entra Domain Services instance.
1. In the **Settings** area, select **Properties**.
1. In the right-hand pane of the page, scroll down until you see **Admin group**. Under this heading should be a link for **AAD DC Administrators**. Select that link.
1. In the **Manage** section, select **Members**.
1. Select **Add members**.
1. In the **Search** text field, enter some characters to locate one of the users you created in a preceding step.
1. Select the user, then activate the **Select** button.

   This user is the one you must use when executing the steps in the **Test queries to the managed domain** section.

> [!NOTE]
> The following list provides some tips about querying the LDAP data, which you need to do to collect some values necessary for WLS configuration:
>
> * The tutorial advises you to use the Windows program *LDP.exe*. This program is only available on Windows. For non-Windows users, it's also possible to use [Apache Directory Studio](https://directory.apache.org/studio/downloads.html) for the same purpose.
> * When logging in to LDAP with *LDP.exe*, the username is just the part before the @. For example, if the user is `alice@contoso.onmicrosoft.com`, the username for the *LDP.exe* bind action is `alice`. Also, leave *LDP.exe* running and logged in for use in subsequent steps.

In the section [Configure DNS zone for external access](/entra/identity/domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access), note down the value for **Secure LDAP external IP address**. You use it later.

If the value of the **Secure LDAP external IP address** isn't readily apparent, use the following steps to get the IP address:

1. In the Azure portal, find the resource group that contains the Microsoft Entra Domain Services resource.
1. In the list of resources, select the **public IP address** resource for the Microsoft Entra Domain Services resource, as shown in the following screenshot. The public IP address likely starts with `aadds`.

   :::image type="content" source="media/migrate-weblogic-with-entra-id-via-ldap/alternate-secure-ip-address-technique.png" alt-text="Screenshot of the Azure portal that shows the Resource group page with the Public IP address highlighted." lightbox="media/migrate-weblogic-with-entra-id-via-ldap/alternate-secure-ip-address-technique.png":::

Don't execute the steps in [Clean-up resources](/entra/identity/domain-services/tutorial-configure-ldaps#clean-up-resources) until instructed to do so in this guide.

With these variations in mind, complete [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-configure-ldaps). You can now collect the values that you need to provide to the WLS Configuration.

> [!NOTE]
> Wait for the secure LDAP configuration to complete processing before moving on to the next section.

### Disable weak TLS v1

By default, Microsoft Entra Domain Services enables the use of TLS v1, which is considered weak and isn't supported in WebLogic Server 14 and later.

This section shows you how to disable the TLS v1 cipher.

First, get the resource ID of the Microsoft Entra Domain Service managed domain that enables LDAP. The following command gets the ID of an Azure Domain Service instance named `aaddscontoso.com` in a resource group named `aadds-rg`:

```azurecli
AADDS_ID=$(az resource show \
    --resource-group aadds-rg \
    --resource-type "Microsoft.AAD/DomainServices" \
    --name aaddscontoso.com \
    --query "id" \
    --output tsv)
```

To disable TLS v1, use the following command:

```azurecli
az resource update \
    --ids $AADDS_ID \
    --set properties.domainSecuritySettings.tlsV1=Disabled
```

The output displays `"tlsV1": "Disabled"` for `domainSecuritySettings`, as shown in the following example:

```output
"domainSecuritySettings": {
      "ntlmV1": "Enabled",
      "syncKerberosPasswords": "Enabled",
      "syncNtlmPasswords": "Enabled",
      "syncOnPremPasswords": "Enabled",
      "tlsV1": "Disabled"
}
```

For more information, see [Harden a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/secure-your-domain).

> [!NOTE]
> If you add a lock to the resource or resource group, you encounter an error message when attempting to update the managed domain, such as: `Message: The scope '/subscriptions/xxxxx/resourceGroups/aadds-rg/providers/Microsoft.AAD/domainServices/aaddscontoso.com' cannot perform write operation because the following scope(s) are locked: '/subscriptions/xxxxx/resourceGroups/aadds-rg'. Please remove the lock and try again.`

Write down the following information for the Microsoft Entra Domain Service managed domain. You use this information in a later section.

| Property                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Server Host                                                    | This value is the public DNS name that you saved when completing [Create and configure a Microsoft Entra ID Domain Services managed domain](/entra/identity/domain-services/tutorial-create-instance).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Secure LDAP external IP address                                | This value is the **Secure LDAP external IP address** value that you saved in the [Configure DNS zone for external access](/entra/identity/domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access) section.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Principal                                                      | To get this value, return to *LDP.exe* and use the following steps to obtain the value for the principal for use on your cloud only: <ol><li>In the **View** menu, select **Tree**.</li><li>In the **Tree View** dialog, leave **BaseDN** blank and select **OK**.</li><li>Right-click in the right side pane and select **Clear output**.</li><li>Expand the tree view select the entry that starts with `OU=AADDC Users`.</li><li>In the **Browse** menu, select **Search**.</li><li>In the dialog that appears, accept the defaults and select **Run**.</li><li>After output appears in the right-hand pane, select **Close**, next to **Run**.</li><li>Scan the output for the `Dn` entry corresponding to the user you added to the `AAD DC Administrators` group. It starts with `Dn: CN=&lt;user name&gt;OU=AADDC Users`.</li></ol> |
| User Base DN and Group Base DN                                 | For the purposes of this tutorial, the values for both of these properties are the same: the principal of `OU=AADDC Users`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Password for Principal                                         | This value is the password for the user that was added to the `AAD DC Administrators` group.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Public key for Microsoft Entra Domain Service LDAPS connection | This value is the *.cer* file you were asked to save aside when you completed the section [Export a certificate for client computers](/entra/identity/domain-services/tutorial-configure-ldaps#export-a-certificate-for-client-computers).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Configure WLS

This section helps you collect the parameter values from the Microsoft Entra Domain Service managed domain deployed earlier.

When you deploy any of the Azure Applications listed in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic), you can follow the steps to integrate Microsoft Entra Domain Service managed domain with WLS.

After the Azure application deployment finishes, use the following steps to find the URL to access the WebLogic Administration Console:

1. Open the Azure portal and go to the resource group that you provisioned.
1. In the navigation pane, in the **Settings** section, select **Deployments**. You see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the previous section. Select the oldest deployment, whose name starts with something similar to `oracle.`.
1. Select **Outputs**. This option shows the list of outputs from the deployment.
1. The **adminConsole** value is the fully qualified, public, internet-visible link to the WLS admin console. Select the copy icon next to the field value to copy the link to your clipboard and save it in a file.

> [!NOTE]
> This tutorial demonstrates how to use TLS v1.2 to connect to the Microsoft Entra Domain Service managed domain LDAP server. To ensure compatibility, you need to enable TLS v1.2 for deployments on JDK 8.
>
> To verify your JDK version, use the following steps:
>
> 1. Paste the value of **adminConsole** into your browser address bar, then sign in to the WLS admin console.
> 1. Under **Domain Structure**, select **Environment** > **Servers** > **admin** > **Monitoring** > **General**, then find **Java Version**.
>
>    :::image type="content" source="media/migrate-weblogic-with-entra-id-via-ldap/wls-console-java-version.png" alt-text="Screenshot of the WLS admin console Monitoring > General tab with the Java Version field highlighted." lightbox="media/migrate-weblogic-with-entra-id-via-ldap/wls-console-java-version.png":::
>
> If your Java version is 8, enable TLS v1.2 by using the following steps:
>
> 1. Under **Domain Structure**, select **Environment** > **Servers** > **admin** > **Configuration** > **Server Start**.
> 1. In the **Arguments** section, specify the value `-Djdk.tls.client.protocols=TLSv1.2`.
> 1. Select **Save** to save the change.
> 1. Under **Change Center**, select **Activate Changes** to enable the option.
>
>    :::image type="content" source="media/migrate-weblogic-with-entra-id-via-ldap/wls-console-enable-tls-v12.png" alt-text="Screenshot of the WLS admin console Configuration > Server Start tab." lightbox="media/migrate-weblogic-with-entra-id-via-ldap/wls-console-enable-tls-v12.png":::

### Integrate Microsoft Entra Domain Service managed domain with WLS

With the WebLogic admin server running, and the Microsoft Entra Domain Service managed domain deployed and secured with LDAPs, it's now possible to launch the configuration.

#### Upload and import the public CA

WLS communicates with the managed domain using Secure LDAP (LDAPS), which is LDAP over Secure Sockets Layer (SSL) or Transport Layer Security (TLS). To establish this connection, you must upload and import the public Certificate Authority (CA) certificate (a *.cer* file) into the WLS trust keystore.

Upload and import the certificate to the virtual machine that runs admin server by using the following steps:

1. Enable access to `adminVM` by following the instructions in the [Connect to the virtual machine](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#connect-to-the-virtual-machine) section of [Quickstart: Deploy WebLogic Server on Azure Virtual Machines](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine).
1. Open a Bash terminal, then upload the certificate by using the following commands. Replace the `ADMIN_PUBLIC_IP` value with the real value, which you can find in the Azure portal. You're required to input the password that you used to connect the machine.

   ```bash
   export CER_FILE_NAME=azure-ad-ds-client.cer
   export ADMIN_PUBLIC_IP="<admin-public-ip>"
   export ADMIN_VM_USER="weblogic"

   cd <path-to-cert>
   scp ${CER_FILE_NAME} "$ADMIN_VM_USER@$ADMIN_PUBLIC_IP":/home/${ADMIN_VM_USER}/${CER_FILE_NAME}
   ```

1. After the certificate is uploaded, you need to move it to the WLS domain folder */u01/domains* and change its ownership with `oracle:oracle` by using the following commands:

   ```azurecli
   export RESOURCE_GROUP_NAME=contoso-rg
   export ADMIN_VM_NAME=adminVM
   export CA_PATH=/u01/domains/${CER_FILE_NAME}

   az vm run-command invoke \
       --resource-group $RESOURCE_GROUP_NAME \
       --name ${ADMIN_VM_NAME} \
       --command-id RunShellScript \
       --scripts "mv /home/${ADMIN_VM_USER}/${CER_FILE_NAME} /u01/domains; chown oracle:oracle ${CA_PATH}"
   ```

1. Import the certificate to your keystore. The Azure application provisions WLS with a default trust store in `<jvm-path-to-security>/cacerts`. The specific path might vary depending on the JDK version. You can import the Microsoft Entra Domain Service managed domain public CA by using the following steps:

   1. Query the script that you used to set the domain environment variables.

      ```azurecli
      export DOMIAN_FILE_PATH=$(az vm run-command invoke \
          --resource-group $RESOURCE_GROUP_NAME \
          --name ${ADMIN_VM_NAME} \
          --command-id RunShellScript \
          --scripts "find /u01/domains -name setDomainEnv.sh" \
          --query value[*].message \
          --output tsv \
          | sed -n '/\[stdout\]/!b; n; p')

      echo $DOMIAN_FILE_PATH
      ```

   1. Import the CA by using the following command. Pay attention to your Java version, which you checked in previous section.

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

   You should see output similar to the following example:

   ```output
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

> [!NOTE]
> If you customize the trust store, you must import the Entra Domain Service managed domain public CA into your trust keystore. There's no need to import the certificate to the WLS managed servers. For more information, see [Configuring WebLogic to use LDAP](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/secmg/ldap_atn.html#GUID-A064C103-85EB-4A7B-ADAE-F01ACDC8E0B8).

#### Configure WLS hostname verification

Because [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-configure-ldaps) uses a wildcard `*.aaddscontoso.com` for the hostname in the certificate, you must configure the WLS admin server with appropriate hostname verification. Use the following steps to disable the verification. For WLS 14 and above, you can select **Wildcard Hostname Verification** instead.

1. Paste the value of **adminConsole** to your browser and log into the WLS admin console.
1. In the **Change Center**, select **Lock & Edit**.
1. Select **Environment** > **Servers** > **admin** > **SSL** > **Advanced**.
1. Next to **Hostname Verification**, select **None**.
1. Select **Save** and **Activate Changes** to save the configuration.

#### Resolve traffic for secure LDAP access

With secure LDAP access enabled over the internet, you can update your DNS zone so that client computers can find this managed domain. The **Secure LDAP external IP address** value is listed on the **Properties** tab for your managed domain. For more information, see [Configure DNS zone for external access](/entra/identity/domain-services/tutorial-configure-ldaps#configure-dns-zone-for-external-access).

If you don't have a registered DNS zone, you can add an entry in the `adminVM` hosts file, to resolve traffic for `ldaps.<managed-domain-dns-name>` (here's `ldaps.aaddscontoso.com`) to the external IP address. Change the value with yours before running the following commands:

```azurecli
export LDAPS_DNS=ldaps.aaddscontoso.com
export LDAPS_EXTERNAL_IP=<entra-domain-services-manged-domain-external-ip>

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

az vm run-command invoke \
    --resource-group $RESOURCE_GROUP_NAME \
    --name ${ADMIN_VM_NAME} \
    --command-id RunShellScript \
    --scripts "systemctl start wls_admin"
```

#### Create and configure the LDAP authentication provider

With the certificate imported and secure LDAP access traffic resolved, you can configure the LDAP provider from WLS console by using the following steps:

1. Paste the **adminConsole** value into your browser address bar and sign in at the WLS admin console.
1. Under **Change Center**, select **Lock & Edit**.
1. Under **Domain Structure**, select **Security Realms** > **myrealm** > **Providers** > **New**, and use the following values to create a new authentication provider.

   * For **Name**, fill in `AzureEntraIDLDAPProvider`.
   * For **Type**, select `ActiveDirectoryAuthenticator`.

1. Select **OK** to save the change.
1. In the provider list, select **AzureEntraIDLDAPProvider**.
1. For **Configuration** > **Common** > **Control Flag**, select **SUFFICIENT**.
1. Select **Save** to save the change.
1. For **Configuration** > **Provider Specific**, input the Microsoft Entra Domain Services managed domain connection information you obtained previously. Steps to obtain the value are listed in the table at [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](#configure-secure-ldap-for-a-microsoft-entra-domain-services-managed-domain).
1. Fill in the following required fields, keeping other fields with their default values:

   | Item                                             | Value                                                            | Sample value                                       |
   |--------------------------------------------------|------------------------------------------------------------------|----------------------------------------------------|
   | **Host**                                         | Managed domain LDAP sever DNS, `ldaps.<managed-domain-dns-name>` | `ldaps.aaddscontoso.com`                           |
   | **Port**                                         | `636`                                                            | `636`                                              |
   | **Principal**                                    | Principal of your cloud only user                                | `CN=WLSTest,OU=AADDC Users,DC=aaddscontoso,DC=com` |
   | **Credential**                                   | Credential of your cloud only user                               | -                                                  |
   | **SSLEnabled**                                   | Selected                                                         | -                                                  |
   | **User Base DN**                                 | Your user base distinguished name (DN)                           | `OU=AADDC Users,DC=aaddscontoso,DC=com`            |
   | **User From Name Filter**                        | `(&(sAMAccountName=%u)(objectclass=user))`                       | `(&(sAMAccountName=%u)(objectclass=user))`         |
   | **User Name Attribute**                          | `sAMAccountName`                                                 | `sAMAccountName`                                   |
   | **User Object Class**                            | `user`                                                           | `user`                                             |
   | **Group Base DN**                                | Your group base DN.                                              | `OU=AADDC Users,DC=aaddscontoso,DC=com`            |
   | **Group Membership Searching**                   | `limit`                                                          | `limit`                                            |
   | **Max Group Membership Search Level**            | `1`                                                              | `1`                                                |
   | **Use Token Groups For Group Membership Lookup** | Selected                                                         | -                                                  |
   | **Connection Pool Size**                         | `5`                                                              | `5`                                                |
   | **Connect Timeout**                              | `120`                                                            | `120`                                              |
   | **Connection Retry Limit**                       | `5`                                                              | `5`                                                |
   | **Results Time Limit**                           | `300`                                                            | `300`                                              |
   | **Keep Alive Enabled**                           | Selected                                                         | -                                                  |
   | **Cache Enabled**                                | Selected                                                         | -                                                  |
   | **Cache Size**                                   | `4000`                                                           | `4000`                                             |
   | **Cache TTL**                                    | `300`                                                            | `300`                                              |

1. Select **Save** to save the provider.
1. Select **Performance** next to **Configuration**.
1. Select **Enable Group Membership Lookup Hierarchy Caching**.
1. Select **Enable SID To Group Lookup Caching**.
1. Select **Save** to save the configuration.
1. Select **Activate Changes** to invoke the changes.

> [!NOTE]
> Pay attention to the hostname of the LDAP server. It should be in the format `ldaps.<managed-domain-dns-name>`. In this example, the value is `ldaps.aaddscontoso.com`.
>
> If you encounter an error such as `[Security:090834]No LDAP connection could be established. ldap://dscontoso.com:636 Cannot contact LDAP server`, try restarting `adminVM` to resolve the issue.

You must restart the WLS admin server for the changes to take effect. Run the following command to restart the admin server:

```azurecli
az vm run-command invoke \
    --resource-group $RESOURCE_GROUP_NAME \
    --name ${ADMIN_VM_NAME} \
    --command-id RunShellScript \
    --scripts "systemctl stop wls_admin"

az vm run-command invoke \
    --resource-group $RESOURCE_GROUP_NAME \
    --name ${ADMIN_VM_NAME} \
    --command-id RunShellScript \
    --scripts "systemctl start wls_admin"
```

> [!NOTE]
> If you're authenticating an application in a cluster with users from Microsoft Entra ID, you must restart the managed server to activate the provider. You can do this by restarting the virtual machine hosting the server.

### Validation

After restarting admin server, use the following steps to verify that the integration was successful:

1. Visit the WLS Admin console.
1. In the navigation pane, expand the tree and select **Security Realms** > **myrealm** > **Providers**.
1. If the integration was successful, you can find the Microsoft Entra ID provider - for example `AzureEntraIDLDAPProvider`.
1. In the navigation pane, expand the tree and select **Security Realms** > **myrealm** > **Users and Groups**.
1. If the integration was successful, you can find users from the Microsoft Entra ID provider.

> [!NOTE]
> It takes a few minutes to load users the first time you access **Users and Groups**. WLS caches the users and is faster on the next access.

### Lock down and secure LDAP access over the internet

While standing up the secure LDAP in the preceding steps, set the source as **Any** for the `AllowLDAPS` rule in the network security group. Now that the WLS Admin Server is deployed and connected to LDAP, obtain its public IP address using the Azure portal. Revisit [Lock down secure LDAP access over the internet](/entra/identity/domain-services/tutorial-configure-ldaps#lock-down-secure-ldap-access-over-the-internet) and change **Any** to the specific IP address of the WLS Admin server.

## Clean up resources

Now it's time to follow the steps in the [Clean up resources](/entra/identity/domain-services/tutorial-configure-ldaps#clean-up-resources) section of [Configure secure LDAP for a Microsoft Entra Domain Services managed domain](/entra/identity/domain-services/tutorial-configure-ldaps).

## Next steps

Explore other aspects of migrating WebLogic Server apps to Azure.

> [!div class="nextstepaction"]
> [Migrate WebLogic Server applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)

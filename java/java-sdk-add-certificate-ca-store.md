---
title: Add a root certificate for Azure to the Java CA store
description: Learn how to add a certificate authority (CA) root certificate to the Java CA certificate (cacerts) store for use with Microsoft Azure.
services: ''
documentationcenter: java
author: rmcmurray
manager: mbaldwin

ms.assetid: d3699b0a-835c-43fb-844d-9c25344e5cda
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 11/13/2018
ms.author: robmcm
---

# Adding a root certificate to the Java CA certificates store

Applications that use Azure services (such as Azure Service Bus) need to trust the Baltimore CyberTrust root certificate. This certificate may already be installed on your system, but if it is not, the steps in this tutorial will show you how to use Oracle's **keytool** to add the required certificate authority (CA) root certificate to the Java CA certificate (cacerts) store that you will use for Azure services.

Oracle's keytool utility is a _Key and Certificate Management Tool_, which allows developers to manage the list of trusted certificates for use with Java. You can use keytool to add the CA certificate before zipping your JDK and adding it to your Azure project's **approot** folder, or you could run an Azure start-up task that uses keytool to add the certificate.

Beginning April 15, 2013, Azure began migrating from the GTE CyberTrust Global root certificate to the Baltimore CyberTrust root certificate. The following steps show you how to use keytool to add the Baltimore CyberTrust root certificate to your Java CA certificate (cacerts) store.

> [!NOTE]
> 
> You can use the steps in this article to configure your Java SDK to trust the root certificates from other trusted certificate authorities. For example, you might choose a root certificate from the list of certificates at [GeoTrust Root Certificates](http://www.geotrust.com/resources/root-certificates/).
> 

## Determining which root certificates are installed

The Baltimore certificate might already be installed in your cacerts store, so you need to use the following steps to determine if it has already been installed.

1. At an administrator command prompt, navigate to your JDK's **jdk\jre\lib\security** folder, and then run the following command to list the certificates that are installed on your system:

   ```shell
   keytool -list -keystore cacerts
   ```

1. If you are prompted for the store password, the default password is **changeit**.

   > [!NOTE]
   > 
   > If you want to change the store password, see the keytool documentation at <http://docs.oracle.com/javase/7/docs/technotes/tools/windows/keytool.html>.
   > 

1. If you do not see the certificate with the thumbprint of `d4:de:20:d0:5e:66:fc:53:fe:1a:50:88:2c:78:db:28:52:ca:e4:74`, use the steps in the following section to download and install the certificate.

## To add a root certificate to the cacerts store

1. Download the Baltimore CyberTrust root certificate from <https://cacert.omniroot.com/bc2025.crt>, and save to a local file with extension **.cer** in your **jdk\jre\lib\security** folder. For this example, assume that you downloaded the Baltimore CyberTrust root certificate file as **bc2025.cer**.

   > [!NOTE]
   > 
   > The Baltimore CyberTrust root certificate has a serial number of `02:00:00:b9`, and a SHA1 thumbprint of `d4:de:20:d0:5e:66:fc:53:fe:1a:50:88:2c:78:db:28:52:ca:e4:74`.
   > 

2. Import the certificate to the cacerts store by using the following command:

   ```shell
   keytool -keystore cacerts -importcert -alias bc2025ca -file bc2025.cer
   ```
   Where:

   |  Parameter   |                              Description                               |
   |--------------|------------------------------------------------------------------------|
   | `keystore`   | Specifies the certificate store.                                       |
   | `importcert` | Specifies that you are importing a certificate.                        |
   | `alias`      | Specifies an alias for the certificate.                                |
   | `file`       | Specifies the filename of the root certificate that you are importing. |


3. If you are prompted to trust the certificate, verify the thumbprint as `d4:de:20:d0:5e:66:fc:53:fe:1a:50:88:2c:78:db:28:52:ca:e4:74`, and type **y** if the thumbprint is correct.

4. Run the following command to ensure the CA certificate has been successfully imported:

   ```shell
   keytool -list -keystore cacerts
   ```

After you have successfully added the root certificate to your JDK, you can zip the contents of JDK and add it to your Azure project's **approot** folder.

## Next steps

For more information about the keytool utility, see <http://docs.oracle.com/javase/7/docs/technotes/tools/windows/keytool.html>.

For more information about Java, see [Azure for Java developers](/java/azure).

<!-- For more information about the root certificates used by Azure, see [Azure Root Certificate Migration](http://blogs.msdn.com/b/windowsazure/archive/2013/03/15/windows-azure-root-certificate-migration.aspx). -->

For more information about the supported JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
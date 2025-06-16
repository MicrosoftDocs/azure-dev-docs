---
title: Troubleshoot networking issues when you use the Azure SDK for Java
description: Provides an overview of how to troubleshoot networking issues related to using the Azure SDK for Java.
ms.date: 04/02/2025
ms.topic: troubleshooting-general
ms.custom: devx-track-java, devx-track-extended-java
author: KarlErickson
ms.author: karler
ms.reviewer: alzimmer
---

# Troubleshoot networking issues

This article describes a few tools that can diagnose networking issues of various complexities. These issues include scenarios that range from troubleshooting an unexpected response value from a service, to root-causing a connection-closed exception.

For client-side troubleshooting, the Azure client libraries for Java offer a consistent and robust logging story, as described in [Configure logging in the Azure SDK for Java](logging-overview.md). However, the client libraries make network calls over various protocols, which may lead to troubleshooting scenarios that extend outside of the troubleshooting scope provided. When these problems occur, the solution is to use the external tooling described in this article to diagnose networking issues.

## Fiddler

[Fiddler](https://docs.telerik.com/fiddler-everywhere/introduction) is an HTTP debugging proxy that allows for requests and responses passed through it to be logged as-is. The raw requests and responses that you capture can help you troubleshoot scenarios where the service gets an unexpected request, or the client receives an unexpected response. To use Fiddler, you need to configure the client library with an HTTP proxy. If you use HTTPS, you need extra configuration to inspect the decrypted request and response bodies.

### Add an HTTP proxy

To add an HTTP proxy, follow the guidance in [Configure proxies in the Azure SDK for Java](proxying.md). Be sure to use the default Fiddler address of `localhost` on port 8888.

### Enable HTTPS decryption

By default, Fiddler can capture only HTTP traffic. If your application uses HTTPS, you must take extra steps to trust Fiddler's certificate to allow it to capture HTTPS traffic. For more information, see [HTTPS Menu](https://docs.telerik.com/fiddler-everywhere/user-guide/settings/https) in the Fiddler documentation.

The following steps show you how to use the Java Runtime Environment (JRE) to trust the certificate. If the certificate isn't trusted, an HTTPS request through Fiddler may fail with security warnings.

#### [Linux/macOS](#tab/linux-macos)

1. Export Fiddler's certificate.
1. Find the JRE's keytool (usually in **jre/bin**).
1. Find the JRE's cacert (usually in **jre/lib/security**).
1. Open a Bash window and use the following command to import the certificate:

   ```bash
   sudo keytool -import -file <location-of-Fiddler-certificate> -keystore <location-of-cacert> -alias Fiddler
   ```

1. Enter a password.
1. Trust the certificate.

#### [Windows](#tab/windows)

1. Export Fiddler's certificate. The certificate is typically exported to the desktop.
1. Find the JRE's keytool (usually in **jre\bin**).
1. Find the JRE's cacert (usually in **jre\lib\security**).
1. Open a PowerShell window in administrator mode and use the following command to import the certificate:

   ```powershell
   keytool.exe -import -trustcacerts -file <location-of-Fiddler-certificate> -keystore <location-of-cacert> -alias Fiddler
   ```

   For example, the following command uses some common values:

   ```powershell
   keytool.exe -import -trustcacerts -file "C:\Users\username\Desktop\FiddlerRootCertificate.crt" -keystore "C:\Program Files\AdoptOpenJDK\jdk-8.0.275.1-hotspot\jre\lib\security\cacerts" -alias Fiddler
   ```

1. Enter a password. If you haven't set a password before, the default is `changeit`. For more information, see [Working with Certificates and SSL](https://docs.oracle.com/cd/E19830-01/819-4712/ablqw/index.html) in the Oracle documentation.
1. Trust the certificate.

---

## Wireshark

[Wireshark](https://www.wireshark.org/) is a network protocol analyzer that can capture network traffic without needing changes to application code. Wireshark is highly configurable and can capture broad to specific, low-level network traffic. This capability is useful for troubleshooting scenarios such as a remote host closing a connection or having connections closed during an operation. The Wireshark GUI displays captures using a color scheme that identifies unique capture cases, such as a TCP retransmission, RST, and so on. You can also filter captures either at capture time or during analysis.

### Configure a capture filter

Capture filters reduce the number of network calls that are captured for analysis. Without capture filters, Wireshark captures all traffic that goes through a network interface. This behavior can produce massive amounts of data where most of it may be noise to the investigation. Using a capture filter helps preemptively scope the network traffic being captured to help target an investigation. For more information, see [Capturing Live Network Data](https://www.wireshark.org/docs/wsug_html_chunked/ChapterCapture.html) in the Wireshark documentation.

The following example adds a capture filter to capture network traffic sent to or received from a specific host.

In Wireshark, navigate to **Capture > Capture Filters...** and add a new filter with the value `host <host-IP-or-hostname>`. This filter captures traffic only to and from that host. If the application communicates to multiple hosts, you can add multiple capture filters, or you can add the host IP/hostname with the 'OR' operator to provide looser capture filtering.

### Capture to disk

You might need to run an application for a long time to reproduce an unexpected networking exception, and to see the traffic that leads up to it. Additionally, it may not be possible to maintain all captures in memory. Fortunately, Wireshark can log captures to disk so that they're available for post-processing. This approach avoids the risk of running out of memory while you reproduce an issue. For more information, see [File Input, Output, And Printing](https://www.wireshark.org/docs/wsug_html_chunked/ChapterIO.html) in the Wireshark documentation.

The following example sets up Wireshark to persist captures to disk with multiple files, where the files split on either 100k captures or 50 MB size.

In Wireshark, navigate to **Capture > Options** and find the **Output** tab, then enter a file name to use. This configuration causes Wireshark to persist captures to a single file.

To enable capture to multiple files, select **Create a new file automatically** and then select **after 100000 packets** and **after 50 megabytes**. This configuration has Wireshark create a new file when one of the predicates is matched. Each new file uses the same base name as the file name entered and appends a unique identifier.

If you want to limit the number of files that Wireshark can create, select **Use a ring buffer with X files**. This option limits Wireshark to logging with only the specified number of files. When that number of files is reached, Wireshark begins overwriting the files, starting with the oldest.

### Filter captures

Sometimes you can't tightly scope the traffic that Wireshark captures - for example, if your application communicates with multiple hosts using various protocols. In this scenario, generally with using persistent capture outlined previously, it's easier to run analysis after network capturing. Wireshark supports filter-like syntax for analyzing captures. For more information, see [Working With Captured Packets](https://www.wireshark.org/docs/wsug_html_chunked/ChapterWork.html) in the Wireshark documentation.

The following example loads a persisted capture file and filters on `ip.src_host==<IP>`.

In Wireshark, navigate to **File > Open** and load a persisted capture from the file location used previously. After the file has loaded underneath the menu bar, a filter input appears. In the filter input, enter `ip.src_host==<IP>`. This filter limits the capture view so that it shows only captures where the source was from the host with the IP `<IP>`.

## Next steps

This article covered using various tools to diagnose networking issues when working with the Azure SDK for Java. Now that you're familiar with the high-level usage scenarios, you can begin exploring the SDK itself. For more information on the APIs available, see the [Azure SDK for Java libraries](azure-sdk-library-package-index.md).

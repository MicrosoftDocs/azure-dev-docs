---
title: Troubleshooting networking issues
description: An overview of how to troubleshoot networking issues related to using the Azure SDK for Java
ms.date: 11/23/2020
ms.topic: conceptual
ms.custom: devx-track-java
---

# Troubleshooting networking issues

The Azure client libraries for Java offer a consistent and robust [logging story](java-sdk-logging-overview.md) to enable client-side troubleshooting. But, the client libraries make network calls over various protocols, which may lead to troubleshooting scenarios that extend outside of the troubleshooting scope provided. When this happens, external tooling to diagnose networking issues is the solution. We'll discuss a few applications that are able to diagnose networking issues of various complexities. The scenarios will range from troubleshooting an unexpected response value from a service to root causing a connection closed exception.

## Fiddler

[Fiddler](https://docs.telerik.com/fiddler-everywhere/introduction) is an HTTP debugging proxy that allows for requests and responses passed through it to be logged as-is. Capturing the raw requests and responses helps aid in troubleshooting scenarios where the service gets an unexpected request or the client receives an unexpected response. To use Fiddler the client library will need to be configured with an HTTP proxy. If HTTPS is being used, extra configuration will be needed if the decrypted request and response bodies need to be inspected.

### Adding an HTTP proxy

To add an HTTP proxy, follow the guidance in the [proxy configuration](java-sdk-proxying.md) documentation. Be sure to use the default Fiddler address of `localhost` on port 8888.

### Enable HTTPS decryption

By default Fiddler is only able to capture HTTP traffic. If your application is using HTTPS, extra steps must be taken to trust Fiddler's certificate to allow it to capture HTTPS traffic.

This is a [high-level guide](https://docs.telerik.com/fiddler-everywhere/user-guide/settings/https) on trusting Fiddler's certificate. Below will discuss having your JRE trust the certificate. Without trusting the certificate HTTPS request through Fiddler may fail with security warnings.

#### Linux/macOS

1. Export Fiddler's certificate
2. Find the JRE's keytool (usually `jre/bin`)
3. Find the JRE's cacert (usually `jre/lib/security`)
4. Run keytool to import the certificate: `sudo keytool -import -file <location of Fiddler certificate> -keystore <location of cacert> -alias Fiddler`
5. Enter a password
6. Trust the certificate

#### Windows

1. Export Fiddler's certificate
2. Find the JRE's keytool (usually `jre/bin`)
3. Find the JRE's cacert (usually `jre/lib/security`)
4. Run keytool to import the certificate: `keytool.exe -import -file <location of Fiddler certificate> -keystore <location of cacert> -alias Fiddler`
5. Enter a password
6. Trust the certificate

## Wireshark

[Wireshark](https://www.wireshark.org/) is a network protocol analyzer that is able to capture traffic going through a network interface without requiring changes to application code. Wireshark is highly configurable and is able to capture broad through to specific low-level network traffic which allows it to aid in troubleshooting scenarios such as a remote host closing a connection or having connections closed during operation. The Wireshark GUI differentiates captures using a color scheme to easily identify unique capture cases such as a TCP retransmission, rst, etc. Captures can also be filtered either at capture time or during analysis.

### Configuring a capture filter

Capture filters reduce the number of network calls that are captured for analysis. Without capture filters Wireshark will capture all traffic that goes through a network interface. This can produce massive amounts of data where most of it may be noise to the investigation. Using a capture filter helps preemptively scope the network traffic being captured to help target an investigation.

Wireshark provides an in-depth [guide](https://www.wireshark.org/docs/wsug_html_chunked/ChapterCapture.html) on configuring traffic capture filters.

**_Example_**

This example adds a capture filter to capture network sent to or received from a specific host.

In Wireshark navigate to `Capture > Capture Filters...` and add a new filter with the value `host <host IP or hostname>`. This will add a filter to only capture traffic to and from that host. If the application communicates to multiple hosts multiple capture filters can be added or the host IP/hostname can be `or`'d to provide looser capture filtering.

### Capturing to disk

Reproducing unexpected networking exceptions may requiring running an application for a long time to get the issue to reproduce and see the traffic leading up to it, and it may not be possible to maintain all captures in memory. Fortunately, Wireshark is able to log captures to disk. Persisting to disk ensures that the captures are available for post-processing and prevents the risk of running out of memory while reproducing the issue.

Wireshark provides an in-depth [guide](https://www.wireshark.org/docs/wsug_html_chunked/ChapterIO.html) on configuring persisting captured traffic to disk.

**_Example_**

This example sets up Wireshark to persist captures to disk with multiple file where the files split on either 100k capture or 50MB in size.

In Wireshark navigate to `Capture > Options` and navigate to the `Output` tab. Enter a file name to use, this will have Wireshark persist captures to a single file. Enable multiple files by checking `Create a new file automatically` and then check `after 100000 packets` and `after 50 megabytes`, this will have Wireshark create a new file after one of the predicates are matched. Each new file will use the same base name as the file name entered and will append a unique identifier. If you want to limit the number of files that Wireshark is able to create check the `Use a ring buffer with X files`, this will limit Wireshark to logging with only X files where upon needing a new file after reaching X the oldest is overwritten.

### Filtering captures

Some times it isn't possible to tightly scope the traffic captured by Wireshark, for example your application communicates with multiple hosts using various protocols. In this scenario, generally with using persistent capture outlined above, it is easier to run analysis after network capturing. Wireshark provides the ability to use capture filter-like syntax to be able to analyze captures.

Wireshark provides an in-depth [guide](https://www.wireshark.org/docs/wsug_html_chunked/ChapterWork.html) on filtering captures.

**_Example_**

This example loads a persisted capture file and filters on `ip.src_host==<IP>`.

In Wireshark navigate to `File > Open` and load a persisted capture from the file location used above. Once the file has loaded below the menu bar there is a filter input. In the filter input enter `ip.src_host==<IP>`, this will limit the capture view to only show captures where the source was from the host with the IP `<IP>`.

---
title: Java Flight Recorder and Mission Control
description: Guidance for using Java Flight Recorder and Mission Control to collect and review app data.
author: bmitchell287
manager: douge
ms.author: brendm 
ms.date: 4/9/2019
ms.devlang: java
ms.topic: conceptual
---
# Using Java Flight Recorder (JFR) and Mission Control

Zulu Mission Control is a fully-tested build of JDK Mission Control, which was open sourced by Oracle in 2018 and is managed as a project under the OpenJDK umbrella. Coupled with Flight Recorder, Mission Control delivers low-overhead, interactive monitoring and management capabilities for Java workloads.

Zulu Mission Control is compatible with the following JDKs/JREs:

* Zulu 12.1 and later
* Zulu 11.0 and later
* Zulu 8u202 (8.36) and later
* Oracle OpenJDK 11+15 and later
* Oracle Java 11.0 and later
* Oracle Java 8.0 and later

Follow the steps below to install Zulu Mission Control, connect to a Java Virtual Machine (JVM), and gain real-time visibility into all aspects of a running application.

1.	[Install a Zulu Mission Control compatible JDK/JRE](java-jdk-install.md).

2.	Download Zulu Mission Control from [the Azul download site](https://www.azul.com/products/zulu-mission-control/), choose the appropriate version for your system, save it locally, and change to that directory.

3.	Expand the downloaded file.

    **Linux:**

    ```cli
    tar -xzvf zmc7.0.0-EA-linux_x64.tar.gz
    ```

    **Windows:**

    ```cli
    unzip -zxvf zmc7.0.0-EA-win_x64.zip	
    ```

    **MacOS:**

    ```cli
    tar -xzvf zmc7.0.0-EA-macosx_x64.tar.gz
    ```

4.	Start your Java application using one of the compatible JDKs. E.g.:

    ```cli
    $JAVA_HOME/bin/java -jar MyApplication.jar
    ```

5.	Start Zulu Mission Control

    **Linux:**

    ```cli
    zmc7.0.0-EA-linux_x64/zmc
    ```

    **Windows:**

    ```cli
    zmc7.0.0-EA-win_x64\zmc.exe	
    ```

    **MacOS:**

    ```cli
    zmc7.0.0-EA-macosx_x64/Zulu\ Mission\ Control.app/Contents/MacOS/zmc
    ```

6.	Switch the JVM installation for Mission Control (Optional)

    On Windows, *zmc.exe* will use the default JVM installation configured in the registry. Zulu Mission Control must be launched from a full JDK to be able to detect local JVM instances automatically. If this is a JRE, you will see the warning below:

    > [!div class="mx-imgBorder"]
    ![Warning if JDK install is JRE-only](../media/jdk/azul-jfr-1.png)

    To change the JVM used by Mission Control, follow these steps: 
    1.	Open *zmc.ini* configuration file, located in the same directory as the *zmc.exe*
    2.	Before the line `-vmargs`, add two lines:
        * On the first line, write `–vm`
        * On the second line, write the path to your JDK installation. (For example, `C:\Program Files\Java\jdk1.8.0_212\bin\javaw.exe`).

7.	Locate the JVM running your application
    1.	In the upper left pane of the Zulu Mission Control window click on the tab labelled **JVM Browser**.
    2.	Select and expand the list item in the upper left for your the JVM instance running your application.

    > [!div class="mx-imgBorder"]
    ![Expand the list item in the upper-left for your JVM instance](../media/jdk/azul-jfr-2.png)


8.	Start a Flight Recording, if necessary
    1.	If the Flight Recorder displays "No Recordings", start one by right-clicking on the Flight Recorder line in the JVM Browser tab and selecting **Start Flight Recording...**
    2.	Select either a fixed duration recording or a continuous recording, and either a Profiling configuration (fine-grained) or a Continuous configuration (lower overhead), then click **Finish**.

    > [!div class="mx-imgBorder"]
    ![Start a Flight Recording](../media/jdk/azul-jfr-3.png)

9.	Dump the Flight Recording
    1.	A Flight Recording should appear below the Flight Recorder line in the JVM Browser. Right-click on the line representing the Flight Recording and select **Dump whole recording**.
    2.	A new tab will appear in the large pane on the right side of the Zulu Mission Control window. This pane represents the Flight Recording just dumped from the JVM running your application.

10.	Examine the Flight Recording using Zulu Mission Control
    1.	If not already activated, select the tab labelled **Outline** in the left pane of the Zulu Mission Control Window. This tab contains different views of the data collected in the Flight Recording.
 
    > [!div class="mx-imgBorder"]
    ![Review the Fliight Recording](../media/jdk/azul-jfr-4.png)

## Resources

We have also prepared a [demonstration video](https://www.azul.com/presentation/azul-webinar-open-source-flight-recorder-and-mission-control-managing-and-measuring-openjdk-8-performance/) narrated by Azul Systems Deputy CTO Simon Ritter. The video walks you through the configuration and setup of both Flight Recorder and Zulu Mission Control. The Flight Recorder discussion starts at 31:30.


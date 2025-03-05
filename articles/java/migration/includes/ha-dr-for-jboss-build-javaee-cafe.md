---
author: KarlErickson
ms.author: karler
ms.reviewer: zhihaoguo
ms.date: 11/28/2024
---

1. Use the following steps to build the Java EE Cafe sample. These steps assume that you have a local environment with Git and Maven installed.

    1. Use the following command to clone the source code from GitHub and check out the tag corresponding to this version of the article:

       ```bash
       git clone https://github.com/Azure/rhel-jboss-templates.git --branch 20240904 --single-branch
       ```

       If you see an error message with the text `You are in 'detached HEAD' state`, you can safely ignore it.

    1. Use the following command to build the source code:

       ```bash
       mvn clean install --file rhel-jboss-templates/eap-coffee-app/pom.xml
       ```

       This command creates the file **rhel-jboss-templates/eap-coffee-app/target/javaee-cafe.war**. You upload this file in the next step.

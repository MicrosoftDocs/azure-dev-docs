---
title: Azure Application and Code Assessment Toolkit
description: How to assess and replatform any type of Java applications with Azure AppCAT (Application and Code Assessment Toolkit) to evaluate their readiness to migrate to Azure
author: KarlErickson
ms.author: antoniomanug
ms.service: azure
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: overview
ms.date: 07/27/2023
keywords: java, azure, appCAT, assessment, replatform
---

# Azure Application and Code Assessment Toolkit

This guide describes how to assess and replatform any type of Java applications with *Azure AppCAT* (Azure Application and Code Assessment Toolkit) to evaluate their readiness to replatform and migrate to Azure.

## What is Azure AppCAT for Java?

Azure AppCAT is a tool to assess Java applications (binaries) and source code to identify replatforming and migration opportunities for Azure. It helps you modernize and replatform large-scale Java applications through a broad range of transformations, use cases, and code patterns.

Azure AppCAT discovers application technology usage through static code analysis, supports effort estimation, and accelerates code replatforming, helping you move Java applications to Azure.

AppCAT bundles a set of tools, engines, and rules to assess and replatform Java applications to different targets (such as Java 11, Java 17, Jakarta EE 10, Quarkus, Spring, and so on). It adds Azure targets (Azure App Service, Azure Kubernetes Service, Azure Container Apps, and Azure Spring Apps) and specific Azure replatforming rules.

Azure AppCAT is open source and based on [WindUp](https://github.com/windup), a project created by Red Hat and published under the [Eclipse Public License](https://github.com/windup/windup/blob/master/LICENSE).

> [!NOTE]
> Azure AppCAT is in **Public Preview**. If you find issues, contact us at [azure-appcat@microsoft.com](mailto:azure-appcat@microsoft.com).

## When should I use Azure AppCAT?

Azure AppCAT is designed to help organizations modernize their Java applications in a way that reduces costs and enables faster innovation. The tool uses advanced analysis techniques to understand the structure and dependencies of any Java application, and provides guidance on how to refactor and migrate the applications to Azure.

With Azure AppCAT you can:

* **Discover technology usage**: Quickly see which technologies an application uses. Discovery is useful if you have legacy applications with not much documentation and want to know which technologies they use.
* **Assess the code to a specific target**: Assess an application for a specific Azure target. Check the effort and the modifications you have to do in order to replatform your applications to Azure.

### Supported Azure targets

The toolkit contains rules for helping you replatform your applications so you can deploy to and use the following Azure services.

You can use the following services as deployment targets:

* Azure App Service
* Azure Spring Apps
* Azure Kubernetes Service
* Azure Container Apps

You can use the following services as resource services:

* Azure Databases
* Azure Service Bus
* Azure Storage
* Azure CDN
* Azure Event Hub
* Azure Key Vault

## Use Azure AppCAT

To use Azure AppCAT, you must download the ZIP file, and have a compatible JDK 11+ installation on your computer. Azure AppCAT runs on Windows, Linux, or Mac, both for X64 and Arm64/M1 hardware.

You can use the [Microsoft Build of OpenJDK](/java/openjdk) to run Azure AppCAT.

### Download Azure AppCAT

The Azure AppCAT CLI is available for download as a ZIP file from [aka.ms/appcat/azure-appcat-cli-latest.zip](https://aka.ms/appcat/azure-appcat-cli-latest.zip).

> [!div class="nextstepaction"]
> [Download Azure AppCAT](https://aka.ms/appcat/azure-appcat-cli-latest.zip)

### Run Azure AppCAT

Unzip the zip file in a folder of your choice. You then get the following directory structure:

```
azure-appcat-cli-<version>    # APPCAT_HOME
  ├── README.md
  ├── bin
  │   ├── appcat-cli
  │   └── appcat-cli.bat
  ├── docs
  │   └── appcat-cli-guide.html
  └── samples
      ├── airsonic.war
      ├── run-assessment
      ├── run-assessment-custom-rules
      ├── run-assessment-no-code-report
      ├── run-assessment-zip-report
      └── run-discovery
```

* *docs*: This directory contains the documentation of Azure AppCAT.
* *bin*: This directory contains the Azure AppCAT CLI executables (for Windows/Linux/Mac).
* *samples*: This directory contains a sample application and several scripts to run Azure AppCAT against the sample application.

To run the tool, open a terminal session and type the following command from the *$APPCAT_HOME/bin* directory:

```bash
./appcat-cli --help
```

To run the tool from anywhere in your computer, configure the directory *$APPCAT_HOME/bin* into your `PATH` environment variable and then restart your terminal session.

## Documentation

The following guides provide the main documentation for Azure AppCAT for Java:

* [CLI Usage Guide](https://azure.github.io/appcat-docs/cli/)
* [Rules Development Guide](https://azure.github.io/appcat-docs/rules-development-guide/)

## Discover technology usage without an Azure target in mind

Discovery of technologies is the first stage of application replatform and modernization. During the *discovery* phase, Azure AppCAT scans the application and its components to gain a comprehensive understanding of its structure, architecture, and dependencies. This information is used to create a detailed inventory of the application and its components (see the [Discovery report](#discovery-report) section), which serves as the basis for further analysis and planning.

Use the following command to initiate discovery:

```bash
./appcat-cli \
    --input ./<my-application-source-path or my-application-jar-war-ear-file> \
    --target discovery
```

The discovery phase is useful when you don't have a specific Azure target in mind. Otherwise, AppCAT runs discovery implicitly for any Azure target.

## Assess a Java application for a specific Azure target

The assessment phase is where Azure AppCAT analyzes the application and its components to determine its suitability for replatorming and to identify any potential challenges or limitations. This phase involves analyzing the application code and checking its compliance with the selected Azure target.

To check the available Azure targets, run the following command:

```bash
./appcat-cli --listTargetTechnologies
```

This command produces output similar to the following example:

```output
Available target technologies:
    azure-aks
    azure-appservice
    azure-container-apps
    azure-spring-apps
```

Then, you can run Azure AppCAT using one of the available Azure targets, as shown in the following example:

```bash
./appcat-cli \
    --input ./<my-application-source-path or my-application-jar-war-ear-file> \
    --target azure-appservice
```

## Get results from Azure AppCAT

The outcome of the discovery and assessment phases is a detailed report that provides a roadmap for the replatforming and modernization of the Java application, including recommendations for the Azure service and replatform approach. The report serves as the foundation for the next stages of the replatforming process. It helps organizations learn about the effort required for such transformation, and make decisions about how to modernize their applications for maximum benefits.

The report generated by Azure AppCAT provides a comprehensive overview of the application and its components. You can use this report to gain insights into the structure and dependencies of the application, and to determine its suitability for replatform and modernization.

The following sections provide more information about the report.

### Summary of the analysis

The landing page of the report lists all the technologies that are used in the application. The dashboard provides a summary of the analysis, including the number of transformation incidents, the incidents categories, or the story points.

:::image type="content" source="media/appcat/report-summary.png" alt-text="Screenshot of the AppCAT summary report." lightbox="media/appcat/report-summary.png":::

When you zoom in on the *Incidents by Category* pie chart, you can see the number of incidents by category: *Mandatory*, *Optional*, *Potential*, *Information*.

The dashboard also shows the *story points*. The story points are an abstract metric commonly used in Agile software development to estimate the level of effort needed to implement a feature or change. Azure AppCAT uses story points to express the level of effort needed to migrate a particular application. Story points don't necessarily translate to work hours, but the value should be consistent across tasks.

:::image type="content" source="media/appcat/report-summary-incident.png" alt-text="Screenshot of the AppCAT summary incident report." lightbox="media/appcat/report-summary-incident.png":::

### Discovery report

The discovery report is a report that's generated during the *Discovery Phase*. It shows the list of technologies used by the application in the *Information* category. This report is just informing you about the technology that Azure AppCAT has discovered.

:::image type="content" source="media/appcat/report-discovery.png" alt-text="Screenshot of the AppCAT discovery report." lightbox="media/appcat/report-discovery.png":::

### Assessment report

The assessment report gives an overview of the transformation issues that would need to be solved to migrate the application to Azure.

These *Issues*, also called *Incidents*, have a severity (*Mandatory*, *Optional*, *Potential*, or *Information*), a level of effort, and the number of story points, which is determined by calculating the number of incidents times the effort required to address the issue.

:::image type="content" source="media/appcat/report-assessment.png" alt-text="Screenshot of the AppCAT assessment report." lightbox="media/appcat/report-assessment.png":::

### Detailed information for a specific issue

For each incident, you can get more information (the issue detail, the content of the rule, and so on) just by clicking on it. You also get the list of all the files affected by this incident.

:::image type="content" source="media/appcat/report-assessment-detail.png" alt-text="Screenshot of the AppCAT issue detail report." lightbox="media/appcat/report-assessment-detail.png":::

Then, for each file or class affected by the incident, you can jump into the source code to highlight the line of code that created the issue.

:::image type="content" source="media/appcat/report-assessment-code.png" alt-text="Screenshot of the AppCAT issue code report." lightbox="media/appcat/report-assessment-code.png":::

## Custom rules

You can think of Azure AppCAT as a rule engine. It uses rules to extract files from Java archives, decompiles Java classes, scans and classifies file types, analyzes these files, and builds the reports. In Azure AppCAT, the rules are defined in the form of a ruleset. A ruleset is a collection of individual rules that define specific issues or patterns that Azure AppCAT can detect during the analysis.

These rules are defined in XML and use the following rule pattern:

```
when (condition)
    perform (action)
    otherwise (action)
```

Azure AppCAT provides a comprehensive set of standard migration rules. Because applications may contain custom libraries or components, Azure AppCAT enables you to write your own rules to identify the use of components or software that may not be covered by the existing ruleset.

To write a custom rule, you use a rich domain specific language (DLS) expressed in XML. For example, let's say you want a rule that identifies the use of the PostgreSQL JDBC driver in a Java application and suggests the use of the Azure PostgreSQL Flexible Server instead. You need a rule to find the PostgreSQL JDBC driver defined in a Maven *pom.xml* file or a Gradle file, such as the dependency shown in the following example:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

To detect the use of this dependency, the rule uses the following XML tags:

* `ruleset`: The unique identifier of the ruleset. A ruleset is a collection of rules that are related to a specific technology.
* `targetTechnology`: The technology that the rule targets. In this case, the rule is targeting Azure App Services, Azure Kubernetes Service (AKS), Azure Spring Apps, and Azure Container Apps.
* `rule`: The root element of a single rule.
* `when`: The condition that must be met for the rule to be triggered.
* `perform`: The action to be performed when the rule is triggered.
* `hint`: The message to be displayed in the report, its category (Information, Optional, or Mandatory) and the effort needed to fix the problem, ranging from 1 (easy) to 13 (difficult).

The following XML shows the custom rule definition:

```xml
<ruleset id="azure-postgre-flexible-server"
         xmlns="http://windup.jboss.org/schema/jboss-ruleset"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://windup.jboss.org/schema/jboss-ruleset http://windup.jboss.org/schema/jboss-ruleset/windup-jboss-ruleset.xsd">
    <metadata>
        <description>Recommend Azure PostgreSQL Flexible Server.</description>
        <dependencies>
            <addon id="org.jboss.windup.rules,windup-rules-xml,3.0.0.Final"/>
        </dependencies>
        <targetTechnology id="azure-appservice"/>
        <targetTechnology id="azure-aks"/>
        <targetTechnology id="azure-container-apps"/>
        <targetTechnology id="azure-spring-apps"/>
    </metadata>
    <rules>
        <rule id="azure-postgre-flexible-server">
            <when>
                <project>
                    <artifact groupId="org.postgresql" artifactId="postgresql"/>
                </project>
            </when>
            <perform>
                <hint title="Azure PostgreSQL Flexible Server" category-id="mandatory" effort="7">
                    <message>The application uses PostgreSQL. It is recommended to use Azure PostgreSQL Flexible Server instead.</message>
                    <link title="Azure PostgreSQL Flexible Server documentation" href="https://learn.microsoft.com/azure/postgresql/flexible-server/overview"/>
                </hint>
            </perform>
        </rule>
    </rules>
</ruleset>
```

After executing this rule through Azure AppCAT, rerun the analysis to review the generated report. As with other incidents, the assessment report lists the identified issues and affected files related to this rule.

:::image type="content" source="media/appcat/rule.png" alt-text="Screenshot of the AppCAT with a rule being executed." lightbox="media/appcat/rule.png":::

The complete guide for Rules Development is available at [azure.github.io/appcat-docs/rules-development-guide](https://azure.github.io/appcat-docs/rules-development-guide/).

## License

Azure AppCAT is a free, open source tool at no-cost, and licensed under the [same license as the upstream WindUp project](https://github.com/windup/windup/blob/master/LICENSE).

## Frequently asked questions

Q: Where can I download the latest version of Azure AppCAT from?

You can download Azure AppCAT from [aka.ms/appcat/azure-appcat-cli-latest.zip](https://aka.ms/appcat/azure-appcat-cli-latest.zip).

Q: Where can I find more information about Azure AppCAT?

When you download Azure AppCAT, you get a *docs* directory with all the information you need to get started.

Q: Where can I find the specific Azure rules?

All the Azure rules are available in the [Azure AppCAT Rulesets GitHub repository](https://github.com/azure/appcat-rulesets).

Q: Where can I find more information about creating custom rules?

Visit the [Rules Development Guide](https://azure.github.io/appcat-docs/rules-development-guide/) for Azure AppCAT.

Q: Where can I get some help when creating custom rules?

The best way to get help is to [create an issue on the AppCAT GitHub repository](https://github.com/azure/appcat-rulesets/issues).

---
title: Assess Spring applications with Cloud Suitability Analyzer
description: Shows you how to assess Spring applications with Cloud Suitability Analyzer to evaluate their readiness to migrate to the cloud.
author: KarlErickson
ms.author: yangtony
ms.topic: conceptual
ms.date: 03/24/2023
ms.custom: devx-track-java
---

# Assess Spring applications with Cloud Suitability Analyzer

This guide describes how to assess Spring applications with Cloud Suitability Analyzer (CSA) to evaluate their readiness to migrate to the cloud.

## When should I use Cloud Suitability Analyzer?

Cloud Suitability Analyzer is an open-source tool developed by VMware. You can use it to evaluate your Spring, Spring Boot, and Spring Cloud applications to determine how ready they are for the cloud.

You can download Cloud Suitability Analyzer to your development environment, and then scan your source code for evaluation. All the results are kept on your local environment. The evaluation report gives you an estimate on how much effort is required to migrate your Spring application to the cloud. The report also lists line-of-code level issues rated by importance.

> [!NOTE]
> Use Chrome as the recommended browser if other browsers fail to properly open the Cloud Suitability Analyzer web portal.

## What results can I get from Cloud Suitability Analyzer?

The following sections describe the results produced by Cloud Suitability Analyzer.

### Summary for a group of applications

Cloud Suitability Analyzer estimates the readiness of your Spring applications against cloud platforms by matching patterns against your source code. The tool assigns each issue a raw score based on a set of predefined or customized rules. The tool then calculates a technical score ranging from 0 to 10 for each application based on the sum of raw scores. The more cloud-ready an application is, the higher its technical score.

You can find the list of applications with their respective technical score on the **Summary** page of the evaluation report. The summary page also lists other information such as lines of code and number of files scanned.

Each time you run an evaluation, the tool records a new report. You can use the **Select Run** control on the **Summary** page to view and compare different report versions and to see the progress of your migration effort.

:::image type="content" source="media/cloud-suitability-analyzer/summary.png" alt-text="Screenshot of the Cloud Suitability Analyzer Summary page." lightbox="media/cloud-suitability-analyzer/summary.png":::

### Closer view of one application

For the list of specific line-of-code level issues, you can find a detailed report on the **Application** page. This page lists the issues for each application, and ranks them in importance as "high", "medium", or "low". "High" issues are must-fixes requiring manual effort, "medium" issues are recommended to fix, and "low" issues are merely informational. You can also find the file name, line number, and estimated effort required for each issue in the report.

To see evaluation results for an application, set **Select Run** to the version you want to see, then set **Application** to the application name. On the top part of the **Findings** tab, you can select a group of tags to filter the results and see only the ones you want to focus on.

:::image type="content" source="media/cloud-suitability-analyzer/application.png" alt-text="Screenshot of the Cloud Suitability Analyzer Application page." lightbox="media/cloud-suitability-analyzer/application.png":::

### Detailed information for a specific issue

On the **Application** page, you can select the ID of an issue to see detailed information and suggested actions. This information includes the path of the source code file with the issue found, the pattern matched for the issue, and the rule that describes the pattern and effort score. In the **Advice** section, you can find the specific explanation for the issue found, and the corresponding action suggested.

:::image type="content" source="media/cloud-suitability-analyzer/issue.png" alt-text="Screenshot of the Cloud Suitability Analyzer issue detail page." lightbox="media/cloud-suitability-analyzer/issue.png":::

## How should I use Cloud Suitability Analyzer?

You can run Cloud Suitability Analyzer in three steps: setup, scan, and review.

1. Setup: Download the [Cloud Suitability Analyzer binaries and Azure customized rules](https://aka.ms/azure-csa). You can replace the binaries with the latest version from the VMware [cloud-suitability-analyzer](https://aka.ms/vmware-csa) repository. Extract the package, and you should find the following items in the same directory:

   - `csa-l`: CSA binary for Linux
   - `csa`: CSA binary for macOS
   - `csa.exe`: CSA binary for Windows
   - `rules`: directory containing Azure customized rules
   - `bins.yaml`: required file for customized rules
   - `run-csa-xxx`: OS-specific one-stop script that runs all required CSA commands for the usual scenarios

   > [!NOTE]
   > All the examples in this article use the Linux version of the script and binary. The parameters in the commands are also applicable to Windows and macOS.

1. Scan: Launch the terminal and run the script or the binary with parameters `-p <src_dir>`, as shown in the following examples:

   ```bash
   ./run-csa-linux.sh -p <src_dir>
   ```

   or

   ```bash
   ./csa-l -p <src_dir>
   ```

   The directory `<src_dir>` contains several subdirectories with Spring app source code. This operation scans all these projects in one run and stores the results in a file called *csa.db*. Subsequent scans store the results in the same *csa.db* file.

   :::image type="content" source="media/cloud-suitability-analyzer/terminal-script.png" alt-text="Screenshot showing the Cloud Suitability Analyzer script running in a Bash window." lightbox="media/cloud-suitability-analyzer/terminal-script.png":::

1. Review: When you run the script, it automatically launches the web portal. Alternately, you can use the following command. The web portal shows the **Summary** page by default.

   ```bash
   ./csa-l ui
   ```

## How should I customize the rules?

The following sections describe the rules and how to customize them.

### List rules in effect

On the web portal, the **Rules** page shows all the rules used to match the issues listed on the **Application** page. You can also find details for each rule.

:::image type="content" source="media/cloud-suitability-analyzer/rule.png" alt-text="Screenshot of the Cloud Suitability Analyzer Rule page." lightbox="media/cloud-suitability-analyzer/rule.png":::

The following list shows some of the Azure customized rules:

- Migration to the cloud in general
  - Windows path to Linux path
  - Log destination to STDOUT
  - Local storage to Azure File Share with the SMB/NFS protocol
- JDK upgrade rules
  - Check JDK version
- Spring Boot/Cloud upgrade
  - Check Spring Boot version
  - Check Spring Cloud version
  - Override Eureka client endpoint
  - Override Config client endpoint
  - Remove Zipkin and use Azure Monitor

### Export rules

To edit the rules or write your own rules, first export the current rules to use as base versions that you can modify. To export the rules, use the following command:

```bash
./csa-l rules export --output-dir=<output_dir>
```

When the command returns successfully, the configuration files describing the rules are in the specified output directory.

### Edit rules

You can edit each rule independently with a text editor. You can find the detailed explanation of each field in the user manual available in the [cloud-suitability-analyzer](https://aka.ms/vmware-csa) repository.

:::image type="content" source="media/cloud-suitability-analyzer/rule-file-visual-studio-code.png" alt-text="Screenshot of Visual Studio Code with the rules file opened." lightbox="media/cloud-suitability-analyzer/rule-file-visual-studio-code.png":::

### Import rules

To add your own rules, or remove rules that you don't need, put the rules you want in the same directory and then import that directory. Use the following steps to add or remove rules:

1. Before you import the rules, use the following command to clear the effective rules and start from a clean slate:

   ```bash
   ./csa-l rules delete-all
   ```

1. After you clear the rules, use the following command to import your own set of rules:

   ```bash
   ./csa-l rules import --rules-dir=<input_dir>
   ```

1. Now use the following command to scan the source code again:

   ```bash
   ./csa-l -p <src_dir>
   ```

1. Then, use the following command to view the results:

   ```bash
   ./csa-l ui
   ```

You can now see the **Rules** page updated with your specified set of rules.

To simply this process, we recommend you update the rules directly in the *rules* directory of the [azure-spring-suitability-rules](https://aka.ms/azure-csa) project, and then use the following command to run the script:

```bash
./run-csa-linux.sh -p <src_dir>
```

This command automatically reloads the rules, rescans the source code, and then launches the web portal.

## Target platforms for migration

There are multiple hosting platforms on Azure that can host your Spring applications. For more information, see [Compare Java application hosting options on Azure](/azure/architecture/guide/technology-choices/service-for-java-comparison).

Azure Spring Apps is a fully managed service for Spring developers. With Azure Spring Apps, you can focus on your code and manage the apps with out-of-box monitoring, service discovery, configuration management, CI/CD integration, blue-green deployment, and more. For more information, see [Migrate Spring Cloud Applications to Azure Spring Apps](migrate-spring-cloud-to-azure-spring-apps.md). Many of the steps in the premigration and migration phases are already covered in [the Azure customized rules for Cloud Suitability Analyzer](https://aka.ms/azure-csa).

## Next steps

For more information, see the user manual in the [cloud-suitability-analyzer](https://aka.ms/vmware-csa) repository.

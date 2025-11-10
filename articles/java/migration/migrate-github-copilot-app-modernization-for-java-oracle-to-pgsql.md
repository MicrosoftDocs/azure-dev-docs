---
title: Migrate from Oracle to PostgreSQL
titleSuffix: Azure
description: Provides instructions to guide customers to migrate from Oracle to PostgreSQL database.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 09/23/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Migrate from Oracle to PostgreSQL

In aspect of app code change relating to DB migration scenarios, GitHub Copilot app modernization has already provided a list of predefined tasks to support you on homogeneous migration: from PostgreSQL, SQL Server, MySQL, Cassandra, MongoDB, etc. to corresponding Azure Database offering, as well as on heterogeneous migration: from Oracle to Azure PostgreSQL. The tasks mainly help you prepare your codebase for Managed Identity authentication to the Azure databases. 

Another important factor to consider during database migration is SQL dialect conversion, which encompasses both static and dynamic SQL present in application code. For homogeneous migrations, SQL conversion is typically unnecessary since the database type remains the same. However, in heterogeneous migrations—such as transitioning from Oracle to PostgreSQL—the process of converting SQL can be complex and requires considerable effort. We aim to invest resources in this area to better support you customers and streamline your migration experience.
We are now offering two significant advancements for Oracle to PostgreSQL migration scenario jointly with Azure PostgreSQL team:
1.	AI-Powered Database Migration tooling: a brand-new PostgreSQL tooling powered by AI that can efficiently manage the database migration process from Oracle to PostgreSQL, thereby reducing manual intervention and minimizing the risk of errors.
2.	Smart SQL Conversion in app code: To support necessary application code changes, we offer built-in SQL conversion functionality in GitHub Copilot app modernization, seamlessly integrated as part of a unified task workflow.
## DB Migration with AI-Powered Database Migration tooling
To understand how to install and use the AI-Powered Database Migration tooling for DB migration, you may directly refer to [this official Azure PostgreSQL document](https://aka.ms/oracle2pgsql-doc). 
## DB related app code change with Smart SQL Conversion
GitHub Copilot app modernization now provides a dedicated migration task designed to address both the database client update (use Managed Identity authentication) and SQL conversion required for the Oracle to PostgreSQL migration scenario. A key feature is the ability to leverage coding notes, which detail schema changes for the database migration. By incorporating these notes during the migration task, GitHub Copilot app modernization can generate high quality SQL conversions tailored to the specific changes in your schema.
Step-by-Step guidance as below:
1.	Run Application Assessment: follow [Quickstart: Assess and Migrate a Java Project Using GitHub Copilot app modernization](https://learn.microsoft.com/en-us/azure/developer/java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate)
2.	Review Assessment Report: After the assessment completes, review the generated report. If your application uses Oracle, then an Oracle-related issue “Database Migration (Oracle)” should be revealed in the report and accordingly “Migrate from Oracle DB to PostgreSQL” will be the default solution there.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/oracle-pgsql-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/oracle-pgsql-report.png" alt-text="Screenshot of Visual Studio Code showing the GitHub Copilot app modernization assessment report.":::

3.	Make sure the coding notes is placed properly in your app code folder. You may refer to [this PostgreSQL official doc](https://aka.ms/oracle2pgsql-doc-codingnotes) to understand more about what is coding notes and where to get it to facilitate the consumption on GHCP App modernization side. 
4.	Execute Migration Task: Next, click "Run Task" to execute the migration. If coding notes have been properly placed, App Mod will reference these notes to produce a high quality SQL conversion as well as the database client update (use Managed Identity authentication). Otherwise, the conversion will apply general Oracle-to-PostgreSQL syntax adjustments to propose changes.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/oracle-pgsql-coding-notes.jpg" lightbox="./media/migrate-github-copilot-app-modernization-for-java/oracle-pgsql-coding-notes.jpg" alt-text="Screenshot of Visual Studio Code showing the GitHub Copilot app modernization task execution for oracle to postgresql.":::


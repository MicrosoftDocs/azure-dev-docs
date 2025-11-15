---
title: Migrate from Oracle to PostgreSQL
titleSuffix: Azure
description: Provides instructions to guide customers to migrate from Oracle to PostgreSQL database.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 11/18/2025
ms.custom: devx-track-java
ms.subservice: migration-copilot
---

# Migrate from Oracle to PostgreSQL

In aspect of app code change relating to DB migration scenarios, GitHub Copilot app modernization has already provided a list of predefined tasks to support you on homogeneous migration: from PostgreSQL, SQL Server, MySQL, Cassandra, MongoDB, etc. to corresponding Azure Database offering, as well as on heterogeneous migration: from Oracle to Azure PostgreSQL. The tasks mainly help you prepare your codebase for Managed Identity authentication to the Azure databases.

Another important factor to consider during database migration is SQL dialect conversion, which encompasses both static and dynamic SQL present in application code. For homogeneous migrations, SQL conversion is typically unnecessary since the database type remains the same. However, in heterogeneous migrations—such as transitioning from Oracle to PostgreSQL—the process of converting SQL can be complex and requires considerable effort. We aim to invest resources in this area to better support you customers and streamline your migration experience.

We are now offering two significant advancements for Oracle to PostgreSQL migration scenario jointly with Azure PostgreSQL team:

1. AI-Powered Database Migration tooling: a brand-new PostgreSQL tooling powered by AI that can efficiently manage the database migration process from Oracle to PostgreSQL, thereby reducing manual intervention and minimizing the risk of errors.

1. Smart SQL Conversion in app code: To support necessary application code changes, we offer built-in SQL conversion functionality in GitHub Copilot app modernization, seamlessly integrated as part of a unified task workflow.

## DB Migration with AI-Powered Database Migration tooling

To understand how to install and use the AI-Powered Database Migration tooling - PostgreSQL Visual Studio Code extension for DB migration, you may directly refer to [this official Azure PostgreSQL document](/azure/postgresql/extensions/vs-code-extension/overview).

## DB related app code change with Smart SQL Conversion

GitHub Copilot app modernization now provides a dedicated migration task designed to address both the database client update (use Managed Identity authentication) and SQL conversion required for the Oracle to PostgreSQL migration scenario.

A key feature is the ability to leverage coding notes, which detail schema changes for the database migration and can be used optionally to produce more precise and semantically aligned PostgreSQL-compatible code. Coding notes are metadata artifacts automatically generated during the database schema conversion phase using [PostgreSQL Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql). Coding notes might include information such as: Data type mappings and structural changes; Conversion details for sequences, identities, and composite types; adjustments to date/time or interval implementations; references to tables with referential integrity constraints; summaries of complex Oracle packages, including procedure and function signatures; and additional AI-generated hints to improve code translation accuracy.

Step-by-Step guidance as below:

1. To run the application assessment, follow the instructions in [Quickstart: Assess and Migrate a Java Project Using GitHub Copilot app modernization](migrate-github-copilot-app-modernization-for-java-quickstart-assess-migrate.md).

1. After the assessment completes, review the generated report. If your application uses Oracle, then an Oracle-related issue "Database Migration (Oracle)" is revealed in the report and "Migrate from Oracle DB to PostgreSQL" is the default solution there.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/oracle-postgresql-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/oracle-postgresql-report.png" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization assessment report.":::

1. Optionally, you can get the coding notes placed properly in your app code folder. Check whether `coding_notes.md` is present in the `.github\postgre-migrations\*\results\application_guidance\` folder. If it isn't, go to your database team responsible for your Oracle to PostgreSQL migration to get it if possible, and put it into the same folder structure.

1. Execute Migration Task: Next, select **Run Task** to execute the migration. If coding notes have been properly placed, app modernization references these notes to produce a higher quality SQL conversion as well as the database client update (use Managed Identity authentication). Otherwise, the conversion applies general Oracle-to-PostgreSQL syntax adjustments to propose changes.

   :::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/oracle-postgresql-coding-notes.jpg" lightbox="./media/migrate-github-copilot-app-modernization-for-java/oracle-postgresql-coding-notes.jpg" alt-text="Screenshot of Visual Studio Code that shows the GitHub Copilot app modernization task execution for Oracle to PostgreSQL.":::

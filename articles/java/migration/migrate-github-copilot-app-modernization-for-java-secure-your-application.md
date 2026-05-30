---
title: "Secure Your Java Applications with GitHub Copilot Modernization"
titleSuffix: Azure
description: Scan and resolve security issues in your Java application — ISO 5055-guided CWE findings and CVE vulnerabilities — using GitHub Copilot modernization in Visual Studio Code.
author: KarlErickson
ms.author: karler
ms.reviewer: haozhan
ms.topic: how-to
ms.date: 06/02/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Secure your Java applications with GitHub Copilot modernization

Modernizing your Java application is not a one-time event. New CVEs are published every day, new CWE findings surface as your code evolves, and dependencies drift out of compliance. Keeping the application secure means **continuously detecting and fixing security debt** — the evergreen way to think about application security.

GitHub Copilot modernization helps you do this with two capabilities:

- **Security assessment** — scans your code for **CWE findings guided by ISO/IEC 5055** and for **CVE vulnerabilities** in your direct and transitive dependencies.
- **Code remediation** — generates an execution plan to fix the selected issues and applies the fixes for you.

These capabilities are available in:

- **Visual Studio Code** — interactive scan and fix, covered in this article.
- **Modernize CLI** — security is one of the assessment domains in [batch assessment](../../github-copilot-app-modernization/modernization-agent/batch-assess.md), so you can scan a portfolio of applications in a single run.

## Scan and resolve security issues in Visual Studio Code

Follow these steps to assess and remediate security issues in one flow.

### 1. Start the security scan

In the **GitHub Copilot modernization** pane, open the **Quick Start** view and select **Scan & Resolve Security Issues**.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/scan-resolve-security-issue.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/scan-resolve-security-issue.png" alt-text="Screenshot of Visual Studio Code that shows the Quick Start view with the Scan and Resolve Security Issues button.":::

Copilot runs a security-domain assessment over your project. The scan covers:

- A curated set of **CWE rules aligned with ISO/IEC 5055**, grouped into six categories: **File & Path Security**, **Injection Attacks**, **Memory Safety**, **Code Quality**, **Credentials & Secrets**, and **Concurrency & Synchronization**.
- **CVE findings** in your **direct and transitive** dependencies, sourced from the **GitHub Security Advisories** database.

For the full catalog of CWE rules and the details of CVE coverage, see [Understand assessment coverage](migrate-github-copilot-app-modernization-for-java-assess-rules.md#domain-security-iso-5055-guided).

> [!NOTE]
> CVE checks work without GitHub authentication, but anonymous calls are rate-limited. For large projects, sign in with `gh auth login` to avoid throttling.

### 2. Review the report

When the scan finishes, the **Assessment Report** opens with the security findings.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/security-assess-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/security-assess-report.png" alt-text="Screenshot of the Assessment Report in Visual Studio Code showing CWE and CVE findings.":::

To control which CVEs surface, set **Security: Minimum CVE Severity** in the assessment configuration. Accepted values are `critical`, `high`, `medium`, and `low`; the default is `high`.

### 3. Pick the issues to fix and create a plan

Select the issue categories you want to remediate. The action button updates to show the count — for example, **Create Plan (3)**. Select it to generate an execution plan.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/Create-plan-on-report.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/Create-plan-on-report.png" alt-text="Screenshot of the Assessment Report with security issue categories selected and the Create Plan button highlighted.":::

### 4. Review the plan

Copilot writes the execution plan as a Markdown file and opens it in the preview pane so you can read it before any fix is applied. The plan describes how Copilot will group and address the selected issues — CVE issues are grouped by dependency, and CWE findings are grouped by file. Edit the Markdown file directly if you want to change scope or order.

:::image type="content" source="./media/migrate-github-copilot-app-modernization-for-java/preview-created-plan.png" lightbox="./media/migrate-github-copilot-app-modernization-for-java/preview-created-plan.png" alt-text="Screenshot of the security execution plan opened in the Visual Studio Code Markdown preview.":::

### 5. Execute the plan

When you're satisfied with the plan, tell Copilot in the chat to execute it. Copilot resolves the selected issues group by group, builds the project to validate each change, and reports progress in the chat. Review the resulting diffs and commit the changes you want to keep.

## Stay evergreen

Security debt reappears as new CVEs are published and as your application changes. Re-run **Scan & Resolve Security Issues** as part of your regular modernization cadence — for example, on every release branch — so issues are caught and remediated continuously instead of accumulating into a Big Upgrade.

## Next step

- [Understand assessment coverage](migrate-github-copilot-app-modernization-for-java-assess-rules.md) — full catalog of CWE rules and CVE coverage details.
- [Working with assessment](migrate-github-copilot-app-modernization-for-java-working-with-assessment.md)
- [Batch assessment with the GitHub Copilot modernization agent](../../github-copilot-app-modernization/modernization-agent/batch-assess.md)

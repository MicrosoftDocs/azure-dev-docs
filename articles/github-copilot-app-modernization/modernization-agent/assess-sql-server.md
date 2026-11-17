---
title: Assess SQL Server Migration Readiness with the Modernize CLI
titleSuffix: GitHub Copilot Modernization Agent
description: Assess local or on-premises SQL Server migration readiness for Azure SQL Database Hyperscale with the Modernize CLI public preview.
author: puichan
ms.author: puichan
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 11/06/2026
---

# Assess SQL Server migration readiness with the Modernize CLI (preview)

Use the Modernize CLI to assess local or on-premises SQL Server dependencies as part of an end-to-end application and database modernization journey. The assessment evaluates migration readiness for **Azure SQL Database Hyperscale**, and it identifies compatibility issues and the effort needed to modernize the workload.

The CLI can discover SQL Server endpoints from application configuration or assess an instance that you specify. You can also request sizing recommendations from existing performance data.

Azure SQL Managed Instance and SQL Server on Azure Virtual Machines remain alternative migration paths when you choose those targets based on your workload requirements.

> [!IMPORTANT]
> SQL Server assessment in the Modernize CLI is in public preview. This workflow assesses readiness; it doesn't migrate databases, provision Azure resources, or collect new performance data. Run it locally on Windows, not through cloud agent delegation.

## Prerequisites

- The [Modernize CLI](quickstart.md#install-the-modernization-agent) and its [GitHub authentication prerequisites](quickstart.md#prerequisites).
- A local application checkout with SQL Server dependencies.
- A Windows machine that can reach the source SQL Server.
- PowerShell 7.
- Azure CLI version 2.75.0 or later, with the `datamigration` extension already installed. See [Install the Azure CLI](/cli/azure/install-azure-cli).
- An existing identity or protected connection configuration with permission to assess the source SQL Server.

The SQL Server assessment skill downloads the [SQL assessment package](https://aka.ms/sqlassessmentpackage); you don't need to download it separately.

Prepare the other required tools, extensions, credentials, and network access before starting. The assessment doesn't sign you in. Linux and macOS aren't supported for this SQL Server workflow, even though the Modernize CLI supports those platforms for other scenarios.

## Assess application SQL Server dependencies

Database assessment runs as an additional assessment skill with **Full analysis**. The default **Issue only** setting doesn't run it.

### Interactive mode (TUI)

1. From your application directory, run the modernization agent:

   ```powershell
   modernize
   ```

1. Select **Assess** from the main menu.
1. Select **Current folder** to assess your application, or **Manual input** to enter a local application path.
1. Select the assessment domains relevant to your application and continue to the assessment configuration.
1. Under **General / Analysis Coverage**, select **Full analysis**, and then select **Continue**.
1. Select **Assess locally**. SQL Server assessment requires a Windows machine with access to the source SQL Server.
1. Enter an output path or accept the default, and start the assessment.

The CLI uses repository evidence to select applicable database assessment skills. For more information about the interactive screens, see [Batch assessment: Interactive mode](batch-assess.md#interactive-mode-assess-locally).

### Headless mode

Create an assessment configuration file, such as `C:\configs\database-assessment.yml`, with the following setting:

```yaml
analysisCoverage: full
```

Merge this setting with any existing configuration rather than replacing other assessment settings. Pass the file to `--assess-config` as shown in the following command, replacing the source, configuration, and output paths with your own:

```powershell
modernize assess `
  --source C:\src\sql-app `
  --assess-config C:\configs\database-assessment.yml `
  --output-path C:\reports\sql-app `
  --format markdown `
  --delegate local `
  --no-tty `
  --prompt 'Assess local or on-premises SQL Server dependencies for migration readiness to Azure SQL.'
```

Alternatively, update an existing user-level `assessment-config.yaml` file at `%USERPROFILE%\.modernize\assessment-config.yaml` by setting `analysisCoverage: full`. If you use that file, omit `--assess-config` from the command. An explicit `--assess-config` path takes precedence over the user-level file.

> [!NOTE]
> The optional `--prompt` supplies context to additional database assessment skills. It doesn't change the Modernize CLI's built-in AI analysis. The CLI selects applicable skills from repository evidence and this optional context; a SQL Server mention in a README alone doesn't establish applicability.

### SQL Server target discovery

When you don't supply an instance, the SQL assessment resolves concrete endpoints from supported application settings, including connection settings and referenced environment variables. It doesn't execute application code to resolve dynamic settings. It assesses each distinct resolved endpoint rather than only the first one.

Available application credentials are resolved inside the local execution process. If no supported credentials are available, the workflow uses the current Windows identity. A failed supplied credential doesn't trigger a retry with a different authentication method.

If discovery can't resolve an endpoint, specify an instance explicitly.

### Specify a SQL Server instance

Use non-secret selectors in the assessment context:

```powershell
modernize assess `
  --source C:\src\sql-app `
  --assess-config C:\configs\database-assessment.yml `
  --output-path C:\reports\sql-app `
  --format markdown `
  --delegate local `
  --no-tty `
  --prompt 'Assess local SQL Server migration readiness. instanceName=localhost; authMode=Windows.'
```

Replace `localhost` with the source SQL Server data source, including its named instance or port if needed. An explicit `instanceName` restricts the assessment target; it isn't a connection string or an Azure Arc resource ID.

`instanceName`, `authMode`, and the other selectors in this article are assessment context, not new CLI flags. Don't use flags such as `--instanceName`.

### Choose an existing authentication source

For an explicitly selected instance, omitting both `authMode` and `configFilePath` uses the current Windows identity when a new assessment is needed. You can instead provide one of these authentication selections in the context:

| Authentication selection | Additional non-secret context | Prerequisite |
| --- | --- | --- |
| `authMode=Windows` | None | Current Windows identity has SQL Server access. |
| `authMode=EntraDefault` | None | A working noninteractive Microsoft Entra credential chain supported by the installed assessment tool. |
| `authMode=ConfigFile` | `configFilePath` | An absolute path to an existing protected assessment configuration file. |
| `authMode=KeyVault` | `sqlUserName`, `keyVaultName`, and `secretName` | An existing Azure session authorized to read the SQL-password secret. |
| `authMode=CredentialManager` | `credentialTarget` | The required credential module and an existing entry containing the SQL username and password. |

Explicit authentication selectors take precedence over discovered application credentials. Missing or conflicting selectors stop the workflow rather than silently selecting another mode.

> [!IMPORTANT]
> Don't put passwords, tokens, or connection strings in `--prompt`, command arguments, or source-controlled assessment configuration. Use an existing protected credential source. Azure sign-in isn't required just to use Windows-integrated SQL authentication.

## Request sizing from existing performance data

To request SKU recommendations along with readiness, add `skuRecommendation=true` and an absolute `performanceDataPath` for completed performance data from the same instance:

```powershell
modernize assess `
  --source C:\src\sql-app `
  --assess-config C:\configs\database-assessment.yml `
  --output-path C:\reports\sql-app `
  --format markdown `
  --delegate local `
  --no-tty `
  --prompt 'Assess local SQL Server migration readiness. instanceName=localhost; authMode=Windows; skuRecommendation=true; performanceDataPath=C:\sql-performance.'
```

The supporting sizing workflow uses existing instance-specific performance CSVs. It doesn't connect to SQL Server or collect new measurements. Requests to start collection or specify a collection duration aren't supported.

Use **Markdown** when you need readiness and the complete requested SKU recommendations in the published report. HTML publication preserves the native readiness HTML and doesn't include separately generated SKU results. Supporting SKU artifacts remain in the invocation directory rather than being copied into the published report.

## Review results

Open the generated application assessment report and follow its database assessment link. The published SQL report is under the current repository report's `externals\evaluate-offline-sql-migration-readiness` directory, with `index.md` or `index.html` matching your requested format.

Review compatibility findings for Azure SQL Database Hyperscale. If you're considering Azure SQL Managed Instance or SQL Server on Azure Virtual Machines as an alternative, review the relevant target-specific findings before choosing a migration approach. Readiness findings aren't proof that migration or production validation is complete.

The workflow can reuse matching results in the current invocation's output directory and displays their generation time. If you need a new assessment, explicitly request a fresh assessment or refresh in the context. Unreadable or ambiguous results aren't treated as permission to overwrite them.

For multiple discovered instances, the published report includes results only after every target completes. If requested sizing fails, the combined readiness-and-sizing request isn't published as completed, even when readiness artifacts exist.

## Troubleshoot assessment

| Diagnostic | Action |
| --- | --- |
| `UNSUPPORTED_HOST` | Run locally on a Windows machine that can reach SQL Server. |
| `PREREQUISITE_REQUIRED` | Prepare the missing tool, extension, package, or required execution context outside the assessment, then rerun. |
| `MISSING_PARAMETERS` | Supply a concrete `instanceName` when discovery can't resolve a target, or complete the explicitly selected authentication inputs. |
| `UNSUPPORTED_SCOPE` | Use a local or on-premises SQL Server source. This workflow doesn't assess existing Azure SQL endpoints or infer local connections from Arc resource names. |
| `COLLECTION_NOT_SUPPORTED` | Remove new-data collection requests. For sizing, supply completed performance data from the same instance. |

For connection or authentication failures, verify reachability and the selected identity outside the assessment. Don't work around failures by placing credentials in the prompt.

## Related content

- [Batch assessment](batch-assess.md)
- [Migrate Oracle-dependent applications to PostgreSQL](migrate-oracle-to-postgresql.md)
- [Modernize CLI command reference](cli-commands.md)

---
title: Migrate Oracle-Dependent Apps to PostgreSQL with the Modernize CLI
titleSuffix: GitHub Copilot Modernization Agent
description: Assess and convert Oracle-dependent Java and .NET application code to PostgreSQL with the Modernize CLI public preview, using optional DDL exports and isolated validation.
author: puichan
ms.author: puichan
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 10/27/2026
---

# Migrate Oracle-dependent applications to PostgreSQL with the Modernize CLI (preview)

Use the Modernize CLI to assess Oracle-dependent application code and create a plan to convert it to PostgreSQL. The workflow supports Java and .NET applications, using application source and optional exported database definitions instead of a connection to a live target database.

> [!IMPORTANT]
> Oracle-to-PostgreSQL application migration in the Modernize CLI is in public preview. This workflow changes application code; it doesn't migrate database servers or customer data, deploy cloud infrastructure, or establish production readiness. Use local execution for the workflow in this article.

## Supported scenarios

The assessment identifies active Oracle dependencies in application providers, configuration, SQL, ORM mappings, sequences, and routine calls. Language-specific conversion skills address:

| Application | Examples of conversion scope |
| --- | --- |
| Java | Oracle JDBC, JPA/Hibernate mappings, SQL, sequences, routine contracts, tests, and driver packaging. |
| .NET | Oracle.DataAccess and Oracle.ManagedDataAccess, ADO.NET, Dapper, EF/EF Core mappings, SQL, routine contracts, Npgsql, tests, and publish outputs. |

The workflow doesn't apply to PostgreSQL-only applications, non-Oracle source migrations, or database-server assessment. The workflow targets Oracle dependencies used by application code or configuration. Oracle references found only in documentation, or an unused Oracle library, aren't sufficient to identify a migration target.

This source-based workflow supports Java and .NET applications and can use optional PostgreSQL DDL exports to inform conversion. It doesn't require a live database connection or application downtime, and it doesn't automatically add Azure managed identity or change your application's authentication policy. The separate [Oracle-to-PostgreSQL Java migration experience](../../java/migration/migrate-github-copilot-app-modernization-for-java-oracle-to-postgresql.md) provides a Java migration task that updates database clients for managed identity authentication and converts SQL, optionally using coding notes generated during database schema conversion.

## Prerequisites

- The [Modernize CLI](quickstart.md#install-the-modernization-agent) and its [GitHub authentication prerequisites](quickstart.md#prerequisites).
- A local checkout of an Oracle-dependent Java or .NET application.
- **Node.js 22 or later** available as `node` on your `PATH`. This requirement is for the migration helpers; the Modernize CLI's bundled runtime doesn't replace it. No npm runtime packages are required.
- For conversion, the application's JDK and build tools, or its .NET SDK and build tools.
- For PostgreSQL runtime validation, a running Docker engine that can run disposable local PostgreSQL containers.
- A committed application baseline on an attached Git branch before source conversion.

The assessment doesn't build or test the application, run Docker, connect to a database, or change application source. Prepare dependencies before running; the assessment doesn't install tools or authenticate interactively.

## Provide optional database definitions

You can assess and convert from application code alone. To provide target schema contracts, add this optional file in the application repository at `.github\modernize\oracle-postgres.json`:

```json
{
  "postgres-ddl-folder": "database\\postgres",
  "options": ["tests"]
}
```

Merge these settings with any existing configuration rather than replacing it.

| Setting | Purpose |
| --- | --- |
| `postgres-ddl-folder` | Read-only PostgreSQL DDL exports, as per-object files or schema-only dumps. |
| `oracle-ddl-folder` | Optional, separate original Oracle definitions to help preserve source behavior. |
| `oracle-schema` | Exact Oracle schema selector when an Oracle DDL folder is supplied. |
| `options` | Conversion actions to explicitly enable, as described in the following table. |

| Option | Purpose |
| --- | --- |
| `tests` | Enables baseline support, test generation, and broken-test repair. |

Conversion actions must be explicitly enabled. Omitted actions remain off.

All settings and the configuration file itself are optional. Relative paths resolve from the application root. Omit a DDL setting for code-only operation; an explicitly supplied missing, empty, or invalid folder is an error, not a fallback to code-only assessment.

Use dedicated, schema-only UTF-8 export folders. Don't include customer data, filesystem links, or executable SQL-client includes. Supported PostgreSQL file extensions are `.sql`, `.ddl`, `.psql`, `.pgsql`, `.fnc`, `.prc`, `.vw`, and `.trg`. Text and Markdown notes are ignored. Object identity comes from DDL declarations, not filenames.

DDL snapshots describe exported contracts, not the current contents or privileges of a live database. An object absent from an export isn't proven absent from the live database. Review ambiguous routine overloads and unsupported constructs explicitly.

Don't add credentials or live connection profiles to this configuration. Persistent target writes and options such as `create-persistent-ddl` and `test-target-writes` aren't supported. DDL paths are repository settings, not new `modernize assess` command-line flags.

## Assess application readiness

**Full analysis** is required for the additional database assessment skill. The default **Issue only** setting doesn't run it.

### Interactive mode (TUI)

1. From your application directory, run the modernization agent:

   ```powershell
   modernize
   ```

1. Select **Assess** from the main menu.
1. Select **Current folder** to assess your application, or **Manual input** to enter a local application path.
1. Select the assessment domains relevant to your application and continue to the assessment configuration.
1. Under **General / Analysis Coverage**, select **Full analysis**, and then select **Continue**.
1. Select **Assess locally**.
1. Enter an output path or accept the default, and start the assessment.

The CLI uses repository evidence to select the Oracle-to-PostgreSQL application assessment when it applies. For more information about the interactive screens, see [Batch assessment: Interactive mode](batch-assess.md#interactive-mode-assess-locally).

### Headless mode

Create an assessment configuration file, such as `C:\configs\database-assessment.yml`, with the following setting:

```yaml
analysisCoverage: full
```

Merge this setting with any existing configuration rather than replacing other assessment settings. Pass the file to `--assess-config` as shown in the following command, replacing the source, configuration, and output paths with your own:

```powershell
modernize assess `
  --source C:\src\oracle-app `
  --assess-config C:\configs\database-assessment.yml `
  --output-path C:\reports\oracle-app `
  --format markdown `
  --delegate local `
  --no-tty `
  --prompt 'Assess Oracle-to-PostgreSQL application-code migration readiness.'
```

Alternatively, on Windows, update an existing user-level `assessment-config.yaml` file at `%USERPROFILE%\.modernize\assessment-config.yaml` by setting `analysisCoverage: full`. If you use that file, omit `--assess-config` from the command. An explicit `--assess-config` path takes precedence over the user-level file.

> [!NOTE]
> The optional `--prompt` describes your goal or scope for additional database assessment skills. It doesn't change the Modernize CLI's built-in AI analysis. Use the repository configuration for DDL paths and conversion options; the prompt doesn't configure those settings.
>
> You can omit `--prompt`. With **Full analysis** enabled, the CLI uses repository evidence to select the Oracle-to-PostgreSQL application assessment when applicable. The assessment evaluates migration readiness; it doesn't convert application code. Conversion runs separately during plan execution.

### Review the assessment report

Open the generated application report and follow **Oracle to PostgreSQL App Readiness**. The external report is published under the current repository report's `externals\oracle-to-postgresql-app-assessment` directory as a self-contained `index.md` or `index.html`.

The assessment performs bounded, read-only static inspection. A completed report means report generation completed, not that application conversion or runtime validation passed.

- If the assessment doesn't find active Oracle application usage, the workflow skips the assessment rather than manufacturing a migration report.
- If the assessment is incomplete, review the reported scope limitations before planning conversion.
- If you supply invalid DDL, correct it and rerun rather than assuming a code-only result.

Assessment doesn't automatically create conversion tasks. Create and review a modernization plan next.

## Create a conversion plan

Start with a disposable, committed sample or test branch. Use a request that distinguishes isolated local validation from prohibited access to customer databases:

```powershell
$request = @'
Migrate this Oracle-dependent Java application to PostgreSQL using the offline
application adapter and the optional repository DDL and test configuration.
Allow disposable task-owned local PostgreSQL Docker containers for validation
of real application JDBC and ORM paths with synthetic data and cleanup.
Do not access customer or production databases, deploy cloud infrastructure,
change authentication policy, or perform unrelated framework upgrades.
'@

modernize plan create $request `
  --source C:\src\oracle-app `
  --language java `
  --plan-name oracle-postgres `
  --assess-file-path C:\reports\oracle-app\reports\report-<id>\index.md `
  --delegate local `
  --no-tty
```

Replace the `--assess-file-path` value with the actual application assessment report path printed by your assessment run, including any repository and versioned report directories. Don't copy the placeholder `<id>` literally.

For more planning options, see [Modernize CLI command reference: plan create](cli-commands.md#plan-create).

For a .NET application, change the request to describe the .NET application and its ADO.NET or ORM paths, and use `--language dotnet`.

Before execution, review the generated plan and task list:

- For Java, confirm that the conversion task uses `migration-oracle-to-postgresql-app-java`.
- For .NET, confirm that it uses `migration-oracle-to-postgresql-app-dotnet`.
- Keep conversion within the intended application boundary and preserve unrelated providers and public behavior.
- Permit task-owned local PostgreSQL Docker validation. Don't impose a mock-only restriction or confuse local test containers with cloud deployment.
- Review baseline, build, test, packaging, and cleanup requirements.

The existing Java `migration-oracle-to-postgresql` skill is a different workflow. Don't substitute it for the offline application adapter.

## Execute and validate

After reviewing the plan, run:

```powershell
modernize plan execute `
  --source C:\src\oracle-app `
  --language java `
  --plan-name oracle-postgres `
  --delegate local `
  --no-tty
```

Use `--language dotnet` for the .NET plan. The Modernize CLI manages task ordering, progress, branches, and commits.

Conversion uses application evidence to update providers, configuration, SQL, mappings, routine contracts, and packaging within the reviewed scope. It doesn't make unrelated architecture, framework, or authentication changes.

Runtime validation uses real application database-access paths against disposable task-owned PostgreSQL containers with synthetic data, assertions, and cleanup. Compilation and mocks alone don't prove PostgreSQL compatibility.

If Docker isn't available, dependent validation remains incomplete. The workflow doesn't install Docker or start Docker Desktop by default. Starting an installed Docker Desktop requires the explicit `start-docker-desktop` option in the repository configuration.

### Interpret conversion outcomes

Review task evidence under the plan work folder at `oracle-postgres\<task-id>`, including `conversion-report.md` and `conversion-state.json`. Check changed files, finding dispositions, native test results, packaging, Docker fixture cleanup, and remaining actions.

| Outcome | Meaning |
| --- | --- |
| `RUNTIME_VALIDATION_NEEDED` | The strongest offline conversion outcome. Customer target validation and production-readiness checks are still required, even when isolated Docker tests pass. |
| `PARTIAL` | Required behavior is deferred, or required validation failed or couldn't run. Don't treat this outcome as a completed migration. |

Neither outcome means production `READY`. Validate deployment-specific schema, privileges, authentication, representative workloads, and operational behavior in your own controlled environment before production rollout. Migrating database data and provisioning a target service are separate activities.

## Related content

- [Assess SQL Server migration readiness](assess-sql-server.md)
- [Batch assessment](batch-assess.md)
- [Modernize CLI command reference](cli-commands.md)

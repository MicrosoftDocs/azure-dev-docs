---
title: CI/CD Integration with Modernize CLI
titleSuffix: GitHub Copilot Modernization Agent
description: Learn how to integrate the GitHub Copilot modernization agent into CI/CD pipelines using GitHub Actions and Azure Pipelines for automated application modernization.
author: KarlErickson
ms.author: karler
ms.reviewer: jessiehuang
ms.topic: how-to
ai-usage: ai-assisted
ms.date: 03/11/2026
---

# CI/CD integration with Modernize CLI

Integrate the Modernize CLI into your CI/CD pipelines to automate application modernization at scale. This article shows you how to configure both GitHub Actions and Azure Pipelines to run the Modernize CLI on a schedule or on demand.

Running the Modernize CLI in a CI/CD pipeline enables you to:

- **Automate upgrades** on a recurring schedule without manual intervention.
- **Standardize modernization workflows** across your organization.
- **Track changes** through dedicated branches and build artifacts.
- **Review results** through pull requests, build summaries, and logs.

The sample pipelines in this article perform the following steps:

1. Download and install the latest Modernize CLI.
1. Run `modernize upgrade` with a configurable target (for example, `Java 21`).
1. Commit any resulting changes and push them to a dedicated branch.
1. Publish a results summary and upload CLI logs as build artifacts.

## Prerequisites

### [GitHub Actions](#tab/github-actions)

- **A GitHub Copilot subscription**: Free, Pro, Pro+, Business, or Enterprise plan. See [Copilot plans](https://github.com/features/copilot/plans).
- **A GitHub Personal Access Token (PAT)**: Create a token and store it as a repository secret named `GH_TOKEN`. See [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

### [Azure Pipelines](#tab/azure-pipelines)

- **A GitHub Copilot subscription**: Free, Pro, Pro+, Business, or Enterprise plan. See [Copilot plans](https://github.com/features/copilot/plans).
- **Permissions to create Azure Pipelines**: See [About permissions and security groups](/azure/devops/organizations/security/about-permissions).
- **Build service permissions**: The pipeline's build service identity needs permissions to write to the repository. See [Run Git commands in a script](/azure/devops/pipelines/scripts/git-commands).
  - Go to **Project Settings** > **Repositories**.
  - Select the target repository and then select the **Security** tab.
  - Search for the build service identity (for example, `Project Collection Build Service (<Organization>)`).
  - Set the following permissions to **Allow**:
    - **Create branch**
    - **Contribute**
    - **Read**
- **A GitHub Personal Access Token (PAT)**: Create a token and store it as a pipeline variable named `GH_TOKEN`. See [Managing your personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and [Define variables](/azure/devops/pipelines/process/variables).

---

## Configure the pipeline

### [GitHub Actions](#tab/github-actions)

Create a workflow file at `.github/workflows/modernize.yml` in your repository with the following content:

```yaml
name: Modernization CLI

on:
  workflow_dispatch:
    inputs:
      upgrade_target:
        description: 'Upgrade target (e.g., Java 21)'
        required: false
        default: 'latest'
  schedule:
    # Run during off-peak hours: 2 AM UTC daily
    - cron: '0 2 * * *'

permissions:
    id-token: write
    contents: write
    actions: read

jobs:
  modernization:
    runs-on: ubuntu-latest
    env:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download Modernize CLI
        run: |
          mkdir -p "$HOME/modernize-cli"
          curl -sL https://github.com/microsoft/modernize-cli/releases/latest/download/modernize_linux_x64.tar.gz | tar -xz -C "$HOME/modernize-cli"
          chmod +x "$HOME/modernize-cli/modernize"
          echo "$HOME/modernize-cli" >> $GITHUB_PATH

      - name: Run Modernize CLI to upgrade code
        run: |
          TARGET="${{ github.event.inputs.upgrade_target }}"
          if [ -z "$TARGET" ] || [ "$TARGET" = "latest" ]; then
            modernize upgrade --no-tty
          else
            modernize upgrade "$TARGET" --no-tty
          fi

      - name: Push changes to result branch
        id: push_changes
        run: |
          BRANCH_NAME="modernize-upgrade-${{ github.event.inputs.upgrade_target || 'latest' }}-$(date +%Y%m%d-%H%M%S)"

          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          git add -A
          git reset .github/workflows
          git diff --cached --quiet || git commit -m "chore: apply Modernize CLI changes [skip ci]"
          git checkout -B "$BRANCH_NAME"
          git push origin "$BRANCH_NAME"

          echo "BRANCH_NAME=$BRANCH_NAME" >> $GITHUB_OUTPUT

      - name: Display results summary
        if: success()
        run: |
          cat >> $GITHUB_STEP_SUMMARY <<EOF
          ## Modernization Complete

          ### Branch Information
          - **Result Branch**: \`${{ steps.push_changes.outputs.BRANCH_NAME }}\`
          - **Target**: ${{ github.event.inputs.upgrade_target || 'latest' }}

          ### Links
          - [View Branch](https://github.com/${{ github.repository }}/tree/${{ steps.push_changes.outputs.BRANCH_NAME }})
          - [Create PR](https://github.com/${{ github.repository }}/compare/main...${{ steps.push_changes.outputs.BRANCH_NAME }})
          EOF

      - name: Upload Modernize CLI logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: modernize-logs
          path: ~/.modernize/logs/
          if-no-files-found: warn
```

### [Azure Pipelines](#tab/azure-pipelines)

1. Create a pipeline YAML file - for example, `azure-pipelines-modernize.yml` - in your repository with the following content.

    ```yaml
    name: Modernization CLI
    
    schedules:
      - cron: '0 2 * * *'
        displayName: 'Daily 2 AM UTC build'
        branches:
          include:
            - main
        always: true
    
    parameters:
      - name: upgrade_target
        displayName: 'Upgrade target (e.g., Java 21)'
        type: string
        default: 'latest'
    
    variables:
      - name: BRANCH_NAME
        value: modernize-${{ parameters.upgrade_target }}-$(Build.BuildId)
    
    pool:
      vmImage: 'ubuntu-latest'
    
    jobs:
      - job: modernization
        displayName: 'Modernization CLI'
        steps:
          - checkout: self
            persistCredentials: true
    
          - task: Bash@3
            displayName: 'Download Modernize CLI'
            inputs:
              targetType: 'inline'
              script: |
                mkdir -p "$HOME/modernize-cli"
                curl -sL https://github.com/microsoft/modernize-cli/releases/latest/download/modernize_linux_x64.tar.gz | tar -xz -C "$HOME/modernize-cli"
                chmod +x "$HOME/modernize-cli/modernize"
    
          - task: Bash@3
            displayName: 'Run Modernize CLI to upgrade code'
            inputs:
              targetType: 'inline'
              script: |
                TARGET="${{ parameters.upgrade_target }}"
                if [ -z "$TARGET" ] || [ "$TARGET" = "latest" ]; then
                  "$HOME/modernize-cli/modernize" upgrade --no-tty
                else
                  "$HOME/modernize-cli/modernize" upgrade "$TARGET" --no-tty
                fi
            env:
              GH_TOKEN: $(GH_TOKEN)
    
          - task: Bash@3
            displayName: 'Push changes to result branch'
            inputs:
              targetType: 'inline'
              script: |
                git config user.name "Azure Pipelines"
                git config user.email "azuredevops@microsoft.com"
    
                git add -A
                git reset .github/workflows
                git diff --cached --quiet || git commit -m "chore: apply Modernize CLI changes [skip ci]"
                git checkout -B "$(BRANCH_NAME)"
                git push origin "$(BRANCH_NAME)"
    
          - task: Bash@3
            displayName: 'Display results summary'
            condition: succeeded()
            inputs:
              targetType: 'inline'
              script: |
                mkdir -p "$(Build.ArtifactStagingDirectory)/summary"
                cat > "$(Build.ArtifactStagingDirectory)/summary/SUMMARY.md" <<EOF
                ## Modernization Complete
    
                ### Branch Information
                - **Result Branch**: \`$(BRANCH_NAME)\`
                - **Target**: ${{ parameters.upgrade_target }}
    
                ### Links
                - [View Branch]($(Build.Repository.Uri)/tree/$(BRANCH_NAME))
                - [View Build]($(System.CollectionUri)$(System.TeamProject)/_build/results?buildId=$(Build.BuildId))
                EOF
    
          - task: PublishBuildArtifacts@1
            displayName: 'Publish summary'
            condition: succeeded()
            inputs:
              pathToPublish: '$(Build.ArtifactStagingDirectory)/summary'
              artifactName: 'modernize-summary'
            continueOnError: true
    
          - task: Bash@3
            displayName: 'Prepare logs for upload'
            condition: always()
            inputs:
              targetType: 'inline'
              script: |
                if [ -d "$HOME/.modernize/logs" ]; then
                  mkdir -p "$(Build.ArtifactStagingDirectory)/modernize-logs"
                  cp -r "$HOME/.modernize/logs/"* "$(Build.ArtifactStagingDirectory)/modernize-logs/" 2>/dev/null || true
                fi
            continueOnError: true
    
          - task: PublishBuildArtifacts@1
            displayName: 'Upload Modernize CLI logs'
            condition: always()
            inputs:
              pathToPublish: '$(Build.ArtifactStagingDirectory)/modernize-logs'
              artifactName: 'modernize-logs'
            continueOnError: true
    ```

1. Create an Azure Pipeline that references this YAML file. For more information, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline).

---

## Workflow details

### [GitHub Actions](#tab/github-actions)

The workflow includes two triggers:

- **Manual dispatch** (`workflow_dispatch`): Run the workflow on demand from the **Actions** tab. Optionally specify an upgrade target such as `Java 21`.
- **Scheduled** (`schedule`): Run automatically at 2 AM UTC daily. Adjust the cron expression to match your preferred schedule.

Each run performs the following steps:

1. Checks out the repository code.
1. Downloads and installs the latest Modernize CLI.
1. Runs `modernize upgrade` with the specified target or defaults to `latest`.
1. Commits any changes and pushes them to a timestamped branch.
1. Writes a summary with branch and PR links to the GitHub Actions step summary.
1. Uploads Modernize CLI logs as a build artifact for troubleshooting.

> [!NOTE]
> The workflow resets `.github/workflows` before committing to avoid accidentally modifying the workflow file itself.

### [Azure Pipelines](#tab/azure-pipelines)

The pipeline includes two triggers:

- **Manual run**: Run the pipeline on demand from Azure DevOps. Specify an upgrade target parameter such as `Java 21`.
- **Scheduled** (`schedules`): Run automatically at 2 AM UTC daily on the `main` branch. Adjust the cron expression to match your preferred schedule.

Each run performs the following steps:

1. Checks out the repository with persisted credentials for pushing changes.
1. Downloads and installs the latest Modernize CLI.
1. Runs `modernize upgrade` with the specified target or defaults to `latest`.
1. Commits any changes and pushes them to a result branch named with the build ID.
1. Publishes a summary markdown file as a build artifact.
1. Uploads Modernize CLI logs as a build artifact for troubleshooting.

---

## Run the pipeline

### [GitHub Actions](#tab/github-actions)

To trigger the workflow manually:

1. Go to your repository on GitHub.
1. Select the **Actions** tab.
1. Select **Modernization CLI** from the workflow list.
1. Select **Run workflow**.
1. Optionally enter an upgrade target, and then select **Run workflow** to confirm.

After the workflow finishes, review the step summary for links to the result branch and create a pull request to merge the changes.

### [Azure Pipelines](#tab/azure-pipelines)

To trigger the pipeline manually:

1. Go to your Azure DevOps project.
1. Select **Pipelines** from the left navigation.
1. Select the **Modernization CLI** pipeline.
1. Select **Run pipeline**.
1. Optionally update the **Upgrade target** parameter, and then select **Run**.

After the pipeline finishes, review the published artifacts for the summary and logs. Then create a pull request from the result branch.

---

## Troubleshooting

### Common problems

**Authentication errors:**

- Verify the `GH_TOKEN` secret or variable is set correctly with a valid GitHub Personal Access Token.
- Ensure the token has the required scopes for GitHub Copilot access.

**No changes detected:**

- The Modernize CLI might determine that no changes are needed for the specified target.
- Review the uploaded logs artifact for details on the assessment.

**Push failures (Azure Pipelines):**

- Confirm the build service identity has **Create branch**, **Contribute**, and **Read** permissions on the repository.
- See [Run Git commands in a script](/azure/devops/pipelines/scripts/git-commands) for detailed setup instructions.

**Modernize CLI download errors:**

- Verify the runner has internet access to <https://github.com>.
- Check for proxy or firewall restrictions that might block the download.

## Next steps

- [Learn about CLI commands](cli-commands.md)
- [Run batch assessment](batch-assess.md)
- [Run batch upgrade](batch-upgrade.md)
- [Create custom skills for organization-specific patterns](customization.md)


---
title: Default interactive hooks in Azure Developer CLI
description: Learn about default interactive hooks mode, schema validation, and debugging capabilities in Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 8/1/2025
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Working with Interactive Hooks in Azure Developer CLI

The Azure Developer CLI (azd) enhances development workflows with hooks that can run custom scripts at various stages of your deployment process. In the latest version of Azure Developer CLI, hooks now run in interactive mode by default, providing a better development experience. This article focuses on working with hooks in interactive mode, leveraging improved schema validation, and utilizing debugging capabilities to streamline your development experience.

## Interactive hooks mode overview

Interactive hooks mode allows you to run hook scripts with direct console interaction, making it easier to debug, monitor, and interact with your hooks in real-time. When a hook is run in interactive mode:

* Input prompts from your hook scripts are displayed directly in the console
* Output is streamed in real-time rather than buffered
* You can interact with the hook process while it's running
* Errors and exceptions are displayed with richer context

Interactive mode is particularly valuable when:

* Debugging complex hook scripts
* Working with hooks that require user input
* Monitoring long-running operations
* Troubleshooting hook configuration issues

## Configuring interactive mode

Hooks run in interactive mode by default, but you can configure this behavior using the following techniques.

### Use the azure.yaml file

You can explicitly set the `interactive` property in your hook configuration if you want to disable interactive mode for a specific hook:

```yaml
hooks:
  postprovision:
    shell: sh
    run: ./scripts/setup-database.sh
    interactive: false # Default is true
```

For service-specific hooks:

```yaml
services:
  api:
    project: ./src/api
    language: js
    host: appservice
    hooks:
      postdeploy:
        shell: sh
        run: ./scripts/post-deploy-verification.sh
        interactive: false  # Override the default interactive mode
```

### Use the azd hooks run command

You can temporarily override a hook's interactive setting by using the `--interactive` or `--no-interactive` flags with the `azd hooks run` command:

```bash
# Explicitly enable interactive mode
azd hooks run postprovision --interactive

# Explicitly disable interactive mode
azd hooks run postprovision --no-interactive
```

This allows you to control the interactive behavior for testing or debugging purposes without modifying your `azure.yaml` file.

## Enhanced schema validation

Azure Developer CLI now includes improved schema validation for hooks, helping you identify and fix configuration issues before your hooks run. This validation includes:

### Configuration validation

When loading your project, `azd` validates the hook configurations in your `azure.yaml` file against the schema:

* **Hook naming**: Ensures hook names follow the correct pattern (`pre*` or `post*` followed by a command or event name)
* **Required properties**: Validates that all required properties are present
* **Property types**: Checks that property values are of the correct type
* **Platform specifications**: Validates that platform-specific configurations (windows/posix) are correctly structured

### Runtime validation

During hook execution, `azd` performs additional validations:

* **Script existence**: Verifies that script files specified in the `run` property exist
* **Shell availability**: Confirms that the specified shell is available on your system
* **Environment variables**: Validates that environment variables used in hooks are properly defined

### Validation error messages

Validation errors are displayed with informative messages to help you quickly identify and fix issues:

```output
Error: Invalid hook configuration at services.api.hooks.postdeploy
        - 'run' property is required when 'shell' is specified
        - 'windows' configuration cannot be combined with 'shell' at the same level
```

## Debugging hooks

Azure Developer CLI provides several features to help you debug and troubleshoot hooks:

### Real-time logging

In interactive mode, log output is streamed to the console in real-time, making it easier to identify issues as they occur. This is particularly useful for diagnosing problems in long-running hooks.

### Inspecting hook environment

You can inspect the environment variables available to your hooks by adding debug outputs to your scripts:

#### Bash example

```bash
# Print all environment variables
echo "Hook environment variables:"
env | sort
```

#### PowerShell example

```powershell
# Print all environment variables
Write-Host "Hook environment variables:"
Get-ChildItem Env: | Sort-Object Name | Format-Table -AutoSize
```

### Hook execution context

When running a hook, `azd` provides context information about the hook's execution:

```output
Running hook 'postprovision'
  - Script: ./scripts/setup-database.sh
  - Working directory: /home/user/myproject
  - Environment: dev
  - Interactive mode: enabled
```

### Debug mode

You can enable detailed debug logging for hooks by using the `--debug` flag with any `azd` command:

```bash
azd hooks run postprovision --debug
```

In debug mode, you'll see additional information about:

* Hook discovery and loading process
* Script execution details
* Environment variable resolution
* Platform-specific behavior

## Best practices for interactive hooks

1. **Use interactive mode thoughtfully**: Consider disabling interactive mode selectively for hooks that don't benefit from user interaction. In CI/CD environments, explicitly disable interactive mode to prevent unexpected hangs:

   ```yaml
   # In your CI pipeline configuration:
   hooks:
     postprovision:
       shell: sh
       run: ./scripts/setup-resources.sh
       interactive: false  # Explicitly disable interactive mode for CI
   
   # Or use the --no-interactive flag in your CI script:
   # azd hooks run postprovision --no-interactive
   ```

   Your hook scripts should still handle both interactive and non-interactive environments:

   ```bash
   # Check if running in a CI environment
   if [ -z "${CI}" ]; then
     # Interactive prompt for local development
     read -p "Enter configuration name: " config_name
   else
     # Use default for CI environments
     config_name="default"
   fi
   ```

1. **Provide clear feedback**: When running in interactive mode, provide clear status messages and progress indicators:

   ```bash
   echo "Starting deployment verification..."
   echo "Step 1/3: Checking service health..."
   # operation here
   echo "Step 2/3: Verifying database connections..."
   # operation here
   echo "Step 3/3: Testing API endpoints..."
   # operation here
   echo "All verification steps completed successfully!"
   ```

1. **Set appropriate timeouts**: For interactive operations that might wait for user input, consider setting timeouts:

   ```bash
   read -t 30 -p "Continue with deployment? (y/n): " response
   if [ -z "$response" ]; then
     echo "No response received, using default (y)"
     response="y"
   fi
   ```

1. **Use exit codes appropriately**: Make sure your hook scripts return appropriate exit codes:

   ```bash
   # Exit with error if verification fails
   if [ "$status" != "success" ]; then
     echo "Verification failed: $error_message"
     exit 1
   fi
   
   # Exit successfully
   echo "Verification completed successfully"
   exit 0
   ```

## Troubleshoot interactive hooks

| Issue | Possible cause | Solution |
|-------|---------------|----------|
| Hook doesn't show interactive prompts | Interactive mode disabled | Check if `interactive: false` is set in your configuration or you're using `--no-interactive` |
| Terminal input not working | Terminal not properly connected | Ensure you're running `azd` in a terminal that supports interactive I/O |
| Hook hangs waiting for input | Script expecting input in non-interactive mode | Make your script check if it's running interactively before prompting for input |
| Hook fails with "Command not found" | Shell path issue or script not executable | Ensure your script has execute permissions (`chmod +x script.sh`) |
| Environment variables not available | Variable scope issue | Use `azd env get-values` to retrieve environment variables |

## Related content

* [Customize your Azure Developer CLI workflows using command and event hooks](azd-extensibility.md)
* [Azure Developer CLI commands](azd-commands.md)
* [Azure.yaml schema reference](azd-schema.md)

[!INCLUDE [request-help](includes/request-help.md)]

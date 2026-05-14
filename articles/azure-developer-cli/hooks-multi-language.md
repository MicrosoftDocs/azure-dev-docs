---
title: Write azd hooks in Python, JavaScript, TypeScript, or .NET
description: Learn how to write Azure Developer CLI hooks in Python, JavaScript, TypeScript, and .NET, with automatic dependency installation and environment management.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/22/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-python, devx-track-js, devx-track-ts, devx-track-dotnet
ai-usage: ai-generated
---

# Write azd hooks in Python, JavaScript, TypeScript, or .NET

The Azure Developer CLI (`azd`) hook system supports **Python**, **JavaScript**, **TypeScript**, and **.NET** in addition to Bash and PowerShell. `azd` automatically detects the language from the file extension, manages dependencies, and runs the script with no extra configuration required.

Hooks let you run custom logic at key points in the `azd` lifecycle, such as before provisioning, after deployment, and more. For general information about hooks, including available hook events and configuration options, see [Customize workflows using command and event hooks](azd-extensibility.md).

## Prerequisites

- [Install azd](/azure/developer/azure-developer-cli/install-azd)
- The runtime for your chosen language must be installed on your machine:
  - **Python**: [Python 3.x](https://www.python.org/downloads/)
  - **JavaScript/TypeScript**: [Node.js](https://nodejs.org/)
  - **.NET**: [.NET SDK](https://dotnet.microsoft.com/download)

## Language detection

Point a hook at a script file in `azure.yaml`, and `azd` infers the language from the file extension. If the extension is ambiguous or missing, specify the language explicitly with the `kind` field:

```yaml
hooks:
  preprovision:
    run: ./hooks/setup.py
    kind: python    # explicit — overrides extension inference
```

## Python hooks

To write a Python hook, create a `.py` file and reference it in your `azure.yaml`. Place a `requirements.txt` or `pyproject.toml` in the same directory as the script or a parent directory. `azd` walks up the directory tree from the script location to find the nearest project file, creates a virtual environment, installs dependencies, and runs the script.

### Example directory structure

```
hooks/
├── setup.py
└── requirements.txt
```

### Example configuration

```yaml
hooks:
  preprovision:
    run: ./hooks/setup.py
```

### Python-specific configuration

Use the `config` block to override the default virtual environment name.

```yaml
hooks:
  preprovision:
    run: ./hooks/setup.py
    config:
      virtualEnvName: .venv   # override default naming
```

## JavaScript and TypeScript hooks

To write JavaScript or TypeScript hooks, create a `.js` or `.ts` file and reference it in your `azure.yaml`. Place a `package.json` in the same directory as your script or a parent directory. `azd` runs `npm install` (or the package manager specified in the `config` block) and executes the script. TypeScript scripts run via `npx tsx` with no compile step or `tsconfig.json` needed.

### Example directory structure

```
hooks/
├── seed.ts
└── package.json
```

### Example configuration

```yaml
hooks:
  postdeploy:
    run: ./hooks/seed.ts
```

### JavaScript and TypeScript configuration

Use the `config` block to specify a preferred package manager.

```yaml
hooks:
  postdeploy:
    run: ./hooks/seed.ts
    config:
      packageManager: pnpm    # npm | pnpm | yarn
```

## .NET hooks

Two modes are supported for .NET hooks:

- **Project mode**: If a `.csproj`, `.fsproj`, or `.vbproj` exists in the same directory as the script or a parent directory, `azd` runs `dotnet restore` and `dotnet build` automatically.
- **Single-file mode**: On .NET 10+, standalone `.cs` files run directly via `dotnet run script.cs` without a project file.

### Example directory structure

```
hooks/
├── migrate.cs
└── migrate.csproj   # optional — omit for single-file mode on .NET 10+
```

### Example configuration

```yaml
hooks:
  postprovision:
    run: ./hooks/migrate.cs
```

### .NET-specific configuration

Specify the build configuration and target framework by using the `config` block:

```yaml
hooks:
  postprovision:
    run: ./hooks/migrate.cs
    config:
      configuration: Release  # Debug | Release
      framework: net10.0      # target framework
```

## Override the working directory

Set the working directory for a hook by using the `dir` field. This configuration is useful when the project root differs from the script location:

```yaml
hooks:
  preprovision:
    run: main.py
    dir: hooks/preprovision
```

## Mix languages and formats

Use different languages for different hooks in the same `azure.yaml` file. You can also combine multi-language hooks with platform-specific overrides:

```yaml
hooks:
  preprovision:
    run: ./hooks/setup.py

  postdeploy:
    run: ./hooks/seed.ts

  postprovision:
    run: ./hooks/migrate.cs

  predeploy:
    windows:
      run: ./hooks/build.ps1
    posix:
      run: ./hooks/build.sh
```

## Related content

- [Customize workflows using command and event hooks](azd-extensibility.md)
- [Azure Developer CLI reference](reference.md)

[!INCLUDE [request-help](includes/request-help.md)]

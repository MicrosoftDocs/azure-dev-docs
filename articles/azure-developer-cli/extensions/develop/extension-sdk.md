---
title: Communicate with azd by using the SDK
description: Learn how to use the azdext Go SDK to communicate with the Azure Developer CLI (azd) from an extension, including project data, prompts, and gRPC services.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/10/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Communicate with azd by using the SDK

Extensions communicate with the Azure Developer CLI (`azd`) through a gRPC connection by using the `azdext` SDK. The SDK lets your extension read project and environment data, prompt the user, and call into `azd` services. This article shows you how to use the SDK to enhance the Contoso Resource Tagger sample extension from the [Build a sample extension quickstart](quickstart-build-extension.md). You can apply the same patterns to any extension.

> [!NOTE]
> `azd` extensions are currently in beta.

## How communication works

When `azd` runs your extension, it starts a gRPC server and passes two values to your extension through environment variables:

- `AZD_SERVER`: The address of the gRPC server, such as `localhost:12345`.
- `AZD_ACCESS_TOKEN`: A JWT access token that authorizes your extension's requests.

Your extension uses the `azdext` SDK to connect to this server and call `azd` services. The token scopes each request to the capabilities your extension declares in its [manifest](extension-manifest.md).

## Create an azd client

The `azdext.NewAzdClient` function creates a client that connects to `azd` by using the environment variables that `azd` provides. Wrap the incoming context with `azdext.WithAccessToken` so the SDK attaches the access token to each request:

```go
import (
    "context"
    "fmt"

    "github.com/azure/azure-dev/cli/azd/pkg/azdext"
)

func run(ctx context.Context) error {
    // Attach the AZD_ACCESS_TOKEN to outgoing requests.
    ctx = azdext.WithAccessToken(ctx)

    azdClient, err := azdext.NewAzdClient()
    if err != nil {
        return fmt.Errorf("failed to create azd client: %w", err)
    }
    defer azdClient.Close()

    // Use azdClient to call azd services.
    return nil
}
```

## Read project and environment data

Use the Project and Environment services to read information about the current `azd` project and environment. For the sample extension, read the project so you can inspect its resources and tags:

```go
// Get the current project.
getProject, err := azdClient.Project().Get(ctx, &azdext.EmptyRequest{})
if err != nil {
    return fmt.Errorf("failed to get project: %w", err)
}

fmt.Printf("Project name: %s\n", getProject.Project.Name)
fmt.Printf("Project path: %s\n", getProject.Project.Path)

// Get the current environment.
getEnv, err := azdClient.Environment().GetCurrent(ctx, &azdext.EmptyRequest{})
if err != nil {
    return fmt.Errorf("failed to get environment: %w", err)
}

fmt.Printf("Environment name: %s\n", getEnv.Environment.Name)
```

## Read and write environment values

The Environment service reads and writes environment values. These values persist in the `.azure` directory of the project. For the sample extension, store a required tag value that the user provides:

```go
// Read an environment value.
getValue, err := azdClient.Environment().GetValue(ctx, &azdext.GetEnvRequest{
    EnvName: getEnv.Environment.Name,
    Key:     "CONTOSO_COST_CENTER",
})
if err == nil {
    fmt.Printf("Cost center: %s\n", getValue.Value)
}

// Write an environment value.
_, err = azdClient.Environment().SetValue(ctx, &azdext.SetEnvRequest{
    EnvName: getEnv.Environment.Name,
    Key:     "CONTOSO_COST_CENTER",
    Value:   "CC-1001",
})
if err != nil {
    return fmt.Errorf("failed to set environment value: %w", err)
}
```

## Prompt the user

The Prompt service provides consistent, interactive prompts that match the `azd` user experience. For the sample extension, prompt the user for a missing tag value:

```go
promptResponse, err := azdClient.Prompt().Prompt(ctx, &azdext.PromptRequest{
    Options: &azdext.PromptOptions{
        Message: "Enter the cost center tag value",
    },
})
if err != nil {
    return fmt.Errorf("failed to prompt for value: %w", err)
}

costCenter := promptResponse.Value
```

The Prompt service also supports selection prompts, confirmation prompts, and multiselect prompts. Use these options instead of writing your own input handling so your extension matches the look and feel of `azd`.

## Available services

The `azdext` SDK exposes the following gRPC services through the client:

| Service | Description |
| --- | --- |
| Project | Reads the current project configuration. |
| Environment | Reads and writes environments and environment values. |
| UserConfig | Reads and writes user-level configuration. |
| Deployment | Reads deployment context and results. |
| Account | Reads Azure subscription and location information. |
| Prompt | Displays interactive prompts. |
| AI Model | Interacts with configured AI models. |
| Event | Subscribes to lifecycle events. |
| Compose | Reads and modifies the composed set of services and resources. |
| Workflow | Runs `azd` workflows. |

For the complete list of services and message definitions, see the [proto files in the azure-dev repository](https://github.com/Azure/azure-dev/tree/main/cli/azd/grpc/proto) and the [extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md).

## Report errors

Return errors from your command handlers so `azd` can display them consistently and set the correct exit code. Wrap errors with context using `fmt.Errorf` and the `%w` verb so callers can inspect the underlying error:

```go
if err != nil {
    return fmt.Errorf("failed to apply tags: %w", err)
}
```

## Related content

- [Add extension capabilities](extension-capabilities.md)
- [Add an MCP server to an extension](extension-mcp-server.md)
- [Publish an extension](publish-extensions.md)
- [Extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)

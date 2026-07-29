---
title: Publish an extension
description: Learn how to package, release, and publish an Azure Developer CLI (azd) extension to a registry so others can install it.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/10/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Publish an extension

After you build an Azure Developer CLI (`azd`) extension, package and publish it to a registry so others can install it. This article shows you how to publish the Contoso Resource Tagger sample extension from the [Build a sample extension quickstart](quickstart-build-extension.md). You can apply the same steps to any extension.

> [!NOTE]
> `azd` extensions are currently in beta.

## Choose a registry

`azd` supports two registries for publishing extensions:

- **Development registry**: An experimental registry for unsigned extensions. Use it to share work in progress and test the publish flow. Extensions in this registry aren't signed or verified.
- **Official registry**: The registry that ships with `azd`. To publish here, submit a pull request to a fork of the [azure/azure-dev](https://github.com/Azure/azure-dev) repository.

This article uses the development registry.

## Prerequisites

- A completed extension from the [Build a sample extension quickstart](quickstart-build-extension.md).
- The `azd` developer extension (`microsoft.azd.extensions`), which provides the `azd x` commands used to package and publish. If you completed the quickstart, it's already installed. Otherwise, run `azd extension install microsoft.azd.extensions`.
- A GitHub account and a repository to host the release artifacts.
- A GitHub personal access token (PAT) with the `repo` scope. The release command uses this token to create GitHub releases and upload artifacts. For more information, see [Managing your personal access tokens](https://docs.github.com/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

## Update the version and changelog

Before you publish, update the version and document your changes:

1. Update the `version` property in `extension.yaml` following [semantic versioning](https://semver.org/). Increment the major, minor, or patch number based on the type of change.

1. Update `CHANGELOG.md` with the notable changes for this version. `azd` uses the changelog to generate release notes.

## Package the extension

Use the `azd x pack` command to build platform-specific binaries and package the extension:

```azdeveloper
azd x pack
```

The command creates artifacts for each supported platform in your output directory. Packaging also runs any snapshot tests to verify the extension behaves as expected before you publish.

## Release the extension

Use the `azd x release` command to create a GitHub release and upload the packaged artifacts. Provide your GitHub PAT so the command can create the release:

```azdeveloper
azd x release
```

The command creates a release in your GitHub repository, uploads the packaged binaries, and generates release notes from your changelog.

> [!TIP]
> Store your GitHub PAT in an environment variable rather than passing it on the command line. Check the command help by running `azd x release --help` for the supported authentication options.

## Publish to the registry

Use the `azd x publish` command to add or update your extension's entry in the extension registry:

```azdeveloper
azd x publish
```

The command updates the registry metadata so users can discover and install your extension from the development registry. This step differs from the local publishing that `azd x init` performs in the quickstart, which registers the extension only to a local source on your machine. Running `azd x publish` updates the shared development registry so that other users can install your extension.

## Install and verify

After you publish, verify that others can install your extension from the development registry:

1. Make sure you already added the development registry.

    ```azdeveloper
    azd extension source add -n dev -t url -l "https://aka.ms/azd/extensions/registry/dev"
    ```

1. Install the extension by its ID.

    ```azdeveloper
    azd extension install contoso.azd.tagger
    ```

1. Run a command to confirm the extension works.

    ```azdeveloper
    azd tagger show
    ```

## Publish to the official registry

To publish to the official registry, submit your extension to the [azure/azure-dev](https://github.com/Azure/azure-dev) repository:

1. Fork the [azure/azure-dev](https://github.com/Azure/azure-dev) repository.
1. Add your extension's registry entry to the official registry file in your fork.
1. Submit a pull request for review.

The Azure Developer CLI team reviews official registry submissions for quality and security before they merge.

## Troubleshoot publishing

The following table lists common publishing issues and their resolutions:

| Issue | Resolution |
| --- | --- |
| Release fails with an authentication error | Verify your GitHub PAT is valid and has the `repo` scope. |
| Snapshot tests fail during `azd x pack` | Review the test output, update your snapshots if the changes are expected, and rerun the command. |
| Users can't find your extension | Confirm the development registry is added and that `azd x publish` completed successfully. |
| Version conflict during publish | Increment the `version` in `extension.yaml` to a new, unused version. |

## Related content

- [Define the extension manifest](extension-manifest.md)
- [Add extension capabilities](extension-capabilities.md)
- [Communicate with azd by using the SDK](extension-sdk.md)
- [Extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)

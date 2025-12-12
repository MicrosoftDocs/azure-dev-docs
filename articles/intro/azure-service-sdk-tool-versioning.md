---
title: Versioning policy for Azure services, SDKs, and CLI tools
description: Versioning policy for Azure services, SDKs, and CLI tools
ms.service: azure
ms.topic: overview
ms.date: 12/11/2025
---

# Versioning policy for Azure services, SDKs, and CLI tools

Most Azure services let you programmatically control and manage their resources by using REST APIs. Services evolve through new published versions of their APIs with different contracts that add new features and modify behaviors.

This article outlines the policy that the Azure service, SDK, and CLI teams use for versioning the Azure REST APIs. While Azure teams make every effort to adhere to this policy, deviations can occur.

## Service versioning

Each published version of an API is identified by a date value in `YYYY-MM-DD` format, called the `api-version`. Newer versions have later dates.

All API operations require clients to specify a valid API version for the service through the `api-version` query string parameter in the URL. For example: `https://management.azure.com/subscriptions?api-version=2020-01-01`. Client SDKs and tools include the `api-version` value automatically. For more considerations, see the [Client SDKs and service versions](#client-sdks-and-service-versions) section later in this article.

In most scenarios, a service client only needs to interact with a single version of a service to access all of the functionality it requires.

Stable service versions generally remain available and supported for many years, even as newer versions become available. In most cases, you adopt a new service version within existing code to take advantage of new features.

### Stable versions

Most published service versions are *stable versions*. Stable versions are backwards compatible, meaning that any code you write that relies on one version of a service can adopt a newer stable version without requiring any code changes to maintain correctness or existing functionality.

### Breaking change versions

A *breaking change version* of a service isn't backwards compatible. Adopting a breaking change version in existing client code might require code changes to ensure the client behaves exactly as it did when targeting the previous version.

Breaking change versions are rare. The Azure teams announce them via documentation and typically precede them with a preview version. Publication of a breaking change version might prompt the eventual retirement of existing stable versions. These stable versions remain available for at least three years after the breaking change version releases. For breaking changes published due to security or compliance issues, existing stable service versions might remain available for one year or less depending on the severity of the the issue.

Due to the rapid innovation and developments in AI, AI-driven services might have a reduced minimum availability of one year. Each service publishes its breaking change policy.

Any Azure service dependent on a non-Microsoft component can shrink its support policy to match that component's policy. Any dependent breaking change links to the component vendor's policy showing the date when the component is no longer supported.

### Preview versions

Occasionally, Microsoft publishes a *preview version* of a service to gather feedback about proposed changes and new features. Preview service versions include the suffix `-preview` in their `api-version` - for example, `2022-07-07-preview`.

Unless a preview version explicitly introduces a breaking change from the previous stable version, it includes all the features of the most recent stable version and adds new preview features. However, between preview versions, a service can break any of the newly added preview features.

Previews aren't intended for long-term use. Anytime a new stable or preview version of a service becomes available, existing preview versions can become unavailable as early as 90 days from the availability of the new version. Use preview versions only in situations where you're actively developing against new service features and you're prepared to adopt a new, non-preview version soon after it's released. If some features from a preview version are released in a new stable version, remaining features still in preview typically are published in a new preview version.

## Client SDKs and service versions

The [Azure SDKs](https://azure.github.io/azure-sdk/releases/latest/) aim to eliminate service versioning as a concern when writing code. Each SDK is composed of client libraries, one for each service, and each client library version targets a single version of the service it relies on.

When you use an SDK to access an Azure service, taking advantage of new versions and features typically requires upgrading the client library version used by the application. New stable versions of services are accompanied by new point releases of client libraries. For new breaking change versions, new client libraries are published as either point release versions or major release versions. The type of release depends on the nature of the service's change and the way the library is able to accommodate it. Only beta-version client libraries use preview service versions.

SDK client libraries support manual overriding of the service version. Overriding a client library's default service version is an advanced scenario and can lead to unexpected behavior. If you make use of this feature, test your application thoroughly to ensure it works as desired.

## Azure command line tools

As with the SDKs, the Azure command line tools (including the [Azure CLI](/cli/azure/) and [Azure PowerShell](/powershell/azure/)) are designed to allow usage of Azure management services without regard for versions. Accessing new service features often requires a new version of a tool. New backward-compatible tool versions are released monthly. Versions with breaking changes are released approximately twice a year, or as required to fix critical security issues.

The Azure command line tools can occasionally expose preview features. These commands are marked with a `Preview` label and output a warning indicating limited support and potential changes in future tool versions.

## Next steps

- [Azure REST API specifications](https://github.com/Azure/azure-rest-api-specs)
- [Microsoft REST API guidelines](https://github.com/microsoft/api-guidelines)
- [Azure SDK general guidelines](https://azure.github.io/azure-sdk/general_introduction.html)


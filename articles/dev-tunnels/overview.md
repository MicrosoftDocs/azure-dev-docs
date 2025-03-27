---
title: What are dev tunnels?
titleSuffix: Microsoft dev tunnels
description: Learn about using dev tunnels
author: derekbekoe
ms.author: debekoe
ms.topic: overview
ms.service: azure-dev-tunnels
ms.date: 03/27/2025
---

# What are dev tunnels?

Dev tunnels allow developers to securely share local web services across the internet. Enabling you to connect your local development environment with cloud services, share work in progress with colleagues or aid in building webhooks. Dev tunnels is for adhoc testing and development, not for production workloads.

> [!IMPORTANT]
> This feature is currently in public preview.
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

## Benefits

- **Secure by default** - By default dev tunnels you create are only accessible to you using your Microsoft, Microsoft Entra ID, or GitHub account.
- **Persistent URLs** - Keep the same dev tunnel url for as long as you need.
- **Support for multiple simultaneous ports** - Host multiple ports on a single dev tunnel at the same time.
- **Global service availability** - The dev tunnels service is available globally. Dev tunnels are automatically created in the closest available region.
- **Tunnel inspection** - Inspect dev tunnel traffic in a familiar interface, browser DevTools.

## Terminology

Before using the CLI, it's helpful to understand the following terms that are referenced throughout:

- **Tunnel** - Provides secure remote access to one host through a relay service. A dev tunnel has a unique DNS name, multiple ports, access controls, and other associated metadata.

- **Tunnel relay service** - Facilitates secure connections between a dev tunnel host and clients via a cloud service, even when the host may be behind a firewall and unable to accept incoming connections directly.

- **Tunnel host** - Accepts client connections to a dev tunnel via the dev tunnel relay service, and forwards those connections to local ports.

- **Tunnel port** - An IP port number (1-65535) that is allowed through a dev tunnel. A dev tunnel only allows connections on ports that have been added. One dev tunnel can support multiple ports, and different ports within a dev tunnel may use different protocols (HTTP, HTTPS, etc.) and may have different access controls.

- **Tunnel connection** - A duplex stream of packets between a dev tunnel client and dev tunnel host, through a dev tunnel port. A dev tunnel connection is most often linked to TCP connections on either side, but UDP-based protocols may also be supported. One tunnel port can support multiple simultaneous connections.

- **Tunnel client** - Initiates a remote connection through a dev tunnel to a host. (While the host may also have a "client" relationship with the dev tunnel service, the term is avoided in that context to reduce confusion.)

## Next steps

- [Get started with dev tunnels](get-started.md)

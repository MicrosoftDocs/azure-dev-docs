---
title: What is dev tunnels?
titleSuffix: Microsoft dev tunnels
description: Learn about using dev tunnels
author: curib
ms.author: cauribeg
ms.topic: overview
ms.service: azure-dev-tunnels
ms.custom: build-2023
ms.date: 04/26/2023 
---

# What are dev tunnels?

Dev tunnels allow developers to securely share local web services across the internet. Enabling you to connect your local development environment with cloud services, share work in progress with colleagues or aid in building webhooks. Dev tunnels is for adhoc testing and development, not for production workloads.

> [!IMPORTANT]
> This feature is currently in public preview.
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

## Benefits

- **Secure by default** - By default tunnels you create are only accessible to you using your Microsoft, Microsoft Azure Active Directory or GitHub account.
- **Persistent URLs** - Keep the same tunnel url for as long as you need.
- **Support for multiple simultaneous ports** - Host multiple ports on a single tunnel at the same time.
- **Global service availability** - The dev tunnels service is available globally. Tunnels are automatically created in the closest available region.
- **Tunnel inspection** - Inspect tunnel traffic in a familiar interface, browser DevTools.

## Terminology

Before using the CLI, it's helpful to understand the following terms that are referenced throughout:

- **Tunnel** - Provides secure remote access to one host through a relay service. A tunnel has a unique DNS name, multiple ports, access controls, and other associated metadata.

- **Tunnel relay service** - Facilitates secure connections between a tunnel host and clients via a cloud service, even when the host may be behind a firewall and unable to accept incoming connections directly.

- **Tunnel host** - Accepts client connections to a tunnel via the tunnel relay service, and forwards those connections to local ports.

- **Tunnel port** - An IP port number (1-65536) that is allowed through a tunnel. A tunnel only allows connections on ports that have been added. One tunnel can support multiple ports, and different ports within a tunnel may use different protocols (HTTP, HTTPS, SSH, etc.) and may have different access controls.

- **Tunnel connection** - A duplex stream of packets between a tunnel client and tunnel host, through a tunnel port. A tunnel connection is most often linked to TCP connections on either side, but UDP-based protocols may also be supported. One tunnel port can support multiple simultaneous connections.

- **Tunnel client** - Initiates a remote connection through a tunnel to a host. (While the host may also have a "client" relationship with the tunnel service, the term is avoided in that context to reduce confusion.)

## Next steps

- [Get started with dev tunnels](get-started.md)

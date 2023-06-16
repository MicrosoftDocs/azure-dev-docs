---
title: Security
titleSuffix: Microsoft dev tunnels
description: Learn about security when using dev tunnels
author: curib
ms.author: cauribeg
ms.topic: conceptual
ms.service: azure-dev-tunnels
ms.date: 06/15/2023 
---
# Security

Dev tunnels is a security-focussed tunneling service.
In this article, you'll learn about how dev tunnels are secured.

## Overview

By default, hosting and connecting to a tunnel requires authentication with the same Microsoft, Microsoft Azure Active Directory or GitHub account that created the tunnel. Tunnelling requires outbound connections to be made to the service hosted in Azure. No inbound connections are required to use the service. On connection of a tunnel, an SSH connection is created in order to provide end-to-end encryption. The current preferred cipher for this encryption is AES 256 in CTR mode, and the code that implements this is [open source](https://github.com/microsoft/dev-tunnels).

## Domains

Access to dev tunnels can be controlled by allowing or denying outbound access to the following domains:

- Authentication
  - `github.com`
  - `login.microsoftonline.com`

- Dev Tunnels
  - `global.rel.tunnels.api.visualstudio.com`
  - `*.rel.tunnels.api.visualstudio.com`
  - `*.devtunnels.ms`

## Tunnel Access

By default, tunnels and tunnel ports are private and only accessible to the user who created the tunnel.

If a tunnel or tunnel port does need to be accessed without authentication, an allow-anonymous Access control entry (ACE) can be added (e.g. via `--anonymous`).

The CLI can also be used to request access tokens that grant limited access to anyone holding the token:

```powershell
devtunnel token
```

Currently, 4 types of tunnel access tokens are available:

- A "management access token" allows the bearer to perform any operations on that tunnel, including setting access controls, hosting, connecting, and deleting the tunnel.
- A "manage ports access token" allows the bearer to add and delete ports on a tunnel.
- A "host access token" allows the bearer to host the tunnel and accept connections, but not make any other changes to it.
- A "client access token" allows the bearer to connect to any ports of the tunnel.

All of the tokens are limited to the current tunnel; they do not grant access to any of the current user's _other_ tunnels, if any. The tokens expire after some time (currently 24 hours). Tokens can only be refreshed using an actual user identity that has manage-scope access to the tunnel (not just a management access token).

Most CLI commands can accept a `--access-token` argument with an appropriate token as an alternative to logging in.

Web service clients can pass a token in a header to authorize requests to a tunnel URI:

```http
X-Tunnel-Authorization: tunnel <TOKEN>
```

> [!TIP]
> This is useful for non-interactive clients as it allows them to access tunnels without requiring anonymous access to be enabled. We use the `X-Tunnel-Authorization` header instead of the standard `Authorization` header to prevent potentially interfering with application-specific authorization.

See the [Manage dev tunnel access](cli-commands#advanced-manage-dev-tunnel-access) section to learn more about how to manage tunnel access through the CLI.

## Tunnel Connections

### E2E Encryption

Client-SDK connections are end-to-end encrypted using the SSH protocol. Traffic routed through the service does not persist in any way. Even if the tunnel relay service was compromised, it could not decrypt any of the tunnel communication.

HTTP (browser) client connections are not E2E encrypted as access to the Application Layer is required for Ingress and HTTP Header Rewriting. See the section on web-forwarding below for more details. Tunnel connection payload data is never stored or logged.

The SSH protocol uses a Diffie-Hellman key-exchange to establish a shared secret for the session, and derives from that a key for AES symmetric encryption. The encryption key is rotated periodically throughout the duration of the session. The shared session secret and all encryption keys are only maintained in-memory by both sides, and are only valid for the duration of the session. They are never written to disk or sent to any service.

The SSH session is also two-way authenticated. The host (SSH server role) uses public/private key authentication as is standard for the SSH protocol. When a host initiates a session, it generates a unique ECDSA public/private key-pair for the session. The host private key is kept only in memory in the host process; it is never written to disk or sent to any service. The host public key is published to the service along with the session connection information where authorized clients can connect. When a client connects to the host's SSH session, the client uses the SSH host authentication protocol to validate that the host holds the private key corresponding to the published public key (without the client actually getting to see the private key).

### Web-forwarding

Tunnel ports using the HTTP(S)/WS(S) protocols can be accessed directly via the provided web-forwarding url (e.g. `https://tunnelid-3000.devtunnels.ms`).

- Insecure client connections are **always** automatically upgraded to HTTPS/WSS.
  - Note: These may still connect to a (non-TLS) HTTP server on the host, even when the client connection is upgraded to HTTPS (see TLS termination below).
- HTTP Strict Transport Security (HSTS) is enabled with a one year max-age.
- The minimum TLS version the service supports is 1.2, with TLS 1.3 being the preferred version.
- TLS termination is done at service ingress using service certificates, issued by a Microsoft CA.
  - Note: After TLS, header rewriting takes place. This is required for many web application development scenarios.
- The connection between the tunnel relay and tunnel host is E2E encrypted as described above.

### Anti-phishing protection

When connecting to a web forwarding url for the first time, users are presented with an interstitial anti-phishing page.

Under any of the following circumstances, the page is skipped:
- The request uses a method other than `GET`
- The request `Accepts` header does not contain `text/html`
- The request contains the `X-Tunnel-Skip-AntiPhishing-Page` header
- The request contains the `X-Tunnel-Authorization` header
- The user has already visited the page and clicked continue

## Further questions

If after reviewing this page, you have further questions, see [Feedback and support](support.md#feedback-and-support).

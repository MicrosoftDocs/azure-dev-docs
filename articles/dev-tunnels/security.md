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

Both hosting and connecting to a tunnel requires authentication with the same Github or Microsoft account on each end. In both cases, outbound connections are made to the service hosted in Azure; no firewall changes are generally necessary, and no set up of network listeners is required.

On connection of a tunnel, an SSH connection is created over the tunnel in order to provide end-to-end encryption. The current preferred cipher for this encryption is AES 256 in CTR mode, and the code that implements this is [open source](https://github.com/microsoft/dev-tunnels).

## Access Control

By default, tunnels and tunnel ports are private and only accessible to the user who created the tunnel.

A rich set of access control capabilities are available in the service. Access control entries (ACEs) can be added to tunnels or tunnel ports to allow or deny access for others. GitHub, AAD and MSA are supported as identity providers for authentication and authorization. With AAD, ACEs can be added for specific users, AAD groups or the current AAD tenant. With GitHub, ACEs can be added for specific users, teams or a GitHub organization. GitHub team or org access requires installing the VS Tunnel Service GH app in the org.

If a tunnel or tunnel port does need to be accessed without authentication, an allow-anonymous ACE can be added. Tunnel access can also be restricted to specific IP address ranges including those defined by Azure service tags.

See the [Basis CLI](../cli/README.md#manage-tunnel-access) page to learn more about access control lists (ACLs), access control entries (ACEs), and how to manage them with the through the CLI. The [TypeScript SDK](../apis/typescript-sdk.md#4-host) and [.NET SDK](../apis/dotnet-sdk.md#3-create-management-client-and-tunnel-definition) docs provide examples for adding access control entries in those languages.

### Tunnel Policies

Tunnel policies allow access controls and resource limits to be set for all tunnels within a team or organization. At this stage policies can only be set by the Basis team. In a future release we plan for owners/admins to be able to manage policies for their teams/orgs. In the meantime you can [contact the Basis team](https://aka.ms/basis-partners) if your team needs to add a policy.

## Tunnel Connections

### E2E Encryption

Client-SDK connections are end-to-end encrypted using the SSH protocol. Traffic routed through the service does not persist in any way. Even if the tunnel relay service was compromised, it could not decrypt any of the tunnel communication.

HTTP (browser) client connections are not E2E encrypted as access to the Application Layer is required for Ingress and HTTP Header Rewriting. See the section on web-forwarding below for more details.

The SSH protocol uses a Diffie-Hellman key-exchange to establish a shared secret for the session, and derives from that a key for AES symmetric encryption. The encryption key is rotated periodically throughout the duration of the session. The shared session secret and all encryption keys are only maintained in-memory by both sides, and are only valid for the duration of the session. They are never written to disk or sent to any service.

The SSH session is also two-way authenticated. The host (SSH server role) uses public/private key authentication as is standard for the SSH protocol. When a host initiates a session, it generates a unique ECDSA public/private key-pair for the session. The host private key is kept only in memory in the host process; it is never written to disk or sent to any service. The host public key is published to the service along with the session connection information where authorized clients can connect. When a client connects to the host's SSH session, the client uses the SSH host authentication protocol to validate that the host holds the private key corresponding to the published public key (without the client actually getting to see the private key).

### Web-forwarding

Tunnel ports using the HTTP(S)/WS(S) protocols can be accessed directly via the provided web-forwarding url (e.g. `https://mytunnel-3000.rel.tunnels.api.visualstudio.com/`).

- Insecure client connections are **always** automatically upgraded to HTTPS/WSS.
  - Note: These may still connect to a (non-TLS) HTTP server on the host, even when the client connection is upgraded to HTTPS (see TLS termination below).
- HTTP Strict Transport Security (HSTS) is enabled with a one year max-age.
- The minimum TLS version the service supports is 1.2, with TLS 1.3 being the preferred version.
- TLS termination is done at service ingress using our service certificates, issued by a Microsoft CA.
  - Note: After TLS, header rewriting takes place. This is required for many web application development scenarios. See [Header rewriting](../design/design.md#header-rewriting).
- The connection between the tunnel relay and the tunnel host is E2E encrypted as described above.

[Example TLS report for web-forwarding url - ssllabs.com](https://www.ssllabs.com/ssltest/analyze.html?d=qdbsj911-3000.usw2.rel.tunnels.api.visualstudio.com&hideResults=on)

#### Anti-phishing protection

When connecting to a web forwarding url for the first time, users are presented with an antiphishing page. This page will be skipped in all of the following scenerios: 
- The request is not GET
- The user has already visited that page and clicked continue
- The request "Accepts" header does not contain "text/html"
- The request contains the "X-Tunnel-Skip-AntiPhishing-Page" header
- The request contains the "X-Tunnel-Authorization" header

## Domains & IP Ranges

If you're part of an organization who wants to control access to dev tunnels. You can do so by allowing or denying access to the following domains.

No inbound connections are required to use the service.

Below is the list of domains and IPs where outbound connections may be made.

This information can be used to either allow or block access to the service.

- Authentication
  - `github.com` - [GitHub IP Addresses](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-githubs-ip-addresses)
  - `login.microsoftonline.com` - [AzureActiveDirectory service tag](https://docs.microsoft.com/en-us/azure/virtual-network/service-tags-overview)

- Tunnel service domains
  - `global.rel.tunnels.api.visualstudio.com`
  - `[clusterId].rel.tunnels.api.visualstudio.com`
  - `*.rel.tunnels.api.visualstudio.com`
  - `*.[clusterId].rel.tunnels.api.visualstudio.com`
  - _Where `[clusterId] = {usw2, use, euw, asse, brs, aue}`_

- Tunnel service IPs
  - `TCP 20.69.79.91:443` (usw2)
  - `TCP 20.120.56.11:443` (use)
  - `TCP 20.103.221.187:443` (euw)
  - `TCP 20.197.80.108:443` (asse)
  - `TCP 20.201.67.222:443` (brs)
  - `TCP 20.213.0.59:443` (aue)
  - _Note these IPs may change in the future. Static IPs and Service Tags are on our roadmap._

## Privacy & Data Storage

- The service stores user IDs (for tracking tunnel ownership and ACEs) but does not store or log other user profile information such as names or emails.
- All user and tunnel metadata is stored only in the home region of the tunnel, and is never replicated to other regions, with the exception of tunnel names which are replicated to support global name resolution.
- Tunnel connection payload data is never stored or logged.

## Security Roadmap
| Status                | Roadmap Item                        | Details |
|:----------------------|:------------------------------------|:--------|
| :white_check_mark:    | Audit Logs                          | Auditing of user and ip origin of tunnel requests. |
| :white_check_mark:    | Client IP Restrictions / Allow List | Restrict tunnel access to clients from specific IPs including Azure service tags. |
| :white_check_mark:    | Tunnel Policies                     | Allows for policies such as disabling anonymous access for all tunnels created in an AAD tenant and restricting access to members of an AAD tenant. |
|                       | Static IPs & Service Tags           | The Basis service has static IP addresses and is assigned service tags. |

--

## Tunnel Access Tokens

The CLI can be used to request access tokens that grant limited access to anyone holding the token:

```powershell
devtunnel token
```

Currently, 4 types of tunnel access tokens are available:

- A "management access token" allows the bearer to perform any operations on that tunnel, including setting access controls, hosting, connecting, and deleting the tunnel.
- A "manage ports access token" allows the bearer to add and delete ports on a tunnel.
- A "host access token" allows the bearer to host the tunnel and accept connections, but not make any other changes to it.
- A "client access token" allows the bearer to connect to any ports of the tunnel.

All of the tokens are limited to the current tunnel; they do not grant access to any of the current user's _other_ tunnels, if any. The tokens expire after some time (currently 24 hours). Tokens can only be refreshed using an actual user identity that has manage-scope access to the tunnel (not just a management access token).

Most CLI commands can accept a `--access-token` argument with an appropriate token as an alternative to logging in. Web service clients can pass a token in a header to authorize requests to a tunnel URI:

```http
X-Tunnel-Authorization: tunnel <TOKEN>
```

(The standard `Authorization` header isn't used because it would potentially interfere with application-specific authorization.)

## Further questions

If after reviewing this page, you have further questions, see [Feedback and support](support.md#feedback-and-support).

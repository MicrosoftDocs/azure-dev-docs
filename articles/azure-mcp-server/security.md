---
title: Secure your Azure MCP Server deployment
description: Learn how to secure Azure MCP Server deployments with authentication, gateway protection, local server hardening, and mitigation of tool-poisoning risks.
author: diberry
ms.author: diberry
ms.reviewer: sandeepsen, gilbertw, vigera, larryo, svukel, alzimmer  
ms.date: 07/15/2026
ms.topic: article
ms.custom:
  - build-2025
  - horz-security
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
# customer intent: As a developer using Azure MCP Server, I want to understand the security considerations so that I can deploy and operate it safely.
---

# Secure your Azure MCP Server deployment

Azure MCP Server connects AI agents to Azure services, executes tools on your behalf, and brokers access to your Azure resources through the tokens that authorize each call. Because the Azure MCP Server sits between your agents and your cloud resources, you must protect the Azure MCP Server itself, the tokens that authorize access, and the tool inputs and outputs that flow through your agents.

This article provides guidance on how to best secure your Azure MCP Server deployment.

## Authentication and authorization

The Azure MCP Server uses Microsoft Entra ID through the Azure Identity library to authenticate callers. The MCP authorization specification requires OAuth 2.1, so treat the Azure MCP Server as an OAuth 2.1 resource server. Clients must use PKCE (Proof Key for Code Exchange) when performing authorization code flows. Apply the following practices:

- **Validate every authorization token.** Verify the issuer, audience, and expiry on each incoming authorization token before you allow tool execution. Don't trust tokens that are missing required claims or that were issued for a different resource.

- **Bind authorization tokens to their intended audience.** Use audience-bound tokens so that a token issued for one service can't be replayed against another.

- **Enforce strict redirect-URI matching and per-client consent.** For authorization-code flows, allow only preregistered, exact redirect URIs and require per-client consent, so an intercepted authorization code can't be redeemed by a different client.

- **Follow least-privilege RBAC.** Grant each caller only the Azure RBAC roles required for its task. The Azure MCP Server reflects your Azure subscription permissions - callers that have broad subscription access can invoke a broad set of tools. Scope role assignments as narrowly as possible. Enable only the tools each caller needs, because every reachable tool adds to your attack surface.

- **Prefer workload identities.** In agentic scenarios, use managed identities or workload identities rather than long-lived secrets or shared credentials. When static credentials are unavoidable - for example, API keys for third-party services that don't support workload identity - store them in [Azure Key Vault](/azure/key-vault/general/overview) and reference them from your deployment configuration. Never store credentials in source code or plain-text configuration files, and rotate them on a regular schedule.

- **Avoid the confused-deputy pattern.** Scope the Azure MCP Server's own Azure identity and permissions to the minimum it needs to operate. Don't let the server act as a deputy that lends its broad privileges to a lower-privileged caller: separate the server's execution identity from the caller's authorization, and enforce per-caller permission checks rather than relying solely on the server's own credentials.

<a name='remote-server-protection'></a>

## Remote Azure MCP Server protection

When you deploy Azure MCP Server as a remote self-hosted server, consider placing it behind Azure API Management (APIM) as an enforcement gateway:

- **Place the Azure MCP Server behind an enforcement gateway.** APIM can validate Entra ID tokens before requests reach your Azure MCP Server, which removes the need for your application code to inspect tokens.

- **Apply gateway policies for rate limiting and auditing.** Use APIM policies to limit how often callers can make requests, restrict allowed tool paths, and log every request for audit purposes.

- **Centralize access control at a single choke point.** A gateway provides a single choke point for access control and observability across multiple downstream MCP tools.

Protect the endpoint that Azure MCP Server clients connect to. A substituted or spoofed URL can receive tool-execution requests and expose credentials or Azure resource data. To reduce that risk:

- **Connect only to trusted Azure MCP Server endpoints.** Use only endpoints that you provisioned or that your team exposes through APIM. Don't derive the Azure MCP Server URL from user-supplied input or unauthenticated discovery responses.

- **Verify the Azure MCP Server's TLS certificate.** Ensure the endpoint matches the expected host. When using APIM, route clients through the gateway so the backing endpoint can't be silently redirected.

- **Fail closed on certificate errors.** Treat an unverified or unrecognized Azure MCP Server certificate as a connection failure, not a warning to bypass.

For self-hosting options, see [Deploy a self-hosted Azure MCP Server](how-to/deploy-remote-mcp-server-microsoft-foundry.md).

## Local deployment hardening

A local Azure MCP Server runs in your developer environment for development use. Because it can act with your Azure identity, review what your signed-in account can access before you connect an agent to Azure resources:

- **Review your Azure permissions.** Check the Azure RBAC roles assigned to your developer account, and remove broad subscription or management-group permissions that aren't needed for the task.

- **Limit local access.** Run the local Azure MCP Server from a trusted workstation or container, and don't expose the local endpoint to untrusted networks or other users on the machine.

- **Keep the local server current.** Use current Azure MCP Server packages and patched dependencies, especially before testing against nonproduction Azure resources.

- **Sandbox local execution.** Run the local Azure MCP Server in a container or sandbox with restricted filesystem and network access, and keep the toolchain patched, to limit command-injection and path-traversal impact when tools spawn subprocesses.

Don't use a local Azure MCP Server to handle production data or production credentials.

## Tool poisoning and prompt injection

MCP tool descriptions and tool responses are inputs to your agent's context. If tool metadata or tool output is malicious, it can influence an agent that has access to Azure MCP Server tools and the Azure permissions behind them.

To reduce this risk for Azure MCP Server deployments:

- **Prefer the official Microsoft-maintained Azure MCP Server.** Use the first-party Azure MCP Server for Azure services instead of an unverified server that exposes similar Azure tools. Treat tool schema changes as dependency changes that require review.

- **Trust but verify tool context.** Treat tool descriptions and responses as untrusted input to the agent. Review tool definitions before production use, and validate or sanitize data that tool responses pass back into agent context.

- **Change-control tool definitions.** Review and pin known-good tool schemas and descriptions, and require re-approval before updated tool metadata takes effect, so a server can't silently change behavior after approval (a supply-chain "rug pull").

- **Use Azure security controls where they fit your architecture.** Evaluate the controls in [Microsoft security controls](#microsoft-security-controls) to inspect agent context, detect sensitive data flows, and monitor Azure AI workloads. Verify each integration path before relying on it in production.

<a name='third-party-server-trust'></a>

## Third-party MCP server trust

Many developer environments run multiple MCP servers at the same time. For Azure work, prefer the official Microsoft-maintained Azure MCP Server over community alternatives for Azure services.

If you add a third-party MCP server next to Azure MCP Server:

- **Verify the publisher and update path.** Use servers from trusted publishers with a public security contact. Review changelogs and package updates before allowing the third-party server into an agent environment that can also reach Azure MCP Server tools.

- **Keep credential contexts separate.** Don't let an unverified server share the credentials, filesystem, or network access used by Azure MCP Server. Run untrusted servers with least privilege in an isolated environment.

- **Review tools across the full agent context.** A malicious server can use its tool descriptions to influence agent behavior toward other trusted servers in the same context, including Azure MCP Server. Audit the tool descriptions for every server you configure, not only the Azure tools.

## Governance and monitoring

Track which Azure MCP Server instances run in your environment, and monitor their activity:

- **Inventory approved servers.** Maintain a known-good baseline of registered Azure MCP Server endpoints, for example with [Azure API Center](/azure/api-center/overview), so you can detect unregistered "shadow" servers that fall outside governance.

- **Monitor activity and retain evidence.** Correlate Azure MCP Server activity in [Microsoft Sentinel](/azure/sentinel/overview) and retain [Microsoft Purview](/purview/purview) audit logs so you can investigate suspicious tool calls.

## Microsoft security controls

Use the following Microsoft security services to add defense-in-depth for Azure MCP Server workloads. The applicability of each control to your specific deployment depends on your architecture. Evaluate each control in the context of your own environment:

- **Inspect agent context with Prompt Shields.** Use Azure AI Content Safety Prompt Shields to inspect content entering your agent's context - including tool descriptions and tool outputs - and detect potential prompt-injection attempts. Consider integrating Prompt Shields in your agent pipeline when you're using dynamically loaded tool metadata. For more information, see [Prompt Shields](/azure/ai-services/content-safety/concepts/jailbreak-detection).

- **Detect sensitive data flows with Purview DLP.** Where your workload is explicitly integrated with Microsoft Purview, use Purview Data Loss Prevention policies to help detect and flag sensitive data in data flows associated with your agents. Coverage of arbitrary tool-call parameters isn't automatic - it depends on your deployment architecture and which Purview connectors your workload uses. Evaluate whether your specific integration path supports the controls you need before relying on DLP for agent workloads. For more information, see the [Microsoft Purview documentation](/purview/purview).

- **Monitor AI workloads with Defender for Cloud.** Use Microsoft Defender for Cloud AI threat protection for runtime threat detection on AI workloads, including alerts on suspicious activity in Azure OpenAI and Azure AI Model Inference service API calls. Coverage doesn't automatically extend to arbitrary MCP tool outputs - it applies to the Azure AI service layer in your architecture. For more information, see [AI threat protection](/azure/defender-for-cloud/ai-threat-protection).

> [!NOTE]
> The controls listed earlier are general Azure security services. Verify that each control's integration path is supported for your specific Azure MCP Server deployment architecture before enabling it in production.

## Related content

- [What is the Azure MCP Server?](overview.md)

- [Azure MCP Server concepts](concepts.md)

- [Deploy a self-hosted Azure MCP Server](how-to/deploy-remote-mcp-server-microsoft-foundry.md)

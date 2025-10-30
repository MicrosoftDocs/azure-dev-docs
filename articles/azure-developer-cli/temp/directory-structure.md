# `azd` directory structure with agents code

## Table of Contents

- [Overview](#overview)
- [General Directory Structure](#general-directory-structure)
- [Example: one declarative agent](#example-one-declarative-agent)
- [Example: one code-based agent (HOBO)](#example-one-code-based-agent-hobo)
- [Example: one code-based agent (COBO)](#example-one-code-based-agent-cobo)
- [Example: multiple agents](#example-multiple-agents)
- [Example: agent and app project](#example-agent-and-app-project)

## Overview

In this section, we start with showing the directory structure of a project under the following use cases:

- 1 declarative agent: the developer just wants to work on an agent, separately from other dependencies.
- 1 code-based agent: the developer just wants to work on an agent, defined in code, potentially with a workflow, separately from other dependencies.
- 1 agent + app: the developer works in parallel on an agent, embedded within a backend service and a frontend app.

⚠️ **Important**: in all those, `agent.yaml` is left for Agent Service to define. The extension will just implement whatever is decided as our standard.

## General Directory Structure

As part of the `azd ai agent` extension, we want to configure, curate and maintain an [**agent manifest**](./terminology.md) and its related agent code in a local subdirectory. At the very least, this subdirectory will contain a file `agent.yaml` with a schema maintained by Azure AI Foundry.

Because an agent is eventually deployed under the Azure AI Foundry project, the location of the agent subdirectory will be added to azd's `azure.yaml` under `services`.

**User actions on this folder:**

The `azd ai agent` extension will allow developers...

- to **INIT** this folder from scratch or from an agent of our catalog

  - _injects the folder into `azure.yaml`_

- to **RUN** the agent specified in this folder locally for testing,

  - _reuses the `.azure/ENVNAME/.env` to run_

- to **DEPLOY** the agent in this folder into an Azure AI Foundry project, either individually (just the agent) or part of an application (the entire repository),

  - _deploys in the services defined in `azure.yaml` and its corresponding environment in `.azure/ENVNAME/`_

- to **PUBLISH** or **UPDATE** the agent manifest in an organization registry for sharing.

  - _publishes in a registry specified in the command_

📌 Dependencies:

- [https://github.com/Azure/azure-dev/issues/5680](azure-dev/5680): `azd` needs to allow extensions to hook into `services` and populate their own section

## Example: one declarative agent

The project consists only in one single agent defined with prompt and yaml. That agent can be [**deployed**](./terminology.md) in an Azure AI Project, the directory structure will be very minimal.

```text
├── .azure/                 # Local environments (ex: .env)
├── src/                    # Agents
│   └── agent.yaml          # Agent manifest in yaml
└── azure.yaml              # AzD configuration
```

In this context, here's what the `azure.yaml` file will look like:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: declarative-agent-project

services:
  my-agent:
    project: src  # points to where agent.yaml is
    host: foundry.hostedagent

resources:
  foundry-project:
    type: ai.project
    models:
      - name: gpt-4o-mini
        version: "2024-07-18"
        format: OpenAI
        sku:
          name: GlobalStandard
          usageName: OpenAI.GlobalStandard.gpt-4o-mini
          capacity: 10
```

## Example: one code-based agent (HOBO)

The project consists in one agent or a multi-agent pool defined in code. That agent can be [**deployed**](./terminology.md) in an Azure AI Project, the directory structure will minimal as well. But it will unfold under the `src/` directory with source code, requirements, etc.

```text
├── .azure/              # Local environments (ex: .env)
├── src/                 # Agents
│   ├── agent.yaml       # Agent manifest in yaml
│   ├── main.py          # Agent code
│   └── pyproject.toml   # Agent code requirements
└── azure.yaml           # AzD configuration
```

Note: the `azure.yaml` will be identical to what's in the declarative case.

In this context, here's what the `azure.yaml` file will look like (identical to the [declarative case](#example-one-declarative-agent)):

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: code-agent-project

services:
  code-agent:
    project: src  # points to where agent.yaml is
    host: foundry.hostedagent

resources:
  foundry-project:
    type: ai.project
    models:
      - name: gpt-4o-mini
        version: "2024-07-18"
        format: OpenAI
        sku:
          name: GlobalStandard
          usageName: OpenAI.GlobalStandard.gpt-4o-mini
          capacity: 10
```

## Example: one code-based agent (COBO)

The project consists in one agent or a multi-agent pool defined in code. That agent can be [**deployed**](./terminology.md) in an Azure AI Project, the directory structure will minimal as well. But it will unfold under the `src/` directory with source code, requirements, etc.

```text
├── .azure/              # Local environments (ex: .env)
├── src/                 # Agents
│   ├── agent.yaml       # Agent manifest in yaml
│   ├── main.py          # Agent code
│   └── pyproject.toml   # Agent code requirements
└── azure.yaml           # AzD configuration
```

Note: the `azure.yaml` will be identical to what's in the declarative case.

In this context, here's what the `azure.yaml` file will look like:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: code-agent-project

services:
  code-agent:
    project: src  # points to where agent.yaml is
    host: containerapp
    language: foundry.agent # TODO: ?????????

resources:
  foundry-project:
    type: ai.project
    models:
      - name: gpt-4o-mini
        version: "2024-07-18"
        format: OpenAI
        sku:
          name: GlobalStandard
          usageName: OpenAI.GlobalStandard.gpt-4o-mini
          capacity: 10
```

❓ Open questions:

- How do we "connect" the containerapp being deployed and the foundry-project ?

## Example: multiple agents

Here's how we think the directory structure will be when using multiple agents:

```text
├── .azure/                 # Local environments (ex: .env)
├── src/                    # Agents
│   ├── analytics-agent/    # First agent folder
│   │   ├── agent.yaml      # Agent manifest in yaml
│   │   ├── main.py         # Agent code
│   │   └── pyproject.toml  # Agent code requirements
│   └── customer-service-agent/  # Second agent folder
│       ├── agent.yaml      # Agent manifest in yaml
│       ├── main.py         # Agent code
│       └── pyproject.toml  # Agent code requirements
└── azure.yaml              # AzD configuration
```

In this context, here's what the `azure.yaml` file will look like:

```yaml
name: multi-agent-project

services:
  analytics-agent:
    project: src/analytics-agent  # points to where agent.yaml is
    host: foundry.hostedagent
  customer-service-agent:
    project: src/customer-service-agent  # points to where agent.yaml is
    host: foundry.hostedagent

resources:
  foundry-project:
    type: ai.project
    models:
      - name: gpt-4o-mini
        version: "2024-07-18"
        format: OpenAI
        sku:
          name: GlobalStandard
          usageName: OpenAI.GlobalStandard.gpt-4o-mini
          capacity: 10

```

## Example: agent and app project

The project consists of an agent embedded within a backend and app to serve user queries. The agent can be [**deployed**](./terminology.md) in an Azure AI Project, and the application can be `azd up` into a `containerapp` or some other hosting service.

```text
├── .azure/                 # Local environments (ex: .env)
├── infra/                  # Infrastructure as Code (Bicep files)
├── src/                    # Source code
│   ├── analytics-agent/    # Backend API service
│   ├── frontend/           # React frontend application
└── azure.yaml              # AzD configuration
```

In this context, here's what the `azure.yaml` file will look like:

```yaml
name: app-and-agent-project

services:
  chat-app:
    project: src/frontend
    host: containerapp
    language: python
  analytics-agent:
    project: src/analytics-agent  # points to where agent.yaml is
    host: foundry.hostedagent

resources:
  chat-app:
    type: host.containerapp
    port: 80
    uses:
       - foundry-project
  foundry-project:
    type: ai.project
    models:
      - name: gpt-4o-mini
        version: "2024-07-18"
        format: OpenAI
        sku:
          name: GlobalStandard
          usageName: OpenAI.GlobalStandard.gpt-4o-mini
          capacity: 10
```

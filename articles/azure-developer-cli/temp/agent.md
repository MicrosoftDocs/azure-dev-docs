# `azd ai agent` extension spec

This document lays out the specification of a new `azd` extension for agent development.

**Motivation** - This `azd ai agent` extension aligns with the [CLI Strategy for AI Foundry](https://microsoft.sharepoint.com/:w:/t/AMLExperiences/ESuakivzSldFqc2lFT5NPP8BbbB5GKL0vnm2SlipCtkdbw?e=qt5tDL). Existing az CLI tools are primarily designed for control plane operations and IT admin workflows, which do not align with the needs of developers working on agent-centric applications. As developer workflows increasingly demand support for inner-loop tasks - like scaffolding, publishing, evaluating, and fine-tuning agents - the azd CLI, with its native integration of Azure AI Services and focus on application development, offers a more suitable foundation. This also aligns with a company wide effort to promote `azd` as the developer CLI experience.

**Important**:
- Per product/marketing recommendation, the extension will be called under `azd ai agent` namespace.
- As much as possible, we want to reuse existing `azd` verbs (ex: `azd up`) instead of creating extension-specific verbs. We'll use extension-specific verbs when `azd` native doesn't support what we need (ex: `azd ai agent run`).
- The `azd` extension framework provides services to get context about the current project, including the current environment, configuration, project configuration, etc. This context could then be used by the `azd ai` extension code to ensure it is are using the correct environments/configuration.

## Release Plan

For Ignite 2025, we're targetting only [JTBD 1](#jtbd1) + [JTBD 2](#jtbd2) (scaffolding using `azd ai agent init`) and [JTBD 4](#jtbd4) (deploying using `azd up`).

## 🧠 Anchoring use case: the contoso data analytics agent

### Scenario 1 : agent-only project

The Contoso AI Enablement Team is building the brain behind business intelligence. To accelerate AI adoption across all internal units, this central team of developers is crafting a powerful analytics agent that speaks the language of data - and of people.

Connected to Microsoft Fabric, this agent lets users query, summarize, and transform structured data using natural language, turning complex datasets into clear insights, charts, and reports.

And it's built to scale. Designed as a generic, reusable agent, it's headed for Contoso's central registry so every business unit can deploy it on their own data - no reinvention required.

The Contoso AI Enablement Team will use the `azd ai` extension to:

- Scaffold the repository and environment for building the analytics agent.
- Iterate rapidly on agent code and workflows.
- Package and publish the agent for reuse across Contoso's business units via the central registry.

### Scenario 2 : agent in a solution

Faced with rising expectations to integrate AI into daily operations, Contoso Sales department is seizing the moment to reimagine how Sales data drives decisions. Their vision? An intelligent, chat-based experience where Sales agents interact with an internal analytics agent to surface insights, build dashboards, and act faster.

To bring this to life, they've enlisted developers to build a proof of concept : an agentic sales assistant that transforms raw data into real-time strategy. Thanks to the work of the Contoso AI Enablement Team, the already have an agent. Now they need to integrate this agent into an existing application and workflow.

The Contoso Sales developers will use the `azd ai` extension to:

- Scaffold the development environment for the sales assistant.
- Bring in the data analytics agent from another team.
- Connect the agent to internal sales data sources.
- Build a chat experience / web UI around the agent.
- Package the solution for internal testing and reuse.

## 🎯 Jobs-to-be-done

> An Agent Developer is responsible for building, configuring, and deploying AI agents as part of an application or solution. They typically have experience with application development, cloud infrastructure, and prompt engineering, and work in environments like VS Code, CLI tools, and cloud-native stacks.

**As an Agent Developer...**

<a id="jtbd1"></a>
1. When I'm starting to build an agent,  
   **I want to scaffold a new project from scratch or from a blueprint from the agent catalog**,  
   so I can define the agent's structure and logic based on my application's needs.

<a id="jtbd2"></a>
2. When I'm configuring the agent,  
   **I want to define its capabilities and connect it to my app's services and Azure resources**,  
   so it can operate effectively within my solution's environment.

<a id="jtbd3"></a>
3. When I'm validating the agent,  
   **I want to run it locally**,  
   so I can ensure it behaves as expected before deployment.

<a id="jtbd4"/></a>
4. When I'm deploying,  
   **I want to package and deploy the agent alongside my application**,  
   so it's integrated into my solution's runtime and lifecycle.

> An Agent Publisher is responsible for packaging and publishing reusable agents to a shared blueprint catalog. As they aim for their agent consumption, they are interested and maybe experienced in developer enablement, documentation, and versioning, and focus on standardization, reuse, and collaboration across teams. They also are expected to maintain the agent blueprint in a working state: fix bugs, fix vulnerabilities / component governance alerts, etc.

**As an Agent Publisher...**

<a id="jtbd5"></a>
5. When I'm ready to share,  
   **I want to publish the agent to the blueprint catalog**,  
   so others can discover, reuse, or extend it.

<a id="jtbd6"></a>
6. When I'm maintaining or upgrading a published agent (improve or fix),  
   **I want to update its metadata, code, version, or dependencies**,  
   so consumers always have access to a stable, secure and up-to-date version.

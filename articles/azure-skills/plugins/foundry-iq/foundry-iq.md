---
title: Azure skill for Foundry IQ (Azure AI Search)
description: Use the Foundry IQ skill to get help with Foundry IQ (Azure AI Search), build agents that answer questions from your documents, and explore entity graphs, topic graphs, and ontologies.
author: yunjchoi
ms.author: yunjchoi
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 11/18/2026
ms.custom: [devx-track-copilot-skills, skill-version-0.3.1]
ai-usage: ai-generated
---

# Azure skill for Foundry IQ (Azure AI Search)

The Foundry IQ plugin (`foundry-iq-skills`) helps you work with Foundry IQ (Azure AI Search). Use it to build agents that answer questions from your documents and to explore how the people, organizations, products, and topics in those documents connect.

**Skill** `foundry-iq` | [Source code](https://github.com/microsoft/azure-skills/blob/main/.github/plugins/foundry-iq-skills/skills/foundry-iq/SKILL.md)

## What's included

| Need | How the plugin helps |
|---|---|
| Foundry IQ | Get guidance on indexes, keyword, vector, and semantic search, access, ingestion, retrieval quality, and grounded agents. |
| Try graphs end to end | A guided demo takes sample documents, or your own, through graph creation and questions. |
| Entity graphs | Create or connect resources, extract entities and relationships, and answer multi-hop questions with sources. |
| Topic graphs | Build and explore the main themes across a document collection. |
| Ontologies | Draft, refine, review, and export an ontology, or inspect versions and validate an OWL file. |
| Graph-backed grounding | Match different names for the same person, organization, or product to one entity. |

This plugin isn't for the Microsoft Graph API, other Azure products, or continuous evaluation.

## Install the plugin

Add the Azure Skills marketplace, install the plugin, and confirm that it's active. Use the commands for your agent client.

### GitHub Copilot CLI

Run the following commands in your terminal:

```bash
copilot plugin marketplace add microsoft/azure-skills
copilot plugin install foundry-iq-skills@azure-skills
copilot plugin list # confirm foundry-iq-skills is active
```

To update the plugin, enter the following command in an interactive Copilot session:

```text
/plugin update foundry-iq-skills@azure-skills
```

### Claude Code

Enter the following commands in Claude Code:

```text
/plugin marketplace add microsoft/azure-skills
/plugin install foundry-iq-skills@azure-skills
/plugin # confirm the plugin appears as installed
```

### Codex CLI

Run the following commands in your terminal:

```bash
codex plugin marketplace add microsoft/azure-skills
codex plugin add foundry-iq-skills
codex plugin list # confirm foundry-iq-skills is active
```

**Next:** [Try the graph demo](#try-the-graph-demo).

## Prerequisites

- An agent client, such as [GitHub Copilot CLI](https://github.com/github/copilot-cli), Claude Code, Cursor, or Codex, and [Git](https://git-scm.com/) to add a plugin marketplace.
- [Python](https://www.python.org/downloads/) 3.12, 3.13, or 3.14.
- [Node.js](https://nodejs.org/) 22.13 or later. The current LTS release works.
- The [Azure CLI](/cli/azure/install-azure-cli), signed in to the tenant you want to use:

  ```azurecli
  az login --tenant "<tenant-id-or-domain>"
  ```

- An Azure subscription where you can create resources. Some steps assign roles, which requires more access than being signed in.

To run the complete graph demo, use Windows x64 or Linux x64/ARM64. On macOS Apple Silicon, you can use most graph features, but you can't build topic graphs. macOS Intel isn't supported.

Copilot checks your machine and sets up what it needs the first time you use a graph feature. You can ask for explanations and plans without Azure access; building, querying, and changing resources require it.

## Try the graph demo

Enter the following prompt:

> **Show me what Foundry IQ graph can do.**

Copilot uses a set of sample Microsoft earnings call transcripts to build these in Azure AI Search:

- Searchable passages.
- **Topics** that show what the calls cover.
- A **knowledge graph**, built with a standard business ontology of organizations, people, products, and events, that connects who said what about which product.
- A **knowledge base** that agents can query.

Then it asks sample questions, compares the answers from search and from the graph, and cites the source transcript for each answer.

| Step | What happens | What you do |
|---|---|---|
| Check | Copilot checks your machine, your Azure sign-in, and which chat and embedding models you can use. | Nothing. |
| Choose | Copilot explains the demo and asks its setup questions in one message, with defaults filled in. | Accept the defaults, or say what you want to change. |
| Build | Copilot creates the Azure resources, adds public Wikidata facts to help match names, makes the documents searchable, finds topics, and builds the graph and knowledge base. | Approve each step, or approve them all at once. Each step shows what it changes, how long it takes, and its estimated cost when one is available. |
| Explore | Copilot opens the Graph Playground in your browser. | Browse the graph and topics. |
| Ask | Copilot asks sample questions, including one with a false premise, and compares search with the graph. | Watch, or ask your own questions. |
| Recap | Copilot lists what it created, what remains billable, any limitations it found, and how to clean up. | Review it. |

The demo takes about an hour or more, mostly waiting for Azure to index documents and extract the graph. Azure AI Search, storage, and model usage are billed until you delete the resources.

### What you can say during the demo

| Say | To |
|---|---|
| "Defaults are fine" | Accept the default setup choices. |
| "Approve" or "Stop" | Answer an approval request. Nothing changes in Azure until you approve. |
| "Approve all" | Approve the remaining steps at once. Copilot still asks again if a plan changes. |
| "Show details" | See every change in a step, including role assignments. |
| "Check again" | Retry after Azure finishes applying a new role assignment, which can take several minutes. |

### Change the defaults

Tell Copilot in your answer to the setup questions, or start with a prompt like:

- "Build a graph from the documents in my local folder."
- "Run the Foundry IQ graph demo on a small sample of my documents."
- "Run the Foundry IQ graph demo with my own ontology file."
- "Run the Foundry IQ graph demo and generate an ontology from the topics."
- "Run the Foundry IQ graph demo with my existing Azure AI Search service and models."

To reuse existing resources, connect compatible Azure AI Search, Storage, and chat and embedding model deployments. Graph features aren't available on Free-tier or key-only Azure AI Search services.

### Explore in the Graph Playground

The Graph Playground is a local, read-only viewer for the graph, topics, and grounding you built. It isn't a separate chat. After a graph is built or you get a cited answer, ask:

- "Open the Graph Playground."
- "Close the Graph Playground."

### Continue later

Copilot saves the demo's run files in your working folder. In a new session, ask:

> "Continue my Foundry IQ demo."

### Clean up

The demo creates its resources in new resource groups. Copilot doesn't delete anything; at the end, it gives you the commands to delete those resource groups so you can run them yourself. To see them again, ask:

> "How do I clean up my Foundry IQ demo resources?"

## More example prompts

| Goal | Prompt |
|---|---|
| Choose an approach | "Do I need a knowledge graph, or is vector search enough for my documents?" |
| Check existing resources | "Check whether my existing Foundry IQ, Storage, and OpenAI resources are ready for Entity Graph." |
| Ask across documents | "Show which organizations connect to Project X, with sources." |
| Find themes | "Find the main themes across my document collection." |
| Work with ontologies | "Draft an ontology from these topics and help me review it." · "Validate this OWL file and explain its classes." |
| Fix indexing | "Why are new documents missing from my Foundry IQ index?" |
| Learn search features | "How can I combine keyword and vector search?" |
| Call the API | "Help me prepare a REST request for this Foundry IQ operation." |

## Important considerations

- **Preview APIs.** Graph builds and some queries use the `2026-11-01-preview` REST API. Other steps use other fixed API versions, which you can't change. Graph features are available in limited regions and services; Copilot checks availability before it creates anything.
- **Costs and approval.** Creating resources, indexing documents, and asking model-backed questions can incur costs, even with sample documents. Review and approve each plan before it runs. A changed plan needs a new approval. Approving the demo doesn't include cleanup or deletion.
- **Data access.** Graphs, summaries, topic indexes, and caches are copies of your source data and don't keep its access permissions. Check who can access them, keep links to the source, and plan for updates and revoked access. Never put keys, tokens, or private document content in prompts or logs.
- **Resource reuse and cleanup.** Confirm which resources Copilot reuses or creates. When you clean up, leave shared or reused resources intact. A successful setup or connection check doesn't prove that a build or query succeeded.

## Troubleshooting

| Problem | What to do |
|---|---|
| Copilot can't find a supported Python, or uses the wrong one | Set the `FOUNDRY_IQ_PYTHON` environment variable to the full path of a Python 3.12, 3.13, or 3.14 executable, restart your agent client, and try again. |
| A step reports that a new role isn't ready | New role assignments can take several minutes to apply. Wait, then say "Check again." |
| A step stops partway | Ask Copilot to check the status and continue. It resumes the same approved plan instead of starting over. |

## Related content

- [Azure plugin catalog](../index.md#foundry-iq-plugin)
- [Foundry IQ documentation](/azure/search/)
- [Foundry IQ and agentic retrieval](/azure/search/agentic-retrieval-overview)
- [Hybrid search](/azure/search/hybrid-search-overview)
- [Document-level access control](/azure/search/search-document-level-access-overview)
- [Foundry IQ API and SDK versions](/azure/search/search-api-versions)

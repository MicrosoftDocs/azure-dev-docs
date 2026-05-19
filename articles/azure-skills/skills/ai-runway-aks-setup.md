---
title: Azure skill for AI Runway AKS setup
description: Walks through setting up AI Runway on an existing AKS cluster, from cluster verification to first model deployment.
ms.topic: reference
ms.date: 05/05/2026
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.custom: skill-version-1.0.1
---

# Azure skill for AI Runway AKS setup

Walks through setting up AI Runway on an existing AKS cluster, from cluster verification to first model deployment.

**Skill:** `airunway-aks-setup` | [Source code](https://github.com/microsoft/azure-skills/blob/main/skills/airunway-aks-setup/SKILL.md)

## What it provides

This skill provides GitHub Copilot with specialized knowledge for end-to-end AI Runway onboarding on Azure Kubernetes Service (AKS). It covers cluster verification, controller installation, GPU assessment, inference provider setup, and first model deployment. This skill uses no external MCP tools — all cluster operations are performed directly via `kubectl` and `make`.

## Prerequisites

- **Azure subscription**: [Create a free account](https://azure.microsoft.com/free/) if you don't have one.
- **AI assistant with Azure Skills**: [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/get-started), Visual Studio Code with [Azure MCP extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-mcp-server), Claude Code, or another [compatible MCP client](../install.md).
- **An existing AKS cluster**: If you don't have a cluster, use the `azure-kubernetes` skill first to provision one with a GPU node pool (unless CPU-only inference is acceptable).
- **CLI tools**: `kubectl`, `make`, and `curl` installed locally.

## When to use this skill

Use this skill when you need to:

- Set up AI Runway on an existing AKS cluster from scratch.
- Install the AI Runway controller and Custom Resource Definitions (CRDs).
- Assess GPU hardware compatibility for model deployment.
- Choose and install an [inference provider](#inference-providers) such as KAITO, Dynamo, or KubeRay.
- Deploy your first AI model to AKS via AI Runway.
- Resume a partially complete AI Runway setup from a specific step.

> [!TIP]
> To resume setup from a specific step, tell the skill `skip-to-step N` where N is the step number (1–6).

## Inference providers

An inference provider is the runtime component that serves your AI model on the cluster. This skill supports three providers:

| Provider | Best for | Description |
|----------|----------|-------------|
| **KAITO** | Managed GPU inference | Kubernetes AI Toolchain Operator — automates model deployment with built-in GPU node provisioning |
| **Dynamo** | High-throughput serving | Inference framework optimized for multi-GPU, multi-node deployments |
| **KubeRay** | Ray-based workloads | Kubernetes operator for Ray clusters — ideal for distributed inference and training |

## Suggested workflow

The skill follows a sequential six-step process:

1. **Cluster verification**: Checks Kubernetes context, node inventory, and GPU detection.
1. **Controller installation**: Deploys CRDs and the AI Runway controller.
1. **GPU assessment**: Detects GPU models and flags dtype/attention constraints.
1. **Provider setup**: Recommends and installs the appropriate inference provider.
1. **First deployment**: Picks a model, deploys it, and verifies it reaches Ready state.
1. **Summary**: Recaps the setup, runs a smoke test, and suggests next steps.

> [!NOTE]
> GPU node pools incur significant compute charges. An A100-80GB node pool can cost $3–5+ per hour. Confirm cost implications before provisioning GPU resources.

## Troubleshooting

| Error / Symptom | Likely cause | Remediation |
|-----------------|--------------|-------------|
| No kubeconfig context | Not connected to a cluster | Run `az aks get-credentials` or equivalent |
| Controller in CrashLoopBackOff | Config or RBAC issue | Check logs: `kubectl logs -n airunway-system -l control-plane=controller-manager --previous` |
| Provider not ready | Image pull or RBAC issue | Check pod logs: `kubectl logs <pod-name> -n <namespace>` |
| ModelDeployment stuck in Pending | GPU scheduling failure or provider not ready | Inspect events: `kubectl describe modeldeployment <name> -n <namespace>` |
| `bfloat16` errors at inference | T4 or V100 lacks bfloat16 support | Add `--dtype float16` to serving args |

For detailed troubleshooting and rollback procedures, see the [Azure Diagnostics skill](/azure/developer/azure-skills/skills/azure-diagnostics).

## Example prompts

Try these prompts to activate this skill:

- "Set up AI Runway on my AKS cluster"
- "Install AI Runway on AKS"
- "Deploy a model to AKS using AI Runway"
- "Set up GPU inference on AKS"
- "Configure KAITO on my AKS cluster"
- "Run an LLM on AKS"
- "Set up vLLM on AKS"
- "Set up model serving on AKS"
- "Install the AI Runway controller"

## Related content

- [Azure Model Context Protocol (MCP) Server overview](/azure/developer/azure-mcp-server/overview)
- [Azure Diagnostics skill](/azure/developer/azure-skills/skills/azure-diagnostics) — troubleshooting AI Runway deployments
- [Skill source code](https://github.com/microsoft/azure-skills/blob/main/skills/airunway-aks-setup/SKILL.md)

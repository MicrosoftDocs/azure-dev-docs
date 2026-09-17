---
title: Azure MCP Server Tools for Azure Cloud Architect
description: Use Azure MCP Server tools to design cloud architectures through guided requirements gathering and receive optimal Azure solution recommendations from your IDE.
author: diberry
ms.author: diberry
reviewer: msalaman
ms.date: 09/16/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 1
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
---

# Azure MCP Server tools for Azure Cloud Architect

The Azure Model Context Protocol (MCP) Server lets you design cloud architectures through guided requirements gathering and receive optimal Azure solution recommendations with natural language prompts.

Azure Cloud Architect helps you design scalable, resilient Azure solutions and apply guidance from the Azure Architecture Center; for more information, see [Azure Architecture Center documentation](/azure/architecture/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Design cloud architecture

<!-- @mcpcli cloudarchitect design -->

This tool recommends architecture designs for cloud services, applications, and solutions — including file storage, banking, video streaming, e-commerce, SaaS, and more. It gathers requirements iteratively by asking 1–2 focused questions at a time, tracks a confidence score (0.0–1.0), and returns architecture guidance aligned with the Azure Well-Architected Framework. When the confidence score reaches 0.7 or higher, the tool stops asking follow-up questions and presents the architecture recommendation.

The tool covers all tiers: infrastructure, platform, application, data, security, and operations. Recommendations are conservative, actionable, and provide a high-level overview.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "Please help me design an architecture for a scalable file upload, storage, and retrieval service."
- "Help me design an Azure-based ATM service architecture for user transactions and account management."
- "I want to design a cloud app for ordering groceries with inventory and delivery tracking."
- "How can I design an Azure cloud service to store, transcode, and serve videos to users?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Answer** |  Optional | The user's response to the current question. |
| **Confidence score** |  Optional | A value between 0.0 and 1.0 representing confidence in understanding requirements. When this reaches 0.7 or higher, `nextQuestionNeeded` should be set to false. |
| **Next question needed** |  Optional | Whether another question is needed. |
| **Question** |  Optional | The current question being asked. |
| **Question number** |  Optional | Current question number. |
| **State** |  Optional | The complete architecture state from the previous request as JSON. Tracks architecture components, tiers (infrastructure, platform, application, data, security, operations), requirements (explicit, implicit, assumed), and confidence factors. |
| **Total questions** |  Optional | Estimated total questions needed. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp cloudarchitect design \
  [--question <question>] \
  [--question-number <question-number>] \
  [--total-questions <total-questions>] \
  [--answer <answer>] \
  [--next-question-needed <next-question-needed>] \
  [--confidence-score <confidence-score>] \
  [--state <state>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `question` | string | No | The current question being asked |
| `question-number` | string | No | Current question number |
| `total-questions` | string | No | Estimated total questions needed |
| `answer` | string | No | The user's response to the question |
| `next-question-needed` | string | No | Whether another question is needed |
| `confidence-score` | string | No | A value between 0.0 and 1.0 representing confidence in understanding requirements. When this value reaches 0.7 or higher, set `nextQuestionNeeded` to false. |
| `state` | string | No | The complete architecture state from the previous request as JSON. See the JSON schema after this table. |

**`state` JSON schema**

```json
{
    "state": {
        "type": "object",
        "description": "The complete architecture state from the previous request",
        "properties": {
            "architectureComponents": {
                "type": "array",
                "description": "All architecture components suggested so far",
                "items": {
                    "type": "string"
                }
            },
            "architectureTiers": {
                "type": "object",
                "description": "Components organized by architecture tier",
                "additionalProperties": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "thought": {
                "type": "string",
                "description": "The calling agent's thoughts on the next question or reasoning process. The calling agent uses the requirements it gathers to reason about the next question."
            },
            "suggestedHint": {
                "type": "string",
                "description": "A suggested interaction hint to show the user, such as 'Ask me to create an ASCII art diagram of this architecture' or 'Ask about how this design handles disaster recovery'."
            },
            "requirements": {
                "type": "object",
                "description": "Tracked requirements organized by type",
                "properties": {
                    "explicit": {
                        "type": "array",
                        "description": "Requirements the user explicitly states",
                        "items": {
                            "type": "object",
                            "properties": {
                                "category": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "source": {
                                    "type": "string"
                                },
                                "importance": {
                                    "type": "string",
                                    "enum": [
                                        "high",
                                        "medium",
                                        "low"
                                    ]
                                },
                                "confidence": {
                                    "type": "number"
                                }
                            }
                        }
                    },
                    "implicit": {
                        "type": "array",
                        "description": "Requirements implied by user responses",
                        "items": {
                            "type": "object",
                            "properties": {
                                "category": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "source": {
                                    "type": "string"
                                },
                                "importance": {
                                    "type": "string",
                                    "enum": [
                                        "high",
                                        "medium",
                                        "low"
                                    ]
                                },
                                "confidence": {
                                    "type": "number"
                                }
                            }
                        }
                    },
                    "assumed": {
                        "type": "array",
                        "description": "Requirements assumed based on context and best practices",
                        "items": {
                            "type": "object",
                            "properties": {
                                "category": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "source": {
                                    "type": "string"
                                },
                                "importance": {
                                    "type": "string",
                                    "enum": [
                                        "high",
                                        "medium",
                                        "low"
                                    ]
                                },
                                "confidence": {
                                    "type": "number"
                                }
                            }
                        }
                    }
                }
            },
            "confidenceFactors": {
                "type": "object",
                "description": "Factors that contribute to the overall confidence score",
                "properties": {
                    "explicitRequirementsCoverage": {
                        "type": "number"
                    },
                    "implicitRequirementsCertainty": {
                        "type": "number"
                    },
                    "assumptionRisk": {
                        "type": "number"
                    }
                }
            }
        }
    }
}
```

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Architecture Center documentation](/azure/architecture/)

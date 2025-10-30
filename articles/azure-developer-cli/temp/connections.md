See https://github.com/Azure/azure-rest-api-specs-pr/blob/feature/ai-foundry/agents-v2/specification/ai/Azure.AI.Agents.V2/tools/models.tsp

union _AgentToolType {
  bing_grounding: "bing_grounding",
  browser_automation: "browser_automation",
  fabric_dataagent: "fabric_dataagent",
  sharepoint_grounding: "sharepoint_grounding",
  azure_ai_search: "azure_ai_search",
  openapi: "openapi",
  bing_custom_search: "bing_custom_search",
  connected_agent: "connected_agent",
  capture_structured_outputs: "capture_structured_outputs",
  capture_semantic_events: "capture_semantic_events",
  a2a: "a2a",
}


compare to https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json

```json
                    "type": {
                        "type": "string",
                        "title": "Type of resource",
                        "description": "The type of resource to be created. (Example: db.postgres)",
                        "enum": [
                            "db.postgres",
                            "db.mysql",
                            "db.redis",
                            "db.mongo",
                            "db.cosmos",
                            "ai.openai.model",
                            "ai.project",
                            "ai.search",
                            "host.containerapp",
                            "host.appservice",
                            "messaging.eventhubs",
                            "messaging.servicebus",
                            "storage",
                            "keyvault"
                        ]
                    },
```

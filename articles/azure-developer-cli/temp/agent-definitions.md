# Agent Definition

### Sample

```yaml
agent:
  # The type of agent - "hosted" for HOBO, "container" for COBO
  kind: hosted
  
  # Unique identifier/name for this agent
  name: weather-agent
  
  # Brief description of what this agent does
  description: A helpful weather agent that provides weather information for any given location using simulated data.

  metadata:
    # Categorization tags for organizing and discovering agents
    tags:
      - weather
      - utility
      - basic-example

  models:
    - id: gpt-4o
      publisher: azure
      deployment: {{model_deployment_name}}

  tools:
    - kind: mcp
      connection:
        kind: foundry
        endpoint: https://api.githubcopilot.com/mcp/
        name: github-mcp-oauth
      name: github-mcp-remote
      url: https://api.githubcopilot.com/mcp/

  protocol: responses

  container:
    scale:
      minReplicas: 1
      maxReplicas: 1
      cpu: 1
      memory: 2Gi
    context:
      dockerfile: dockerfile
      buildContext: .
    environment_variables:
      - name: AZURE_AI_PROJECT_ENDPOINT
        value: ${{ AZURE_AI_PROJECT_ENDPOINT }}
      - name: AZURE_AI_MODEL_DEPLOYMENT_NAME
        value: {{model_deployment_name}}

parameters:
  model_deployment_name:
    schema:
      type: string
      default: gpt-4o
    description: the name of your model deployment
    required: true
```

## I/O

| Field                           | `init` reads from      | `azd provision` reads from | `azd up` builds from |
|---------------------------------|------------------------|----------------------------|----------------------|
| `agent`                         | yaml (manifest)        |                            |                      |
| `├── kind`                      | yaml (manifest)        | yaml                       |                      |
| `├── name`                      | yaml (manifest)        | yaml                       |                      |
| `├── description`               | yaml (manifest)        | yaml                       |                      |
| `├── metadata`                  | yaml (manifest)        | yaml                       |                      |
| `│   └── tags`                  | yaml (manifest)        | yaml                       |                      |
| `├── models`                    | yaml (manifest)        |                            |                      |
| `│   └── - id`                  | yaml (manifest)        | env var                    |                      |
| `│       ├── publisher`         | user?                  | env var                    |                      |
| `│       └── deployment`        | user?                  | env var                    |                      |
| `├── tools`                     | yaml (manifest)        |                            |                      |
| `│   └── - kind`                | yaml (manifest)        |                            |                      |
| `│       ├── connection`        | yaml (manifest)        |                            |                      |
| `│       │   ├── kind`          | yaml (manifest)        |                            |                      |
| `│       │   ├── endpoint`      | yaml (manifest)        |                            |                      |
| `│       │   └── name`          | yaml (manifest)        |                            |                      |
| `│       ├── name`              | yaml (manifest)        |                            |                      |
| `│       └── url`               | yaml (manifest)        |                            |                      |
| `├── protocol`                  | yaml (manifest)        | yaml                       |                      |
| `└── container`                 | yaml (manifest)        |                            |                      |
| `    ├── scale`                 | yaml (manifest)        |                            |                      |
| `    │   ├── minReplicas`       | yaml (manifest)        |                            |                      |
| `    │   ├── maxReplicas`       | yaml (manifest)        |                            |                      |
| `    │   ├── cpu`               | yaml (manifest)        |                            |                      |
| `    │   └── memory`            | yaml (manifest)        |                            |                      |
| `    ├── context`               | yaml (manifest)        |                            |                      |
| `    │   ├── dockerfile`        | yaml (manifest)        |                            |                      |
| `    │   └── buildContext`      | yaml (manifest)        |                            |                      |
| `    └── environment_variables` | yaml (manifest)        |                            |                      |
| `        └── - name`            | yaml (manifest)        |                            |                      |
| `            └── value`         | yaml (manifest)        |                            |                      |
| `parameters`                    | yaml (manifest)        |                            |                      |
| `└── model_deployment_name`     | yaml (manifest), user? | yaml (definition)          |                      |
| `    ├── schema`                | yaml (manifest)        |                            |                      |
| `    │   ├── type`              | yaml (manifest)        |                            |                      |
| `    │   └── default`           | yaml (manifest)        |                            |                      |
| `    ├── description`           | yaml (manifest)        |                            |                      |
| `    └── required`              | yaml (manifest)        |                            |                      |


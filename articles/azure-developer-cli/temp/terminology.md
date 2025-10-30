# 📓 Relevant terminology

## Nouns

- **Agent Manifest**: a YAML representation of the code, prompt/instructions, tools defining what an agent does and how (see [`prompty/travel.yaml`](https://github.com/microsoft/prompty/blob/dev/specification/prompty/docs/examples/travel/travel.yaml)).
- **Declarative agents**: Agents purely defined in yaml, with a prompt and a list of tools. No code.
- **Code-based agents**: Agents defined by code using Microsoft Agent Framework, LangGraph, custom-code...
- **Workflows**: ...
- **HOBO**: ...
- **COBO**: ...

## Verbs

- to **INIT** an agent: create the local scaffolding of an agent based either on an existing blueprint, or from a minimal example.
- to **RUN** an agent: create a running instance of the agent locally, so that it can serve queries for the time of a test or evaluation.
- to **DEPLOY** an agent: create the agent running instance in an Azure AI Project; in other words packaging the agent manifest locally, uploading that to the Azure AI Agent service to create a running instance of that agent that can serve queries from an app or users.
- to **PUBLISH** an agent blueprint: share the agent manifest in a public or organization registry.
- to **UPDATE** an agent: change the published manifest of an agent in a public or organization registry, incrementing the published version number for every update.

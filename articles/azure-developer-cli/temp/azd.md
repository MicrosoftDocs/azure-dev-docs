
# `azd ai` extension(s) for Azure AI Foundry

This specifies the set of extensions we want to build for `azd` to fully support Azure AI Foundry.

**Motivation** - These extensions align with the [CLI Strategy for AI Foundry](https://microsoft.sharepoint.com/:w:/t/AMLExperiences/ESuakivzSldFqc2lFT5NPP8BbbB5GKL0vnm2SlipCtkdbw?e=qt5tDL):

- Existing az CLI tools are primarily designed for control plane operations and IT admin workflows, which do not align with the needs of developers working on agent-centric applications.
- As developer workflows increasingly demand support for inner-loop tasks (like scaffolding, publishing, evaluating, and fine-tuning agents) the azd CLI, with its native integration of Azure AI Services and focus on application development, offers a more suitable foundation.
- This also aligns with a company wide effort to promote `azd` as the developer CLI experience.

**Important**:
- Per product/marketing recommendation, the extensions will be nested under `azd ai` namespace.
- As much as possible, we want to reuse existing `azd` verbs (ex: `azd up`) instead of creating extension-specific verbs. We'll use extension-specific verbs when `azd` native doesn't support what we need (ex: `azd ai agent publish`).
- The `azd` extension framework provides services to get context about the current project, including the current environment, configuration, project configuration, etc. This context could then be used by the `azd ai` extension code to ensure it is are using the correct environments/configuration.

## Scope and timeline

| Extension                            | Scope                                                  | Timeline          |
|:-------------------------------------|:-------------------------------------------------------|:------------------|
| [`azd ai agent`](./azd/ai/agents.md) | Agent scaffolding, testing, deployment and publishing. | PuPr, ignite 2025 |
| `azd ai model` (name tbd)            | Model deployment, fine-tuning.                         | tbd               |
| `azd ai eval` (name tbd)             | Model/Agent evaluation.                                | tbd               |

## Context: current `azd` support of foundry

For context, the following commands/verbs **already exist** in native azd.

### Case 1 : initialize and create an AI resource

1. Initialize the directory with a minimal `azure.yaml`:

    ```text
    azdagentdemo> azd init --minimal

    Initializing an app to run on Azure (azd init)

    ? What is the name of your project? azdagentdemo
    (✓) Done: Initialized git repository

    SUCCESS: Generated azure.yaml project file.
    Run azd add to add new Azure components to your project.
    ```

2. Add an Azure AI Services resource and model deployment, and provision:

    ```text
    azdagentdemo> azd add
    ? Enter a unique environment name: [? for help] dev                                                                     
    ? Enter a unique environment name: dev

    New environment 'dev' created and set as default
    ? Select an Azure Subscription to use: 98. Jeff Omhover test sub (827cb315-a120-4b3d-bd80-93f7b3126af2)
    ? What would you like to add? AI
    ? Which type of AI resource? Azure AI services model
    ? Which model do you want to use? gpt-4o-mini
    ? Select model SKU GlobalStandard

    Previewing changes to azure.yaml:

    +  ai-project:
    +      type: ai.project
    +      models:
    +          - name: gpt-4o-mini
    +            version: "2024-07-18"
    +            format: OpenAI
    +            sku:
    +              name: GlobalStandard
    +              usageName: OpenAI.GlobalStandard.gpt-4o-mini
    +              capacity: 10

    ? Accept changes to azure.yaml? Yes

    SUCCESS: azure.yaml updated.

    ? Do you want to provision these changes? Yes
    ```

❓ **Open questions**

- do we need something to ensure the model is compatible with the agent service? (`azd ai agent model add` ?)

### Case 2 : initialize with a pre-existing AI resource

1. Initialize the directory with a minimal `azure.yaml`:

    ```text
    azdagentdemo> azd init --minimal

    Initializing an app to run on Azure (azd init)

    ? What is the name of your project? azdagentdemo
    (✓) Done: Initialized git repository

    SUCCESS: Generated azure.yaml project file.
    Run azd add to add new Azure components to your project.
    ```

2. Add an existing Azure AI Services resource, using default values quickly:

    ```text
    azdagentdemo> azd add
    ? Enter a unique environment name: dev

    New environment 'dev' created and set as default
    ? Select an Azure Subscription to use: 98. Jeff Omhover test sub (827cb315-a120-4b3d-bd80-93f7b3126af2)
    ? What would you like to add? ~Existing resource
    ? Which type of existing resource? AI
    ? Which type of AI resource? Azure AI services model
    ? Which AI Foundry resource? 2. ai-account-sdrzusshiytg2/dev (swedencentral)
    ```

❓ **Open questions**

- how do we also add the model deployment directly here?

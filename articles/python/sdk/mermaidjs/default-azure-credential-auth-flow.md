```mermaid
%% STEPS TO GENERATE IMAGE
%% =======================
%% 1. Install mermaid CLI v10.9.1 (see https://github.com/mermaid-js/mermaid-cli/blob/master/README.md):
%%    npm i -g @mermaid-js/mermaid-cli@10.9.1
%% 2. Run commands:
%%    mmdc -i default-azure-credential-auth-flow.md -o ../../media/mermaidjs/default-azure-credential-auth-flow-inline.svg
%%    mmdc -i default-azure-credential-auth-flow.md -o ../../media/mermaidjs/default-azure-credential-auth-flow-expanded.png -w 1156

%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'tertiaryBorderColor': '#fff',
      'tertiaryColor': '#fff'
    }
  }
}%%

flowchart LR;
    accTitle: DefaultAzureCredential authentication flow;
    accDescr: Flowchart showing the credential chain implemented by DefaultAzureCredential;

    subgraph CREDENTIAL TYPES;
        direction LR;
        Deployed(Deployed service):::deployed ~~~ Developer(Developer tool):::developer ~~~ Interactive(Interactive):::interactive;
    end;

    subgraph CREDENTIALS;
        direction LR;
        A(Environment):::deployed -->
        B(Workload Identity):::deployed -->
        C(Managed Identity):::deployed -->
        D(Shared Token Cache):::developer -->
        E(Visual Studio Code):::developer -->
        F(Azure CLI):::developer -->
        G(Azure PowerShell):::developer -->
        H(Azure Developer CLI):::developer -->
        I(Interactive browser):::interactive -->
        J(Broker):::developer;
    end;

    %% Define styles for credential type boxes
    classDef deployed fill:#95C37E, stroke:#71AD4C, stroke-width:2px;
    classDef developer fill:#F5AF6F, stroke:#EB7C39, stroke-width:2px;
    classDef interactive fill:#A5A5A5, stroke:#828282, stroke-dasharray:5 5, stroke-width:2px;

    %% Add API ref links to credential type boxes
    click A "https://learn.microsoft.com/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python" _blank;
    click B "https://learn.microsoft.com/python/api/azure-identity/azure.identity.workloadidentitycredential?view=azure-python" _blank;
    click C "https://learn.microsoft.com/python/api/azure-identity/azure.identity.managedidentitycredential?view=azure-python" _blank;
    click D "https://learn.microsoft.com/python/api/azure-identity/azure.identity.sharedtokencachecredential?view=azure-python" _blank;
    click E "https://learn.microsoft.com/python/api/azure-identity/azure.identity.visualstudiocodecredential?view=azure-python" _blank;
    click F "https://learn.microsoft.com/python/api/azure-identity/azure.identity.azureclicredential?view=azure-python" _blank;
    click G "https://learn.microsoft.com/python/api/azure-identity/azure.identity.azurepowershellcredential?view=azure-python" _blank;
    click H "https://learn.microsoft.com/python/api/azure-identity/azure.identity.azuredeveloperclicredential?view=azure-python" _blank
    click I "https://learn.microsoft.com/python/api/azure-identity/azure.identity.interactivebrowsercredential?view=azure-python" _blank;
    click J "https://learn.microsoft.com/python/api/azure-identity-broker/azure.identity.broker.interactivebrowserbrokercredential?view=azure-python" _blank;
```

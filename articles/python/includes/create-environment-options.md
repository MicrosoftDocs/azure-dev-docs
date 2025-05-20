---
ms.topic: include
ms.date: 05/20/2025
---

* Configure a Python virtual environment using `venv` or your tool of choice. To start using the virtual environment, be sure to activate it. To install python, see [Install Python](https://www.python.org/downloads/).

    ### [Bash](#tab/bash)

    ```azurecli-interactive
    #!/bin/bash
    # Create a virtual environment
    python -m venv .venv
    # Activate the virtual environment
    source .venv/Scripts/activate # only required for Windows (Git Bash)
    ```

    ### [PowerShell](#tab/powershell)

    ```powershell-interactive
    # Create a virtual environment
    python -m venv venv
    # Activate the virtual environment
    . .\venv\Scripts\Activate.ps1
    ```

    ---

* Use a [conda environment](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html). To install Conda, see [Install Miniconda](https://docs.conda.io/en/latest/miniconda.html).

* Use a [Dev Container](https://containers.dev/) in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) or [GitHub Codespaces](https://docs.github.com/en/codespaces/overview).
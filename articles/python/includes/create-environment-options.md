---
ms.topic: include
ms.date: 12/14/2022
---

* Configure a Python virtual environment using `venv` or your tool of choice. You can create the virtual environment locally or in [Azure Cloud Shell](https://shell.azure.com/) and run the code there. Be sure to activate the virtual environment to start using it. To install python, see [Install Python](https://www.python.org/downloads/).

### [Bash](#tab/bash)

```azurecli-interactive
#!/bin/bash
# Create and activate virtual environment
source .venv/Scripts/activate #local dev environment
source .venv/bin/activate #cloudshell
python -m venv .venv

### [PowerShell](#tab/powershell)

```powershell-interactive
# PowerShell syntax.ps1
.venv\Scripts\activate
```

---

* Use a [conda environment](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html). To install Conda, see [Install Miniconda](https://docs.conda.io/en/latest/miniconda.html).

* Use a [Dev Container](https://containers.dev/) in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) or [GitHub Codespaces](https://docs.github.com/en/codespaces/overview).
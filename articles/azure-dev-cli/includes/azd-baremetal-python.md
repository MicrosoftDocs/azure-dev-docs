### Prerequisites

Before you get started, ensure you have the following tools installed on your local machine:

- [Git](https://git-scm.com/)
- [GitHub CLI v2.3+](https://github.com/cli/cli)
- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js with npm (v 16.13.1 LTS)](https://nodejs.org/)
- [Azure CLI (v 2.30.0+)](/cli/azure/install-azure-cli)
- Azure Dev CLI

```bash
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

### Python virtual environment

This application uses Python Virtual Environments to isolate Python package installations. Create and activate a virtual environment.

<img valign="middle" src="https://img.shields.io/static/v1?label=&message=Windows&color=blue"> `py -m venv .venv`

<img valign="middle" src="https://img.shields.io/static/v1?label=&message=Lunux/MacOS&color=brightgreen">  `python3 -m venv .venv`

Activate the Virtual Environment

<img valign="middle" src="https://img.shields.io/static/v1?label=&message=Windows&color=blue"> `.venv\Scripts\activate`

<img valign="middle" src="https://img.shields.io/static/v1?label=&message=PowerShell&color=9cf"> `Set-ExecutionPolicy Unrestricted .venv\Scripts\Activate.ps1`

<img valign="middle" src="https://img.shields.io/static/v1?label=&message=Lunux/MacOS&color=brightgreen"> `source .venv/bin/activate`
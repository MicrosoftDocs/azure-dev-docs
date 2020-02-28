---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Configure KeyVault FlexVolume

Create an Azure KeyVault and populate all the necessary secrets. For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](/azure/key-vault/quick-create-cli). Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will also need to update the startup script used to bootstrap WildFly. This script must import the certificates into the keystore used by WildFly before starting the server.

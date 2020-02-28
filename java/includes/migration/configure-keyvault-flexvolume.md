---
author: mriem
ms.author: manriem
ms.date: 2/28/2020
---

### Configure KeyVault FlexVolume

[Create an Azure KeyVault](/azure/key-vault/quick-create-cli) and populate all the necessary secrets. Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will need to make sure the startup script used to bootstrap WildFly imports the certificates into the keystore used by WildFly before starting the server.

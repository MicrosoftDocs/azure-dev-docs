---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Inventory all secrets

Before the advent of "configuration as a service" technologies such as Azure Key Vault, there wasn't a well-defined concept of "secrets". Instead, you had a disparate set of configuration settings that effectively functioned as what we now call "secrets". With app servers such as WebLogic Server, these secrets are in many different config files and configuration stores. Check all properties and configuration files on the production server(s) for any secrets and passwords. Be sure to check *weblogic.xml* in your WARs. Configuration files containing passwords or credentials may also be found inside your application. For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).

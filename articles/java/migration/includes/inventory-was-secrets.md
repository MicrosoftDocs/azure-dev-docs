---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/03/2023
---

### Inventory all secrets

Before the advent of "configuration as a service" technologies such as Azure Key Vault, there wasn't a well-defined concept of "secrets". Instead, you had a disparate set of configuration settings that effectively functioned as what we now call "secrets". With app servers such as WAS, these secrets are in many different config files and configuration stores. Check all properties and configuration files on the production server(s) for any secrets and passwords. Configuration files containing passwords or credentials may also be found inside your application. WAS stores configuration data in several documents in a cascading hierarchy of directories. Most configuration documents have XML content. For more information, see [Configuration documents](https://www.ibm.com/docs/en/was/9.0.5?topic=files-configuration-documents) and [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).

---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Inventory all certificates

Document all the certificates used for public SSL endpoints. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```

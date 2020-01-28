---
author: yevster
ms.author: yebronsh
ms.date: 1/24/2020
---

### Inventory certificates

Document all the certificates used for public SSL endpoints or communication with backend databases and other systems. You can view all certificates on the production server(s) by running the following command:

```bash
keytool -list -v -keystore <path to keystore>
```

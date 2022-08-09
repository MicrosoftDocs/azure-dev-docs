---
author: jessmjohnson
ms.author: jejohn
ms.topic: include
ms.date: 06/01/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.custom: devx-track-python
---

#### [Windows](#tab/windows)

```Cmd
pip install python-certifi-win32
```

> [!Note]
> The package `python-certifi-win32` was tested on Python 3.9. If your environment is a different version and you run into problems, create a virtual environment with Python 3.9. For example, `py -3.9 -m venv .venv39`.

#### [macOS/Linux](#tab/mac-linux)

```Bash
export REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

---

---
ms.custom: devx-track-ts, devx-track-typespec
ms.topic: include
ms.date: 09/02/2026
---
The Express.js project structure found at `tsp-output/server/` includes the generated server, package files, configuration, and middleware for your Azure integration.

```console
server
├── .vscode
│   ├── launch.json
│   └── tasks.json
├── package-lock.json
├── package.json
├── schema
│   └── openapi.yaml
├── src
│   ├── controllers
│   │   └── widgets.ts
│   ├── generated
│   │   ├── helpers
│   │   │   ├── header.ts
│   │   │   ├── http.ts
│   │   │   └── router.ts
│   │   ├── http
│   │   │   ├── openapi3.ts
│   │   │   ├── operations
│   │   │   │   └── server-raw.ts
│   │   │   └── router.ts
│   │   └── models
│   │       └── all
│   │           └── demo-service.ts
│   ├── index.ts
│   └── swagger-ui.ts
└── tsconfig.json
```

The file structure for the parent TypeSpec project includes this Express.js project in `tsp-output`:

```console
├── .gitignore
├── main.tsp
├── package-lock.json
├── package.json
├── tsp-output
│   └── server
└── tspconfig.yaml
```

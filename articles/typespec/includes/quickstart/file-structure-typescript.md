---
ms.custom: devx-track-ts, devx-track-typespec
ms.topic: include
ms.date: 04/23/2025
---
The Express.js project structure found at `tsp-output/server/` includes the generated server, the package.json, and the middleware for your Azure integration. 

```console
server
├── package.json
├── package-lock.json
├── src
│   ├── controllers
│   │   └── widgets.ts
│   ├── generated
│   │   ├── helpers
│   │   │   ├── datetime.ts
│   │   │   ├── header.ts
│   │   │   ├── http.ts
│   │   │   ├── multipart.ts
│   │   │   ├── router.ts
│   │   │   └── temporal
│   │   │       ├── native.ts
│   │   │       └── polyfill.ts
│   │   ├── http
│   │   │   ├── openapi3.ts
│   │   │   ├── operations
│   │   │   │   └── server-raw.ts
│   │   │   └── router.ts
│   │   └── models
│   │       └── all
│   │           ├── demo-service.ts
│   │           └── typespec.ts
│   ├── index.ts
│   └── swagger-ui.ts
```

The file structure for the parent TypeSpec project includes this Express.js project in `tsp-output`:

```console
├── tsp-output
├── .gitignore
├── main.tsp
├── package-lock.json
├── package.json
├── tspconfig.yaml
```
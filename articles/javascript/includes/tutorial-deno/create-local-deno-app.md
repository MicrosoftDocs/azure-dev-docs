---
title: include file 2
description: include file 2
ms.topic: include
ms.date: 06/01/2020
ms.custom: devx-track-js
---

In this step, you create a simple Deno api using Deno's built-in webserver. You then run the app locally.

1. In a terminal or command prompt, navigate to a location where you want to create the app folder and create a new folder called `deno-demo`.

1. Create a new file called `demo.ts`.
1. Deno accepts running code from URLs directly. Write a HTTP server that answers all the requests with "Hello World". Use the following code:

    ```typescript
    import { serve } from "https://deno.land/std@0.54.0/http/server.ts"
    const handler = serve({ port: 80 })

    console.log("Serving at 80")

    for await (const req of handler) {
     req.respond({ body: "Hello World!\n" })
    }
    ```

1. Execute the app by running the following script:

    ```bash
    deno run --allow-net ./demo.ts
    ```

1. Test the app by opening a browser to `http://localhost:80`. The site should appear as follows:

    ![Running the demo server](../../media/deploy-azure/deno-hello-world.png)

    You can also run this code by typing `deno run --allow-net https://gist.githubusercontent.com/khaosdoctor/cd2bbb28e682feb8d20a7aba47fc1e17/raw/92de998fd11f2a24ae40bbcb84f5262cfe9389b2/deno-demo.ts`

1. Press **Ctrl**+**C** in the terminal to stop the server.

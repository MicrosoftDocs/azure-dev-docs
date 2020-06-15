---
title: Create the Azure App Service from Visual Studio Code
description: Tutorial part 2, create the Deno app and run it locally
ms.topic: conceptual
ms.date: 06/01/2020
---

# Test local Deno apps

[Previous step: Introduction and prerequisites](tutorial-vscode-azure-app-service-deno-01.md)

In this step, you create a simple Deno api using Deno's built-in webserver. You then run the app locally.

## Create and run a local Deno app

1. In a terminal or command prompt, navigate to a location where you want to create the app folder and create a new folder called `deno-demo`.

1. Create a new file called `demo.ts`
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

    ![Running the demo server](media/deploy-azure/deno-hello-world.png)

    > You can also run this code by typing `deno run --allow-net https://gist.githubusercontent.com/khaosdoctor/cd2bbb28e682feb8d20a7aba47fc1e17/raw/92de998fd11f2a24ae40bbcb84f5262cfe9389b2/deno-demo.ts`

    <!-- TODO: THIS LINK SHOULD BE A MS-OWNED LINK -->

1. Press **Ctrl**+**C** in the terminal to stop the server.

> [!div class="nextstepaction"]
> [I created the Deno app](tutorial-vscode-azure-app-service-deno-03.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=deno-deployment-azureappservice&step=create-app)

## Next steps

[!INCLUDE [tutorial-next-steps](includes/tutorial-next-steps.md)]

> [!div class="nextstepaction"]
> [I'm done](node-howto-deploy-web-app.md) [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=deno-deployment-azureappservice&step=clean-up-resources)

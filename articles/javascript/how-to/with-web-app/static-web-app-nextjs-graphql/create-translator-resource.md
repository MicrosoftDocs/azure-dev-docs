---
title: "Trivia game: create translator resource"
description: Create a Translator resource for the trivia game.
ms.topic: how-to
ms.date: 01/19/2023
ms.custom: devx-track-js, devx-graphql
#intent: Create Next.js GraphQL app with SSR to deploy as SWA hybrid. 
---

# Trivia game: create a Translator resource

The trivia game translates the questions and answers across a range of languages with the help of Azure Cognitive Services Translator. 

## Create a Translator resource 

Complete the steps in [this Translator quickstart](/azure/cognitive-services/translator/how-to-create-translator-resource) with the following caveats:

* Create the resource in the **Global** region.
* Use [the resource group you created](getting-started.md#create-a-resource-group) for this tutorial series.
* Copy the key and resource name to use in the next step.

## Add Translator secrets to .env.local

Add the Translator secrets to a local secrets file.

1. Open the [.env.local](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/.env.sample) file at the root of the sample project.
1. Copy the key and resource name from the previous section into the appropriate variables:

    ```text
    AZURE_COSMOSDB_ENDPOINT=https://REPLACE-WITH-YOUR-COSMOS-DB-RESOURCE-NAME.documents.azure.com:443/
    AZURE_COSMOSDB_KEY=REPLACE-WITH-YOUR-COSMOS-DB-KEY
    ``` 

## Play the trivia game

Start and play the game in a different language, such as **Spanish**. 

1. Build the project, including the upload script.

    ```bash
    npm run dev
    ```

1. Before answering any questions, select **Spanish** in the top navigation bar.
1. Play through the game.

    :::image type="content" source="../../../media/static-web-app-nextjs-graphql/web-browser-trivia-game-spanish.png" alt-text="Screenshot of web browser showing the trivia game in Spanish.":::


## Next.js integration with Translator

Learn how the sample Next.js application integrates on the client and server to use the Azure Translator service. 

### Client: translate question

The Next.js client provides a route for each language in the `./pages/components/LocaleSwitcher.tsx` file.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/components/LocaleSwitcher.tsx" highlight="11":::

The **Question** component, in the `./components/Question.tsx` file, reads the locale with a **useEffect** hook and sets the state for the component. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="GetQuestionUseEffect":::

The locale is passed with the GraphQL query to the server in the **Question** component. The server returns the question and answers in that locale. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerUseMutation":::

### Server: translate question

The client request passes through the Apollo server's [`/graphql`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts) API to the **Query** resolver in `./pages/api/resolvers/resolvers.ts` to get a question for the game from the database. When the question is retrieved, it's translated based on the language received from the client:

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" id="GetQuestionGraphQLResolverQuery" highlight="17":::

The resolver calls the Translator data source. The data source translates the question and answers.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/datasources/TranslatorDataSource.ts" ::: 

### Client: validate answer

The user submits an answer with the **onClick** event in the `./components/Question.tsx` file.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="136-149":::

This calls the validateAnswer mutation. 

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerGraphQL" :::  

The mutation is wrapped in a **useMutation** hook to pass the request to the Next.js API layer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerUseMutation" :::  

When the data flows back to the client component, a **useEffect** hook sets the component's state for the answer. This allows the UI to display based on correctness of the user's answer.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" id="ValidateAnswerUseEffect" :::  

Then the results are displayed. The first block of code displays if the answer _isn't_ correct. The second block of code displays if the answer is correct.

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/components/Question.tsx" range="134-171":::  

### Server: validate answer

The client request passes through the Apollo server's [`/graphql`](https://github.com/Azure-Samples/js-e2e-graphql-nextjs-triviagame/blob/main/pages/api/graphql.ts) API to the **Mutation** resolver in `/pages/api/resolvers/resolvers.ts`:

:::code language="TypeScript" source="~/../js-e2e-graphql-nextjs-triviagame/pages/api/resolvers/resolvers.ts" id="ValidateAnswerGraphQLResolverMutation" highlight="68-76":::

The question is fetched from the database by its ID then the correct answer is translated. The translated correct answer is compared against the submitted answer. The submitted answer, in its translated form, was sent by the client. 

## Next step

> [!div class="nextstepaction"]
> [Deploy trivia game >>](deploy-trivia-game.md)

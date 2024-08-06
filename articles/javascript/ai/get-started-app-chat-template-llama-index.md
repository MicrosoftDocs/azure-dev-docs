---
title: "Get started with Serverless AI Chat using LlamaIndex"
description: "Use LlamaIndex to simplify..."
ms.topic: get-started 
ms.date: 05/22/2024
ms.subservice: intelligent-apps
ms.custom: build-2024-intelligent-apps
ms.collection: ce-skilling-ai-copilot
#customer intent: As a TypeScript developer, I want deploy and use a serverless chat app so that I can understand how LLamaIndex helps a chat app.

---

# Get started with Serverless AI Chat with RAG using LlamaIndex

Use LlamaIndex in a RAG chat app to ingest data from a variety of arbitrary data sources, index the data, and query with a chat interface.

 

## Implement RAG with LlamaIndex

To implement a RAG (Retrieval-Augmented Generation) system using LlamaIndex, follow these steps:

### Data Ingestion

| Process | Description | API or tool|
|--|--|--|
|Load Documents|Use a document loader to import data from sources such as PDFs, APIs, or SQL databases.|SimpleDirectoryReader, SentenceSplitter|
|Chunk Documents|Break down large documents into smaller, manageable chunks.||

### Index Creation

| Process | Description | API or tool|
|--|--|--|
|Create Vector Index|Create a vector index of the document chunks. This allows for efficient similarity searches based on embeddings.|VectorStoreIndex|
|Recursive Retrieval (Optional)|For complex datasets, use recursive retrieval techniques to manage hierarchically structured data and retrieve relevant sections based on user queries.||

### Query Engine Setup

| Process | Description | API or tool|
|--|--|--|
|Convert to Query Engine|Convert the vector index into a query engine. Set parameters to define how many top documents should be retrieved.|asQueryEngine, similarityTopK|
|Advanced Setup (Optional)|Use agents to create a multi-agent system. Each agent handles specific documents, and a top-level agent coordinates the overall retrieval process.||

### Retrieval and Generation

| Process | Description | API or tool|
|--|--|--|
|Define Objective Function|Create an objective function that takes user queries and retrieves relevant document chunks. Ensure the retrieved chunks match the user's query.||
|Perform Retrieval|Use retrieval and query processing which can include additional steps like re-ranking the retrieved documents.|RetrieverQueryEngine, CohereRerank|
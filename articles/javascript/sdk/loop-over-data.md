---
title: Loop over data from the Azure SDK for JavaScript
description: Loop over large sets of data using async iterators in the Azure SDK for JavaScript. This article explains async iterators, their benefits, and provides practical examples for handling paginated data from Azure services.
ms.date: 08/12/2024
ms.topic: concept-article
ms.custom: devx-track-js 
ai-usage: ai-assisted
---

# Loop over data returned from the Azure SDK for JavaScript

When working with Azure services, you often need to process large sets of data. Azure client libraries provide async iterators to help manage this task efficiently. This article explains what async iterators are, how to use them, and provides examples for key Azure services.

## What are Async Iterators?

Async iterators are a feature in modern JavaScript that allow you to consume streams of data or when you need to process data as it becomes available. They're useful for handling paginated data from APIs. Async iterators use the `for-await-of` loop to iterate over data, fetching it as needed.

Using async iterators provides several advantages:

- **Simplified Syntax:** The [`for-await-of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loop makes consuming async iterators straightforward.
- **On-Demand Data Fetching:** Fetch only the data you need, reducing memory usage and load on the backend.
- **Future Compatibility:** Async iterators are a standard feature in JavaScript, ensuring compatibility with future updates and libraries.

If you're new to async iterators, the following concepts help to understand how paging works in Azure SDKs for JavaScript.

- **Async Functions:** Functions that return a `Promise`.
- **Generators:** Functions that can be paused and resumed, yielding multiple values.
- **Async Generators:** Combine the features of async functions and generators to produce async iterators.

Azure client librariess use async iterators to handle potentially large collections of data. Below are examples of how to use async iterators with various Azure services. 

## Loop over a few items

If you result set is only a few items, you can loop through that small list. The following code loops through a small set of containers in Azure Storage:

```javascript
for await (const container of blobServiceClient.listContainers()) {
    console.log(`Container: ${container.name}`);
}
```

## Loop over data by page

If your data set is larger, you may want to return the data in pages, then iterate over items in each page. The following code loops through a data by page, then each item.

```javascript
const maxPageSize = 3;
const containerPages = blobServiceClient.listContainers().byPage({ maxPageSize });
for await (const page of containerPages) {
    for (const container of page) {
        console.log(`Container: ${container.name}`);
    }
}
```

## Loop over until the end

For some scenarios, you may need to loop over all the data. The following JavaScript function takes a service client and a page size, then loops over `maxPageSize` records. 

```javascript
async function listBlobsWithContinuation(containerClient, maxPageSize) {

   console.log(`Listing all blobs using iterators with a page size of ${maxPageSize}`);

   let continuationToken = null;
   let pageCount = 0;

   do {

       console.log(`Retrieving a page of results with a continuation token`);
       const blobPages = (continuationToken 
           ? containerClient.listBlobsFlat().byPage({ maxPageSize, continuationToken })
           : containerClient.listBlobsFlat().byPage({ maxPageSize }));

       if(blobPages === undefined){
           console.log("blobPages is undefined");
       } else {
           console.log("blobPages is defined");
           for await (const page of blobPages) {

               pageCount++;
               console.log(`Page ${pageCount}:`);
               for (const blob of page.segment.blobItems) {
                   console.log(`  Blob: ${blob.name}`);
               }
               // Save the continuation token for the next iteration
               continuationToken = page.continuationToken;
           }
       }

   } while (continuationToken);
}
```


## Continue looping at a specific page

If you need to have more control over the loop, including resuming the loop, use a continuation token. The paged iterator also supports resuming from a continuation token. In the following example, we use the continuation token from the first iteration to resume iteration at the second page.

```javascript
const maxPageSize = 3;

// Create iterator
const iter = containerClient.listBlobsFlat().byPage({ maxPageSize });
let pageNumber = 1;

const result = await iter.next();
if (result.done) {
    throw new Error("Expected at least one page of results.");
}

const continuationToken = result.value.continuationToken;
if (!continuationToken) {
    throw new Error(
        "Expected a continuation token from the blob service, but one was not returned."
    );
}

// Continue with iterator
const resumed = containerClient.listBlobsFlat().byPage({ continuationToken, maxPageSize });
pageNumber = 2;
for await (const page of resumed) {
    console.log(`- Page ${pageNumber++}:`);
    for (const blob of page.segment.blobItems) {
        console.log(`  - ${blob.name}`);
    }
}
```

## Additional resources

- [MDN documentation for iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
- [MDN documentation for Symbol.asyncIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)


---
title: ""
description: ""
ms.date: 08/08/2022
ms.topic: concept-article
ms.custom: devx-track-js
ai-usage: ai-assisted
---

## Testing integration Code for Azure SDK for JavaScript

Testing your integration code for the Azure SDK for JavaScript is essential to ensure your applications interact correctly with Azure services. 
For unit tests, use tools such as Jest, Sinon, or ts-mockito. 

## Mocking or Cloud Services

When deciding whether to mock out cloud service SDK calls or use a live service for testing purposes, it's important to consider the trade-offs between speed, reliability, and cost.

### Mocking Cloud Services

**Pros:**

- Speeds up test suite by eliminating network latency.
- Provides predictable and controlled test environments.
- Easier to simulate various scenarios and edge cases.
- Reduces costs associated with using live cloud services, especially in continuous integration pipelines.

**Cons:**

- Mocks may drift from the actual SDK, leading to discrepancies.
- Might ignore certain features or behaviors of the live service.
- Less realistic environment compared to production.

### Using a Live Service

**Pros:**

- Provides a realistic environment that closely mirrors production.
- Useful for integration tests to ensure different parts of the system work together.
- Helps identify issues related to network reliability, service availability, and actual data handling.

**Cons:**

- Slower due to network calls.
- More expensive due to potential service usage costs.
- Complex and time-consuming to set up and maintain a live service environment that matches production.

The choice between mocking and using live services depends on your testing strategy. For unit tests where speed and control are paramount, mocking is often the better choice. For integration tests where realism is crucial, using a live service can provide more accurate results. Balancing these approaches helps achieve comprehensive test coverage while managing costs and maintaining test efficiency.

## Test doubles: Mocks, stubs, and fakes

A test double is any kind of substitute used in place of something real for testing purposes. The type of double you choose is based on what you want it to replace. The term _mock_ is often meant as any _double_ when the term is used casually. In this article, the term is used specifically and illustrated specifically in the Jest test framework. 

* Mocks (also called _spies): Substitute in a function and be able to control and spy on the **behavior** of that function when it is called indirectly by some other code. 
* Stubs: Substitute in a function's returned result data. This allows your code to call the function and get back a wide variety of good and bad state. **State verification** can include results such as failures, exceptions, and edge cases. 
* Fakes: Substitute in functionality that you wouldn't normally use in production, such as an in-memory database instead of a cloud database.

## Azure SDK example of CosmosDB

Imagine you have an application that needs to write a new document to CosmosDB if all the information is submitted and verified. If an empty form is submitted or the information doesn't match the expected format, the application should not enter the data. 

CosmosDB is used as an example, the process and concepts apply to most of the Azure SDKs for JavaScript.

The following function captures this functionality

```typescript
// insertDocument.ts

export async function insertDocument<RawInput>(doc):Promise<
    VerificationErrors |         // data doesn't match expected types
    DbDocument |                 // insert succeeded
    DBErrors                     // insert failed
> {

    isVerified: bool = inputVerified(doc);

    return (isVerified)
        ? await cosmos.items.create(city);
        : null
}
```

> [!NOTE]
> TypeScript types are used to communicate the type of information in the function. TypeScript isn't necessary to use Jest or many other JavaScript testing frameworks but is fundamental for writing type-safe JavaScript. 

The functions in this application above are:

* **insertDocument** (application code): Inserts a document into the database. This is the function we want to test.
* **inputVerified** (application code): Verifies the input data against a schema. This can be done using a package like zod to ensure data is in the correct format (examples include email addresses are valid emails, URLs are correctly formatted).
* **cosmos.items.create** (SDK code): This is the SDK function for Azure Cosmos DB using a package like [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos). We want to mock this function because we don't need to test the SDK itself. It already has its own tests maintained by the package owners. We just want to test our code. As part of testing insertDocument, we need to verify that the CosmosDB function call was made and returned data if the incoming data passed verification.

## Mocking Azure SDK example for CosmosDB

How can we use mocks, stubs, and fakes to test the **insertDocument** function? 

* Mocks: we need a mock to make sure the **behavior** of the function is tested such as:
    * If the data does pass verification, the call to the CosmosDB function happened only 1 time
    * If the data doesn't pass verification, the call to the CosmosDB function didn't happen
* Stubs: 
    * The data passed in matches the new document returned by the function.

The following Jest test file shows how to test the **insertDocument** function.

```typescript
// insertDocument.spec.ts

const { insertDocument } = require('./insertDocument');
const { cosmosContainer } = require('@azure/cosmos');

// Mock the cosmosContainer.items.create function
jest.mock('@azure/cosmos', () => ({
    cosmosContainer: {
        items: {
            create: jest.fn()
        }
    }
}));

// Fixtures for test cases
const validDoc = { id: '1', name: 'Valid Document' };
const invalidDoc = { id: '2', name: '' }; // Assuming name is required
const dbDocument = { resource: { id: '1', name: 'Valid Document' } };
const verificationErrors = { error: 'Invalid data format' };
const dbErrors = { error: 'Database error' };

// Mock inputVerified function
jest.mock('./path/to/your/inputVerified', () => ({
    inputVerified: jest.fn((doc) => doc.name !== '')
}));

describe('insertDocument', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should insert document if input is verified', async () => {
        require('./path/to/your/inputVerified').inputVerified.mockReturnValue(true);
        cosmosContainer.items.create.mockResolvedValue(dbDocument);

        const result = await insertDocument(validDoc);

        expect(require('./path/to/your/inputVerified').inputVerified).toHaveBeenCalledWith(validDoc);
        expect(cosmosContainer.items.create).toHaveBeenCalledWith(validDoc);
        expect(result).toEqual(dbDocument.resource);
    });

    test('should not insert document if input is not verified', async () => {
        require('./path/to/your/inputVerified').inputVerified.mockReturnValue(false);

        const result = await insertDocument(invalidDoc);

        expect(require('./path/to/your/inputVerified').inputVerified).toHaveBeenCalledWith(invalidDoc);
        expect(cosmosContainer.items.create).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test('should handle database errors', async () => {
        require('./path/to/your/inputVerified').inputVerified.mockReturnValue(true);
        cosmosContainer.items.create.mockRejectedValue(dbErrors);

        try {
            await insertDocument(validDoc);
        } catch (error) {
            expect(error).toEqual(dbErrors);
        }

        expect(require('./path/to/your/inputVerified').inputVerified).toHaveBeenCalledWith(validDoc);
        expect(cosmosContainer.items.create).toHaveBeenCalledWith(validDoc);
    });
});
```


## References

* [Jest Mocking Best Practices](https://devblogs.microsoft.com/ise/jest-mocking-best-practices/)
* [The Difference between Mocks and Stubs](https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs) by Martin Fowler


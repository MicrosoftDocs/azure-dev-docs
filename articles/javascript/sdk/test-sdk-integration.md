---
title: "Testing code depending on Azure SDK in JavaScript"
description: "Learn testing Azure SDK integration in JavaScript apps. Understand when to use a live dependency, when to use doubles and how to use mocks with the SDKs."
ms.date: 08/15/2022
ms.topic: concept-article
ms.custom: devx-track-js
ai-usage: ai-assisted
#customer intent: As a JavaScript or TypeScript developer new to Azure, I want understand how to test my code which depends on the Azure SDKs so that only test what is needed.
---

# Testing integration Code for Azure SDK for JavaScript

Testing your integration code for the Azure SDK for JavaScript is essential to ensure your applications interact correctly with Azure services. 
For unit tests, use tools such as Jest, Sinon, or ts-mockito. 

## Use Mocking or Live Service

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

### Mocks

Mocks (also called _spies_): Substitute in a function and be able to control and spy on the **behavior** of that function when it's called indirectly by some other code. 

In the following examples, you have 2 functions: 

- **someTestFunction**: This is the function you need to test. It calls a dependency, `dependencyFunction`, which you didn't write and don't need to test.
- **dependencyFunctionMock**: This is a mock of the dependency.

```javascript
// setup
const dependencyFunctionMock = jest.fn();

// perform test
// Jest replaces the call to dependencyFunction with dependencyFunctionMock
const { name } = someTestFunction()

// verify behavior
expect(dependencyFunctionMock).toHaveBeenCalled();
```

The purpose of the test is to ensure that someTestFunction behaves correctly without actually invoking the dependency code. The test validates that the mock of the dependency was called. 


### Stubs

Stubs: Replace a function's return data to simulate different scenarios. This allows your code to call the function and receive various states, including successful results, failures, exceptions, and edge cases. **State verification** ensures your code handles these scenarios correctly.

```javascript
// setup
const dependencyFunctionMock = jest.fn();
const fakeDatabaseData = {first: 'John', last: 'Jones'};
dependencyFunctionMock.mockReturnValue(fakeDatabaseData);

// perform test
// date is returned by mock then transformed in SomeTestFunction()
const { name } = someTestFunction()

// verify state
expect(name).toBe(`${first} ${last}`);
```

The purpose of the test is to ensure that the work done by `someTestFunction` meets the expected outcome. In this simple example, the function's task is to concatenate the first and last names. By using fake data, you know the expected result and can validate that the function performs the work correctly.

### Fakes

Fakes: Substitute in functionality that you wouldn't normally use in production, such as an in-memory database instead of a cloud database.

```javascript
// fake-in-mem-db.ts
class FakeDatabase {
    constructor() {
        this.data = {};
    }

    save(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }
}

// Function to test
function someTestFunction(db, key, value) {
    db.save(key, value);
    return db.get(key);
}

// Jest test suite
describe('someTestFunction', () => {
    let fakeDb;
    let testKey;
    let testValue;

    beforeEach(() => {
        fakeDb = new FakeDatabase();
        testKey = 'testKey';
        testValue = { first: 'John', last: 'Jones', lastUpdated: new Date().toISOString() };

        // Spy on the save method
        jest.spyOn(fakeDb, 'save');
    });

    afterEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
    });

    test('should save and return the correct value', () => {
        // Perform test
        const result = someTestFunction(fakeDb, testKey, testValue);

        // Verify state
        expect(result).toEqual(testValue);
        expect(result.first).toBe('John');
        expect(result.last).toBe('Jones');
        expect(result.lastUpdated).toBe(testValue.lastUpdated);

        // Verify behavior
        expect(fakeDb.save).toHaveBeenCalledWith(testKey, testValue);
    });
});
```

The purpose of the test is to ensure that `someTestFunction` correctly interacts with the database. By using a fake in-memory database, you can test the function's logic without relying on a real database, making the tests faster and more reliable.

## Scenario: Inserting a document into CosmosDB using Azure SDK

Imagine you have an application that needs to write a new document to Cosmos DB _if_ all the information is submitted and verified. If an empty form is submitted or the information doesn't match the expected format, the application shouldn't enter the data.

Cosmos DB is used as an example however the concepts apply to most of the Azure SDKs for JavaScript. The following simple function captures this functionality:

```typescript
// insertDocument.ts

export async function insertDocument<RawInput>(doc):Promise<
    DbDocument |                 // insert succeeded
    DBErrors |                   // insert failed
    VerificationErrors           // data doesn't match expected types
> {

    isVerified: bool = inputVerified(doc);

    return (isVerified)
        ? await cosmos.items.create(city);
        : null
}
```

> [!NOTE]
> TypeScript types help define the kinds of data a function uses. While you don't need TypeScript to use Jest or other JavaScript testing frameworks, it is essential for writing type-safe JavaScript.

The functions in this application above are:

| Function | Description  |
|--|--|
| **insertDocument**      | Inserts a document into the database. **This is what we want to test**. |
| **inputVerified**       | Verifies the input data against a schema using a package like zod. Ensures data is in the correct format (e.g., valid email addresses, correctly formatted URLs).|
| **cosmos.items.create** | SDK function for Azure Cosmos DB using the [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos). **This is what we want to mock**. It already has its own tests maintained by the package owners. We need to verify that the Cosmos DB function call was made and returned data if the incoming data passed verification. |

## Set up unit test for Azure SDK 

Lets go through

How can we use mocks, stubs, and fakes to test the **insertDocument** function? 

- Mocks: we need a mock to make sure the **behavior** of the function is tested such as:
  - If the data does pass verification, the call to the Cosmos DB function happened only 1 time
  - If the data doesn't pass verification, the call to the Cosmos DB function didn't happen
- Stubs:
  - The data passed in matches the new document returned by the function.

The following Jest test file shows how to test the **insertDocument** function.

```typescript
import { insertDocument } from './insertDocument';
import { cosmosContainer } from '@azure/cosmos';

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
jest.mock('./inputVerified', () => ({
    inputVerified: jest.fn((doc: { name: string }) => doc.name !== '')
}));

describe('insertDocument', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should insert document if input is verified', async () => {
        const { inputVerified } = require('./inputVerified');
        inputVerified.mockReturnValue(true);
        (cosmosContainer.items.create as jest.Mock).mockResolvedValue(dbDocument);

        const result = await insertDocument(validDoc);

        // Test behavior
        expect(inputVerified).toHaveBeenCalledWith(validDoc);
        expect(cosmosContainer.items.create).toHaveBeenCalledWith(validDoc);
        expect(result).toEqual(dbDocument.resource);

        // Validate properties
        expect(result.id).toBe(validDoc.id);
        expect(result.name).toBe(validDoc.name);
    });

    test('should not insert document if input is not verified', async () => {
        const { inputVerified } = require('./inputVerified');
        inputVerified.mockReturnValue(false);

        const result = await insertDocument(invalidDoc);

        // Test behavior
        expect(inputVerified).toHaveBeenCalledWith(invalidDoc);
        expect(cosmosContainer.items.create).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test('should handle database throwing errors', async () => {
        const { inputVerified } = require('./inputVerified');
        inputVerified.mockReturnValue(true);
        (cosmosContainer.items.create as jest.Mock).mockRejectedValue(dbErrors);

        try {
            await insertDocument(validDoc);
        } catch (error) {
            expect(error).toEqual(dbErrors);
        }

        // Test behavior
        expect(inputVerified).toHaveBeenCalledWith(validDoc);
        expect(cosmosContainer.items.create).toHaveBeenCalledWith(validDoc);
    });
});
```


## References

* [Jest Mocking Best Practices](https://devblogs.microsoft.com/ise/jest-mocking-best-practices/)
* [The Difference between Mocks and Stubs](https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs) by Martin Fowler


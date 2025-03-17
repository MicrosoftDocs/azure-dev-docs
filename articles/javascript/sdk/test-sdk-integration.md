---
title: "How to Test Azure SDK Integration in JavaScript Applications"
description: "Learn how to test Azure SDK integration in JavaScript apps using Jest. Discover best practices for using live dependencies, doubles, and mocks with Azure client libraries."
ms.date: 03/14/2025
ms.topic: concept-article
ms.custom: devx-track-js
ai-usage: ai-assisted
#customer intent: As a JavaScript or TypeScript developer new to Azure, I want understand how to test my code which depends on the Azure SDKs so that only test what is needed.
---

# How to Test Azure SDK Integration in JavaScript Applications

Testing your integration code for the Azure SDK for JavaScript is essential to ensure your applications interact correctly with Azure services. This guide shows you how to effectively test Azure SDK integration in your JavaScript applications a testing framework. 

When deciding whether to mock out cloud service SDK calls or use a live service for testing purposes, it's important to consider the trade-offs between speed, reliability, and cost. This article demonstrates how to use a test framework for testing SDK integration. Other comparable test frameworks can also be used.

## Prerequisites

- [Node.js LTS](https://nodejs.org). LTS [release status](https://nodejs.org/about/previous-releases) is "long-term support", which typically guarantees that critical bugs will be fixed for a total of 30 months.

### [Node.js test runner](#tab/test-with-node-testrunner)

The [Node.js test runner](https://nodejs.org/en/learn/test-runner/introduction) is part of the Node.js installation. 

> [!CAUTION]
> The sample provided for the Node.js test runner uses the experimental node:test module with mock.fn(). Keep in mind that Node’s built‐in test runner doesn't yet offer a fully supported mocking API. Make sure that your target Node version supports the experimental APIs or consider using a third‑party mocking library (or stub functions) instead.

### [Jest](#tab/test-with-jest)

- [Jest](https://jestjs.io/)

### [Vitest](#tab/test-with-vitest)

- [Vitest](https://main.vitest.dev/)

---


### Mocking cloud services

**Pros:**

- Speeds up test suite by eliminating network latency.
- Provides predictable and controlled test environments.
- Easier to simulate various scenarios and edge cases.
- Reduces costs associated with using live cloud services, especially in continuous integration pipelines.

**Cons:**

- Mocks can drift from the actual SDK, leading to discrepancies.
- Might ignore certain features or behaviors of the live service.
- Less realistic environment compared to production.

### Using a live service

**Pros:**

- Is a realistic environment that closely mirrors production?
- Is useful for integration tests to ensure different parts of the system work together?
- Is helpful to identify issues related to network reliability, service availability, and actual data handling?

**Cons:**

- Is slower due to network calls.
- Is more expensive due to potential service usage costs.
- Is complex and time-consuming to set up and maintain a live service environment that matches production.

The choice between mocking and using live services depends on your testing strategy. For unit tests where speed and control are paramount, mocking is often the better choice. For integration tests where realism is crucial, using a live service can provide more accurate results. Balancing these approaches helps achieve comprehensive test coverage while managing costs and maintaining test efficiency.

## Test doubles: Mocks, stubs, and fakes

A test double is any kind of substitute used in place of something real for testing purposes. The type of double you choose is based on what you want it to replace. The term _mock_ is often meant as any _double_ when the term is used casually. In this article, the term is used specifically and illustrated specifically in the Jest test framework. 

### Mocks

Mocks (also called _spies_): Substitute in a function and be able to control and spy on the **behavior** of that function when it's called indirectly by some other code. 

In the following examples, you have 2 functions: 

- **someTestFunction**: The function you need to test. It calls a dependency, `dependencyFunction`, which you didn't write and don't need to test.
- **dependencyFunctionMock**: Mock of the dependency.

### [Node.js test runner](#tab/test-with-node-testrunner)

```typescript
import { mock } from 'node:test';
import assert from 'node:assert';

// setup
const dependencyFunctionMock = mock.fn();

// perform test
// Mock replaces the call to dependencyFunction with dependencyFunctionMock
const { name } = someTestFunction()

// verify behavior
assert.strictEqual(dependencyFunctionMock.mock.callCount(), 1);
```


### [Jest](#tab/test-with-jest)

```typescript
// setup
const dependencyFunctionMock = jest.fn();

// perform test
// Jest replaces the call to dependencyFunction with dependencyFunctionMock
const { name } = someTestFunction()

// verify behavior
expect(dependencyFunctionMock).toHaveBeenCalled();
```

### [Vitest](#tab/test-with-vitest)

```typescript
import { expect, vi } from 'vitest';

// setup
const dependencyFunctionMock = vi.fn();

// perform test
// Mock replaces the call to dependencyFunction with dependencyFunctionMock
const { name } = someTestFunction()

// verify behavior
expect(dependencyFunctionMock).toHaveBeenCalledTimes(1);
```

---



The purpose of the test is to ensure that someTestFunction behaves correctly without actually invoking the dependency code. The test validates that the mock of the dependency was called. 

### Mock large versus small dependencies

When you decide to mock a dependency, you can choose to mock just what you need such as:

- A function or two from a **larger dependency**. Jest offers [partial mocks](https://jestjs.io/docs/mock-functions#mocking-partials) for this purpose. 
- All functions of a **smaller dependency**, as shown in the example in this article.

### Stubs

The purpose of a stub is to replace a function's return data to simulate different scenarios. You use a stub to allow your code to call the function and receive various states, including successful results, failures, exceptions, and edge cases. **State verification** ensures your code handles these scenarios correctly.

### [Node.js test runner](#tab/test-with-node-testrunner)

```typescript
import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';

// setup
const fakeDatabaseData = {first: 'John', last: 'Jones'};

const dependencyFunctionMock = mock.fn();
dependencyFunctionMock.mock.mockImplementation((arg) => {
    return fakeDatabaseData;
});

// perform test
// Mock replaces the call to dependencyFunction with dependencyFunctionMock
const { name } = someTestFunction()

// verify behavior
assert.strictEqual(name, `${fakeDatabaseData.first} ${fakeDatabaseData.last}`);
```


### [Jest](#tab/test-with-jest)

```typescript
// ARRANGE
const dependencyFunctionMock = jest.fn();
const fakeDatabaseData = {first: 'John', last: 'Jones'};
dependencyFunctionMock.mockReturnValue(fakeDatabaseData);

// ACT
// date is returned by mock then transformed in SomeTestFunction()
const { name } = someTestFunction()

// ASSERT
expect(name).toBe(`${fakeDatabaseData.first} ${fakeDatabaseData.last}`);
```

### [Vitest](#tab/test-with-vitest)

```typescript
import { it, expect, vi } from 'vitest';

// ARRANGE
const fakeDatabaseData = {first: 'John', last: 'Jones'};

const dependencyFunctionMock = vi.fn();
dependencyFunctionMock.mockReturnValue(fakeDatabaseData);

// ACT
// date is returned by mock then transformed in SomeTestFunction()
const { name } = someTestFunction()

// ASSERT
expect(name).toBe(`${fakeDatabaseData.first} ${fakeDatabaseData.last}`);
```


---



The purpose of the preceding test is to ensure that the work done by `someTestFunction` meets the expected outcome. In this simple example, the function's task is to concatenate the first and family names. By using fake data, you know the expected result and can validate that the function performs the work correctly.

### Fakes

Fakes substitute a functionality that you wouldn't normally use in production, such as using an in-memory database instead of a cloud database.

- [Node.js LTS](https://nodejs.org).

### [Node.js test runner](#tab/test-with-node-testrunner)

### [Jest](#tab/test-with-jest)

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/fakes/fake-in-mem-db.spec.ts" :::

### [Vitest](#tab/test-with-vitest)

---



The purpose of the preceding test is to ensure that `someTestFunction` correctly interacts with the database. By using a fake in-memory database, you can test the function's logic without relying on a real database, making the tests faster and more reliable.

## Scenario: Insert document into Cosmos DB using Azure SDK

Imagine you have an application that needs to write a new document to Cosmos DB _if_ all the information is submitted and verified. If an empty form is submitted or the information doesn't match the expected format, the application shouldn't enter the data.

Cosmos DB is used as an example, however the concepts apply to most of the Azure SDKs for JavaScript. The following function captures this functionality:

- [Node.js LTS](https://nodejs.org).

### [Node.js test runner](#tab/test-with-node-testrunner)

### [Jest](#tab/test-with-jest)

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/mock-function/lib/insert.ts":::

### [Vitest](#tab/test-with-vitest)

---



> [!NOTE]
> TypeScript types help define the kinds of data a function uses. While you don't need TypeScript to use Jest or other JavaScript testing frameworks, it's essential for writing type-safe JavaScript.

The functions in this application are:

| Function | Description  |
|--|--|
| **insertDocument**      | Inserts a document into the database. **This is what we want to test**. |
| **inputVerified**       | Verifies the input data against a schema. Ensures data is in the correct format (for example, valid email addresses, correctly formatted URLs).|
| **cosmos.items.create** | SDK function for Azure Cosmos DB using the [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos). **This is what we want to mock**. It already has its own tests maintained by the package owners. We need to verify that the Cosmos DB function call was made and returned data if the incoming data passed verification. |

### Install test framework dependency

- [Node.js LTS](https://nodejs.org).

### [Node.js test runner](#tab/test-with-node-testrunner)

This framework is provided as part of Node.js LTS.

### [Jest](#tab/test-with-jest)


In the root of the application directory, install Jest with the following command:

```console
npm install -D jest
```

### [Vitest](#tab/test-with-vitest)

In the root of the application directory, install Vitest with the following command:

```console
npm install -D vitest
```


---



### Configure package to run test

### [Node.js test runner](#tab/test-with-node-testrunner)


Update the `package.json` for the application with a new script to test our source code files. Source code files are defined by matching on partial file name and extension. Test runner looks for files following the common naming convention for test files: `<file-name>.spec.[jt]s`. This pattern means files named like the following examples are interpreted as test files and run by Test runner:

- ***.test.js**: For example, math.test.js
- ***.spec.js**: For example, math.spec.js
- **Files located in a *__tests__* directory**, such as __tests__/math.js

Add a script to the *package.json* to support that test file pattern with Test runner:

```JSON
"scripts": {
    "test": "node --test --experimental-test-coverage --experimental-test-module-mocks --trace-exit"
}
```


### [Jest](#tab/test-with-jest)


Update the `package.json` for the application with a new script to test our source code files. Source code files are defined by matching on partial file name and extension. Jest looks for files following the common naming convention for test files: `<file-name>.spec.[jt]s`. This pattern means files named like the following examples are interpreted as test files and run by Jest:

- ***.test.js**: For example, math.test.js
- ***.spec.js**: For example, math.spec.js
- **Files located in a *__tests__* directory**, such as __tests__/math.js

Add a script to the *package.json* to support that test file pattern with Jest:

```JSON
"scripts": {
    "test": "jest dist --coverage",
}
```

The TypeScript source code is generated into the `dist` subfolder. Jest runs the `.spec.js` files found in the `dist` subfolder.


### [Vitest](#tab/test-with-vitest)



Update the `package.json` for the application with a new script to test our source code files. Source code files are defined by matching on partial file name and extension. Vitest looks for files following the common naming convention for test files: `<file-name>.spec.[jt]s`. This pattern means files named like the following examples are interpreted as test files and run by Vitest:

- ***.test.js**: For example, math.test.js
- ***.spec.js**: For example, math.spec.js
- **Files located in a *__tests__* directory**, such as __tests__/math.js

Add a script to the *package.json* to support that test file pattern with Vitest:

```JSON
"scripts": {
    "test": "vitest run --coverage",
}
```

---


### Set up unit test for Azure SDK 

How can we use mocks, stubs, and fakes to test the **insertDocument** function? 

- Mocks: we need a mock to make sure the **behavior** of the function is tested such as:
  - If the data does pass verification, the call to the Cosmos DB function happened only 1 time
  - If the data doesn't pass verification, the call to the Cosmos DB function didn't happen
- Stubs:
  - The data passed in matches the new document returned by the function.

When testing, think in terms of the test setup, the test itself, and the verification. In terms of test vernacular, this functionality uses the following terms:

* Arrange: set up your test conditions
* Act: call your function to test, also known as the _system under test_ or SUT
* Assert: validate the results. Results can be behavior or state. 
    * Behavior indicates functionality in your test function, which can be verified. One example is that some dependency was called.
    * State indicates the data returned from the function.  

### [Node.js test runner](#tab/test-with-node-testrunner)

### [Jest](#tab/test-with-jest)

Jest has a test file template to define your test file. 

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/test-boilerplate/boilerplate.spec.ts":::

### [Vitest](#tab/test-with-vitest)


---



When you use mocks in your tests, that template code needs to use mocking to test the function without calling the underlying dependency used in the function, such as the Azure client libraries. 

## Create the test file

The test file with mocks, to simulate a call to a dependency, has an extra setup. 


### [Node.js test runner](#tab/test-with-node-testrunner)

### [Jest](#tab/test-with-jest)

There are several parts to the test file:

- `import`: The import statements allow you to use or mock out any of your test.
- `jest.mock`: Create the default mock behavior you want. Each test can alter as needed. 
- `describe`: Test group family for the `insert.ts` file.
- `test`: Each test for the `insert.ts` file.


### [Vitest](#tab/test-with-vitest)


---


The test file covers three tests for the `insert.ts` file, which can be divided into two validation types:

|Validation type|Test|
|--|--|
|Happy path: `should insert document successfully`|The mocked database method was called, and returned the altered data.|
|Error path: `should return verification error if input is not verified`|Data failed validation and returned an error.|
|Error path:`should return error if db insert fails`|The mocked database method was called, and returned an error.|


### [Node.js test runner](#tab/test-with-node-testrunner)

### [Jest](#tab/test-with-jest)

The following Jest test file shows how to test the **insertDocument** function.

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/mock-function/lib/insert.spec.ts":::


### [Vitest](#tab/test-with-vitest)


---

## Additional information 

- [Jest Mocking Best Practices](https://devblogs.microsoft.com/ise/jest-mocking-best-practices/)
- [Vitest mocking](https://vitest.dev/guide/mocking)
- [Node.js Test runner](https://nodejs.org/en/learn/test-runner/introduction)
- [The Difference between Mocks and Stubs](https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs) by Martin Fowler


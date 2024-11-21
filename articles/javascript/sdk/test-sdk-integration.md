---
title: "Testing code depending on Azure SDK in JavaScript"
description: "Learn to test Azure SDK integration in JavaScript apps. Understand when to use live dependencies, doubles, and mocks with client libraries (SDKs)."
ms.date: 08/29/2022
ms.topic: concept-article
ms.custom: devx-track-js
ai-usage: ai-assisted
#customer intent: As a JavaScript or TypeScript developer new to Azure, I want understand how to test my code which depends on the Azure SDKs so that only test what is needed.
---

# Testing Azure SDK integration in JavaScript applications

Testing your integration code for the Azure SDK for JavaScript is essential to ensure your applications interact correctly with Azure services. 

When deciding whether to mock out cloud service SDK calls or use a live service for testing purposes, it's important to consider the trade-offs between speed, reliability, and cost.

## Prerequisites

- [Node.js LTS](https://nodejs.org)

### Mocking cloud services

**Pros:**

- Speeds up test suite by eliminating network latency.
- Provides predictable and controlled test environments.
- Easier to simulate various scenarios and edge cases.
- Reduces costs associated with using live cloud services, especially in continuous integration pipelines.

**Cons:**

- Mocks may drift from the actual SDK, leading to discrepancies.
- Might ignore certain features or behaviors of the live service.
- Less realistic environment compared to production.

### Using a live service

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

### Mock large versus small dependencies

When you decide to mock a dependency, you can choose to mock just what you need such as:

- A function or two from a **larger dependency**. Jest offers [partial mocks](https://jestjs.io/docs/mock-functions#mocking-partials) for this purpose. 
- All functions of a **smaller dependency**, as shown in the example in this article.

### Stubs

The purpose of stubs is to replace a function's return data to simulate different scenarios. This allows your code to call the function and receive various states, including successful results, failures, exceptions, and edge cases. **State verification** ensures your code handles these scenarios correctly.

```javascript
// ARRANGE
const dependencyFunctionMock = jest.fn();
const fakeDatabaseData = {first: 'John', last: 'Jones'};
dependencyFunctionMock.mockReturnValue(fakeDatabaseData);

// ACT
// date is returned by mock then transformed in SomeTestFunction()
const { name } = someTestFunction()

// ASSERT
expect(name).toBe(`${first} ${last}`);
```

The purpose of the preceding test is to ensure that the work done by `someTestFunction` meets the expected outcome. In this simple example, the function's task is to concatenate the first and family names. By using fake data, you know the expected result and can validate that the function performs the work correctly.

### Fakes

Fakes substitute a functionality that you wouldn't normally use in production, such as using an in-memory database instead of a cloud database.

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/fakes/fake-in-mem-db.spec.ts" :::

The purpose of the preceding test is to ensure that `someTestFunction` correctly interacts with the database. By using a fake in-memory database, you can test the function's logic without relying on a real database, making the tests faster and more reliable.

## Scenario: Inserting a document into Cosmos DB using Azure SDK

Imagine you have an application that needs to write a new document to Cosmos DB _if_ all the information is submitted and verified. If an empty form is submitted or the information doesn't match the expected format, the application shouldn't enter the data.

Cosmos DB is used as an example, however the concepts apply to most of the Azure SDKs for JavaScript. The following function captures this functionality:

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/mock-function/lib/insert.ts":::

> [!NOTE]
> TypeScript types help define the kinds of data a function uses. While you don't need TypeScript to use Jest or other JavaScript testing frameworks, it is essential for writing type-safe JavaScript.

The functions in this application above are:

| Function | Description  |
|--|--|
| **insertDocument**      | Inserts a document into the database. **This is what we want to test**. |
| **inputVerified**       | Verifies the input data against a schema. Ensures data is in the correct format (for example, valid email addresses, correctly formatted URLs).|
| **cosmos.items.create** | SDK function for Azure Cosmos DB using the [@azure/cosmos](https://www.npmjs.com/package/@azure/cosmos). **This is what we want to mock**. It already has its own tests maintained by the package owners. We need to verify that the Cosmos DB function call was made and returned data if the incoming data passed verification. |

## Install test framework dependency

This article uses [Jest](https://jestjs.io/) as the test framework. There are other test frameworks, which are comparable you can also use. 

In the root of the application directory, install Jest with the following command:

```console
npm install jest
```

## Configure package to run test

Update the `package.json` for the application with a new script to test our source code files. Source code files are defined by matching on partial file name and extension. Jest looks for files following the common naming convention for test files: `<file-name>.spec.[jt]s`.  This pattern means files named like the following examples will be interpreted as test files and run by Jest:

- ***.test.js**: For example, math.test.js
- ***.spec.js**: For example, math.spec.js
- **Files located in a *__tests__* directory**, such as __tests__/math.js

Add a script to the *package.json* to support that test file pattern with Jest:

```JSON
"scripts": {
    "test": "jest dist",
}
```

The TypeScript source code is generated into the `dist` subfolder. Jest runs the `.spec.js` files found in the `dist` subfolder.

## Set up unit test for Azure SDK 

How can we use mocks, stubs, and fakes to test the **insertDocument** function? 

- Mocks: we need a mock to make sure the **behavior** of the function is tested such as:
  - If the data does pass verification, the call to the Cosmos DB function happened only 1 time
  - If the data doesn't pass verification, the call to the Cosmos DB function didn't happen
- Stubs:
  - The data passed in matches the new document returned by the function.

When testing, think in terms of the test setup, the test itself, and the verification. In terms of test vernacular, this is known as:

* Arrange: set up your test conditions
* Act: call your function to test, also known as the _system under test_ or SUT
* Assert: validate the results. Results can be behavior or state. 
    * Behavior indicates functionality in your test function, which can be verified. One example is that some dependency was called.
    * State indicates the data returned from the function.  

Jest, similar with other test frameworks, has test file boilerplate to define your test file. 

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/test-boilerplate/boilerplate.spec.ts":::

When using mocks, that boiler place needs to use mocking to test the function without calling the underlying dependency used in the function, such as the Azure client libraries. 

## Create the test file

The test file with mocks to simulate a call to a dependency has some extra setup in additional to the common test boilerplate code. There are several parts to the test file below:

- `import`: The import statements allow you to use or mock out any of your test.
- `jest.mock`: Create the default mock behavior you want. Each test can alter as needed. 
- `describe`: Test group family for the `insert.ts` file.
- `test`: Each test for the `insert.ts` file.

The test file covers three tests for the `insert.ts` file, which can be divided into two validation types:

|Validation type|Test|
|--|--|
|Happy path: `should insert document successfully`|The mocked database method was called, and returned the altered data.|
|Error path: `should return verification error if input is not verified`|Data failed validation and returned an error.|
|Error path:`should return error if db insert fails`|The mocked database method was called, and returned an error.|

The following Jest test file shows how to test the **insertDocument** function.

:::code language="TypeScript" source="~/../node-essentials/unit-testing/src/mock-function/lib/insert.spec.ts":::

## Additional information 

- [Jest Mocking Best Practices](https://devblogs.microsoft.com/ise/jest-mocking-best-practices/)
- [The Difference between Mocks and Stubs](https://martinfowler.com/articles/mocksArentStubs.html#TheDifferenceBetweenMocksAndStubs) by Martin Fowler


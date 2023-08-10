---
title: User scenarios with Contoso real estate
description: Understand how the implementation architecture of Contoso real estate maps to the User scenarios the solution is meant to solve.
ms.topic: conceptual
ms.date: 08/10/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
# CustomerIntent: As a Senior JavaScript Developer new to the Contoso real estate enterprise pp, I want understand how the user scenarios the architecture solves for so that I can have a deeper understanding between the technical solution and the business solution.
---

# User scenarios for Contoso real estate

To understand the solution implementation, it's important to identify the user's of the solution and what actions each can accomplish.

## User specification

The solutions architect has the following requirements:
 - **3 user types**: Guests, New Hires and HR Admins
 - **3 content types**: Listings, Blog Posts, User Activities
 - **3 user interfaces**: Portal UI, Blog UI and Admin UI

The use case is implemented by a **modern full-stack application** with _multiple front-ends_ talking to a _content management system_ and related _service integrations_ on the backend through a _common API_:
 - **Admin App**: is the core UI/UX for HR Admins, putting _content management_ in focus.
 - **Portal App**: is the primary UI/UX for New Hires, putting _rental listings_ in focus.
 - **Blog App**: is the secondary UI/UX for New Hires, discoverable from the Portal App.

Where user roles are tied to the relevant app:
 - **HR Admins** are authenticated users on Admin app.
 - **New Hires** are authenticated users on Portal app.
 - **Guests** are anonymous users that can only see Blog and Portal apps.

By definition, _Guest_ roles can sign in on the Portal App to get upgraded to _New User_ roles. And _New User_ roles are downgraded to _Guest_ access when they sign out. 

## User Scenarios by role

Now convert the broad application scenario into specific user scenarios:

**HR Admin Role**

* HR Admins **can** sign in on the **Admin App**:
    * Manage property listings and feature certain listings
    * Create blog posts 
    * Manage portal content seen on _About_ page, _Terms of service_ page, _Home_ pages.
* HR Admins **can't** sign in on the **Portal App**. HR Admin can visit the Portal App anonymously, as a Guest.

**Guest Role** 

* Guests **can** visit the **Portal App** and see content, which doesn't require authentication such as the _Home_ page, _About_ page, _Terms of service_ page. Guests can also begin the authentication process to sign in to the Portal App.
* Guests **can** visit the **Blog App** page can see and explore the blog posts.
* Guests **can't** sign in on the **Admin App**

**New Hire Role** 

* New Hires **can** sign in on the **Portal App** and see, explore, and reserve listings.
* New Hires **can't** sign in on the **Admin App**

## Test role actions

When the user roles and abilities are defined, these can be validated with [Playwright](https://playwright.dev/docs/intro) end to end tests.

## Next step

> [!div class="nextstepaction"]
> [Understand the developer solutions](contoso-real-estate-developer-solutions.md)

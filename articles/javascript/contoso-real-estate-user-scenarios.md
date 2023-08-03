---
title: User scenarios with Contoso real estate
description: Understand how the implementation architecture of Contoso real estate maps to the User scenarios the solution is meant to solve.
ms.topic: conceptual
ms.date: 8/1/2023
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

## User Scenarios

Now convert the broad application scenario into specific user scenarios:

### HR Admin Role

HR Admins **can** sign in on the **Admin App** and: 

* Create property listings with location, amenities, price
* Update, delete, or view current rental listings
* Toggle feature flag on a listing to feature it
* Create blog posts with title, images, content
* Update portal content seen on _About_ page, _Terms of service_ page, _Home_ pages.

HR Admins **can't** sign in on the **Portal App**

* HR Admins credentials for Admin App shouldn't work on Portal App.
* HR Admin can visit the Portal App anonymously, as a Guest.

### Guest Role

Guests can visit the **Portal App** and:

* See the *Home page* as their landing or entry point
* See *navbar, footer and content* sections on Home page
* See a selectable *login button* in the navbar 
* See selectable *About, TOS, Home links* in footer
* See a *"hero banner"* in content section of Home page 
* See a selectable *visit blog* button in the hero banner 
* See a selectable *"search" button* in content section of Home page 
* See a *"featured" listings block* in content section of Home page 
* See a selectable listing image for each item in the featured listings

Guests on the **Portal App** _Home_ page can: 

* Select the *login* button to start authentication workflow
* Select *About*, *TOS*, *Home links* to visit those pages (routes)
* Select the search button to visit the search page to make queries
* Select the blog link to visit the **Blog App**
* Select a featured listing image to visit the listing details page

Guests on the **Portal App** _Listing Details_ page can:

* See related listing images
* See related listing details (location, description, amenities)
* See a listing reservation section (not enabled for input)
* See the same navbar and footer sections as Home page
* Select the navbar sign in button to start authentication workflow
* Select *About, TOS, Home links* to visit those pages (routes)

Guests can visit the Blog App page can:

* See the same navbar and footer as the Portal App
* See a list of tags for exploring blog posts
* See a list of currently published blog posts 
* See a link to return to Portal App page
* Select on a blog post in listing to visit Blog Article page.

### New Hire Role

New Hires can sign in on the **Portal App** and: 

* Get all default _Guest_ features except for the login button in navbar then see a:
    * Selectable _Profile_ button in navbar 
    * Selectable _Favorite_ toggle button on listing cards in Home page
    * Selectable _Favorite_ toggle button in Listing Detail page
    * Editable _Reservation_ form section in Listing Detail page
    * Selectable _Reserve_ button in Reservation form section
* Select Profile button to see a dropdown menu with a selectable
    - _Profile_ item leading to the user's profile page
    - _Favorites_ item leading to the user's saved listings
    - _Reservations_ item leading to the user's reservations 
    - _Payments_ item leading to the user's payments history
    - _Logout_ item that logs user out (returns to Guest role)
* Editable Reservation form details (dates) and select to submit request

New Hires can't sign in on the **Admin App**

* New Hires shouldn't _see_ any links to Admin App in Portal App
* New Hire credentials for Portal App shouldn't work for Admin App

## Test role actions

When the user roles and abilities are defined, these can be validated with [Playwright](https://playwright.dev/docs/intro) end to end tests.

## Next step

> [!div class="nextstepaction"]
> [Understand the developer solutions](contoso-real-estate-developer-solutions.md)

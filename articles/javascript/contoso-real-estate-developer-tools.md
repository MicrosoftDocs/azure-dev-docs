---
title: Contoso real estate developer tools
description: Modern cloud development includes tools to enable you to develop, debug, build, deploy, and test you application.
ms.topic: Overview
ms.date: 05/23/2023
ms.custom: devx-track-js, devx-track-ts, contoso-real-estate
---

# What are modern cloud development tools and practices

Modern cloud development includes tools to enable you to develop, debug, build, deploy, and test you application. 

## Developer Environment

An effective and efficient development team makes use of the following modern tools and techniques:

|Tool or technique|Summary|
|--|--|
|Development Containers|The development environment must be the same for every developer on your team. That environment also needs to mirror the production environment as much as possible. [Development Containers](https://containers.dev/) is the industry standard with community support, a specification, tools, guides and templates. The dev container should be maintained for operating system, languages, and other tools necessary for team effeciency.|
|IDEs|In integrated development environment which seemlessly uses your development container allows you to quickly onboard new team members will still supporting the rest of the team. Any IDE settings, extensions, source code dependencies, and other integrations should be rolled back into the dev container so all team members can have those manual steps and time removed from their flow. |
|IAM|Each team member should have access to either local emulators or cloud services with the appropriate and limited authorization.|
|Secrets and configuration|All configuration including secrets necessary to start up the app during local development should be available from secured storage. |
|Code quality tooling|The environment shared by the team should have the same code quality specifications in place, stored in source code, and maintained as the team code quality matures.|
|Automated testing|The environment should allow the developer to quickly write code and test the impact it has on the project as a whole.|

## Infrastructure as code



## Continuous integration and deployment

This reference architecture contains the components for building enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. It's a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.

## End to end testing

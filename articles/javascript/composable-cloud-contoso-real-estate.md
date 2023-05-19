---
title: Composable Cloud - Contoso Real Estate 
description: Enterprise-grade Reference Architecture for JavaScript including a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.
ms.topic: how-to
ms.date: 05/19/2023
ms.custom: devx-track-js, devx-track-ts
---

# Contoso Real Estate: Enterprise-grade Reference Architecture for JavaScript

This reference architecture contains the components for building enterprise-grade modern composable frontends (or micro-frontends) and cloud-native applications. It is a collection of best practices, architecture patterns, and functional components that can be used to build and deploy modern JavaScript applications to Azure.

## Who is Contoso?

Contoso Corporation is a fictional but representative global manufacturing conglomerate with its headquarters in Paris. The company deployed Microsoft 365 for enterprise and addressed major design decisions and implementation details for networking, identity, Windows 10 Enterprise, Microsoft 365 Apps for enterprise, mobile device management, information protection, and security.

The company's overall goal for Microsoft 365 for enterprise is to accelerate its digital transformation by using cloud services to bring together its employees, partners, data, and processes to create customer value and maintain its competitive advantage in a digital-first world.

Contoso has 3 office tiers (Headquarters, Regional and Satellite) with a total of almost 30K employees.

Contoso is expanding its configuration, and rolling out to new regions and countries, which will result in massive hiring. They offer relocation and have designed an application, to help HR and new hires find the right housing. This web app is an internal tool used by Contoso HR and new hire or relocating employees.

The Contoso HR App is part of the Contoso platform and designed to serve internal users. Both authenticated Talent Managers, and new hires can interact with the application features, while non-authenticated users can access some parts of it.

## What is built to support the HR app? 

The HR app is built as:

* UI for rentals portal and blog front ends
* API layer to communicate between client and cloud
* Microservices for cloud integrations

:::image type="content" source="https://github.com/Azure-Samples/contoso-real-estate/blob/main/docs/media/block-architecture.png" alt-text="Diagram showing HR app architecture":::
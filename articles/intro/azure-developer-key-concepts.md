---
title: Important considerations when designing your Azure solution
description: Understand the factors that affect your overall strategy for designing an Azure solution.
keywords: azure account, azure subscription, billing, region, resource groups
ms.topic: overview
ms.date: 09/16/2021
ms.custom: overview
---

# Important considerations when designing your Azure solution

Before you get too far in designing your application to run on Azure, chances are you'll need to do a little planning ahead of time.  As you get started, there are some basic Azure concepts that you need to understand to make the best decisions for your scenario.  Considerations include:

- Accounts
- Subscriptions
- Billing accounts
- Resource groups
- Region
- Setting permissions
- Storing connection strings and other private data

## What is an account?

The Azure account is a global unique entity that gets you access to Azure services and your Azure subscriptions.

![Conceptual video](https://via.placeholder.com/640x360?text=conceptual-video)

## What is a subscription?

You can create multiple subscriptions in your Azure account to create separation for billing or management purposes. An Azure subscription can have a trust relationship with an Azure Active Directory (Azure AD) instance.  A subscription trusts Azure AD to authenticate users, services, and devices.  In other words, you can gain access to resources set up by other Azure subscriptions via Azure Active Directory.  This is how you can have your own account, but manage and deploy services to your employer's account.

Multiple subscriptions can trust the same Azure AD directory. Each subscription can only trust a single directory.

## What is a billing account?

A billing account is created when you sign up to use Azure. You use your billing account to manage your invoices, payments, and track costs. You can have access to multiple billing accounts.

## What is a resource group?

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group.

![Conceptual video](https://via.placeholder.com/640x360?text=conceptual-video)

## What is a region?

A region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. Azure gives you the flexibility to deploy applications where you need to, including across multiple regions to deliver cross-region resiliency.

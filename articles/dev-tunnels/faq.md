---
title: Dev tunnels frequently asked questions (FAQ)
titleSuffix: Microsoft dev tunnels
description: Frequently asked questions for dev tunnels.
author: curib
ms.author: cauribeg
ms.topic: reference
ms.service: azure-dev-tunnels
ms.custom: build-2023
ms.date: 04/26/2023 
---

# Frequently asked questions (FAQ)

Some frequently asked questions for dev tunnels.

## Issues and requests

GitHub [issues](https://github.com/Microsoft/dev-tunnels/issues) is a great way to connect with us.

. [Request a feature, submit a bug, or up-vote an existing one any features, bugs, feedback](https://github.com/Microsoft/dev-tunnels).

## What is dev tunnels?

Dev tunnels allow developers to securely share local web services across the internet. There are many use cases including: sharing in-progress work without having to deploy an application; prototyping applications locally that need the ability to receive webhook notifications from other services; working with local web services during mobile development.

## Is dev tunnels available on all platforms?

Dev tunnels are available cross-platform on Windows, Linux, and macOS.

## When are unused dev tunnels deleted?

After 30 days of no activity.

## Is it better to recreate dev tunnels or reuse the same dev tunnel?

We'd recommend reusing the same tunnel when it's convenient, rather than creating a new one for every use. It's also slightly faster to get an existing tunnel compared to creating a new one. In addition, by reusing the same tunnel, the tunnel web forwarding URL can be stable instead of changing on every use.

## Can anonymous users create dev tunnels?

No, anonymous users can't create dev tunnels. All creation of tunnels requires either a Microsoft Azure Active Directory (Azure AD), Microsoft, or GitHub account.

## Where else is dev tunnels used?

- [Teams Toolkit for Visual Studio Code Update – April 2023](https://devblogs.microsoft.com/microsoft365dev/teams-toolkit-for-visual-studio-code-update-april-2023/)
- [How to use dev tunnels in Visual Studio 2022 with ASP.NET Core apps](/aspnet/core/test/dev-tunnels)

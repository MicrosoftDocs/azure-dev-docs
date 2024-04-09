---
title: Dev tunnels frequently asked questions (FAQ)
titleSuffix: Microsoft dev tunnels
description: Frequently asked questions for dev tunnels.
author: curib
ms.author: cauribeg
ms.topic: reference
ms.service: azure-dev-tunnels
ms.custom: build-2023
ms.date: 11/17/2023 
---

# Frequently asked questions (FAQ)

This article answers some frequently asked questions about dev tunnels.

## What is dev tunnels?

Dev tunnels allow developers to securely share local web services across the internet. There are many use cases including: sharing in-progress work without having to deploy an application; prototyping applications locally that need the ability to receive webhook notifications from other services; working with local web services during mobile development.

## Issues and requests

See how to request feedback or submit an issue [here](support.md).

## Is dev tunnels available on all platforms?

Dev tunnels are available cross-platform on Windows, Linux, and macOS.

## What are the usage limits for dev tunnels?

See the dev tunnels limits [here](https://aka.ms/devtunnels/limits).

## When are unused dev tunnels deleted?

The default is after 30 days of no activity. You can set a custom expiration by appending `--expiration 5d` to the create, host, or update command. Minimum that you can set is 1 hour (1h) and the maximum you can set is 30 days (30d). The custom expiration you set is after a period of inactivity, just like the default expiration. This means it isn't a fixed expiration time, but instead a sliding window that is automatically pushed out by any new activity. See examples [here](cli-commands.md).

## Can I set time-limited anonymous access to my tunnel?

Yes. You can set time-limited anonymous access by running `devtunnel access create TUNNELID -a --expiration 2h` after you've created a tunnel. Minimum that you can set is 1 hour (1h) and the maximum you can set is 30 days (30d). Once the access control expires, it is removed from the tunnel. If an access control is set to expire after the tunnel expires, the tunnel expiration takes precedence. Note, once you set the expiration for an access control you cannot modify it, unless you entirely reset your access controls on the tunnel. Additionally, this expiration is on a fixed window, so it checks the access control expiration against the time it was created.

## How can I create a persistent tunnel?

Run `devtunnel create` to create a persistent tunnel. If you run `devtunnel host` without running `devtunnel create` before that, the `devtunnel host` command creates a temporary tunnel that is deleted once the connection is closed.

## Is it better to recreate dev tunnels or reuse the same dev tunnel?

We'd recommend reusing the same dev tunnel when it's convenient, rather than creating a new one for every use. It's also slightly faster to get an existing dev tunnel compared to creating a new one. In addition, by reusing the same dev tunnel, the dev tunnel web forwarding URL can be stable instead of changing on every use.

## Can anonymous users create dev tunnels?

No, anonymous users can't create dev tunnels. All creation of dev tunnels requires either a Microsoft Entra ID, Microsoft, or GitHub account.

## Why would I want to choose a tunnel ID if it's not used in the tunnel URL?

Tunnel IDs need to be provided for all operations that refer to a tunnel, so having the ability to choose your own tunnel ID adds convenience. We recommend choosing a tunnel ID that is easy to remember and type.

## What are the license terms for dev tunnels?

When using the `devtunnel` CLI for the first time, you see a link to the dev tunnel license terms. You can also download our license terms [here](https://aka.ms/devtunnels/tos).

## Where else is dev tunnels used?

- [How to use dev tunnels in Visual Studio 2022 with ASP.NET Core apps](/aspnet/core/test/dev-tunnels)
- [Local Port Forwarding built into Visual Studio Code](https://code.visualstudio.com/docs/editor/port-forwarding)
- [Teams Toolkit for Visual Studio Code Update – April 2023](https://devblogs.microsoft.com/microsoft365dev/teams-toolkit-for-visual-studio-code-update-april-2023/)
- [Debug and test your web APIs within Microsoft Power Automate or Power Apps](/connectors/custom-connectors/port-tunneling)

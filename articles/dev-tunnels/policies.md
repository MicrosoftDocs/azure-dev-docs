---
title: Configure and deploy group policies
titleSuffix: Microsoft dev tunnels
description: Learn how to configure and deploy group policies settings across your organization. 
author: derekbekoe
ms.author: debekoe
ms.topic: quickstart
ms.service: azure-dev-tunnels
ms.date: 03/27/2025
---

# Configure and deploy Group Policy Administrative Templates for Dev Tunnels

IT Administrators in organizations may want to control certain aspects of Dev Tunnels to achieve consistency or compliance across their organization. An easy way to accomplish this level of control is to configure and then deploy group policy settings to the client machines. The [Dev Tunnels in Visual Studio](https://aka.ms/devtunnels/vs), [port forwarding built into Visual Studio Code](https://code.visualstudio.com/docs/editor/port-forwarding), [the Visual Studio Code Remote - Tunnels extension](https://code.visualstudio.com/docs/remote/tunnels), and `devtunnel` CLI policies are consolidated in the [Administrator Template files (ADMX/ADML) for Dev Tunnels](https://aka.ms/devtunnels/policies/download).

In this quickstart, you'll learn how to configure and deploy Dev Tunnels group policy settings across your organization.

## Prerequisites

- Windows Server 2016, Windows Server 2019, Windows Server 2022, Windows 8.1, Windows 10, Windows 11
- Active Directory
- Access to Local Group Policy Editor

>[!NOTE]
>The policies are only applicable on Windows machines.

## Policies Supported

:::image type="content" source="./media/policies/tunnel-policies.png" alt-text="Screenshot that shows Dev Tunnel policies in the Local Group Policy Editor.":::

- **Disable anonymous tunnel access**: Disallow anonymous tunnel access. Enabling this policy enforces users to select either private or organization for tunnel access. This means users cannot connect to an existing tunnel with anonymous access control, host an existing tunnel with anonymous access control, or add anonymous access to existing or new tunnels.
- **Disable Dev Tunnels**: Disallow users from using the Dev Tunnels service. All commands, with few exceptions, should be denied access when this policy is enabled. Exceptions: unset, echo, ping, and user.
- **Allow only selected Microsoft Entra tenant IDs**: Users must authenticate within the given tenant list to access Dev Tunnels. When enabling this policy, multiple tenant IDs can be added by using a semicolon or comma to separate each. All commands, with few exceptions, should be denied access when this policy is enabled and the user's tenant ID isn't in the list of allowed tenant IDs. Exceptions: unset, echo, ping, and user. Follow the steps in [this article to find your Microsoft Entra tenant ID](/entra/fundamentals/how-to-find-tenant).

## Configure policies with Local Group Policy Editor

### Download the Administrator Template files

1. Head over to the Microsoft Download Center and download the [Administrator Template files (ADMX/ADML) for Dev Tunnels](https://aka.ms/devtunnels/policies/download).
1. Navigate to the `C:\Windows\PolicyDefinitions` folder and add the `TunnelsPolicies.admx` file.
1. Navigate to the `C:\Windows\PolicyDefinitions\en-US` folder and add the `TunnelsPolicies.adml` file.

### Apply the policies using the Local Group Policy Editor

1. Open Command Prompt and run `gpupdate /force` to ensure the policy files are configured.
1. Open the Windows Local Group Policy Editor.
1. Navigate to Computer Configuration > Administrative Templates > Dev Tunnels.
1. Apply the desired policy changes.

## Contact us

If you have any feedback, feature requests, questions, or you encounter an unexpected issue while working with the `devtunnel` CLI, reach out to us. We want to hear from you!

GitHub [issues](https://aka.ms/devtunnels/issues) is a great way to connect with us. You can open a new issue or up-vote any existing issues using a 👍 reaction to:

- Request a feature
- Submit a bug
- Provide feedback

If you're an enterprise looking to adopt dev tunnels in your organization with specific questions on security, enterprise management or support, email us at tunnelsfeedback@microsoft.com.

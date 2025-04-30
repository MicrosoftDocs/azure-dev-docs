---
title: Dev tunnels command-line reference
titleSuffix: Microsoft dev tunnels
description: Reference documentation for how to use the dev tunnel command line tool to create publicly accessible ports for local services.
author: derekbekoe
ms.author: debekoe
ms.topic: reference
ms.service: azure-dev-tunnels
ms.date: 03/27/2025
---

# Dev tunnels command-line reference

Dev tunnels offer a command-line interface (CLI) tool for creating and managing dev tunnels. This article explains the syntax and parameters for the various `devtunnel` CLI commands.

> [!IMPORTANT]
> This feature is currently in public preview.
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

>[!NOTE]
>`devtunnel` CLI commands are in preview. Command names and options may change in future releases.

## Global options

- `-v, --verbose`: Enable verbose output.
- `-?, -h, --help`: Show help and usage information.

## Manage user credentials

The dev tunnel service requires login for authorizing management of and access to dev tunnels. By default, a dev tunnel is only accessible to the user who created the dev tunnel, though that user may grant access to others.

After logging in, the login token is cached in the system secure key chain, and is valid for several days before expiration. Logging out of the CLI clears this cached token, but doesn't clear any browser cookies. Which may include dev tunnel access tokens if a browser was used to authenticate with a dev tunnel.

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel user login`     | Login with a Microsoft or GitHub account. |
| `devtunnel user logout`    | Clear the cached token                                  |
| `devtunnel user show` | Show current login status                                     |

> [!TIP]
> `devtunnel login` and `devtunnel logout` are shorthand commands for logging in and out.

Here are some examples on use of these commands:

| Examples     | Description                                                       |
|-----------------------------------|---------------------------------------------------------|
| `devtunnel user login`     | Login with a Microsoft organization (Microsoft Entra ID) or personal account |
| `devtunnel user login -g`  | Login with a GitHub account |
| `devtunnel user login -d`  | Login with a Microsoft organization (Microsoft Entra ID) or personal account with _device code login_, if local interactive browser login isn't possible  |
| `devtunnel user login -g -d`  | Login with a GitHub account with _device code login_, if local interactive browser login isn't possible |

## Host a dev tunnel

`devtunnel host` is the main command used to host your dev tunnel. The command should be run on the host system running the server you want accessible through the dev tunnel.

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel host`     | Host a dev tunnel. If a dev tunnel ID isn't specified, a new _temporary_ dev tunnel is created that is deleted once the connection is closed. |

Here are some examples on use of this command:

| Examples     | Description                                                       |
|---------------------------------------------------|---------------------------------------------|
| `devtunnel host -p 3000`     | Host a temporary dev tunnel for a server listening port 3000 on the host system. |
| `devtunnel host -p 3000 --allow-anonymous`  | Host a temporary dev tunnel and enable anonymous client access. |
| `devtunnel host -p 3000 5000`  | Host a temporary dev tunnel for local servers listening on ports 3000 and 5000. |
| `devtunnel host -p 8443 --protocol https`  | Host a temporary dev tunnel for a server listening on port 8443 that uses the HTTPS protocol. |
| `devtunnel host -p 8000 --expiration 2d`     | Host a temporary dev tunnel with a custom expiration time. Minimum is 1 hour (1h) and the maximum is 30 days (30d). |
| `devtunnel host TUNNELID`  | Host an existing dev tunnel that has previously been configured. |

> [!WARNING]
> Allowing anonymous access to a dev tunnel means anyone on the internet is able to connect to your local server, if they can guess the dev tunnel ID.

Press **Control-C** to stop the dev tunnel host process and terminate any client connections through the dev tunnel.
If an existing dev tunnel wasn't provided, the dev tunnel that was automatically created by the process will be deleted on process exit.

## Connect to a dev tunnel

**Using web-forwarding UI:**

The `devtunnel host` command shows output similar to the following:

```powershell
Hosting port 3000 at https://l3rs99qw-3000.usw2.devtunnels.ms/
```

The displayed `https:` URI is unique to the dev tunnel port: the first component is a subdomain containing the given dev tunnel id and port number.

If the hosted port connects to a web server, then that URI can be opened directly in a browser, from anywhere. If access to the dev tunnel requires authorization, then the initial request to the URI will redirect to a login page, and return to the site after the user is authorized.

If the hosted port connects to a web service, then that URI can be used as the base URI by a web service client application. However, if the dev tunnel doesn't allow anonymous access then the web service client normally won't know how to authenticate. If the web service is safe to expose publicly, consider allowing anonymous access. Otherwise, a web service client may add a request header with a dev tunnel access token to authorize the connection.

**Using the CLI:**

Instead of having a client browser or application connect directly to a dev tunnel relay URI, the CLI may be used to forward connections from a port on the client to a dev tunnel port. The client may also need to log in, if the dev tunnel doesn't allow anonymous access.

```powershell
devtunnel connect TUNNELID
```

- Replace `TUNNELID` with the same dev tunnel id that was used on the host.

Successful client output is similar to the following:

```powershell
Connected to tunnel: l3rs99qw
SSH: Forwarding from 127.0.0.1:3000 to host port 3000.
SSH: Forwarding from [::1]:3000 to host port 3000.
```

Now, the server that was shared on the host's port 3000 is available at `localhost:3000` on the client, using either IPv4 or IPv6. (The "SSH" prefix is because the dev tunnel service builds on the standard SSH protocol for port-forwarding.) If the hosted port connects to a web server, then `http://localhost:3000/` can be opened in a browser. In this case, no further authorization is required because the client's CLI login token was used to authorize the connection if necessary.

## Advanced: Manage dev tunnels

It's possible to create a dev tunnel without yet hosting it. This is useful for advanced dev tunnel configuration and management such as:

- Listing all owned dev tunnels
- Adding and removing ports of a dev tunnel
- Managing dev tunnel access controls
- Adding metadata to a dev tunnel like description and tags

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel create`     | Create a persistent dev tunnel |
| `devtunnel list`     | List dev tunnels |
| `devtunnel show`     | Show dev tunnel details |
| `devtunnel update`     | Update dev tunnel properties |
| `devtunnel delete`     | Delete a dev tunnel |
| `devtunnel delete-all`     | Delete all dev tunnels |

Here are some examples on use of these commands:

| Examples     | Description                                                       |
|-------------------------------------------------------------|----------------------------------|
| `devtunnel create -a`     | Create a persistent dev tunnel that allows anonymous access. |
| `devtunnel create -d 'my tunnel description'`     | Create a persistent dev tunnel with a non-searchable description. |
| `devtunnel create --expiration 4h`     | Create a persistent dev tunnel with a custom expiration time. Minimum is 1 hour (1h) and the maximum is 30 days (30d). |
| `devtunnel create myTunnelID`     | Create a persistent dev tunnel with a custom tunnel ID. |
| `devtunnel create --tags my-web-app v1`     | Create a persistent dev tunnel and apply searchable tags. |
| `devtunnel list --tags my-web-app`     | List dev tunnels that have any of the specified tags. |
| `devtunnel list --all-tags my-web-app v1`     | List dev tunnels that have all the specified tags. |
| `devtunnel show`     | Show details of the last-used dev tunnel. |
| `devtunnel show TUNNELID`     | Show details for a dev tunnel. |
| `devtunnel update TUNNELID -d 'my new tunnel description'`     | Update the description of a dev tunnel. |
| `devtunnel update TUNNELID --remove-tags`     | Remove all tags from a dev tunnel. |
| `devtunnel update TUNNELID --expiration 10d`     | Update a dev tunnel with a new custom expiration time. Minimum is 1 hour (1h) and the maximum is 30 days (30d). |
| `devtunnel delete TUNNELID`     | Delete a dev tunnel. |
| `devtunnel delete-all`     | Delete all your dev tunnels. |

> [!TIP]
> Most CLI commands operate on the last-used dev tunnel implicitly, though there's an option to specify a dev tunnel ID if necessary.

## Advanced: Manage dev tunnel ports

A dev tunnel created using the `devtunnel create` command initially has no ports. Use `devtunnel port` commands to add ports before hosting:

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel port create`     | Create a dev tunnel port |
| `devtunnel port list`     | List dev tunnel ports |
| `devtunnel port show`     | Show dev tunnel port details |
| `devtunnel port update`     | Update dev tunnel port properties |
| `devtunnel port delete`     | Delete a dev tunnel port |

| Examples                                      | Description                            |
|-----------------------------------------------------|----------------------------------------|
| `devtunnel port create -p 3000 --protocol http` | Add a port with the specified protocol |
| `devtunnel port list TUNNELID`                               | List current ports                     |
| `devtunnel port show TUNNELID -p 3000`                               | Show the details for port 3000                     |
| `devtunnel port update -p 3000 --description 'frontend port'` | Update a dev tunnel port description |
| `devtunnel port delete -p 3000`                     | Delete a port                          |

When creating a port, the protocol may optionally be specified, if auto-detection doesn't work properly. Current options are "http", "https" or "auto" (default). If the hosted port is HTTPS, then it's recommended to set the port protocol to "https"; otherwise "auto" is probably fine.

After configuring a dev tunnel using the above commands, start hosting it:

```powershell
devtunnel host
```

## Advanced: Manage dev tunnel access

With the following commands, dev tunnel access tokens can be issued to provide other clients access to your dev tunnel without allowing anonymous access. The access control entry commands allow you to configure access control on dev tunnels and dev tunnel ports.

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel token`     | Issue dev tunnel access token |
| `devtunnel access create`     | Create an access control entry |
| `devtunnel access list`     | List access control entries |
| `devtunnel access delete`     | Delete an access control entry |
| `devtunnel access reset`     | Reset access control entries to default |

Here are some examples on use of these commands:

| Examples                                      | Description                            |
|------------------------------------------------------------------|--------------------------------|
| `devtunnel token TUNNELID --scopes connect` | Get a 'connect' access token for a dev tunnel that can be shared to provide temporarily access to the dev tunnel. |
| `devtunnel access create TUNNELID --anonymous` | Enable anonymous client access on the dev tunnel. |
| `devtunnel access create TUNNELID --anonymous --expiration 4h` | Enable anonymous client access on the dev tunnel with a custom access control expiration time. Minimum is 1 hour (1h) and the maximum is 30 days (30d). |
| `devtunnel access create TUNNELID --port 3000 --anonymous` | Enable anonymous client access on port 3000. |
| `devtunnel access create TUNNELID --tenant` | Enable the current Microsoft Entra tenant access on the dev tunnel. |
| `devtunnel access create TUNNELID --org ORG` | Enable a GitHub organization access by name on the dev tunnel. |

> [!TIP]
> GitHub organization access requires [installing the Dev Tunnels GitHub app into the org](./security.md#github-organization-access).

## Supplementary commands

These commands can be used if you need to explicitly set or unset this local cache of last-used dev tunnel.

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel set`     | Set default dev tunnel |
| `devtunnel unset`     | Clear default dev tunnel |

## Diagnostic commands

| Command     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel clusters`     | List available service clusters by location |
| `devtunnel echo`     | Run a diagnostic echo server on a local port |
| `devtunnel ping`     | Send diagnostic messages to a remote echo server |


| Examples     | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `devtunnel clusters --ping`     | List available service clusters sorted by measured latency. |
| `devtunnel echo http --port 8080 --interface 127.0.0.1`     | Start a local http diagnostic server on port 8080. |

## Troubleshooting

To troubleshoot issues with the `devtunnel` CLI, the following tips may be useful:

- Ensure you're on the latest version of the `devtunnel` CLI. Check the currently installed version with `devtunnel --version`.
- The `--verbose` option prints debugging messages, which can provide extra diagnostic information.

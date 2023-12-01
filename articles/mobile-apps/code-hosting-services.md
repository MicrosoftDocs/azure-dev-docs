---
title: Cloud-hosted mobile app source code management
description: Learn about options for hosting your mobile app's source code in the cloud with GitHub or Azure Repos.
author: codemillmatt
ms.assetid: 12a8a079-9b3c-4faf-2222-ccff02097224
ms.service: mobile-services
ms.topic: conceptual
ms.date: 05/09/2022
ms.author: masoucou
ms.custom: team=cloud_advocates, kr2b-contr-experiment
ms.contributors: masoucou-01212021
---

# Cloud-hosted mobile application source code management

Cloud-hosted source code is readily accessible no matter where you are. A central repository means development team members can interact on the same code base by uploading, editing, and managing code files. Cloud hosting requires less hardware configuration than on-premises options, letting you implement solutions in an easier and more agile manner.

Benefits of hosting source code in the cloud include:

- **Central storage** to view and manage your data from anywhere.
- **Better collaboration** for cleaner code.
- **Easier contributing** to encourage involvement.
- **Faster releases**.
- **Reduced costs** by not maintaining hardware and infrastructure.

GitHub and Azure Repos are two options for hosting mobile app source code and data in the cloud.

## GitHub

[GitHub](https://github.com/) is an open-source repository hosting service for code projects in many different languages. GitHub tracks and helps resolve the various changes in every code iteration.

Use [codespaces](https://github.com/features/codespaces) to host your development environment in the cloud. Keep all your code in one place. Private, public, and open-source repositories all have tools to help host, version, and release code.

Review code with [built-in review tools](https://github.com/features/code-review) to make code review an essential part of your team's process.

- Protect branches, propose changes, and request reviews.
- Spot differences, comment in context, and get clear feedback.

Use [project management tools](https://github.com/features/issues) to coordinate early, stay aligned, and get more done.

- See the project's larger picture.
- Use task boards that are right next to your code inside GitHub.
- Drag cards to assign issues or pull requests to team members.
- Set milestones to organize and track progress.
- Write notes to capture useful ideas that don't belong to a particular issue or pull request.

[Manage users](https://docs.github.com/enterprise-server@latest/admin/user-management) and help teams grow by using:

- User roles to help organize team roles and access permissions.
- Discussion thread tools to keep conversations on track and team-focused.
- Community guidelines to quickly set up new team members with accounts.

Use [GitHub Actions](https://github.com/features/actions) to connect all your tools and automate every step of your development workflow.

Other GitHub features let you:

- Browse and star popular projects to follow them.
- Easily discover and purchase communication and automation tools from the [GitHub Marketplace](https://github.com/marketplace).
- Network and learn from others in the industry.

## Azure Repos

[Azure Repos](https://azure.microsoft.com/services/devops/repos) is the distributed source control option for [Azure DevOps Services](https://azure.microsoft.com/services/devops). Azure Repos offers unlimited free private or public repositories with collaborative code reviews, advanced file management, code search, and branch policies.

Azure Repos integrates with other services like Azure Pipelines and Azure Boards for end-to-end project services. Azure Repos is great for small projects, or for large organizations that need native Microsoft Entra ID support and advanced policy controls.

You can also use [Team Foundation Version Control (TFVC)](/azure/devops/repos/tfvc/index) for centralized source control with code review.

- Azure Repos supports any *Git client* through webhooks and [Git API](/rest/api/azure/devops/git) integration.
- Connect to your code from *development environments* like Xcode, Eclipse, IntelliJ, Android Studio, Visual Studio, and Visual Studio Code.
- Collaborate to build better code by using *threaded discussions* and continuous integration (CI) for each change.
- Use [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines) or other tools to *kick off builds* from pull requests. Set up continuous integration/continuous delivery (CI/CD) pipelines that automatically build, test, and deploy your app with every completed pull request.
- Use powerful semantic *code search* in pull requests.
- Simplify *access management* with native Microsoft Entra integration.
- Ensure code quality with *branch policies*, such as minimum number of reviewers, requirements for successful builds, and Git merge strategy enforcement.
- Integrate with [Azure Boards](https://azure.microsoft.com/services/devops/boards) *project management* tools.

## Next steps

- [GitHub guides](https://guides.github.com/)
- [GitHub Community Forum](https://github.community)
- [GitHub Marketplace](https://github.com/marketplace)
- [Get started with Azure Repos](https://azure.microsoft.com/services/devops/repos) 
- [Azure Repos documentation](/azure/devops/repos)

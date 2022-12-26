---
title: "IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift"
description: Shows you how to quickly stand up JIBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift.
author: KarlErickson
ms.author: haiche
ms.topic: overview
ms.date: 12/26/2022
ms.custom: template-overview, devx-track-java, devx-track-javaee, devx-track-javaee-was
---

# Quickstart: Deploy IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift using the Azure portal

This article shows you how to quickly stand up IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift (ARO) using the Azure portal.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- Ensure the Azure identity you use to sign in has either the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role or the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)

## Get a Red Hat pull secret

The Azure Marketplace offer you're going to use in this article requires a Red Hat pull secret. This section shows you how to get a Red Hat pull secret for ARO. For more information, see [Get a Red Hat pull secret ](/azure/openshift/tutorial-create-cluster?WT.mc_id=Portal-fx#get-a-red-hat-pull-secret-optional).

- [Navigate to your Red Hat OpenShift cluster manager portal](https://console.redhat.com/openshift/install/azure/aro-provisioned) and log in. 

    If you don't have a Red Hat account, you need to create a new Red Hat account with your business email and accept the terms and conditions. After you log in, select **OpenShit**, **Downloads**. Scoll down to the button of the page, you will find **Tokens**. Under the **Pull secret**, select **copy** or **Download** to get the value, as the following screenshot shows. 

    :::image type="content" source="media/liberty-on-aro/redhat-console-portal-pull-secret.png" alt-text="Screenshot of Red Hat console portal showing the pull secret." lightbox="media/liberty-on-aro/redhat-console-portal-pull-secret.png":::

    You can also log in [https://cloud.redhat.com/openshift/install/pull-secret](https://www.ibm.com/links?url=https%3A%2F%2Fcloud.redhat.com%2Fopenshift%2Finstall%2Fpull-secret) to navigae to the pull secret quickly.

    The following is an example that was copied from Red Hat console portal, the auth code are replaced with `xxxx...xxx`.

    ```json
    {"auths":{"cloud.openshift.com":{"auth":"xxxx...xxx","email":"contoso@test.com"},"quay.io":{"auth":"xxx...xxx","email":"contoso@test.com"},"registry.connect.redhat.com":{"auth":"xxxx...xxx","email":"contoso@test.com"},"registry.redhat.io":{"auth":"xxxx...xxx","email":"contoso@test.com"}}}
    ```

## Create a Azure AD Service Principal from Azure Portal

https://learn.microsoft.com/en-us/azure/openshift/howto-create-service-principal?pivots=aro-azureportal

## Deploy IBM WebSphere Liberty and Open Liberty on Azure Red Hat OpenShift

## Optional: Verify the functionality of the deployment

## Clean up resources

## Next steps

Learn more about deploying IBM WebSphere family on Azure by following these links:

> [!div class="nextstepaction"]
> [What are solutions to run the IBM WebSphere family of products on Azure?](websphere-family.md)

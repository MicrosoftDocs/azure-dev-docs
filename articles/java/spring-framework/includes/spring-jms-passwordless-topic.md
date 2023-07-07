#### [Passwordless (Recommended)](#tab/passwordless)

> [!NOTE]
> Azure Service Bus JMS supportes using Azure Active Directory(Azure AD) to authorize requests to Service Bus resources, with Azure AD, you can use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to grant permissions to a [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), which may be a user or an application service principal.
> If you want to run this sample locally with Azure AD authentication, be sure your user account has authenticated via Azure Toolkit for IntelliJ, Visual Studio Code Azure Account plugin, or Azure CLI. Also, be sure the account has been granted sufficient permissions.

> [!IMPORTANT]
> Before you started, please make sure you have assigned the `Azure Service Bus Data Owner` role to the Azure AD account you're currently using. See [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal) for more details.

   ```properties
   spring.jms.servicebus.namespace=<ServiceBusNamespace>
   spring.jms.servicebus.topic-client-id=<ServiceBusSubscriptionID>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   spring.jms.servicebus.passwordless-enabled=true
   ```

The following table describes the fields in the configuration:

| Field                                   | Description                                                                                     |
-----------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------|
| `spring.jms.servicebus.namespace`            | Specify the namespace you obtained in your Service Bus service from the Azure portal. |
| `spring.jms.servicebus.pricing-tier`         | Specify the pricing tier of your service bus. Supported values are *premium*, *standard*, and *basic*. Premium uses Java Message Service (JMS) 2.0, while standard and basic use JMS 1.0 to interact with Azure Service Bus. |
| `spring.jms.servicebus.topic-client-id`      | Specify the JMS client ID, which is your Service Bus Subscription ID in the Azure portal.       |
| `spring.jms.servicebus.passwordless-enabled` | Specify whether to use passwordless. |

#### [Connection string](#tab/connection-string)



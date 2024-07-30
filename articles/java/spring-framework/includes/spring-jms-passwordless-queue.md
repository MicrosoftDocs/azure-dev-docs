#### [Passwordless (Recommended)](#tab/passwordless)

> [!NOTE]
> Azure Service Bus JMS supports using Microsoft Entra ID to authorize requests to Service Bus resources. With Microsoft Entra ID, you can use [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) to grant permissions to a [security principal](/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object), which may be a user or an application service principal.

> [!IMPORTANT]
> Before you start, ensure that you've assigned the **Azure Service Bus Data Owner** role to the Microsoft Entra account you're currently using. For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

   ```properties
   spring.jms.servicebus.namespace=<ServiceBusNamespace>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   spring.jms.servicebus.passwordless-enabled=true
   spring.jms.listener.receive-timeout=60000
   ```

The following table describes the fields in the configuration:

| Field                                        | Description                                                                                                                                                                                              |
|----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spring.jms.servicebus.namespace`  | Specify the namespace you obtained in your Service Bus service instance from the Azure portal.                                                                                                           |
| `spring.jms.servicebus.pricing-tier` | Specify the pricing tier of your service bus. Supported values are *premium* and *standard*. Premium tier uses Java Message Service (JMS) 2.0, while standard tier use JMS 1.1 to interact with Azure Service Bus. |
| `spring.jms.servicebus.passwordless-enabled` | Specify whether to use passwordless.                                                                                                                                                                     |
| `spring.jms.listener.receive-timeout`        | By default the receive timeout value is 1000. We recommend that you set it to 60000                                                                                                                      |                                                                                         

#### [Connection string](#tab/connection-string)

   ```properties
   spring.jms.servicebus.connection-string=<ServiceBusNamespaceConnectionString>
   spring.jms.servicebus.pricing-tier=<ServiceBusPricingTier>
   spring.jms.listener.receive-timeout=60000
   ```

The following table describes the fields in the configuration:

| Field                                     | Description                                                                                                                                                                                              |
|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spring.jms.servicebus.connection-string` | Specify the connection string you obtained in your Service Bus namespace from the Azure portal.                                                                                                          |
| `spring.jms.servicebus.pricing-tier`      | Specify the pricing tier of your service bus. Supported values are *premium* and *standard*. Premium tier uses Java Message Service (JMS) 2.0, while standard tier use JMS 1.1 to interact with Azure Service Bus. |
| `spring.jms.listener.receive-timeout`        | By default the receive timeout value is 1000. We recommend that you set it to 60000                                                                                                                      |                                                                                       

---

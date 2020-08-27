---
author: yevster
ms.author: yebronsh
ms.date: 8/25/2020
---

Now that you've completed your migration, verify that your application works as you expect. You can then make your application more cloud-native by using the following recommendations.

* Consider enabling your application to work with Spring Cloud Registry. This will enable your application to be dynamically discovered by other deployed microservices and clients. For more information, see [Tutorial: Prepare a Java Spring app for deployment](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment). Then, modify any application clients to use the Spring Client Load balancer. This allows the client to obtain addresses of all the running instances of the application and find an instance that works if another instance become corrupted or unresponsive. For more information, see [Spring Tips: Spring Cloud Load Balancer](https://spring.io/blog/2020/03/25/spring-tips-spring-cloud-loadbalancer) in the Spring Blog.

* Instead of making your application public, consider adding a [Spring Cloud Gateway](https://cloud.spring.io/spring-cloud-static/spring-cloud-gateway/current/reference/html/) instance. Spring Cloud Gateway provides a single endpoint for all applications/microservices deployed in your Azure Spring Cloud instance. If a Spring Cloud Gateway is already deployed, ensure that it's configured to route traffic to your newly deployed application.

* Consider adding a Spring Cloud Config server to centrally manage and version-control configuration for all your Spring Cloud microservices. First, create a Git repository to house the configuration and configure the Azure Spring Cloud instance to use it. For more information, see [Tutorial: Set up a Spring Cloud Config Server instance for your service](/azure/spring-cloud/spring-cloud-tutorial-config-server). Then, migrate your configuration using the following steps:

  1. Inside the application's `src/main/resources` directory, create a `bootstrap.yml` file with the following contents:

        ```yml
          spring:
            application:
              name: <your-application-name>
        ```

  1. In the configuration Git repository, create an `<your-application-name>.yml` file, where `your-application-name` is the same as in the preceding step. Move the settings from `application.yml` file in `src/main/resources` to the new file you just created. If the settings were previously in a *.properties* file, they will need to be converted to YAML. You can find online tools or IntelliJ plugins to perform such conversions.

  1. Create an application.yml file in the directory above. You can use this file to define settings and resources that will be shared among all applications on the Azure Spring Cloud instance. Such settings typically include data sources, logging settings, Spring Boot Actuator configuration, and others.

  1. Commit and push these changes to the Git repository.

  1. Remove the `application.properties` or `application.yml` file from the application.

* Consider adding a deployment pipeline for automatic, consistent deployments. Instructions are available [for Azure Pipelines](/azure/spring-cloud/spring-cloud-howto-cicd), [for GitHub Actions](/azure/spring-cloud/spring-cloud-howto-github-actions), and [for Jenkins](/azure/jenkins/tutorial-jenkins-deploy-cli-spring-cloud-service).

* Consider using staging deployments to test code changes in production before they're available to some or all of your end users. For more information, see [Set up a staging environment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-howto-staging-environment).

* Consider adding service bindings to connect your application to supported Azure databases. These service bindings would eliminate the need for you to provide connection information, including credentials, to your Spring Cloud applications.

* Consider using Distributed Tracing and Azure App Insights to monitor performance and interactions of your applications. For more information, see [Use distributed tracing with Azure Spring Cloud](/azure/spring-cloud/spring-cloud-tutorial-distributed-tracing).

* Consider adding Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions. For more information, see [Tutorial: Monitor Spring Cloud resources using alerts and action groups](/azure/spring-cloud/spring-cloud-tutorial-alerts-action-groups).

* Consider replicating the Azure Spring Cloud deployment in another region for lower latency and higher reliability and fault tolerance. Use [Azure Traffic Manager](/azure/traffic-manager) to load balance among deployments or use [Azure Front Door](/azure/frontdoor) to add SSL offloading and Web Application Firewall with DDoS protection.

* If geo-replication isn't necessary, consider adding an [Azure Application Gateway](/azure/application-gateway) to add SSL offloading and Web Application Firewall with DDoS protection.

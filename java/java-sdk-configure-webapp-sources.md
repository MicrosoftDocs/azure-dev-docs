---
title: Configure webapp deployments using Java | Microsoft Docs
description: Sample Java code to configure Git or FTP Azure App Service deployments  using the Azure SDK for Java
author: rloutlaw
manager: douge
ms.assetid: 833e9c78-1e50-4c23-a611-f73a2f0c2983
ms.service: Azure
ms.devlang: java
ms.topic: article
ms.date: 03/30/2017
ms.author: routlaw;asirveda

---

# Configure Azure App Service deployment sources from your Java applications

[This sample](https://github.com/Azure-Samples/compute-java-create-virtual-machines-across-regions-in-parallel) deploys code to four applications in a single [Azure App Service](https://docs.microsoft.com/azure/app-service/) plan, each using a different deployment source.

## Run the sample

Create an [authentication file](https://github.com/Azure/azure-sdk-for-java/blob/master/AUTH.md) and set an environment variable `AZURE_AUTH_LOCATION` with the full path to the file on your computer. Then run:

```
git clone https://github.com/Azure-Samples/app-service-java-configure-deployment-sources-for-web-apps.git
cd app-service-java-configure-deployment-sources-for-web-apps
mvn clean compile exec:java
```

View the [complete sample code on GitHub](https://github.com/Azure-Samples/app-service-java-configure-deployment-sources-for-web-apps/blob/master/src/main/java/com/microsoft/azure/management/appservice/samples/ManageWebAppSourceControl.java).

## Authenticate with Azure

[!INCLUDE [auth-include](includes/java-auth-include.md)]

## Create a App Service app running Apache Tomcat

```java
// create a new Standard app service plan and create a single Java 8/Tomcat 8 app in it
WebApp app1 = azure.webApps().define(app1Name)
             .withNewResourceGroup(rgName)
             .withNewAppServicePlan(planName)
             .withRegion(Region.US_WEST)
             .withPricingTier(AppServicePricingTier.STANDARD_S1)
             .withJavaVersion(JavaVersion.JAVA_8_NEWEST)
             .withWebContainer(WebContainer.TOMCAT_8_0_NEWEST)
             .create();
```

`withJavaVersion()` and `withWebContainer()` configure App Service to serve HTTP requests using Tomcat 8.

## Deploy a Java application using FTP
```java
// pass the PublishingProfile that contains FTP information to a helper method 
uploadFileToFtp(app1.getPublishingProfile(), "helloworld.war", 
      ManageWebAppSourceControl.class.getResourceAsStream("/helloworld.war"));

// Use the FTP classes in the Apache Commons library to connect to Azure using 
// the information from the PublishingProfile
private static void uploadFileToFtp(PublishingProfile profile, String fileName, InputStream file) throws Exception {
        FTPClient ftpClient = new FTPClient();
        String[] ftpUrlSegments = profile.ftpUrl().split("/", 2);
        String server = ftpUrlSegments[0];
        // Tomcat will deploy WAR files uploaded to this directory.
        String path = "./site/wwwroot/webapps"; 

        // FTP the build WAR to Azure
        ftpClient.connect(server);
        ftpClient.login(profile.ftpUsername(), profile.ftpPassword());
        ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
        ftpClient.changeWorkingDirectory(path);
        ftpClient.storeFile(fileName, file);
        ftpClient.disconnect();
}
```

This code uploads a WAR file to the `/site/wwwroot/webapps` directory. Tomcat deploys WAR files placed in this directory by default in App Service.

## Deploy a Java application from a local Git repo

```java
// get the publishing profile from the App Service webapp
PublishingProfile profile = app2.getPublishingProfile();

// create a new Git repo in the sample directory under src/main/resources 
Git git = Git
    .init()
    .setDirectory(new File(ManageWebAppSourceControl.class.getResource("/azure-samples-appservice-helloworld/").getPath()))
    .call();
git.add().addFilepattern(".").call();
// add the files in the sample app to an initial commit
git.commit().setMessage("Initial commit").call(); 

// push the commit using the Azure Git remote URL and credentials in the publishing profile
PushCommand command = git.push();
command.setRemote(profile.gitUrl()); 
command.setCredentialsProvider(new UsernamePasswordCredentialsProvider(profile.gitUsername(), profile.gitPassword()));
command.setRefSpecs(new RefSpec("master:master")); 
command.setForce(true);
command.call();
```      

This code uses the [JGit](https://eclipse.org/jgit/) libraries to create a new Git repo in the `src/main/resources/azure-samples-appservice-helloworld` folder. The sample then adds all files in the folder to an initial commit and pushes the commit to Azure using Git deployment information from the webapp's `PublishingProfile`. 

>[!NOTE]
> The layout of the files in the repo must match exactly how you want the files deployed under the `/site/wwwroot/` directory in Azure App Service.

## Deploy an application from a public Git repo

```java
// deploy a .NET sample app from a public GitHub repo into a new webapp
WebApp app3 = azure.webApps().define(app3Name)
                .withNewResourceGroup(rgName)
                .withExistingAppServicePlan(plan)
                .defineSourceControl()
                .withPublicGitRepository(
                   "https://github.com/Azure-Samples/app-service-web-dotnet-get-started")
                .withBranch("master")
                .attach()
                .create();
 ```

 The App Service runtime automatically builds and deploys the .NET project using the latest code on the `master` branch of the repo.

## Continuous deployment from a GitHub repo

```java
// deploy the application whenever you push a new commit or merge a pull request into your master branch
WebApp app4 = azure.webApps()
                    .define(app4Name)
                    .withExistingResourceGroup(rgName)
                    .withExistingAppServicePlan(plan)
                    // Uncomment the following lines to turn on continuous deployment scenario
                    //.defineSourceControl()
                    //    .withContinuouslyIntegratedGitHubRepository("username", "reponame")
                    //    .withBranch("master")
                    //    .withGitHubAccessToken("YOUR GITHUB PERSONAL TOKEN")
                    //    .attach()
                    .create();
```  

The `username` and `reponame` values are the ones used in GitHub. [Create a GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with repo read permissions and pass it to `withGitHubAccessToken`. 


## Sample explanation

The sample creates the first application using Java 8 and Tomcat 8 running in a newly created [Standard](https://docs.microsoft.com/azure/app-service/azure-web-sites-web-hosting-plans-in-depth-overview) App Service plan. The code then FTPs a WAR file using the information in the `PublishingProfile` object and Tomcat deploys it.

The second application uses in the same plan as the first and is also configured as a Java 8/Tomcat 8 application. The JGit libraries create a new Git repository in a folder that contains an unpacked Java web application in a directory structure that maps to App Service. A new commit adds the files in the folder to the new Git repo, and Git pushes the commit to Azure with a remote URL and username/password provided by the webapp's `PublishingProfile`.

The third application is not configured for Java and Tomcat. Instead, a .NET sample in a public GitHub repo is deployed directly from source.

The fourth application deploys the code in your master branch every time you push changes or merge a pull request into the GitHub repo's master branch.

| Class used in sample | Notes
|-------|-------|
| [WebApp](https://docs.microsoft.com/java/api/com.microsoft.azure.management.appservice._web_app) | Created from the `azure.webApps().define()....create()` fluent chain. Creates a App Service web app and any resources needed for the app. Most methods query the object for configuration details, but verb methods like `restart()` change the state of the webapp.
| [WebContainer](https://docs.microsoft.com/java/api/com.microsoft.azure.management.appservice._web_container) | Class with static public fields used as paramters to `withWebContainer()` when defining a WebApp running a Java webcontainer. Has choices for both Jetty and Tomcat versions.
| [PublishingProfile](https://docs.microsoft.com/java/api/com.microsoft.azure.management.appservice._publishing_profile) | Obtained through a WebApp object using the `getPublishingProfile()` method. Contains FTP and Git deployment information, including deployment username and password (which is separate from Azure account or service principal credentials).
| [AppServicePlan](https://docs.microsoft.com/java/api/com.microsoft.azure.management.appservice._app_service_plan) | Returned by `azure.appServices().appServicePlans().getByResourceGroup()`. Methods are availble to check the capacity, tier, and number of web apps running in the plan.
| [AppServicePricingTier](https://docs.microsoft.com/java/api/com.microsoft.azure.management.appservice._app_service_pricing_tier) | Class with static public fields representing App Service tiers. Used to define a plan tier in-line during app creation with `withPricingTier()` or directly when defining a plan via `azure.appServices().appServicePlans().define()`
| [JavaVersion](https://docs.microsoft.com/java/api/com.microsoft.azure.management.appservice._java_version) | Class with static public fields representing Java versions supported by App Service. Used with `withJavaVersion()` during the `define()...create()` chain when creating a new webapp.

## Next steps

[!INCLUDE [next-steps](includes/java-next-steps.md)]
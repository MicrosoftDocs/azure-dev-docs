After running these commands, switch your appsettings.json configuration back to the original MyDbConnection value.  This will ensure that the next time you deploy your code to Azure, it will pull the correct connection string from your App Service configuration.  The *ConnectionStrings* should again look like the code below:

---
      "ConnectionStrings": {
        "MyDbConnection": "MyDbConnection"
      }
---
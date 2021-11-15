Inside of Visual Studio, we need to update the connection string of our app to point to the Azure SQL Database.
1. Open the appsettings.json file in your project.
1. Inside of this file, paste the connection string you copied earlier into the value of the "MyDbConnection" key.  Your *ConnectionStrings* settings should now look like the code below.

---
      "ConnectionStrings": {
        "MyDbConnection": "Server=tcp:MyDbServer.database.windows.net,1433;
        Initial Catalog=mySqlDb;Persist Security Info=False;
        User ID=<username>;Password=<password>;
        MultipleActiveResultSets=False;
        Encrypt=True;TrustServerCertificate=False;
        Connection Timeout=30;"
      }
---
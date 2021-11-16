Inside of your local code editor, we need to temporarily update the connection string of our local app to point to the Azure SQL Database.  This will allow us to run Entity Framework Core migrations and generate the correct schema for our database.
1. Open the appsettings.json file in your project.
1. Inside of this file, paste the connection string you copied earlier into the value of the *MyDbConnection* key. Make sure to replace the password with the value you chose when setting up your database.
1.  Your *ConnectionStrings* settings should now look like the code below.
 

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

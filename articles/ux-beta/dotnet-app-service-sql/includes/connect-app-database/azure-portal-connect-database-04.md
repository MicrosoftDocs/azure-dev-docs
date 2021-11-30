1. Click on the `Configuration` link on the left nav to go to the configuration page.

1. Click the `+ New Connection string` button in the `Connection Strings` section.  

1. Enter a name of `MyDbConnection` and then paste the connection string you copied into the value field. 

1. Make sure to replace the username and password in the Connection String with those you specified when creating the database.

1. Click `OK` to close the dialog, and then click `Save` at the top of the configuration screen.

Your app can now connect to the SQL database.  However, we still need to generate the schema for our data using Entity Framework Core, so let's do that next.

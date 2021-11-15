1. Next, in the search bar at the top of the Azure Portal, search for the App Service you created previously and click on it to navigate to the overview page.

1. Click on the `Configuration` link on the left nav to go to the configuration page.

1. At the bottom of this page you should see a `Connection strings` section.  Click the `+ New Connection string` button.  Enter a name of `MyDbConnection` and then paste the connection string you copied into the value field.  Click `OK` to close the dialog, and then click `Save` at the top of the configuration screen.

1. Your app can now connect to the SQL database.  However, we still need to generate the schema for our data using Entity Framework Core, so let's do that next.

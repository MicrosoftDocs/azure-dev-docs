Next, inside of your code editor's terminal we need to run the following commands to install Entity Framework Core tooling and create the schema of our database.

1. Run the commands below to install the necessary CLI tools for Entity Framework Core, create an intial database migration file, and apply those changes to update the database.

        dotnet tool install -g dotnet-ef
        dotnet ef migrations add InitialCreate
        dotnet ef database update

The migration should complete successfully, and your database is now setup on Azure with the correct schema.
<br />
<br />
If you receive a connection or authentication issue on this step, it's possible the IP address you configured in Azure is not your actual external IP - this is common in corporate environments that use VPNs.  If there is a different IP address listed in this error, try updating your firewall rule in Azure with that value instead.
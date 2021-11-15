Next, inside of your code editor's terminal we need to run the following commands to install Entity Framework Core tooling and create the schema of our database.

1. First run the command below to install the necessary CLI tools for Entity Framework Core.

        dotnet tool install -g dotnet-ef

1. Next, run the command *dotnet ef migrations add InitialCreate*.  This will generate a migrations file, which is used to modify or setup the schema on our database.
    
        dotnet ef migrations add InitialCreate

1. Finally, run the command below to apply our changes to the database.

        dotnet ef database update

The migration should complete successfully, and your database is now setup on Azure with the correct schema.
<br />
<br />
If you receive a connection or authentication issue on this step, read the error carefully. It's possible the IP address you configured in Azure is not your actual external IP - this is common in corporate environments that use VPNs.  If there is a different IP address listed in this error, try updating your firewall rule in Azure with that value instead.
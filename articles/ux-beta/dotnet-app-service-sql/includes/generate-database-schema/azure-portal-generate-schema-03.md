Next, inside of your code editor's terminal we need to run the following commands to install Entity Framework Core tooling and create the schema of our database.

1. Run the commands below to install the necessary CLI tools for Entity Framework Core, create an intial database migration file, and apply those changes to update the database.

        dotnet tool install -g dotnet-ef
        dotnet ef migrations add InitialCreate
        dotnet ef database update

The migration should complete successfully, and your database is now setup on Azure with the correct schema.
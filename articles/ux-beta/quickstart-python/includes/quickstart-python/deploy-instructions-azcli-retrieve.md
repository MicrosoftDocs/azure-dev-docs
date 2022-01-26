#### [Windows (PS)](#tab/windows)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query "{Username:publishingUserName, Password:publishingPassword}" `
    --output table
```

#### [macOS/Linux (Bash)](#tab/mac-linux)

```azurecli
az webapp deployment list-publishing-credentials `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query "{Username:publishingUserName, Password:publishingPassword}" `
    --output table
```

---

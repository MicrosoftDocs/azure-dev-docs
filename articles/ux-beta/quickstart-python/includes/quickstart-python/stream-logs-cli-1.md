#### [Windows (PS)](#tab/windows)

```azurecli
az webapp log config `
    --web-server-logging 'filesystem' `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME
```

#### [macOS/Linux (Bash)](#tab/mac-linux)

```azurecli
az webapp log config \
    --web-server-logging 'filesystem' \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

---

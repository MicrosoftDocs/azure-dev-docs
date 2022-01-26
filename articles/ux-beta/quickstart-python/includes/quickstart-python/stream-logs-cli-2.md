#### [Windows (PS)](#tab/windows)

```azurecli
az webapp log tail `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME
```

#### [macOS/Linux (Bash)](#tab/mac-linux)

```azurecli
az webapp log tail \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME
```

---

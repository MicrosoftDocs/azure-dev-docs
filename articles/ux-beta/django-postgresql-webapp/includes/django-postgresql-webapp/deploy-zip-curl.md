###### [bash](#tab/deploy-instructions-curl-bash)

```bash
curl -X POST \
     -H 'Content-Type: application/zip' \
     -u <username> \
     -T '<zip-package-path>' \
    https://<app-name>.scm.azurewebsites.net/api/zipdeploy
```

###### [PowerShell terminal](#tab/deploy-instructions-curl-ps)

```powershell
curl -Method 'POST' `
     -ContentType 'Content-Type: application/zip' `
     -Credential '<username>' `
     -InFile <zip-package-path> `
     -Uri https://<app-name>.scm.azurewebsites.net/api/zipdeploy
```

---

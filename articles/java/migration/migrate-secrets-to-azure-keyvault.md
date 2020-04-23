---
title: Migrate secrets to Azure KeyVault
description: This guide describes how to migrate secrets from open source secret stores to Azure Key Vault
author: yevster
ms.author: yebronsh
ms.topic: conceptual
ms.date: 03/30/2020
---

# Migrate secrets to Azure KeyVault

This guide describes how to migrate secrets from popular open source secret stores to Azure Key Vault.

## HashiCorp Vault

Vault can store different kinds of secrets. Here, we show how to export commonly-used key-value secrets into Azure Key Vault.

> [!NOTE]
> Vault permits multiple name-value pairs to be stored under a single key. To import such pairs into Azure KeyVault, we will need to collapse the Key->(Name,Value) structure into a flat list of name-value pairs.

```azurepowershell
# Assume $secretName is set to the name of the Vault secret,
# and $keyVaultName is set to the name of the Azure KeyVault.

$vaultSecret = vault kv get -format=json "secret/${secretName}" | ConvertFrom-Json

$vaultSecret.data.data.PSObject.Properties | ForEach-Object {
    $secureValue = ConvertTo-SecureString $_.Value -AsPlainText -Force
    $keyVaultKeyName="${secretName}-$($_.Name)"
    Set-AzKeyVaultSecret -VaultName $keyVaultName -Name $keyVaultKeyName -SecretValue $secureValue
}
```

```azurecli
# Assume $secretName is set to the name of the Vault secret,
# and $keyVaultName is set to the name of the Azure KeyVault.

vaultSecretJson=$(vault kv get -format=json "secret/${secretName}")
readarray -t names <<< "$(echo $vaultSecretJson |jq -r '.data.data | keys[]')"
for i in "${names[@]}"
do
  kvSecretName="${secretName}-$i"
  kvSecretValue=$(echo $vaultSecretJson | jq -r ".data.data.${i}")
  az keyvault secret set --vault-name "$keyVaultName" --name "$kvSecretName" --value "$kvSecretValue"
done
```

## CredHub

CredHub has an Export function that can be invoked via by REST API or via CredHub CLI:

```bash
credhub export -j -f export.json
```

Secrets thus exported can then be imported into Azure KeyVault.

```azurepowershell
# Assume $keyVaultName is set to the name of the Azure KeyVault.

#Read the JSON file
$secrets = Get-Content -Raw export.json | ConvertFrom-Json

#Extract the Key-Value pairs
$keyValues = $secrets.Credentials | Where-Object Type -eq 'value'

#Extract passwords
$passwords = $secrets.Credentials | Where-Object Type -eq 'password'

#Populate the secrets above in KeyVault
$keyValues + $passwords | ForEach-Object {
    $secureValue = ConvertTo-SecureString $_.Value -AsPlainText -Force
    $keyVaultKeyName = if ($_.Name.StartsWith("/")) {$_.Name.Remove(0,1)} Else {$_.Name}
    Set-AzKeyVaultSecret -VaultName $keyVaultName -Name $keyVaultKeyName -SecretValue $secureValue
}

```

```azurecli
# Assume $keyVaultName is set to the name of the Azure KeyVault.

credhubSecretJson=$(cat export.json | jq -r '.Credentials[] | select (.Type=="value" or .Type=="password")')
readarray -t names <<< $(echo $credhubSecretJson | jq -r ".Name" | sed -e "s/^\///g")
for name in "${names[@]}"
do
  secretValue=$(echo $credhubSecretJson  | jq -r '. | select (.Name=="'/${name}'") | .Value')
  az keyvault secret set --vault-name "$keyVaultName" --name "$name" --value "$secretValue"
done
```
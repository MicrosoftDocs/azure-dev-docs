use azure_identity::{ManagedIdentityCredential, ManagedIdentityCredentialOptions, UserAssignedId};
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a user-assigned managed identity credential using Azure resource ID
    let options = ManagedIdentityCredentialOptions {
        user_assigned_id: Some(UserAssignedId::ResourceId(String::from(
            "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>",
        ))),
        ..Default::default()
    };
    let credential = ManagedIdentityCredential::new(Some(options))?;

    // Create a client for the specified Key Vault
    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // Use the client to interact with Azure Key Vault
    // let secret = client.get("secret-name", None).await?;

    Ok(())
}

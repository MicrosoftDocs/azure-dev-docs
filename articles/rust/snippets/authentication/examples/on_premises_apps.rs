use azure_identity::ClientSecretCredential;
use azure_core::credentials::Secret;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let tenant_id = std::env::var("AZURE_TENANT_ID")?;
    let client_id = std::env::var("AZURE_CLIENT_ID")?;
    let client_secret = std::env::var("AZURE_CLIENT_SECRET")?;

    // Create a credential using the service principal
    let credential = ClientSecretCredential::new(
        &tenant_id,
        client_id,
        Secret::new(client_secret),
        None,
    )?;

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

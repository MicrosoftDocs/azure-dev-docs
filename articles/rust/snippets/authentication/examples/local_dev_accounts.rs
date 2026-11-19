use azure_identity::DeveloperToolsCredential;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create a credential
    let credential = DeveloperToolsCredential::new(None)?;

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

use azure_identity::AzurePipelinesCredential;
use azure_core::credentials::Secret;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let system_access_token = std::env::var("SYSTEM_ACCESSTOKEN")?;

    let credential = AzurePipelinesCredential::new(
        String::from("<tenant-id>"),
        String::from("<client-id>"),
        "<service-connection-id>",
        Secret::new(system_access_token),
        None,
    )?;

    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // Use the client in your pipeline task
    // let secret = client.get("secret-name", None).await?;

    Ok(())
}

use azure_identity::ClientCertificateCredential;
use azure_core::credentials::SecretBytes;
use azure_security_keyvault_secrets::SecretClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let tenant_id = std::env::var("AZURE_TENANT_ID")?;
    let client_id = std::env::var("AZURE_CLIENT_ID")?;
    let cert_path = std::env::var("AZURE_CLIENT_CERTIFICATE_PATH")?;

    // Read the certificate file
    let cert_bytes = std::fs::read(&cert_path)?;

    let credential = ClientCertificateCredential::new(
        tenant_id,
        client_id,
        SecretBytes::from(cert_bytes.as_slice()),
        None,
    )?;

    let client = SecretClient::new(
        "https://<your-key-vault-name>.vault.azure.net/",
        credential.clone(),
        None,
    )?;

    // Use the client to interact with Azure Key Vault
    // let secret = client.get("secret-name", None).await?;

    Ok(())
}

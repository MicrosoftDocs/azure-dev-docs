use azure_identity::AzureCliCredential;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let credential = AzureCliCredential::new(None)?;
    // or
    // use azure_identity::AzureDeveloperCliCredential;
    // let credential = AzureDeveloperCliCredential::new(None)?;
    Ok(())
}

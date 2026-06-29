package lowkeyvault_test

import (
	"context"
	"testing"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/azure/lowkeyvault"
)

func TestKeyVaultSecrets(t *testing.T) {
	ctx := context.Background()

	ctr, err := lowkeyvault.Run(ctx, "nagyesta/lowkey-vault:7.0.9-ubi10-minimal")
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	// Simulate managed-identity authentication used in production.
	identityEndpoint, err := ctr.IdentityEndpoint(ctx, lowkeyvault.Local)
	require.NoError(t, err)
	t.Setenv("IDENTITY_ENDPOINT", identityEndpoint)
	t.Setenv("IDENTITY_HEADER", ctr.IdentityHeader())

	vaultURL, err := ctr.ConnectionURL(ctx, lowkeyvault.Local)
	require.NoError(t, err)

	httpClient, err := ctr.Client(ctx)
	require.NoError(t, err)

	// azidentity.NewDefaultAzureCredential picks up IDENTITY_ENDPOINT / IDENTITY_HEADER.
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	require.NoError(t, err)

	secretsClient, err := azsecrets.NewClient(vaultURL, cred, &azsecrets.ClientOptions{
		ClientOptions: azcore.ClientOptions{Transport: httpClient},
	})
	require.NoError(t, err)

	_, err = secretsClient.SetSecret(ctx, "db-password", azsecrets.SetSecretParameters{
		Value: to.Ptr("s3cr3t"),
	}, nil)
	require.NoError(t, err)

	resp, err := secretsClient.GetSecret(ctx, "db-password", "", nil)
	require.NoError(t, err)
	require.Equal(t, "s3cr3t", *resp.Value)
}

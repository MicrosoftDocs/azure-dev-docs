package cosmosdb_test

import (
	"context"
	"net/http"
	"testing"

	"github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/azure/cosmosdb"
)

func TestCosmosDB(t *testing.T) {
	ctx := context.Background()

	ctr, err := cosmosdb.Run(ctx, "mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview")
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	connStr, err := ctr.ConnectionString(ctx)
	require.NoError(t, err)

	policy, err := cosmosdb.NewContainerPolicy(ctx, ctr)
	require.NoError(t, err)

	client, err := azcosmos.NewClientFromConnectionString(connStr, policy.ClientOptions())
	require.NoError(t, err)

	resp, err := client.CreateDatabase(ctx, azcosmos.DatabaseProperties{ID: "mydb"}, nil)
	require.NoError(t, err)
	require.Equal(t, http.StatusCreated, resp.RawResponse.StatusCode)
}

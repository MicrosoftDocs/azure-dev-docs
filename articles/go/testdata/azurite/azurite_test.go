package azurite_test

import (
	"context"
	"strings"
	"testing"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/data/aztables"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/azure/azurite"
)

func TestBlobStorage(t *testing.T) {
	ctx := context.Background()

	ctr, err := azurite.Run(
		ctx,
		"mcr.microsoft.com/azure-storage/azurite:3.33.0",
		azurite.WithEnabledServices(azurite.BlobService),
		azurite.WithInMemoryPersistence(64),
	)
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	serviceURL, err := ctr.BlobServiceURL(ctx)
	require.NoError(t, err)

	cred, err := azblob.NewSharedKeyCredential(azurite.AccountName, azurite.AccountKey)
	require.NoError(t, err)

	client, err := azblob.NewClientWithSharedKeyCredential(serviceURL+"/"+azurite.AccountName, cred, nil)
	require.NoError(t, err)

	_, err = client.CreateContainer(ctx, "mycontainer", nil)
	require.NoError(t, err)

	_, err = client.UploadStream(ctx, "mycontainer", "hello.txt", strings.NewReader("Hello, Azure!"), nil)
	require.NoError(t, err)
}

func TestQueueStorage(t *testing.T) {
	ctx := context.Background()

	ctr, err := azurite.Run(
		ctx,
		"mcr.microsoft.com/azure-storage/azurite:3.33.0",
		azurite.WithEnabledServices(azurite.QueueService),
	)
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	serviceURL, err := ctr.QueueServiceURL(ctx)
	require.NoError(t, err)

	cred, err := azqueue.NewSharedKeyCredential(azurite.AccountName, azurite.AccountKey)
	require.NoError(t, err)

	client, err := azqueue.NewServiceClientWithSharedKeyCredential(serviceURL+"/"+azurite.AccountName, cred, nil)
	require.NoError(t, err)

	_, err = client.CreateQueue(ctx, "myqueue", &azqueue.CreateOptions{
		Metadata: map[string]*string{"env": to.Ptr("test")},
	})
	require.NoError(t, err)
}

func TestTableStorage(t *testing.T) {
	ctx := context.Background()

	ctr, err := azurite.Run(
		ctx,
		"mcr.microsoft.com/azure-storage/azurite:3.33.0",
		azurite.WithEnabledServices(azurite.TableService),
	)
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	serviceURL, err := ctr.TableServiceURL(ctx)
	require.NoError(t, err)

	cred, err := aztables.NewSharedKeyCredential(azurite.AccountName, azurite.AccountKey)
	require.NoError(t, err)

	client, err := aztables.NewServiceClientWithSharedKey(serviceURL+"/"+azurite.AccountName, cred, nil)
	require.NoError(t, err)

	_, err = client.CreateTable(ctx, "mytable", nil)
	require.NoError(t, err)
}

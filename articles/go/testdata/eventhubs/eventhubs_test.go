package eventhubs_test

import (
	"context"
	"testing"

	"github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/azure/eventhubs"
)

func TestEventHubs(t *testing.T) {
	ctx := context.Background()

	cfg, err := eventhubs.NewConfig(
		eventhubs.WithNamespace(eventhubs.EmulatorNamespaceName,
			eventhubs.WithEntity("orders", 2,
				eventhubs.WithConsumerGroup("$Default"),
			),
		),
	)
	require.NoError(t, err)

	ctr, err := eventhubs.Run(
		ctx,
		"mcr.microsoft.com/azure-messaging/eventhubs-emulator:2.1.0",
		eventhubs.WithAcceptEULA(),
		eventhubs.WithConfigObject(cfg),
	)
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	connStr, err := ctr.ConnectionString(ctx)
	require.NoError(t, err)

	producer, err := azeventhubs.NewProducerClientFromConnectionString(connStr, "orders", nil)
	require.NoError(t, err)
	defer producer.Close(ctx)

	// Retry because event hub entity creation from config is asynchronous.
	var batch *azeventhubs.EventDataBatch
	for range 3 {
		batch, err = producer.NewEventDataBatch(ctx, nil)
		if err == nil {
			break
		}
	}
	require.NoError(t, err)

	err = batch.AddEventData(&azeventhubs.EventData{Body: []byte("hello")}, nil)
	require.NoError(t, err)

	err = producer.SendEventDataBatch(ctx, batch, nil)
	require.NoError(t, err)
}

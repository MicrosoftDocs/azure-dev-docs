package servicebus_test

import (
	"context"
	"strings"
	"testing"

	"github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/azure/servicebus"
)

func TestServiceBus(t *testing.T) {
	ctx := context.Background()

	cfg := `{
		"UserConfig": {
			"Namespaces": [{
				"Name": "sbemulatorns",
				"Queues": [{
					"Name": "orders",
					"Properties": {
						"DeadLetteringOnMessageExpiration": false,
						"DefaultMessageTimeToLive": "PT1H",
						"DuplicateDetectionHistoryTimeWindow": "PT20S",
						"LockDuration": "PT1M",
						"MaxDeliveryCount": 10,
						"RequiresDuplicateDetection": false,
						"RequiresSession": false
					}
				}]
			}],
			"Logging": {"Type": "File"}
		}
	}`

	ctr, err := servicebus.Run(
		ctx,
		"mcr.microsoft.com/azure-messaging/servicebus-emulator:1.1.2",
		servicebus.WithAcceptEULA(),
		servicebus.WithConfig(strings.NewReader(cfg)),
	)
	testcontainers.CleanupContainer(t, ctr)
	require.NoError(t, err)

	connStr, err := ctr.ConnectionString(ctx)
	require.NoError(t, err)

	client, err := azservicebus.NewClientFromConnectionString(connStr, nil)
	require.NoError(t, err)
	defer client.Close(ctx)

	sender, err := client.NewSender("orders", nil)
	require.NoError(t, err)
	defer sender.Close(ctx)

	// Retry because queue creation from config is asynchronous.
	var sendErr error
	for range 3 {
		sendErr = sender.SendMessage(ctx, &azservicebus.Message{Body: []byte("order-1")}, nil)
		if sendErr == nil {
			break
		}
	}
	require.NoError(t, sendErr)

	receiver, err := client.NewReceiverForQueue("orders", nil)
	require.NoError(t, err)
	defer receiver.Close(ctx)

	messages, err := receiver.ReceiveMessages(ctx, 1, nil)
	require.NoError(t, err)
	require.Len(t, messages, 1)

	err = receiver.CompleteMessage(ctx, messages[0], nil)
	require.NoError(t, err)
}

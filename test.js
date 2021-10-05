const EventSource = require('eventsource');
const { Webhooks } = require("@octokit/webhooks");
const webhooks = new Webhooks({ secret: "3dteamet" });

const webhookProxyUrl = "https://smee.io/I3qputDOxnGo5c69"; // replace with your own Webhook Proxy URL
const source = new EventSource(webhookProxyUrl);
source.onmessage = (event) => {
  const webhookEvent = JSON.parse(event.data);
  webhooks
    .verifyAndReceive({
      id: webhookEvent["x-request-id"],
      name: webhookEvent["x-github-event"],
      signature: webhookEvent["x-hub-signature"],
      payload: webhookEvent.body,
    })
    .catch(console.error);
};
const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const { exec } = require("child_process");
const conf = require("./conf.json");

// Parse command line options
const flags = {};
process.argv.slice(2).forEach((arg) => {
  if (arg.startsWith("-")) {
    const parts = arg.split(/=(.+)/);
    flags[parts[0].replace(/^--?/, "")] = parts[1];
  }
});

const webhooks = new Webhooks({ secret: conf.secret });

// Listen for webhook events
webhooks.onAny(({ id, name, payload }) => {
  // Push events also include merging pull requests and editing files directly
  // on GitHub
  if (name == "push") {
    conf.endpoints.forEach((endpoint) => {
      if (
        endpoint.ref == payload.ref &&
        endpoint.repository == payload.repository.full_name
      ) {
        exec(endpoint.command);
      }
    });
  }
});

if (flags.proxy) {
  const EventSource = require("eventsource");

  // Listen for webhooks from a proxy
  const source = new EventSource(flags.proxy);
  source.onmessage = (event) => {
    const webhookEvent = JSON.parse(event.data);
    // Forward events to wehook listener
    webhooks
      .verifyAndReceive({
        id: webhookEvent["x-request-id"],
        name: webhookEvent["x-github-event"],
        signature: webhookEvent["x-hub-signature"],
        payload: webhookEvent.body,
      })
      .catch(console.error);
  };
} else {
  // Start a http server to listen for webhooks
  require("http")
    .createServer(createNodeMiddleware(webhooks, { path: conf.path }))
    .listen(conf.port);
}

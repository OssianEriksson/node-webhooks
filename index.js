const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const webhooks = new Webhooks({ secret: "3dteamet", });

webhooks.onAny(({ id, name, payload }) => {

    console.log(name, "event received");
});

require("http").createServer(createNodeMiddleware(webhooks, { path: "/" })).listen(3000);
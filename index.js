const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");
const conf = require('./conf.json');

const webhooks = new Webhooks({ secret: conf.secret });

webhooks.onAny(({ id, name, payload }) => {
    if (name == "push") {
        conf.endpoints.forEach(endpoint => {
            if (endpoint.ref == payload.ref && endpoint.repository == payload.repository.full_name) {
                exec(endpoint.command);
            }
        });
    }
});

require("http").createServer(createNodeMiddleware(webhooks, { path: conf.path })).listen(conf.port);
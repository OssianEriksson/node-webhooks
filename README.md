# node-webhooks

Webhooks server for Github based on [@octokit/webhooks](https://github.com/octokit/webhooks.js/).

# Getting started

1. Install node modules:
   ```console
   $ npm i
   ```

1. Go to the GitHub page of the app you want to add webhooks for, go to the Settings tab, click Webhooks and add your webhook. 

1. Copy `conf.example.json` to `conf.json` and edit the fields to match your GitHub webhook configuration.
   All options are mandatory.
   Multiple endpoints can be configured.

1. Start the webhook server:
   ```console
   $ npm run start
   ```

# Local development

Go to [smee.io](https://smee.io/) and <kbd>Start a new channel</kbd>.
Copy the "Webhook Proxy URL" and enter it in the GitHub app's "Webhook URL" input.
To develop on the webhook server, also pass it the "Webhook Proxy URL" in the following manner:
```console
$ npm run start -- --proxy=<Webhook Proxy URL>
```
[![NPM Version][npm-image]][npm-url]
[![Node.js Version][node-version-image]][node-version-url]

<!-- [![Build status][travis-image]][travis-url] -->

# koa-github-webhook-secure

Koa v2 middleware for processing GitHub Webhooks Securely

This library is a **middleware** for Koa v2 web servers that handles all the logic of receiving and verifying webhook requests from GitHub.
It's based on the awesome work by @TinOo512, available [here](https://github.com/TinOo512/koa-github-webhook-handler).

## Dependency

Any **JSON body parser middleware** for Koa.js (see complete list [here](https://github.com/koajs/koa/wiki#body-parsing)).

## Example

```js
import koa from 'koa';
import GithubWebhook from 'koa-github-webhook-secure';

const app = koa();

const githubWebhook = new GithubWebhook({
  path: '/webhook',
  secret: 'myhashsecret',
});

githubWebhook.on('push', ({ payload }) => {
  console.log('Received a push event for repo', payload.repository.name, '-', payload.ref);
});

app.use(githubWebhook.middleware());

app.listen(3000);
```

## API

koa-github-webhook-secure exports a **class**, you must instantiate it with an _options_ object.
Your options object should contain:

- `"path"`: the complete case sensitive path/route to match when looking at `req.url` for incoming requests.
  Any request not matching this path will `yield` to the "downstream" **middleware**.
- `"secret"`: this is a hash key used for creating the SHA-1 HMAC signature of the JSON blob sent by GitHub.
  You should register the same secret key with GitHub.
  Any request not delivering a `X-Hub-Signature` that matches the signature generated using this key against the blob will throw an HTTP `400` error code.

The **class** inherits form `EventEmitter`.
All Github events are emitted.

See the [GitHub Webhooks documentation](https://developer.github.com/webhooks/) for more details on the events you can receive.

Additionally, there is a special `'*'` event you can listen to in order to receive _everything_.

## License

**koa-github-webhook-secure** is licensed under the MIT License.
See the included [LICENSE.md](./LICENSE.md) file for more details.

[npm-image]: https://img.shields.io/npm/v/koa-github-webhook-secure.svg
[npm-url]: https://npmjs.org/package/koa-github-webhook-secure
[node-version-image]: https://img.shields.io/node/v/koa-github-webhook-secure.svg
[node-version-url]: http://nodejs.org/download/

<!--
[travis-image]: https://img.shields.io/travis/cinderblock/koa-github-webhook-secure/master.svg
[travis-url]: https://travis-ci.org/cinderblock/koa-github-webhook-secure
-->

'use strict';

import { EventEmitter } from 'events';
import { signBlob } from './tools';
import parse from 'co-body';
import Koa from 'koa';

export default class GithubWebhookHandler extends EventEmitter {
  options: { path: string; secret: string };

  constructor(options: { path: string; secret: string }) {
    super();

    if (typeof options !== 'object') throw new TypeError(`must provide an options object`);
    if (typeof options.path !== 'string') throw new TypeError(`must provide a 'path' option`);
    if (typeof options.secret !== 'string') throw new TypeError(`must provide a 'secret' option`);

    this.options = options;
  }

  middleware() {
    const self = this;

    return async (ctx: Koa.Context, next: () => Promise<any>) => {
      if (ctx.request.path !== self.options.path) return next();

      const sig = ctx.request.get('x-hub-signature');
      const event = ctx.request.get('x-github-event');
      const id = ctx.request.get('x-github-delivery');

      ctx.assert(sig, 400, 'No X-Hub-Signature found on request');
      ctx.assert(event, 400, 'No X-Github-Event found on request');
      ctx.assert(id, 400, 'No X-Github-Delivery found on request');

      const payload = await parse(ctx);

      const isBlobMatchingSig = sig === signBlob(self.options.secret, JSON.stringify(payload));
      ctx.assert(isBlobMatchingSig, 400, 'X-Hub-Signature does not match blob signature');

      ctx.response.body = { ok: true };

      const emitData = {
        event,
        id,
        payload,
        protocol: ctx.request.protocol,
        host: ctx.request.get('host'),
        url: ctx.request.url,
      };

      self.emit(event, emitData);
      self.emit('*', emitData);
    };
  }
}

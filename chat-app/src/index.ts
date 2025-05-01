import { DurableObject } from 'cloudflare:workers';
import { error, Router } from 'itty-router';
export { Chat } from './chat';
const router = Router().get('/api/chat', (request: Request, env: Env) => {
	const chatId = new URL(request.url).searchParams.get('chatId');
	if (!chatId) {
		return new Response('Chat ID is missing', { status: 400 });
	}
	const doId = env.CHATS.idFromName(chatId);
	const chat = env.CHATS.get(doId);
	if (request.headers.get('Upgrade') != 'websocket') {
		return new Response('expected websocket', { status: 400 });
	}
	return chat.fetch(request.clone());
});

router.all('*', () => error(404));

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

/** A Durable Object's behavior is defined in an exported Javascript class */
export class MyDurableObject extends DurableObject<Env> {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * The Durable Object exposes an RPC method sayHello which will be invoked when when a Durable
	 *  Object instance receives a request from a Worker via the same method invocation on the stub
	 *
	 * @param name - The name provided to a Durable Object instance from a Worker
	 * @returns The greeting to be sent back to the Worker
	 */
	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		// Create a `DurableObjectId` for an instance of the `MyDurableObject`
		// class named "foo". Requests from all Workers to the instance named
		// "foo" will go to a single globally unique Durable Object instance.
		return router.fetch(request, env);
	},
} satisfies ExportedHandler<Env>;

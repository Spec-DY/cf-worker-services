/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	API_AUTH_KEY: String;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const api_key = request.headers.get('x-api-auth-key');

		if (api_key === env.API_AUTH_KEY) {
			return new Response('Authenticated', { status: 200 });
		}

		return new Response('Incorrect Auth Key', { status: 401 });
	},
} satisfies ExportedHandler<Env>;

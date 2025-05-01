import { DurableObject } from 'cloudflare:workers';

type RawUserMessage = {
	text: string;
	name: string;
	connection_established?: boolean;
};

type FormattedUserMessage = {
	text: string;
	type: string;
	name?: string;
};

export class Chat extends DurableObject {
	constructor(ctx: DurableObjectState, env: any) {
		super(ctx, env);
	}
	async fetch(request: Request) {
		let [client, sever] = Object.values(new WebSocketPair());
		this.ctx.acceptWebSocket(sever);
		return new Response(null, { status: 101, webSocket: client });
	}

	async webSocketMessage(ws: WebSocket, message: string) {
		const user_message = this.formatUserMessage(message);
		this.boardcastMessage(user_message);
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		ws.close(code, 'Durable Object is closing WebSocket');
	}
	boardcastMessage(user_message: FormattedUserMessage) {
		const websockets = this.ctx.getWebSockets();
		for (let x = 0; x < websockets.length; x++) {
			const session = websockets[x];
			session.send(JSON.stringify(user_message));
		}
	}
	formatUserMessage(websocket_message: string): FormattedUserMessage {
		const data = JSON.parse(websocket_message) as RawUserMessage;
		let user_message;
		if (data.connection_established) {
			user_message = {
				text: `${data.name} joined!`,
				type: 'metadata',
			};
		} else {
			user_message = {
				text: data.text,
				name: data.name,
				type: 'user_message',
			};
		}
		return user_message;
	}
}

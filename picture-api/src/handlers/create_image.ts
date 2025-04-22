import { ALL_IMAGES } from '../data/image_store';
import { IRequest } from 'itty-router';
import { Env } from '../env';

interface imageRequest {
	id: string;
	url: string;
	author: string;
}

const createImage = async (request: IRequest, env: Env) => {
	const json = (await request.json()) as {
		category_id: number;
		user_id: number;
		image_url: string;
		title: string;
		format: string;
		resolution: string;
		file_size_bytes: number;
	};
	let result;

	try {
		result = await env.DB.prepare(
			`INSERT INTO images
			(category_id, user_id, image_url, title,
			format, resolution, file_size_bytes)
			VALUES
			(?1, ?2, ?3, ?4, ?5, ?6, ?7)
			RETURNING *;
			`
		)
			.bind(json.category_id, json.user_id, json.image_url, json.title, json.format, json.resolution, json.file_size_bytes)
			.first();
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;

		console.log({ message: message });
	}

	if (!result) {
		return new Response('Not Found', { status: 500 });
	}

	return new Response(JSON.stringify(result), { headers: { 'content-type': 'application/json' }, status: 201 });
};

export default createImage;

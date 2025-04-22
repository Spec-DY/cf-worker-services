import { ALL_IMAGES } from '../data/image_store';
import { IRequest, status } from 'itty-router';
import { Env } from '../env';

const getSingleImage = async (request: IRequest, env: Env) => {
	let result;

	try {
		result = await env.DB.prepare(
			`SELECT i.*, c.display_name AS category_display_name
			FROM images i
			INNER JOIN image_categories c ON i.category_id = c.id
			WHERE i.id = ?1
			`
		)
			.bind(request.params.id)
			.first();
	} catch (e) {
		let message;
		if (e instanceof Error) {
			message = e.message;
		}

		console.log({
			message: message,
		});

		return new Response('Error fetch image', { status: 500 });
	}

	if (!result) {
		return new Response('Not Found', { status: 404 });
	}

	return new Response(JSON.stringify(result), { status: 200, headers: { 'content-type': 'application/json' } });
};

export default getSingleImage;

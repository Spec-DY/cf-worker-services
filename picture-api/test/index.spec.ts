// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, test } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Photo Service', () => {
	it('returns a 404 if non-existent endpoint is called', async () => {
		const response = await SELF.fetch('https://example.com/invalid-endpoint');
		expect(response.status).toEqual(404);
	});

	describe('GET /images', () => {
		it('returns 200', async () => {
			const response = await SELF.fetch('http://example.com/images');
			expect(response.status).toEqual(200);
		});

		it('return images', async () => {
			const response = await SELF.fetch('http://example.com/images');
			const json = await response.json();
			expect(json).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: 3,
						url: 'https://bar.com/img1',
						author: 'Lara Lobster',
					}),
				])
			);
		});

		it('return number of images with count', async () => {
			const response = await SELF.fetch('http://example.com/images?count=2');
			const json = await response.json();
			expect(json).toHaveLength(2);
		});
	});

	describe('POST /images', () => {
		it('return 201', async () => {
			const payload = {
				id: 4,
				url: 'http://example.com/some_image.png',
				author: 'Lia',
			};
			const response = await SELF.fetch('http://example.com/images', {
				method: 'POST',
				body: JSON.stringify(payload),
			});

			expect(response.status).toEqual(201);
		});

		it('return create image', async () => {
			const newImage = {
				id: 4,
				url: 'http://example.com/some_image.png',
				author: 'Lia',
			};

			const response = await SELF.fetch('http://example.com/images', {
				method: 'POST',
				body: JSON.stringify(newImage),
			});
			const data = await response.json();
			expect(data).toEqual(expect.objectContaining(newImage));
		});
	});

	describe('GET /images/id', () => {
		test('return 200 with id 1', async () => {
			const response = await SELF.fetch('http://example.com/images/1');

			expect(response.status).toEqual(200);
		});

		test('return an image with id 1', async () => {
			const image = {
				id: 1,
				url: 'https://foo.com/img1',
				author: 'Bart Simpson',
			};

			const response = await SELF.fetch('http://example.com/images/1');
			const data = await response.json();

			expect(data).toEqual(expect.objectContaining(image));
		});
	});
});

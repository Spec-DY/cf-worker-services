import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const ctx = getCloudflareContext();
  const bucket = ctx.env.IMAGE_APP_UPLOADS;

  const objects = await bucket.list();

  const images = objects.objects.map((obj) => ({
    key: obj.key,
    url: `https://images.dylanjin.com/${obj.key}`,
    uploaded: obj.uploaded,
    size: obj.size,
  }));

  return new Response(
    JSON.stringify({
      success: true,
      images: images,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}

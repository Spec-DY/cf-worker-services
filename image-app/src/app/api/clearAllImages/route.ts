import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function DELETE() {
  try {
    const ctx = getCloudflareContext();
    const bucket = ctx.env.IMAGE_APP_UPLOADS;

    const objects = await bucket.list();

    if (objects.objects.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No images to delete",
        }),
        {
          headers: { "content-type": "application/json" },
        }
      );
    }

    for (const object of objects.objects) {
      await bucket.delete(object.key);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted ${objects.objects.length} images`,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete images",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

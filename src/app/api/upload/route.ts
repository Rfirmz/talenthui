import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return Response.json({ error: 'Filename is required' }, { status: 400 });
  }

  if (!request.body) {
    return Response.json({ error: 'Request body is required' }, { status: 400 });
  }

  const blob = await put(filename, request.body, {
    access: 'public',
    addRandomSuffix: true
  });

  return Response.json(blob);
}

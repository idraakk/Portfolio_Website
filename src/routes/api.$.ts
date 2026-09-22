export function loader() { return Response.json({ error: 'Route not found' }, { status: 404 }); }
export const action = loader;

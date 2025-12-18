import { getTeamForUser } from '@repo/next-utils/db/queries';

export async function GET() {
  const team = await getTeamForUser();
  return Response.json(team);
}

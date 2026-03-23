import packageJson from '@/package.json';

export async function GET() {
  return Response.json({
    version: packageJson.version,
    name: packageJson.name,
    buildAt: process.env.BUILD_TIME
  });
}
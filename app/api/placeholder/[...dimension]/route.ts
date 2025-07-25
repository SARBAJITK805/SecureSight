import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ dimensions: string[] }> }
) {
  const { dimensions } = await context.params; // Await the params Promise
  const [widthStr = "100", heightStr = "100"] = dimensions || [];
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#374151"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
            fill="#9CA3AF" text-anchor="middle" dominant-baseline="middle">
        ${width}×${height}
      </text>
      <circle cx="50%" cy="40%" r="15" fill="#6B7280" opacity="0.5"/>
      <rect x="45%" y="55%" width="10%" height="8%" fill="#6B7280" opacity="0.5"/>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}
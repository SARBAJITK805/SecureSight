import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()

  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Main Entrance',
        location: 'Building Front'
      }
    }),
    prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Vault Camera',
        location: 'Secure Area - Level B2'
      }
    }),
    prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Shop Floor A',
        location: 'Retail Area - Ground Floor'
      }
    }),
    prisma.camera.create({
      data: {
        id: randomUUID(),
        name: 'Loading Dock',
        location: 'Rear Entrance'
      }
    })
  ])

  const baseDate = new Date('2025-07-20T00:00:00Z')


  const incidents = [
    {
      type: 'UNAUTHORIZED_ACCESS',
      timestamp: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000), 
      cameraId: cameras[1].id,
      thumbnail: '/thumbnails/vault-alert-1.jpg',
      description: 'Unauthorized personnel attempted vault access'
    },
    {
      type: 'FACE_RECOGNIZED',
      timestamp: new Date(baseDate.getTime() + 4 * 60 * 60 * 1000), 
      cameraId: cameras[0].id,
      thumbnail: '/thumbnails/entrance-face-1.jpg',
      description: 'Known suspect identified at entrance'
    },
    {
      type: 'SUSPICIOUS_BEHAVIOR',
      timestamp: new Date(baseDate.getTime() + 6 * 60 * 60 * 1000),
      cameraId: cameras[3].id,
      thumbnail: '/thumbnails/dock-suspicious-1.jpg',
      description: 'Unusual activity near loading area'
    },
    // Midday incidents
    {
      type: 'GUN_THREAT',
      timestamp: new Date(baseDate.getTime() + 10 * 60 * 60 * 1000), 
      cameraId: cameras[2].id,
      thumbnail: '/thumbnails/shop-weapon-1.jpg',
      description: 'Potential weapon spotted in retail area'
    },
    {
      type: 'UNAUTHORIZED_ACCESS',
      timestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000), 
      cameraId: cameras[0].id,
      thumbnail: '/thumbnails/entrance-unauth-1.jpg',
      description: 'Tailgating detected at main entrance'
    },
    {
      type: 'FACE_RECOGNIZED',
      timestamp: new Date(baseDate.getTime() + 13 * 60 * 60 * 1000), 
      cameraId: cameras[2].id,
      thumbnail: '/thumbnails/shop-face-1.jpg',
      description: 'Person of interest detected in shop area'
    },
    // Afternoon incidents
    {
      type: 'SUSPICIOUS_BEHAVIOR',
      timestamp: new Date(baseDate.getTime() + 15 * 60 * 60 * 1000), 
      cameraId: cameras[1].id,
      thumbnail: '/thumbnails/vault-suspicious-1.jpg',
      description: 'Suspicious patterns near vault entrance'
    },
    {
      type: 'GUN_THREAT',
      timestamp: new Date(baseDate.getTime() + 16 * 60 * 60 * 1000), 
      cameraId: cameras[0].id,
      thumbnail: '/thumbnails/entrance-weapon-1.jpg',
      description: 'Possible concealed weapon detected'
    },
    {
      type: 'UNAUTHORIZED_ACCESS',
      timestamp: new Date(baseDate.getTime() + 17 * 60 * 60 * 1000), 
      cameraId: cameras[3].id,
      thumbnail: '/thumbnails/dock-unauth-1.jpg',
      description: 'Unauthorized vehicle at loading dock'
    },
    // Evening incidents
    {
      type: 'FACE_RECOGNIZED',
      timestamp: new Date(baseDate.getTime() + 19 * 60 * 60 * 1000), 
      cameraId: cameras[0].id,
      thumbnail: '/thumbnails/entrance-face-2.jpg',
      description: 'Watchlist match at main entrance'
    },
    {
      type: 'SUSPICIOUS_BEHAVIOR',
      timestamp: new Date(baseDate.getTime() + 21 * 60 * 60 * 1000), 
      cameraId: cameras[2].id,
      thumbnail: '/thumbnails/shop-suspicious-1.jpg',
      description: 'Unusual after-hours activity detected'
    },
    {
      type: 'GUN_THREAT',
      timestamp: new Date(baseDate.getTime() + 23 * 60 * 60 * 1000), 
      cameraId: cameras[1].id,
      thumbnail: '/thumbnails/vault-weapon-1.jpg',
      description: 'Armed individual near vault area'
    }
  ]

  await Promise.all(
    incidents.map(incident =>
      prisma.incident.create({
        data: {
          id: randomUUID(),
          ...incident
        }
      })
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()


  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Main Entrance',
        location: 'Building Front - Ground Floor'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Vault Camera',
        location: 'Secure Area - Level B2'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Shop Floor A',
        location: 'Retail Area - Ground Floor'
      }
    }),
    prisma.camera.create({
      data: {
        name: 'Loading Dock',
        location: 'Rear Entrance - Ground Floor' 
      }
    })
  ])


  const baseDate = new Date('2025-07-20T00:00:00Z')


  const createTimeRange = (hourOffset: number, durationMinutes: number) => ({
    tsStart: new Date(baseDate.getTime() + hourOffset * 60 * 60 * 1000),
    tsEnd: new Date(baseDate.getTime() + hourOffset * 60 * 60 * 1000 + durationMinutes * 60 * 1000)
  })

  const incidents = [
    {
      type: 'UNAUTHORIZED_ACCESS',
      ...createTimeRange(2, 5),
      cameraId: cameras[1].id,
      thumbnailUrl: '/thumbnails/vault-alert-1.jpg',
      resolved: false
    },
    {
      type: 'FACE_RECOGNIZED',
      ...createTimeRange(4, 3),
      cameraId: cameras[0].id,
      thumbnailUrl: '/thumbnails/entrance-face-1.jpg',
      resolved: true
    },
    {
      type: 'SUSPICIOUS_BEHAVIOR',
      ...createTimeRange(6, 8),
      cameraId: cameras[3].id,
      thumbnailUrl: '/thumbnails/dock-suspicious-1.jpg',
      resolved: false
    },  
    {
      type: 'GUN_THREAT',
      ...createTimeRange(10, 2),
      cameraId: cameras[2].id,
      thumbnailUrl: '/thumbnails/shop-weapon-1.jpg',
      resolved: false
    },
    {
      type: 'UNAUTHORIZED_ACCESS',
      ...createTimeRange(12, 4),
      cameraId: cameras[0].id,
      thumbnailUrl: '/thumbnails/entrance-unauth-1.jpg',
      resolved: true
    },  
    {
      type: 'FACE_RECOGNIZED',
      ...createTimeRange(13, 3),
      cameraId: cameras[2].id,
      thumbnailUrl: '/thumbnails/shop-face-1.jpg',
      resolved: false
    },
    {
      type: 'SUSPICIOUS_BEHAVIOR',
      ...createTimeRange(15, 6),
      cameraId: cameras[1].id,
      thumbnailUrl: '/thumbnails/vault-suspicious-1.jpg',
      resolved: false
    },
    {
      type: 'GUN_THREAT',
      ...createTimeRange(16, 2),
      cameraId: cameras[0].id,
      thumbnailUrl: '/thumbnails/entrance-weapon-1.jpg',
      resolved: false
    },
  
    {
      type: 'UNAUTHORIZED_ACCESS',
      ...createTimeRange(17, 5),
      cameraId: cameras[3].id,
      thumbnailUrl: '/thumbnails/dock-unauth-1.jpg',
      resolved: true
    },
    {
      type: 'FACE_RECOGNIZED',
      ...createTimeRange(19, 3),
      cameraId: cameras[0].id,
      thumbnailUrl: '/thumbnails/entrance-face-2.jpg',
      resolved: false
    },
    {
      type: 'SUSPICIOUS_BEHAVIOR',
      ...createTimeRange(21, 7),
      cameraId: cameras[2].id,
      thumbnailUrl: '/thumbnails/shop-suspicious-1.jpg',
      resolved: false
    },
    {
      type: 'GUN_THREAT',
      ...createTimeRange(23, 2),
      cameraId: cameras[1].id,
      thumbnailUrl: '/thumbnails/vault-weapon-1.jpg',
      resolved: false
    }
  ]


  await Promise.all(
    incidents.map(incident =>
      prisma.incident.create({
        data: incident
      })
    )
  )
  
  console.log(`Created ${cameras.length} cameras and ${incidents.length} incidents`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function getAuthDoctor(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  // For simplicity, the token is the doctor's ID
  // In production, this would verify a JWT
  try {
    const doctor = await db.doctor.findUnique({
      where: { id: token },
      include: { settings: true, subscription: true },
    })
    return doctor
  } catch {
    return null
  }
}

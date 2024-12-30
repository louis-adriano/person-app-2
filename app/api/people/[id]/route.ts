import { NextRequest, NextResponse } from 'next/server'
import { updateUser } from '@/app/actions/actions'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log('Received PUT request for user:', params.id, 'with body:', body)

    const updatedUser = await updateUser(params.id, body)
    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error in PUT handler:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
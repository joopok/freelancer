import { NextResponse } from 'next/server';
import { clearSession } from '@/utils/session';

export async function POST() {
  clearSession();
  return NextResponse.json({ success: true });
} 
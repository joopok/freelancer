import { NextRequest, NextResponse } from 'next/server';
import { DatabaseHealthService } from '@/services/database';

export async function GET(request: NextRequest) {
  try {
    const healthCheck = await DatabaseHealthService.checkHealth();
    
    return NextResponse.json({
      success: true,
      data: healthCheck,
      timestamp: new Date().toISOString()
    }, {
      status: healthCheck.healthy ? 200 : 503
    });
  } catch (error) {
    console.error('Database health check API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check database health',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
} 
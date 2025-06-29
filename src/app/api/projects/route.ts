import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/services/database';
import { PaginationOptions } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = (searchParams.get('sortOrder') || 'DESC') as 'ASC' | 'DESC';
    const type = searchParams.get('type') as 'remote' | 'onsite' | 'hybrid' | null;
    const search = searchParams.get('search');
    
    const paginationOptions: PaginationOptions = {
      page: Math.max(1, page),
      limit: Math.min(50, Math.max(1, limit)), // Limit between 1-50
      sortBy,
      sortOrder
    };
    
    let result;
    
    if (search) {
      // Search projects
      result = await ProjectService.search({
        query: search,
        fields: ['title', 'description', 'company', 'skills'],
        filters: type ? { type } : {},
        pagination: paginationOptions
      });
    } else if (type) {
      // Filter by type
      result = await ProjectService.findByType(type, paginationOptions);
    } else {
      // Get all projects
      result = await ProjectService.findAll(paginationOptions);
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      ...(search && { searchQuery: search }),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Projects API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'company', 'skills', 'duration', 'budget', 'deadline', 'type', 'level', 'client_id'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        missingFields,
        timestamp: new Date().toISOString()
      }, {
        status: 400
      });
    }
    
    // Create project
    const projectData = {
      title: body.title,
      description: body.description,
      company: body.company,
      skills: typeof body.skills === 'string' ? body.skills : JSON.stringify(body.skills),
      duration: body.duration,
      budget: body.budget,
      deadline: body.deadline,
      type: body.type,
      level: body.level,
      status: body.status || 'active',
      client_id: body.client_id
    };
    
    const result = await ProjectService.create(projectData);
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        affectedRows: result.affectedRows
      },
      message: 'Project created successfully',
      timestamp: new Date().toISOString()
    }, {
      status: 201
    });
    
  } catch (error) {
    console.error('Create project API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create project',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
} 
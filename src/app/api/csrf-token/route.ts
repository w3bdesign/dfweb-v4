import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

/**
 * GET handler for CSRF token generation
 * @returns {NextResponse} JSON response with CSRF token
 */
export async function GET() {
  try {
    const token = generateCSRFToken();
    
    return NextResponse.json(
      { csrfToken: token },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

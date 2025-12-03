<<<<<<< HEAD
// Simple handler for Netlify Functions
export const handler = async (event: any) => {
  // Extract request details
  const method = event.httpMethod || event.requestContext?.http?.method;
  const path = event.path || event.rawPath;
  
  let body: any = {};
  if (event.body) {
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      body = event.body;
    }
  }

  // Log request
  console.log(`${method} ${path}`, body);

  // Basic routing for health check
  if (path === '/api/health' || path?.includes('health')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok' }),
    };
  }

  // API route handler - proxy to backend
  // Set BACKEND_URL in Netlify environment variables
  const backendUrl = (globalThis as any).process?.env?.BACKEND_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...event.headers,
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
=======
// Simple handler for Netlify Functions
export const handler = async (event: any) => {
  // Extract request details
  const method = event.httpMethod || event.requestContext?.http?.method;
  const path = event.path || event.rawPath;
  
  let body: any = {};
  if (event.body) {
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      body = event.body;
    }
  }

  // Log request
  console.log(`${method} ${path}`, body);

  // Basic routing for health check
  if (path === '/api/health' || path?.includes('health')) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok' }),
    };
  }

  // API route handler - proxy to backend
  // Set BACKEND_URL in Netlify environment variables
  const backendUrl = (globalThis as any).process?.env?.BACKEND_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...event.headers,
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: data,
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14

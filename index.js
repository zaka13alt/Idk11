export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Extract the target URL from the path (e.g., /https://example.com)
    const targetUrlString = url.pathname.substring(1) + url.search;

    if (!targetUrlString || !targetUrlString.startsWith('http')) {
      return new Response("Usage: your-worker.workers.dev/https://target-url.com", {
        status: 400,
        headers: { "Content-Type": "text/plain" }
      });
    }

    // Define your custom User-Agent and target headers
    const customHeaders = new Headers(request.headers);
    customHeaders.set('User-Agent', 'Mozilla/5.0, lol nothing else after!');
    
    // Create the proxied request
    const targetRequest = new Request(targetUrlString, {
      method: request.method,
      headers: customHeaders,
      body: request.body,
      redirect: 'follow'
    });

    try {
      const response = await fetch(targetRequest);
      
      // Clone the response to modify headers
      const modifiedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText
      });

      // Force Content-Type to text/plain
      modifiedResponse.headers.set('Content-Type', 'text/plain');

      // Set CORS Headers
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      modifiedResponse.headers.set('Access-Control-Allow-Headers', '*');

      return modifiedResponse;
    } catch (err) {
      return new Response("Error fetching the requested URL: " + err.message, {
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
};

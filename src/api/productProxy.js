// api/productProxy.js
export default async function handler(req, res) {
    const { barcode } = req.query;
  
    if (!barcode) {
      return res.status(400).json({ error: "Barcode is required" });
    }
  
    try {
      const response = await fetch(`https://products-test-aci.onrender.com/api/product/${barcode}`);
  
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        // Check if the response is JSON before attempting to parse
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          return res.status(response.status).json({
            error: `API Error: ${response.status} ${response.statusText}`,
            details: errorData, // Include details from the API if available
          });
        } else {
          // If not JSON, it's likely an HTML error page, so return a generic error
          return res.status(response.status).json({
            error: `API Error: ${response.status} ${response.statusText} (Non-JSON response)`,
          });
        }
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
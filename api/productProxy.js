// api/productProxy.js
export default async function handler(req, res) {
    const { barcode } = req.query;
  
    if (!barcode) {
      return res.status(400).json({ error: "Barcode is required" });
    }
  
    try {
      const response = await fetch(`https://products-test-aci.onrender.com/api/product/${barcode}`, {
        timeout: 10000, // 10 seconds timeout
      });
  
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          return res.status(response.status).json({
            error: `API Error: ${response.status} ${response.statusText}`,
            details: errorData,
          });
        } else {
          // If not JSON, return a generic error
          return res.status(response.status).json({
            error: `API Error: ${response.status} ${response.statusText} (Non-JSON response)`,
          });
        }
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.error("Proxy error: Fetch failed", error);
        return res.status(500).json({ error: "Failed to fetch data from the API" });
      } else if (error instanceof Error && error.message.includes("timeout")) {
        console.error("Proxy error: Timeout", error);
        return res.status(504).json({ error: "Timeout while fetching data from the API" });
      } else {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
  
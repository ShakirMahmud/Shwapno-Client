
export default async function handler(req, res) {
    const { barcode } = req.query;
  
    try {
      const response = await fetch(`https://products-test-aci.onrender.com/api/product/${barcode}`);
      console.log(response);
  
      if (!response.ok) {
        console.log(response);
        return res.status(response.status).json({ error: `Failed to fetch product: ${response.statusText}` });
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  
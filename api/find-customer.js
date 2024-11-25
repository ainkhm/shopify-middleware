const axios = require("axios");
require("dotenv").config(); 

module.exports = async (req, res) => {
    
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.body || !req.body.phone) {
    return res.status(400).json({ error: "Bad Request: Missing 'phone' in request body" });
  }

  const { phone } = req.body;

  const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;

  try {
    const response = await axios.get(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-10/customers.json`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
        },
      }
    );

    const result = response.data;

    if (result.customers && result.customers.length > 0) {
      const customer = result.customers.find((c) => c.phone === phone);

      if (customer) {
        return res.status(200).json(customer);
      }
    }

    return res.status(200).json(null);
  } catch (error) {
    console.error("Error fetching customer:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

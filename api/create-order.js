const axios = require("axios");
require("dotenv").config();

module.exports = async (req, res) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = JSON.stringify(req.body);

  const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;

  try {
    const response = await axios.post(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-10/orders.json`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
        },
      }
    );
   
    if (response) {
      return res.status(200).json(response.data.order);
    } else {
      return res.status(400).json({ message: "Failed to create order" });
    }
  } catch (error) {
    console.error("Error creating order:", error.message);

    return res.status(500).json({
      error: "Internal server error",
      details: error.response ? error.response.data : error.message,
    });
  }
};

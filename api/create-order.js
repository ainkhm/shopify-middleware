const axios = require("axios");
require("dotenv").config(); // Подключение .env-файла

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body;

  const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
  const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;

  try {
    const response = await axios.post(
      `https://${SHOPIFY_DOMAIN}/admin/api/2024-10/orders.json`,
      { order: payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_API_KEY,
        }
      }
    );

    if (response.data.order) {
      return res.status(200).json(response.data.order);
    } else {
      return res.status(400).json({ message: "Failed to create order" });
    }
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
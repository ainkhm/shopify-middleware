const axios = require("axios");
require("dotenv").config(); // Подключение .env-файла

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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

    const customers = response.data.customers || [];
    const customer = customers.find((c) => c.phone === phone);

    if (customer) {
      return res.status(200).json(customer);
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

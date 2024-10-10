import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/fetchdata", async (req, res) => {
  const { url, id } = req.body;
  console.log(url, id);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const fullUrl = id ? `${url}${id}` : url;
    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0", // Add a user agent header like a browser
      },
    });
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else {
      // Log and send non-JSON responses as plain text for debugging
      const text = await response.text();
      console.error("Received non-JSON response:", text);
      res
        .status(500)
        .send("Failed to fetch JSON data. Non-JSON response received.");
    }
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

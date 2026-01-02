// server.js
import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get("/api/prices", async (req, res) => {
  try {
    const { data } = await axios.get("https://donutsmpstats.net/spawners");
    const $ = cheerio.load(data);

    let prices = {};
    $(".spawner-card").each((i, el) => {
      const name = $(el).find(".spawner-name").text().trim();
      const avgPrice = $(el).find(".spawner-average").text().replace(/[^\d]/g,"");
      if(name && avgPrice) prices[name] = parseInt(avgPrice,10);
    });

    res.json(prices);
  } catch(err){
    console.error("Fehler beim Abrufen:", err);
    res.status(500).json({ error: "Fehler beim Abrufen" });
  }
});

app.listen(PORT, () => console.log(`Backend läuft auf Port ${PORT}`));

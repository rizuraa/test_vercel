const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

async function scrapeImage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const newImageUrl = await page.evaluate(() => {
    const imgElement = document.querySelector("img");
    return imgElement ? imgElement.src : null;
  });

  await browser.close();

  return newImageUrl;
}

module.exports = async (req, res) => {
  try {
    const response = await axios.get("https://bmkg.go.id/");
    const $ = cheerio.load(response.data);

    const imageElement = $(
      'div.img-mkg-home-bg:has(a[title="Prakiraan Angin"]) img'
    );
    const imageUrl = imageElement.attr("data-original");

    if (imageUrl) {
      console.log("URL gambar awal:", imageUrl);
      const newImageUrl = await scrapeImage(imageUrl);
      console.log("URL gambar terbaru:", newImageUrl);

      res.status(200).json({ imageUrl: newImageUrl });
    } else {
      console.log("Tidak ada gambar prakiraan angin yang ditemukan.");
      res
        .status(404)
        .json({ error: "Tidak ada gambar prakiraan angin yang ditemukan" });
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
};

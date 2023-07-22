const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  try {
    const response = await axios.get(
      "https://peta-maritim.bmkg.go.id/prakiraan/tinggi_gelombang"
    );
    const $ = cheerio.load(response.data);

    const imageElement = $("div.blog-view.view-fifth div.img img");
    const imageUrl = imageElement.attr("src");
    const keterangan = $("div.img + p").text();
    const potensiHujanElement = $(
      "b:contains('1. Potensi Hujan Lebat disertai petir berpeluang terjadi di :') + ul li"
    );
    const potensiHujan = [];

    potensiHujanElement.each((index, element) => {
      potensiHujan.push($(element).text());
    });

    if (imageUrl) {
      console.log("URL gambar:", imageUrl);
      console.log("Keterangan:", keterangan);
      console.log("Potensi Hujan Lebat:", potensiHujan);

      res.status(200).json({ imageUrl, keterangan, potensiHujan });
    } else {
      console.log("Tidak ada gambar yang ditemukan.");
      res.status(404).json({ error: "Tidak ada gambar yang ditemukan" });
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
};

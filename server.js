const express = require("express");
const mongoose = require("mongoose");
const app = express();
const shortUrlModel = require("./model/shortUrls");

mongoose.connect(
  "mongodb+srv://navya:MYpassw0rd@cluster0.flgzf6k.mongodb.net/urlShortner",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.use(express.urlencoded({ extends: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  let shorts = await shortUrlModel.find();
  res.render("index", { shorts });
});

app.post("/short/urls", async (req, res) => {
  await shortUrlModel.create({
    full: req.body.fullUrl,
  });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  let url = await shortUrlModel.findOne({ short: req.params.shortUrl });
  if (url == null) {
    return res.sendStatus(404);
  }
  url.clicks++;
  url.save();
  res.redirect(url.full);
});
app.listen(process.env.PORT || 5000);

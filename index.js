const express = require("express");
const path = require("path");

const app = express();
const PORT = 874;

// sert tous les fichiers du dossier /site
app.use(express.static(path.join(__dirname, "site")));

// optionnel : route "/" → index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "site", "index.html"));
});

// Page 404 personnalisée
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "site", "404.html"));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

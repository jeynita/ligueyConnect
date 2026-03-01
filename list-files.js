// list-files.js
import fs from "fs";
import path from "path";

// Chemin du dossier à scanner (ici le backend)
const baseDir = "./backend"; // ou "./frontend" selon ce que tu veux

// Fonction récursive pour lister tous les fichiers
function readFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // Si c'est un dossier, on appelle récursivement
      readFiles(fullPath);
    } else {
      // Si c'est un fichier, on affiche son chemin et son contenu
      console.log(`\n===== ${fullPath} =====`);
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        console.log(content);
      } catch (err) {
        console.error(`Erreur lecture fichier ${fullPath}:`, err.message);
      }
    }
  });
}

// Lancer la fonction
readFiles(baseDir);
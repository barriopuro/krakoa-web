import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogoDir = path.join(root, "catalogo");
const outputDir = path.join(root, "src", "data");
const outputFile = path.join(outputDir, "catalogo.json");

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const categoryConfig = {
  anime: {
    name: "Anime",
    color: "#e53935",
  },
  
  comics: {
    name: "Comics",
    color: "#E84393",
  },

  "cine-series": {
    name: "Cine y Series",
    color: "#f2c94c",
  },

  deportes: {
    name: "Deportes",
    color: "#f2994a",
  },

  musica: {
    name: "Música",
    color: "#2f80ed",
  },

  videojuegos: {
    name: "Videojuegos",
    color: "#27ae60",
  },

  otros: {
    name: "Otros",
    color: "#bb86fc",
  },
};

function formatName(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function findImage(directory, baseName) {
  for (const extension of imageExtensions) {
    const file = `${baseName}${extension}`;
    const fullPath = path.join(directory, file);

    if (fs.existsSync(fullPath)) {
      return file;
    }
  }

  return null;
}

if (!fs.existsSync(catalogoDir)) {
  console.error("ERROR: No existe la carpeta catalogo.");
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const categories = [];
const products = [];

const categoryFolders = fs
  .readdirSync(catalogoDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

for (const categoryFolder of categoryFolders) {
  const categoryId = categoryFolder.name;
  const categoryDirectory = path.join(catalogoDir, categoryId);

const config = categoryConfig[categoryId];

categories.push({
  id: categoryId,
  name: config?.name ?? formatName(categoryId),
  color: config?.color ?? "#888888",
});

  const productFolders = fs
    .readdirSync(categoryDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  for (const productFolder of productFolders) {
    const productId = productFolder.name;
    const productDirectory = path.join(categoryDirectory, productId);

    const modelo = findImage(productDirectory, "modelo");
    const remera = findImage(productDirectory, "remera");

    if (!modelo || !remera) {
      console.warn(
        `ADVERTENCIA: "${formatName(productId)}" no tiene todas las imágenes necesarias.`
      );

      if (!modelo) {
        console.warn("  Falta: modelo.jpg");
      }

      if (!remera) {
        console.warn("  Falta: remera.jpg");
      }

      continue;
    }

    products.push({
      id: productId,
      name: formatName(productId),
      category: categoryId,
      categoryName: config?.name ?? formatName(categoryId),
      modelo: `/catalogo/${categoryId}/${productId}/${modelo}`,
      remera: `/catalogo/${categoryId}/${productId}/${remera}`,
    });
  }
}

const catalog = {
  categories,
  products,
};

fs.writeFileSync(
  outputFile,
  JSON.stringify(catalog, null, 2),
  "utf8"
);

console.log(
  `Catálogo generado: ${products.length} producto(s), ${categories.length} categoría(s).`
);
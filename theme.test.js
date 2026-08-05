const fs = require("fs");
const path = require("path");

const checks = [
  ["app.jsx", ["pf-theme", "toggleTheme", "ThemeToggle", "data-theme"]],
  ["index.html", ["pf-theme", "data-theme"]],
  ["resume.html", ["pf-theme", "data-theme"]],
  ["contact.html", ["pf-theme", "data-theme"]],
  ["404.html", ["pf-theme", "data-theme"]],
  ["offline.html", ["pf-theme", "data-theme"]],
  ["case-studies/field.html", ["pf-theme"]],
  ["case-studies/interior.html", ["pf-theme"]],
  ["case-studies/portrait.html", ["pf-theme"]],
  ["case-studies/landscape.html", ["pf-theme"]],
  ["case-studies/studio.html", ["pf-theme"]],
  ["case-studies/case-study.css", ["data-theme"]],
];

let failed = false;

for (const [relativePath, requiredSubstrings] of checks) {
  const filePath = path.join(__dirname, relativePath);

  if (!fs.existsSync(filePath)) {
    console.error(`missing file: ${relativePath}`);
    failed = true;
    continue;
  }

  const contents = fs.readFileSync(filePath, "utf-8");

  for (const substring of requiredSubstrings) {
    if (!contents.includes(substring)) {
      console.error(`missing "${substring}" in ${relativePath}`);
      failed = true;
    }
  }
}

if (!failed) {
  console.log("theme toggle contract OK");
  process.exit(0);
} else {
  process.exit(1);
}

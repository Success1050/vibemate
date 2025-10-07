const fs = require("fs");

const envFiles = [".env", ".env.local", ".env.development", ".env.production"];

envFiles.forEach((file) => {
  if (!fs.existsSync(file)) return;

  console.log(`\nChecking ${file}...`);

  let content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    // Skip comments and empty lines
    if (!line || line.startsWith("#")) return;

    // Detect spaces around '='
    if (line.includes(" =") || line.includes("= ")) {
      console.log(`Line ${index + 1}: Spaces around '=' -> "${line}"`);
    }

    // Detect non-ASCII characters
    [...line].forEach((ch) => {
      if (ch.charCodeAt(0) > 127) {
        console.log(`Line ${index + 1}: Non-ASCII character -> "${ch}"`);
      }
    });
  });
});

console.log("\n✅ Done checking .env files.");

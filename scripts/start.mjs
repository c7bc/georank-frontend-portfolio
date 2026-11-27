import { access, cp } from "node:fs/promises";

const standalone = new URL("../.next/standalone/", import.meta.url);
const server = new URL("server.js", standalone);
try {
  await access(server);
} catch {
  console.error("Build the frontend with npm run build before starting it.");
  process.exit(1);
}

await Promise.all([
  cp(new URL("../public/", import.meta.url), new URL("public/", standalone), { recursive: true }),
  cp(new URL("../.next/static/", import.meta.url), new URL(".next/static/", standalone), { recursive: true }),
]);
process.env.HOSTNAME = process.env.HOSTNAME === "0.0.0.0" ? "0.0.0.0" : "127.0.0.1";
await import(server.href);

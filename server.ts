// Import aus Deno SQLite Modul
import { Database } from "jsr:@db/sqlite";
// Dateien für Frontend hosten
import { serveDir } from "jsr:@std/http/file-server";

// --- später aktivieren ---
// import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const hostname = "127.0.0.1"; // localhost
const port = 3000;

// --- Datenbank vorbereiten ---
const db = new Database("users.db");
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS avatars (
    id INTEGER PRIMARY KEY,
    hat INTEGER,
    eyes INTEGER,
    nose INTEGER,
    mouth INTEGER,
    FOREIGN KEY ("id") REFERENCES "users" ("id") 
  )
`).run();

Deno.serve({ hostname, port }, async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  let status = 200;
  let body: unknown = "";
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if(url.pathname === "/register" && request.method === "POST") {
    const { username, password } = await request.json();
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, password);

    const currentID=Number(db.prepare("SELECT id FROM users WHERE username = ?").get(username));

    const stmt1 = db.prepare("INSERT INTO avatars (id, hat, eyes, nose, mouth) VALUES (?, ?, ?, ?, ?)");
    stmt1.run(currentID,1,1,1,1);

    body = { message: "Successfully registered" };
    return new Response(JSON.stringify(body), { status, headers });
  }

  if(url.pathname === "/login" && request.method === "POST") {
    const { username, password } = await request.json();
    const stmt = db.prepare("SELECT id FROM users WHERE username = ? AND password = ?");
    const result = stmt.all(username, password);

    if (result.length > 0) {
      body = { success: true, message: "Login ok" };
    } else {
      status = 401;
      body = { success: false, message: "Login failed" };
    }
    return new Response(JSON.stringify(body), { status, headers });
  }

  if (url.pathname === "/save" && request.method === "POST") {
    const { hat, eyes, nose, mouth , username} = await request.json();

    const currentID = Number(db.prepare("SELECT id FROM users WHERE username = ?").get(username)); //TODO

    const stmt = db.prepare("UPDATE avatars SET hat = ? WHERE id = ?"); 
    stmt.run(hat, currentID);
    const stmt1 = db.prepare("UPDATE avatars SET eyes = ? WHERE id = ?");
    stmt1.run(eyes, currentID);
    const stmt2 = db.prepare("UPDATE avatars SET nose = ? WHERE id = ?");
    stmt2.run(nose, currentID);
    const stmt3 = db.prepare("UPDATE avatars SET mouth = ? WHERE id = ?");
    stmt3.run(mouth, currentID);
    body = { message: "Successfully updated avatar" };
    return new Response(JSON.stringify(body), { status, headers });
  }

  // --- Fileserver für ./frontend ---
  return serveDir(request, {
    fsRoot: "./frontend",
    urlRoot: "",
    showDirListing: true,   // nützlich beim Entwickeln
    enableCors: true,       // praktisch für lokale Tests
  });

});

console.log(`Server läuft auf http://${hostname}:${port}/`);
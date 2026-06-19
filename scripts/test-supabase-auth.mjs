import fs from "fs";

function parseEnvValue(raw) {
  return raw?.trim().replace(/^["']|["']$/g, "") ?? "";
}

const env = fs.readFileSync(".env", "utf8");
const url = parseEnvValue(env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]);
const key = parseEnvValue(env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.+)/)?.[1]);

console.log("URL:", url);
const health = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
console.log("health status:", health.status);

const signup = await fetch(`${url}/auth/v1/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json", apikey: key },
  body: JSON.stringify({ email: `test-${Date.now()}@example.com`, password: "TestPass123!" }),
});
console.log("signup status:", signup.status);
console.log("signup body:", (await signup.text()).slice(0, 200));

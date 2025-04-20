// proxy-llm.ts
import express from "express";
import axios from "axios";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Función para obtener todas las keys disponibles
const getApiKeys = (): string[] => {
  const keys: string[] = [];

  // Buscar todas las variables de entorno que empiecen con KEY_
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("KEY_") && value) {
      keys.push(value);
    }
  }

  return keys;
};

const KEYS = getApiKeys();

if (KEYS.length === 0) {
  console.error(
    "Error: No se encontraron claves de API configuradas en el archivo .env"
  );
  process.exit(1);
}

console.log(`Se encontraron ${KEYS.length} claves de API configuradas`);

let current = 0;
const pickKey = () => KEYS[current++ % KEYS.length];

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Back‑off mínimo para no disparar 429 en cascada
app.use(rateLimit({ windowMs: 60_000, max: 600 }));

app.all("/v1beta/*", async (req, res) => {
  try {
    const key = pickKey();
    console.log(
      `[${new Date().toISOString()}] Usando clave API: ${key.slice(
        0,
        5
      )}...${key.slice(-5)}`
    );
    const url = new URL(
      `https://generativelanguage.googleapis.com${req.originalUrl}`
    );
    url.searchParams.set("key", key);

    const upstream = await axios({
      method: req.method,
      url: url.toString(),
      headers: { ...req.headers, host: undefined },
      data: req.body,
      responseType: "stream",
      validateStatus: () => true,
    });

    res.status(upstream.status);
    for (const [h, v] of Object.entries(upstream.headers)) {
      if (["transfer-encoding", "content-length"].includes(h.toLowerCase()))
        continue;
      res.setHeader(h, v as string);
    }

    upstream.data.pipe(res);
  } catch (err: any) {
    console.error("Proxy error:", err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

const PORT = process.env.PORT || 8765;
app.listen(PORT, () => console.log(`Proxy LLM en :${PORT}`));

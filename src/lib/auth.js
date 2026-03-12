const COOKIE_NAME = "admin_session";

function toBase64Url(bytes) {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function getKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing in .env.local");
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signValue(value) {
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(username) {
  const payload = {
    username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  const payloadString = JSON.stringify(payload);
  const payloadEncoded = toBase64Url(new TextEncoder().encode(payloadString));
  const signature = await signValue(payloadEncoded);

  return `${payloadEncoded}.${signature}`;
}

export async function verifySessionToken(token) {
  try {
    if (!token) return null;

    const [payloadEncoded, signature] = token.split(".");
    if (!payloadEncoded || !signature) return null;

    const expectedSignature = await signValue(payloadEncoded);
    if (signature !== expectedSignature) return null;

    const payloadBytes = fromBase64Url(payloadEncoded);
    const payloadString = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadString);

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
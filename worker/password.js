// Password hashing with PBKDF2-HMAC-SHA256 via WebCrypto, so the exact same
// code runs in the Worker (verify) and in Node (scripts/create-admin.mjs).
//
// 100,000 iterations is the most Cloudflare Workers' PBKDF2 allows. The format
// stores the algorithm and iteration count, so hashes can be upgraded later:
//   pbkdf2-sha256$<iterations>$<salt base64>$<hash base64>

const ALGO = "pbkdf2-sha256";
const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

const toB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const fromB64 = (str) => Uint8Array.from(atob(str), (ch) => ch.charCodeAt(0));

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password.normalize("NFKC")),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    HASH_BYTES * 8,
  );
  return new Uint8Array(bits);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, ITERATIONS);
  return `${ALGO}$${ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

export async function verifyPassword(password, stored) {
  const [algo, iterStr, saltB64, hashB64] = String(stored).split("$");
  const iterations = Number(iterStr);
  if (algo !== ALGO || !Number.isInteger(iterations) || iterations < 1 || iterations > ITERATIONS) {
    return false;
  }
  const expected = fromB64(hashB64);
  const actual = await derive(password, fromB64(saltB64), iterations);
  return timingSafeEqual(actual, expected);
}

// Used when the username doesn't exist, so a wrong username takes as long as a
// wrong password and response timing doesn't reveal which usernames are real.
let dummyHash;
export async function burnPasswordCheck(password) {
  dummyHash ??= await hashPassword(crypto.randomUUID());
  await verifyPassword(password, dummyHash);
  return false;
}

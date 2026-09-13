import crypto from "crypto";

// Better Auth ka format
function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const N = 16384;
    const r = 16;
    const p = 1;
    const dkLen = 64;
    const salt = crypto.randomBytes(16);
    
    crypto.scrypt(
      password.normalize("NFKC"),
      salt,
      dkLen,
      { N, r, p, maxmem: 128 * N * r * 2 },
      (err, key) => {
        if (err) return reject(err);
        resolve(`${salt.toString("hex")}:${key.toString("hex")}`);
      }
    );
  });
}

// Verify function
function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve) => {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) return resolve(false);
    
    const salt = Buffer.from(saltHex, "hex");
    const expectedHash = Buffer.from(hashHex, "hex");
    
    const N = 16384;
    const r = 16;
    const p = 1;
    const dkLen = 64;
    
    crypto.scrypt(
      password.normalize("NFKC"),
      salt,
      dkLen,
      { N, r, p, maxmem: 128 * N * r * 2 },
      (err, key) => {
        if (err) return resolve(false);
        resolve(crypto.timingSafeEqual(expectedHash, key));
      }
    );
  });
}

async function test() {
  const password = "test123456";
  
  // Naya hash banao
  const hash = await hashPassword(password);
  console.log("New hash:", hash);
  console.log("Length:", hash.length);
  
  // Verify karo
  const valid = await verifyPassword(password, hash);
  console.log("Verify:", valid);
  
  // Existing hash test karo (DB se copy karo)
  const existingHash = "f9d086fb177b9c559d61eec077ed631e:e49f15b1e6f84a562151398126d01fe497e58ed75478fd9..."; // Full copy
  const existingValid = await verifyPassword("user-password", existingHash);
  console.log("Existing verify:", existingValid);
}

test();
import crypto from "crypto";

// Box 2 password hash from backend
const box2Hash =
  "b6edca7adf1a569634dffeee2240ea7bcebdb4b2cc6291c5a1103b9944f68eda";

// Try common codes
const testCodes = [
  "1234",
  "0000",
  "1111",
  "2222",
  "3333",
  "4444",
  "5555",
  "6666",
  "7777",
  "8888",
  "9999",
  "test",
  "admin",
  "pass",
  "code",
  "lock",
  "12345",
  "00000",
  "11111",
];

console.log("Testing codes for Box 2 (target hash: " + box2Hash + "):\n");

testCodes.forEach((code) => {
  const hashed = crypto.createHash("sha256").update(code).digest("hex");
  const match = hashed === box2Hash ? " ✓ MATCH!" : "";
  console.log(`${code.padEnd(10)} -> ${hashed}${match}`);
});

// Try numeric sequences
console.log("\nTrying 4-digit numeric sequences:");
for (let i = 0; i <= 100; i++) {
  const code = String(i).padStart(4, "0");
  const hashed = crypto.createHash("sha256").update(code).digest("hex");
  if (hashed === box2Hash) {
    console.log(`FOUND: ${code} -> ${hashed}`);
  }
}

console.log("\nDone.");

import { generateApiKey, hashApiKey } from "@/lib/api-keys";
import { createHash } from "crypto";

describe("generateApiKey()", () => {
  it("returns a key prefixed with rpk_", () => {
    const { rawKey } = generateApiKey();
    expect(rawKey.startsWith("rpk_")).toBe(true);
  });

  it("returns a prefix that is the first 12 characters of the raw key", () => {
    const { rawKey, prefix } = generateApiKey();
    expect(prefix).toBe(rawKey.slice(0, 12));
  });

  it("returns a hash matching sha256 of the raw key", () => {
    const { rawKey, hash } = generateApiKey();
    expect(hash).toBe(createHash("sha256").update(rawKey).digest("hex"));
  });

  it("generates unique keys on each call", () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a.rawKey).not.toBe(b.rawKey);
  });
});

describe("hashApiKey()", () => {
  it("matches the hash produced at generation time", () => {
    const { rawKey, hash } = generateApiKey();
    expect(hashApiKey(rawKey)).toBe(hash);
  });

  it("is deterministic", () => {
    expect(hashApiKey("rpk_fixed_value")).toBe(hashApiKey("rpk_fixed_value"));
  });
});

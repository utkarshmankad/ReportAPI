describe("getSiteUrl()", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns NEXT_PUBLIC_SITE_URL when set", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://reportapi.io";
    const { getSiteUrl } = await import("@/lib/site-url");
    expect(getSiteUrl()).toBe("https://reportapi.io");
  });

  it("falls back to VERCEL_URL when NEXT_PUBLIC_SITE_URL is unset", async () => {
    process.env.VERCEL_URL = "reportapi-git-develop.vercel.app";
    const { getSiteUrl } = await import("@/lib/site-url");
    expect(getSiteUrl()).toBe("https://reportapi-git-develop.vercel.app");
  });

  it("falls back to localhost when neither is set", async () => {
    const { getSiteUrl } = await import("@/lib/site-url");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("prefers NEXT_PUBLIC_SITE_URL over VERCEL_URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://reportapi.io";
    process.env.VERCEL_URL = "reportapi-git-develop.vercel.app";
    const { getSiteUrl } = await import("@/lib/site-url");
    expect(getSiteUrl()).toBe("https://reportapi.io");
  });
});

// env.test.js

describe("Environment Variables", () => {
  it("should have NEXT_PUBLIC_SUPABASE_URL defined", () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
  });

  it("should have NEXT_PUBLIC_SUPABASE_ANON_KEY defined", () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
  });

  it("should have NEXT_PUBLIC_NFT_BASE_URI defined", () => {
    expect(process.env.NEXT_PUBLIC_NFT_BASE_URI).toBeDefined();
  });
});

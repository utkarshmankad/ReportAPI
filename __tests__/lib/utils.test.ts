import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("returns an empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("joins multiple classes with a space", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("handles conditional object syntax", () => {
    expect(cn({ active: true, hidden: false })).toBe("active");
  });

  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles array inputs", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("handles nested arrays and objects", () => {
    expect(cn(["foo", { bar: true }])).toBe("foo bar");
  });
});

import { describe, expect, it } from "vitest";
import { parseGithubUrl } from "./githubParser";

describe("parseGithubUrl", () => {
  it("parses https URLs", () => {
    expect(parseGithubUrl("https://github.com/facebook/react")).toEqual({
      owner: "facebook",
      repo: "react",
    });
  });

  it("strips .git suffix", () => {
    expect(parseGithubUrl("https://github.com/vercel/next.js.git")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("parses ssh URLs", () => {
    expect(parseGithubUrl("git@github.com:tanstack/router.git")).toEqual({
      owner: "tanstack",
      repo: "router",
    });
  });

  it("parses owner/repo shorthand", () => {
    expect(parseGithubUrl("microsoft/typescript")).toEqual({
      owner: "microsoft",
      repo: "typescript",
    });
  });

  it("returns null for empty input", () => {
    expect(parseGithubUrl("")).toBeNull();
    expect(parseGithubUrl("   ")).toBeNull();
  });

  it("returns null for non-github URLs", () => {
    expect(parseGithubUrl("https://gitlab.com/foo/bar")).toBeNull();
  });

  it("returns null for malformed URLs", () => {
    expect(parseGithubUrl("https://github.com/onlyowner")).toBeNull();
  });
});
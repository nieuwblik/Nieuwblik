import { describe, expect, test } from "bun:test";
import { berekenIndicatie } from "../src/lib/kostenCalculator";

describe("kosten calculator", () => {
  test("kleine website start bij 990 euro", () => {
    expect(berekenIndicatie("starter", []).van).toBe(990);
  });
  test("complete website start bij 1990 euro", () => {
    expect(berekenIndicatie("professional", []).van).toBe(1990);
  });
  test("webshop start bij 2990 euro", () => {
    expect(berekenIndicatie("webshop", []).van).toBe(2990);
  });
  test("extra's tellen op en dubbele extra's tellen één keer", () => {
    expect(berekenIndicatie("starter", ["teksten", "teksten", "logo"]).van).toBe(990 + 250 + 300);
  });
});

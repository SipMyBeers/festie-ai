import { describe, it, expect } from "vitest";
import { generateResponse } from "../responder";

describe("SMS Responder - Rule-based", () => {
  it("responds to greeting", () => {
    expect(generateResponse("hey")).toContain("guide");
  });

  it("responds to help", () => {
    expect(generateResponse("help")).toContain("help with");
  });

  it("finds Sabrina Carpenter by name", () => {
    expect(generateResponse("when is Sabrina Carpenter?")).toContain("Coachella Stage");
  });

  it("finds Anyma by name", () => {
    expect(generateResponse("what time is anyma")).toContain("Sahara");
  });

  it("shows friday schedule", () => {
    expect(generateResponse("friday schedule")).toContain("Schedule");
  });

  it("shows saturday schedule", () => {
    expect(generateResponse("saturday lineup")).toContain("Schedule");
  });

  it("answers parking FAQ", () => {
    expect(generateResponse("where do i park?").toLowerCase()).toContain("parking");
  });

  it("answers weather FAQ", () => {
    expect(generateResponse("is it gonna be hot?")).toContain("85-100");
  });

  it("answers prohibited items FAQ", () => {
    expect(generateResponse("can i bring a camera?")).toContain("professional cameras");
  });

  it("finds water stations", () => {
    expect(generateResponse("where can i get water").toLowerCase()).toContain("water");
  });

  it("finds restrooms", () => {
    expect(generateResponse("where is the nearest bathroom").toLowerCase()).toContain("restroom");
  });

  it("finds food options", () => {
    expect(generateResponse("im hungry").toLowerCase()).toContain("food");
  });

  it("returns fallback for unknown input", () => {
    expect(generateResponse("xyzzy gibberish")).toContain("not sure");
  });
});

import { describe, expect, it } from "vitest";
import { getOverlayContent } from "./guess-overlay";

describe("getOverlayContent", () => {
  it("fills the guess to the same length as hint", () => {
    expect(getOverlayContent("switc", "__i___")).toBe("switc‎");
    expect(getOverlayContent("switch", "__i___")).toBe("switch");
    expect(getOverlayContent("switchh", "__i___")).toBe("switch");
  });

  it("overrides revealed hint with the guess", () => {
    expect(getOverlayContent("swatch", "__i___")).toBe("swatch");
    expect(getOverlayContent("glock", "__ü__")).toBe("glock");
  });

  it("inserts missing spaces in the guess", () => {
    expect(getOverlayContent("hotchocolate", "___ _________")).toBe("hot chocolate");
    expect(getOverlayContent("hot chocolate", "___ _________")).toBe("hot chocolate");
    expect(getOverlayContent("potofgold", "___ __ ____")).toBe("pot of gold");
    expect(getOverlayContent("pot ofgold", "___ __ ____")).toBe("pot of gold");
    expect(getOverlayContent("pot of gold", "___ __ ____")).toBe("pot of gold");
  });

  it("ignores spaces and dashes in the guess", () => {
    expect(getOverlayContent("abs", "___")).toBe("abs");
    expect(getOverlayContent(" abs ", "___")).toBe("abs");
    expect(getOverlayContent("a b s", "___")).toBe("abs");
    expect(getOverlayContent("hot-chocolate", "___ _________")).toBe("hot chocolate");
    expect(getOverlayContent("hot   chocolate", "___ _________")).toBe("hot chocolate");
    expect(getOverlayContent("h-o-t-chocolate", "___ _________")).toBe("hot chocolate");
    expect(getOverlayContent("saut à l élastique", "____ _ ___________")).toBe("saut à lélastique‎");
  });

  it("does not ignore apostrophe in the guess", () => {
    expect(getOverlayContent("saut à l'élastique", "____ _ ___________")).toBe("saut à l'élastique");
  });

  it("preserves casing from the guess", () => {
    expect(getOverlayContent("Abs", "___")).toBe("Abs");
    expect(getOverlayContent("ABS", "___")).toBe("ABS");
  });

  it("preserves casing from the hint", () => {
    expect(getOverlayContent("kungfu", "K___ F_")).toBe("Kung Fu");
    expect(getOverlayContent("äquator", "Ä______")).toBe("Äquator");
  });

  it("preserves diacritics from the hint", () => {
    expect(getOverlayContent("gluck", "__ü__")).toBe("glück");
    expect(getOverlayContent("seche cheveux", "_è___-_______")).toBe("sèche-cheveux");
    expect(getOverlayContent("aquator", "Ä______")).toBe("Äquator");
    expect(getOverlayContent("aouaaceeeeiiouuynaiouacenszz", "äöüàâçéèêëîïôûùÿñáíóúąćęńśżź")).toBe("äöüàâçéèêëîïôûùÿñáíóúąćęńśżź");
  });

  it("does not convert ł to l", () => {
    // skribbl does not accept "l" in place of "ł" for some reason
    expect(getOverlayContent("zolty", "żółty")).toBe("żólty");
  });
});

/**
 * wordlist for manual testing
 * switch,hot chocolate,T-shirt,Mr. Bean,skribbl.io,Löwe,Öl,CO2,Strauß,cámara fotográfica,saut à l"élastique,sèche-cheveux,żółć,T-rex,AC/DC,äöüàâçéèêëîïôûùÿñáíóúąćęńśżź
 */

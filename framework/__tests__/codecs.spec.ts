import { URLFromString } from "@framework/codecs";
import * as E from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";

describe("Codecs", () => {
  describe("URLFromString", () => {
    it("is", () => {
      const T = URLFromString;

      expect(
        T.is(new URL("https://gcanti.github.io/io-ts-types/"))
      ).toBeTruthy();
      expect(T.is(new URL("ftp://gcanti.github.io/io-ts-types/"))).toBeTruthy();
      expect(T.is("")).toBeFalsy();
      expect(T.is("/invalid")).toBeFalsy();
      expect(T.is(null)).toBeFalsy();
    });

    it("decodes", () => {
      const T = URLFromString;

      expect(T.decode("https://gcanti.github.io/io-ts-types/")).toEqual(
        E.right(new URL("https://gcanti.github.io/io-ts-types/"))
      );
      expect(PathReporter.report(T.decode("/invalid"))).toMatchInlineSnapshot(`
Array [
  "Invalid value \\"/invalid\\" supplied to : url",
]
`);
      expect(PathReporter.report(T.decode(""))).toMatchInlineSnapshot(`
Array [
  "Invalid value \\"\\" supplied to : url",
]
`);
    });

    it("encodes", () => {
      const T = URLFromString;
      expect(
        T.encode(new URL("https://gcanti.github.io/io-ts-types/"))
      ).toEqual("https://gcanti.github.io/io-ts-types/");
    });
  });
});

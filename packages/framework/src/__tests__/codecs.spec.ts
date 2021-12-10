import { URLFromString, withDefault } from "@framework/codecs";
import * as E from "fp-ts/Either";
import * as t from "io-ts";
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

  describe("withDefault", () => {
    it("is", () => {
      const T = withDefault(t.string, "default");

      expect(T.is("Hello world")).toBeTruthy();
      expect(T.is("")).toBeTruthy();
      expect(T.is(123)).toBeFalsy();
    });

    it("decodes", () => {
      const T = withDefault(t.string, "default");

      expect(T.decode("Hello world")).toEqual(E.right("Hello world"));
      expect(T.decode(null)).toEqual(E.right("default"));
      expect(T.decode(undefined)).toEqual(E.right("default"));
      expect(PathReporter.report(T.decode(123))).toMatchInlineSnapshot(`
Array [
  "Invalid value 123 supplied to : withDefault(string, \\"default\\")",
]
`);
    });

    it("encodes", () => {
      const T = withDefault(t.string, "default");
      expect(T.encode("Hello world")).toEqual("Hello world");
    });
  });
});

import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as t from "io-ts";

export type URLFromStringC = t.Type<typeof URL, string, unknown>;

export const URLFromString = new t.Type<URL, string, unknown>(
  "url",
  (input: unknown): input is URL => input instanceof URL,
  (input, context) =>
    pipe(
      t.string.validate(input, context),
      E.chain((eURL) => {
        try {
          return t.success(new URL(eURL));
        } catch (e) {
          return t.failure(input, context);
        }
      })
    ),
  String
);

export function withDefault<T extends t.Any>(
  type: T,
  defaultValue: t.TypeOf<T>
): t.Type<t.InputOf<T>, t.TypeOf<T>> {
  return new t.Type(
    `withDefault(${type.name}, ${JSON.stringify(defaultValue)})`,
    type.is,
    (v, c) => type.validate(v != null ? v : defaultValue, c),
    type.encode
  );
}

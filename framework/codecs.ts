import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";

export interface URLFromStringC extends t.Type<typeof URL, string, unknown> {}

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

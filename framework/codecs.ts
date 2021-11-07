import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import * as t from "io-ts";

export const URLCodec = new t.Type<URL, string, unknown>(
  "url",
  (input: unknown): input is URL => input instanceof URL,
  (input, context) => {
    if (input instanceof URL) return t.success(input);
    return pipe(
      t.string.validate(input, context),
      E.chain((s) => {
        try {
          return t.success(new URL(s));
        } catch (e) {
          return t.failure(input, context);
        }
      })
    );
  },
  (url) => url.toString()
);

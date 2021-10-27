import * as t from "io-ts";

export const URLCodec = new t.Type<URL, URL, unknown>(
  "url",
  (input: unknown): input is URL => input instanceof URL,
  (input, context) =>
    input instanceof URL ? t.success(input) : t.failure(input, context),
  t.identity
);

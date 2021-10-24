import { fetch as crossFetch } from "cross-fetch";
import * as t from "io-ts";

import * as E from "fp-ts/lib/Either";
import * as TE from "fp-ts/lib/TaskEither";

import { ValidationError } from "io-ts";
import { failure } from "io-ts/lib/PathReporter";
import { flow, pipe } from "fp-ts/lib/function";

/** Error handling */

export type NetworkError = {
  _tag: "NETWORK_ERROR";
  error: Error;
};
export const toNetworkError = (error: unknown | Error): NetworkError => ({
  _tag: "NETWORK_ERROR",
  error: error instanceof Error ? error : E.toError(error),
});

export type ParserError = {
  _tag: "PARSER_ERROR";
  error: Error;
};
export const toParserError = (error: unknown | Error): ParserError => ({
  _tag: "PARSER_ERROR",
  error: error instanceof Error ? error : E.toError(error),
});

export type ResponseError = {
  _tag: "RESPONSE_ERROR";
  error: Error;
  response: Response;
};
export const toResponseError =
  (response: Response) =>
  (error: Error | unknown): ResponseError => ({
    _tag: "RESPONSE_ERROR",
    error: error instanceof Error ? error : E.toError(JSON.stringify(error)),
    response,
  });

export type DecodingError = {
  _tag: "DECODING_ERROR";
  error: Error;
};
export const toDecodingError = (
  error: ValidationError[] | Error
): FetchError => ({
  _tag: "DECODING_ERROR",
  error: error instanceof Error ? error : new Error(failure(error).join("\n")),
});

export type NotFound = {
  _tag: "NOT_FOUND";
  error: Error;
};
export const toNotFound = (error: unknown | Error): NotFound => ({
  _tag: "NOT_FOUND",
  error: error instanceof Error ? error : E.toError(error),
});

export type FetchError =
  | NetworkError
  | ParserError
  | ResponseError
  | DecodingError
  | NotFound;

/** Request handling */

function onSuccess<T>(response: Response): TE.TaskEither<FetchError, T> {
  return TE.tryCatch(() => response.json(), toParserError);
}

function onFailure(response: Response): TE.TaskEither<FetchError, never> {
  return pipe(
    TE.tryCatch(
      () => response.json().then(toResponseError(response)),
      toResponseError(response)
    ),
    TE.chain(TE.left)
  );
}

const customFetch = <Codec>(decoder: t.Type<Codec>) => {
  return (url: URL, init?: RequestInit): TE.TaskEither<FetchError, Codec> =>
    pipe(
      TE.tryCatch(() => crossFetch(url.toString(), init), toNetworkError),
      TE.chain((response: Response) =>
        response.ok ? onSuccess(response) : onFailure(response)
      ),
      TE.chain<FetchError, unknown, Codec>(
        flow(decoder.decode, E.mapLeft(toDecodingError), TE.fromEither)
      )
    );
};

export default customFetch;

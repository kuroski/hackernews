import { fetch as crossFetch } from "cross-fetch";
import * as t from "io-ts";

import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

import { failure } from "io-ts/lib/PathReporter";
import { flow, pipe } from "fp-ts/function";

// #region Error handling

export type NetworkError = {
  _tag: "NETWORK_ERROR";
  error: Error;
};
export const toNetworkError = (error: unknown | Error): FetchError => ({
  _tag: "NETWORK_ERROR",
  error: error instanceof Error ? error : E.toError(error),
});

export type ParserError = {
  _tag: "PARSER_ERROR";
  error: Error;
};
export const toParserError = (error: unknown | Error): FetchError => ({
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
  (error: Error | unknown): FetchError => ({
    _tag: "RESPONSE_ERROR",
    error: error instanceof Error ? error : E.toError(JSON.stringify(error)),
    response,
  });

export type DecodingError = {
  _tag: "DECODING_ERROR";
  error: Error;
};
export const toDecodingError = (error: t.Errors | Error): FetchError => ({
  _tag: "DECODING_ERROR",
  error: error instanceof Error ? error : new Error(failure(error).join("\n")),
});

export type NotFound = {
  _tag: "NOT_FOUND";
  error: Error;
};
export const toNotFound = (error: unknown | Error): FetchError => ({
  _tag: "NOT_FOUND",
  error: error instanceof Error ? error : E.toError(error),
});

export const fetchErrorToString = (error: FetchError): string =>
  error.error.message;

export type FetchError =
  | NetworkError
  | ParserError
  | ResponseError
  | DecodingError
  | NotFound;

// #endregion

// #region Request handling

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

const customFetch = <Codec extends t.Mixed>(decoder: Codec) => {
  return (request: URL, init?: RequestInit) =>
    pipe(
      TE.tryCatch(() => crossFetch(request.toString(), init), toNetworkError),
      TE.chain((response) =>
        response.ok ? onSuccess(response) : onFailure(response)
      ),
      TE.chain(flow(decoder.decode, E.mapLeft(toDecodingError), TE.fromEither))
    );
};

// #endregion

// #region Operators

/**
 * Maps a decoded response into another decoded
 * This function is useful when your API response
 * is different from what you want to use in your application
 */
export const mapTDecoded = <T, R>(
  transformFn: (_tcodec: T) => E.Either<t.Errors, R>
) =>
  TE.chain<FetchError, T, R>(
    flow(transformFn, E.mapLeft(toDecodingError), TE.fromEither)
  );
// #endregion

export default customFetch;

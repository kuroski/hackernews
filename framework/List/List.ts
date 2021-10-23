import * as t from "io-ts";
import * as E from "fp-ts/Either";

export interface ListIdBrand {
  readonly ListId: unique symbol;
}

export const ListId = t.brand(
  t.Int,
  (id: t.Int): id is t.Branded<t.Int, ListIdBrand> => id >= 0,
  "ListId"
);
export type ListId = t.TypeOf<typeof ListId>;

export const List = t.readonlyArray(ListId);
export type List = t.TypeOf<typeof List>;

export const TList = t.array(t.number);
export type TList = t.TypeOf<typeof TList>;

export const fromTList = (tlist: TList): E.Either<t.Errors, List> =>
  List.decode(tlist);

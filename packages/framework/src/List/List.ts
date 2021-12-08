import * as t from "io-ts";
import * as E from "fp-ts/Either";

export interface ListIdBrand {
  readonly ListId: unique symbol;
}

const ListId = t.brand(
  t.Int,
  (id: t.Int): id is t.Branded<t.Int, ListIdBrand> => id >= 0,
  "ListId"
);
export type ListId = t.TypeOf<typeof ListId>;

const List = t.readonlyArray(ListId);
export type List = t.TypeOf<typeof List>;

export const empty: List = [];

// #region Api response data type

export const TListItem = t.number;
export type TListItem = t.TypeOf<typeof TListItem>;

export const TList = t.array(TListItem);
export type TList = t.TypeOf<typeof TList>;

export const fromTListItem = (
  tlistItem: TListItem
): E.Either<t.Errors, ListId> => ListId.decode(tlistItem);

export const fromTList = (tlist: TList): E.Either<t.Errors, List> =>
  List.decode(tlist);

//#endregion

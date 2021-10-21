import { brand, Branded, Int, TypeOf } from "io-ts";

export interface ListIdBrand {
  readonly ListId: unique symbol;
}

export const ListId = brand(
  Int,
  (id: Int): id is Branded<Int, ListIdBrand> => id >= 0,
  "ListId"
);

export type ListId = TypeOf<typeof ListId>;

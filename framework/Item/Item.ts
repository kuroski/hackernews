import { brand, Branded, Int, TypeOf } from "io-ts";

export interface ItemIdBrand {
  readonly ItemId: unique symbol;
}

export const ItemId = brand(
  Int,
  (id: Int): id is Branded<Int, ItemIdBrand> => id >= 0,
  "ItemId"
);

export type ItemId = TypeOf<typeof ItemId>;

type ItemJob = {
  readonly _tag: "ItemJob";
  readonly id: ItemId;
  readonly title: string;
};

type ItemStory = {
  readonly _tag: "ItemStory";
  readonly id: ItemId;
  readonly title: string;
  readonly text: string;
  readonly url: URL;
};

export type Item = ItemJob | ItemStory;

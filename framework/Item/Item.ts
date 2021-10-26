import * as t from "io-ts";

interface ItemIdBrand {
  readonly ItemId: unique symbol;
}

export const ItemId = t.brand(
  t.Int,
  (id: t.Int): id is t.Branded<t.Int, ItemIdBrand> => id >= 0,
  "ItemId"
);

export type ItemId = t.TypeOf<typeof ItemId>;

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

// #region Api response data type

export const TItemStory = t.type({
  id: t.number,
  title: t.string,
  text: t.string,
  url: t.string,
});
export type TItemStory = t.TypeOf<typeof TItemStory>;

//#endregion

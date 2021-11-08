import * as t from "io-ts";
import * as tt from "io-ts-types";
import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/Either";
import { URLFromString } from "@framework/codecs";

interface ItemIdBrand {
  readonly ItemId: unique symbol;
}

const ItemId = t.brand(
  t.Int,
  (id: t.Int): id is t.Branded<t.Int, ItemIdBrand> => id >= 0,
  "ItemId"
);

export type ItemId = t.TypeOf<typeof ItemId>;

const ItemStory = t.type({
  _tag: t.literal("ItemStory"),
  id: t.readonly(ItemId),
  title: t.readonly(tt.optionFromNullable(t.string)),
  // text: t.readonly(tt.optionFromNullable(t.string)),
  url: t.readonly(URLFromString),
});

export type ItemStory = t.TypeOf<typeof ItemStory>;

export type Item = ItemStory;

// #region Api response data type

export const TItemStory = t.strict({
  id: t.number,
  title: t.string,
  url: t.string,
});
export type TItemStory = t.TypeOf<typeof TItemStory>;

export const fromTItemStory = (
  tlistItem: TItemStory
): E.Either<t.Errors, ItemStory> => {
  return ItemStory.decode({
    _tag: "ItemStory",
    ...tlistItem,
  });
};

//#endregion

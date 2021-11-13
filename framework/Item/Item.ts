import * as t from "io-ts";
import * as tt from "io-ts-types";
import * as E from "fp-ts/Either";
import { URLFromString } from "@framework/codecs";
import { TList } from "@framework/List";

// #region Id brand
interface ItemIdBrand {
  readonly ItemId: unique symbol;
}

const ItemId = t.brand(
  t.Int,
  (id: t.Int): id is t.Branded<t.Int, ItemIdBrand> => id >= 0,
  "ItemId"
);

export type ItemId = t.TypeOf<typeof ItemId>;
//#endregion

const ItemStory = t.strict({
  _tag: t.literal("ItemStory"),
  id: t.readonly(ItemId),
  by: t.readonly(t.string),
  title: t.readonly(tt.option(t.string)),
  text: t.readonly(tt.option(t.string)),
  url: t.readonly(URLFromString),
  kids: t.readonlyArray(ItemId),
});

export type ItemStory = t.TypeOf<typeof ItemStory>;

const ItemJob = t.strict({
  _tag: t.literal("ItemJob"),
  id: t.readonly(ItemId),
  by: t.readonly(t.string),
  title: t.readonly(tt.option(t.string)),
  text: t.readonly(tt.option(t.string)),
  url: t.readonly(URLFromString),
});

export type ItemJob = t.TypeOf<typeof ItemJob>;

export type Item = ItemStory | ItemJob;

// #region Api response data type
export const TItemStory = t.strict({
  type: t.literal("story"),
  id: t.number,
  by: t.string,
  title: tt.optionFromNullable(t.string),
  text: tt.optionFromNullable(t.string),
  url: t.string,
  kids: TList,
});
export type TItemStory = t.TypeOf<typeof TItemStory>;

export const TItemJob = t.strict({
  type: t.literal("job"),
  id: t.number,
  by: t.string,
  title: tt.optionFromNullable(t.string),
  text: tt.optionFromNullable(t.string),
  url: t.string,
});
export type TItemJob = t.TypeOf<typeof TItemJob>;

export const TItem = t.union([TItemStory, TItemJob]);
export type TItem = t.TypeOf<typeof TItem>;

export const fromTItem = (tlistItem: TItem): E.Either<t.Errors, Item> => {
  switch (tlistItem.type) {
    case "story":
      return ItemStory.decode({
        _tag: "ItemStory",
        ...tlistItem,
      });

    case "job":
      return ItemJob.decode({
        _tag: "ItemJob",
        ...tlistItem,
      });
  }
};
//#endregion

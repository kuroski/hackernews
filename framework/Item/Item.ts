import { Prism } from "monocle-ts";
import * as t from "io-ts";
import * as tt from "io-ts-types";
import * as E from "fp-ts/Either";
import { Eq, fromEquals } from "fp-ts/lib/Eq";
import { URLFromString, withDefault } from "@framework/codecs";
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
  url: t.readonly(tt.option(URLFromString)),
  kids: t.readonlyArray(ItemId),
});

export type ItemStory = t.TypeOf<typeof ItemStory>;

const ItemJob = t.strict({
  _tag: t.literal("ItemJob"),
  id: t.readonly(ItemId),
  by: t.readonly(t.string),
  title: t.readonly(tt.option(t.string)),
  text: t.readonly(tt.option(t.string)),
  url: t.readonly(tt.option(URLFromString)),
});

export type ItemJob = t.TypeOf<typeof ItemJob>;

export type Item = ItemStory | ItemJob;

// #region instances

export const _ItemStory: Prism<Item, Item> = Prism.fromPredicate(
  (s) => s._tag === "ItemStory"
);

export const _ItemJob: Prism<Item, Item> = Prism.fromPredicate(
  (s) => s._tag === "ItemJob"
);

export function getEq(): Eq<Item> {
  return fromEquals((x, y) => {
    if (x._tag === "ItemStory" && y._tag === "ItemStory") {
      return true;
    }
    if (x._tag === "ItemJob" && y._tag === "ItemJob") {
      return true;
    }
    return false;
  });
}
//#endregion

// #region destructors
export function fold<R>(
  onItemStory: (story: ItemStory) => R,
  onItemJob: (job: ItemJob) => R
): (fa: Item) => R {
  return (fa) => {
    switch (fa._tag) {
      case "ItemStory":
        return onItemStory(fa);
      case "ItemJob":
        return onItemJob(fa);
    }
  };
}
//#endregion

// #region Api response data type
export const TItemStory = t.strict({
  type: t.literal("story"),
  id: t.number,
  by: t.string,
  title: tt.optionFromNullable(t.string),
  text: tt.optionFromNullable(t.string),
  url: tt.optionFromNullable(t.string),
  kids: withDefault(TList, []),
});
export type TItemStory = t.TypeOf<typeof TItemStory>;

export const TItemJob = t.strict({
  type: t.literal("job"),
  id: t.number,
  by: t.string,
  title: tt.optionFromNullable(t.string),
  text: tt.optionFromNullable(t.string),
  url: tt.optionFromNullable(t.string),
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

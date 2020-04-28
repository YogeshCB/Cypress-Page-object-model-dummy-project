import creativesListPack from "./list";
import Chat from "../../../../lib/chat";
import services from "../../../../services";

export const getVisibleFilterSet = (filters = []) =>
  filters.reduce((acc, { id, visibility = true, showFiltersTab = false }) => {
    (visibility || showFiltersTab) && acc.add(id);
    return acc;
  }, new Set());

export const getOpenedCreative = () => {
  const { selected = [], results } = creativesListPack.resolvers.getListData();
  const [openedCreativeIndex] = selected;
  return results[openedCreativeIndex];
};

export const allMessagesConsumed = (dispatch, creativeId, clearMentions = true) => {
  clearMentions &&
  services.chat.clearMentions().send({
    creativeId
  });
  dispatch(creativesListPack.actions.rowChange({
    id: creativeId,
    data: {
      unreadChatCount: 0
    }
  }));
  return Chat.getInstance().allMessagesConsumed();
};

export const isEqual = (value, other) => {
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  let valueLen = type === "[object Array]" ? value.length : Object.keys(value).length;
  let otherLen = type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  let compare = function (item1, item2) {
    let itemType = Object.prototype.toString.call(item1);
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false;
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  if (type === "[object Array]") {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  return true;
};

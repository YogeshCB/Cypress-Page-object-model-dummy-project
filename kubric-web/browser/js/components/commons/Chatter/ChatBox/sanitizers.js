import { isNull, isUndefined } from "@bit/kubric.utils.common.lodash";

export const getMentionRegex = (withGroups = true) => {
  const groupPrefix = !withGroups ? "?:" : "";
  return new RegExp(`(?:<span.*?data\\-value=\"(${groupPrefix}.*?)\">(${groupPrefix}(?:.+?))<\\/span>)`, "g");
};

const mentionRegex = getMentionRegex();
export const placeHolderRegex = /(?:<span.*?data\-type="placeholder".*?>(.*)<\/span>)/;


const clearBreak = html => html.replace(/^<br>$/, '');
/**
 * Removes placeholder tag from the html if it is the first character entered in the box
 */
export const clearPlaceHolder = (html, { expectedPlaceholder } = {}) => {
  const match = html.match(placeHolderRegex);
  return (isUndefined(expectedPlaceholder) || isNull(match) || match[1] === expectedPlaceholder) ? html : match[1].replace(expectedPlaceholder, "");
};

/**
 * If the message starts with a tag and the user clears the text till the start. Now whatever the user types will
 * be enclosed in a font tag auto inserted by the contentEditable div. This needs to be removed otherwise the
 * text will come in blue color like a tag
 */
const clearFontTag = html => html.replace(/<font(?:.*?)>(.*?)<\/font>/, "$1");

/**
 * If backspace is pressed on a tag, it is no more a tag. It should be reverted to a normal text
 */
const validateTags = html => {
  return html.replace(mentionRegex, (match, p1, p2) => {
    if (p1 === p2) {
      //tag matches value
      return match;
    } else if (p2.length < p1.length) {
      //tag length is less that expected value length. This means that part of the tag has been deleted and is
      //no longer fit to be a tag. Return tag span content as normal text
      return p2;
    } else {
      //If tag content is found to be longer than the expected tag value. This means that something new has
      //been added to the end of the tag
      const startEx = new RegExp(`^${p1}(.*)`);
      const endEx = new RegExp(`^(.*?)${p1}`);
      const startMatch = p2.match(startEx);
      const endMatch = p2.match(endEx);
      if (!isNull(startMatch)) {
        //If the original tag content is found intact at the beginning of the tag string, that part is
        //converted to a tag and the rest is passed back as normal text
        const { 1: afterTagContent } = startMatch;
        return `${match.replace(/>(?:.*)</, `>${p1}<`)}${afterTagContent}`;
      } else if (!isNull(endMatch)) {
        //If the original tag content is found intact at the end of the tag string, that part is
        //converted to a tag and the rest is passed back as normal text
        const { 1: beforeTagContent } = endMatch;
        return `${beforeTagContent}${match.replace(/>(?:.*)</, `>${p1}<`)}`;

      } else {
        //If the original tag content is not found, then the entire string is passed back as normal text
        return p2;
      }
    }
  });
};

export const sanitizers = [
  clearBreak,
  clearPlaceHolder,
  clearFontTag,
  validateTags
];

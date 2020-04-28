import { h } from 'preact';

const mentionTypes = {
  "user": "@"
};

export const getMention = ({ value = {}, styler, addLeadingSpace = false }) => {
  const { name, type = "user", id = "" } = value;
  const mentionText = `${mentionTypes[type]}${name}`;
  return (
    `${addLeadingSpace ? "&nbsp;" : ''}` +
    `<span class="${styler.get("tag")}" data-id="${id}" data-value="${mentionText}">${mentionText}</span>` +
    `&nbsp;`
  );
};
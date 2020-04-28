export default {
  'episode': {
    restrictedFields: ['enabled', 'editorspick', 'evergreen', 'boost', 'metaString'],
    lockedFields: ['author', 'duration'],
  },
  'channel': {
    restrictedFields: ['rss', 'enabled'],
    lockedFields: ['author'],
  },
  'profile': {
    lockedFields: ['email'],
  },
  'appheader': {
    restrictedFields: ['search'],
  },
};

import store from '../../../store';

const assettasks = (state) => (state || store.getState()).assettasks.data;

const getAssetTasksData = (state) => {
  const tasks = [];
  Object.keys(assettasks(state)).map(taskId => {
    tasks.push(assettasks(state)[taskId]);
  })
  return tasks
};

const getById = (id, state) => assettasks(state)[id];

const getActiveFolders = (state) => assettasks(state).activeFolders;

export default {
  assettasks,
  getById,
  getActiveFolders,
  getAssetTasksData
};
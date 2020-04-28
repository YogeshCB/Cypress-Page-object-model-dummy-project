import logger from '../../../lib/logger';
import services from "../../../services";
import { getOrgData, taskPoller } from "./validate";
import _ from 'lodash';

const dedupe = (bindingsArr, orgData = {}) =>
  bindingsArr.map(bindings =>
    bindings.map(binding => {
      const deduper = binding =>
        Object.keys(binding).reduce((newBinding, param) => {
          const { meta = {}, bindings: subBindings } = binding[param];
          const { colId = '' } = meta;
          if (_.isUndefined(orgData[colId])) {
            const updatedBindings = {
              ...binding[param]
            };
            if (!_.isUndefined(subBindings)) {
              updatedBindings.bindings = deduper(subBindings)
            }
            newBinding[param] = updatedBindings;
          }
          return newBinding;
        }, {});
      return deduper(binding);
    }));

export default async (data, progress, resolve, reject) => {
  try {
    let { token, campaignId, workspace, preprocess = false, bindings = "[]", ssData = "[]", source = '[]' } = data;
    source = JSON.parse(source);
    bindings = JSON.parse(bindings);
    let ssRows = JSON.parse(ssData);
    const { type, data: storyboards = [] } = source;
    const isStoryboardBased = type === 'storyboards';
    if (!preprocess) {
      resolve();
    } else {
      const orgData = getOrgData(ssRows, false);
      const dedupedBindings = dedupe(bindings, orgData[0]);
      const promises = dedupedBindings.map(bindings =>
        services.campaign.preprocess()
          .send({
            token,
            workspace_id: workspace,
            campaign: campaignId,
            orgData,
            bindings
          })
          .then(({ task_id: taskId }) => taskId));
      const tasks = await Promise.all(promises);

      const adUpdater = (index, data, { ssData = '[]' } = {}) => {
        const ssRows = JSON.parse(ssData);
        return ssRows.map((row, rowIndex) => {
          const { attributes = [] } = row;
          const baseLength = attributes.length;
          let inferredData = data[rowIndex].bindings || [];
          const addAttributes = (bindings, params, shotIndex) => {
            const currentBindings = !_.isUndefined(shotIndex) ? bindings[shotIndex] : bindings;
            Object.keys(currentBindings).forEach(param => {
              const inferred = params[param];
              const { meta = {}, bindings: subBindings } = currentBindings[param];
              if (_.isUndefined(subBindings)) {
                const { colId, colIndex } = meta;
                const targetIndex = baseLength + (colIndex - 3); //colIndex in bindings start at 3
                attributes[targetIndex] = {
                  name: colId,
                  value: inferred || '',
                };
              } else {
                addAttributes(subBindings, inferred);
              }
            });
          };
          inferredData.forEach(addAttributes.bind(null, dedupedBindings[index]));
          row.inferredData = inferredData;
          row.attributes = attributes.filter(attribute => !_.isUndefined(attribute) && !_.isNull(attribute));
          if (isStoryboardBased) {
            row.storyboard = {
              ...storyboards[index],
              index
            };
          }
          return row;
        });
      };

      const results = [];
      const resolver = (index, { ssRows }) => {
        results[index] = JSON.parse(ssRows);
        if (results.length === tasks.length) {
          resolve({
            ssData: JSON.stringify([].concat(...results))
          });
        }
      };

      const rejector = index => {
        emitters.forEach(emitter => emitter.clear());
        reject();
      };

      const emitters = tasks.map((task, index) =>
        taskPoller(data, progress, resolver.bind(null, index), rejector.bind(null, index), adUpdater.bind(null, index), task));
    }
  } catch (ex) {
    logger.error(ex);
    reject(ex);
  }
}
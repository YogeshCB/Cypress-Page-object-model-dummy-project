import resolvers, { nonAssetSet } from './resolvers';
import { resolveAllPromise } from "../../isomorphic/promise";
import JSONResolver from '@bit/kubric.utils.common.json-resolver';
import _ from 'lodash';

const defaultValueMapper = {
  audio: {},
  "video,audio": {},
};

export default class Resolver {
  constructor(bindings, { attributes, userid, token, workspace }) {
    this.bindings = bindings;
    this.valueMap = Resolver.parseAttributes(attributes);
    this.userId = userid;
    this.token = token;
    this.workspace = workspace;
  }

  static parseAttributes(attributes) {
    if (Array.isArray(attributes)) {
      return attributes.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
    }
    return attributes;
  }

  static getError(result) {
    return Object.keys(result).reduce((acc, key) => {
      if (key !== '__hasErred__') {
        acc[key.replace(/_/g, '')] = result[key];
      }
      return acc;
    }, {});
  }

  processResults(results) {
    const { bindings = {} } = this;
    return Object.keys(bindings)
      .reduce((acc, paramId) => {
        const { type: paramType } = bindings[paramId];
        const result = results[paramId];
        if (_.isUndefined(result)) {

        } else if (Array.isArray(result)) {
          result.reduce((subAcc, subResult, index) => {
            if (subResult.__hasErred__) {
              subAcc.errors[`${paramId}.${index}`] = Resolver.getError(subResult);
            } else {
              if (!subAcc.results[paramId]) {
                subAcc.results[paramId] = [];
              }
              subAcc.results[paramId][index] = subResult.value || subResult;
              if (subResult.meta) {
                subAcc.meta[subResult.value] = subResult.meta;
              }
            }
            return subAcc;
          }, acc);
        } else if (result.__hasErred__ === true) {
          acc.errors[paramId] = Resolver.getError(result);
          acc.results[paramId] = defaultValueMapper[paramType] || '';
        } else if (!_.isUndefined(result.value)) {
          acc.results[paramId] = result.value;
          acc.meta[result.value] = result.meta;
        } else {
          acc.results[paramId] = result;
        }
        return acc;
      }, { errors: {}, results: {}, meta: {} });
  }

  resolveResults(promiseMap) {
    return resolveAllPromise(promiseMap)
      .then(::this.processResults)
      .then(({ errors = {}, ...rest } = {}) => Object.keys(errors).length === 0 ? rest : { errors, ...rest });
  }

  async resolveParameters(shouldResolve, { attributeMap, userId, token, workspace }) {
    const promiseMap = Object.keys(this.bindings).reduce((acc, paramId) => {
      const currentParam = this.bindings[paramId];
      let type = currentParam.type;
      if (!resolvers[type]) {
        type = "__other__";
      }
      if (shouldResolve(type)) {
        const resolver = resolvers[type];
        acc[paramId] = resolver(currentParam, attributeMap, userId, token, workspace);
      }
      return acc;
    }, {});
    return await this.resolveResults(promiseMap);
  }

  getResolvedEditorMeta() {
    return Object.keys(this.bindings).reduce((acc, parameter) => {
      const { editorMeta } = this.bindings[parameter];
      if (!_.isUndefined(editorMeta)) {
        acc[parameter] = editorMeta;
      }
      return acc;
    }, {});
  }

  async resolve({ attributes, userid, token, workspace } = {}) {
    const attributeMap = _.isUndefined(attributes) ? this.valueMap : Resolver.parseAttributes(attributes);
    const userId = userid || this.userId;
    token = token || this.token;
    workspace = workspace || this.workspace;
    const data = {
      attributeMap,
      userId,
      token,
      workspace
    };
    const { results: nonAssetResults = {}, errors: nonAssetErrors, meta: nonAssetMeta = {} } = await this.resolveParameters(type => nonAssetSet.has(type), data);
    const jsonResolver = new JSONResolver();
    this.bindings = jsonResolver.resolve(this.bindings, nonAssetResults);
    const { results: assetResults = {}, errors: assetErrors, meta: assetMeta = {} } = await this.resolveParameters(type => !nonAssetSet.has(type), data);
    let finalResults = {};
    if (!_.isUndefined(nonAssetErrors) || !_.isUndefined(assetErrors)) {
      finalResults = {
        errors: {
          ...(nonAssetErrors || {}),
          ...(assetErrors || {})
        }
      }
    }
    const editorMeta = this.getResolvedEditorMeta();
    return {
      ...finalResults,
      results: {
        ...nonAssetResults,
        ...assetResults,
      },
      meta: {
        ...nonAssetMeta,
        ...assetMeta
      },
      editorMeta
    };
  }
};
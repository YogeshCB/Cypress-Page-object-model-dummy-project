import config from '../config';
import Resolver from '@bit/kubric.utils.common.json-resolver';
import { isUndefined } from "@bit/kubric.utils.common.lodash";

const resolver = new Resolver({
  replaceUndefinedWith: '',
});

const trailingDotRegex = /\,$/;

export const commaJoinMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: value => value.join(','),
});

export const jsonMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: value => JSON.stringify(value),
});

export const audienceSizeMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: value => typeof value !== 'undefined' ? value : config.audiences.pageSize,
});

export const constraintMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: ({ tr, co, as, or, so, mop } = {}) => `${mop ? `mop:${mop},` : ''}${tr ? `tr:${tr},` : ''}${co ? `co:${co},` : ''}${as ? `as:${as},` : ''}${or ? `or:${or},` : ''}${so ? `so:${so},` : ''}`.replace(trailingDotRegex, '')
});

export const excludeMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: ({ auto_gen, asset_type } = {}) => `${auto_gen ? `auto_gen:${auto_gen},` : ''}${asset_type ? `asset_type:${asset_type},` : ''}`.replace(trailingDotRegex, '')
});

export const attributeMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: ({ location } = {}) => `${location ? `location:${location}` : ''}`.replace(trailingDotRegex, '')
});

export const assetAttributeMapper = fieldPath => ({
    _mapping: `{{${fieldPath}}}`,
    _transformer: ({ gender, is_banner } = {}) => `${gender ? `gender:${gender}` : ''}${!isUndefined(is_banner) ? is_banner === 'true'? '': `is_banner:false,` : ''}`.replace(trailingDotRegex, '')
  });

export const sortMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: ({ created_time } = {}) => `${created_time ? `created_time:${created_time}` : ''}`.replace(trailingDotRegex, '')
});

export const qcStatusMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: value => value === "none" ? "" : value
});

export const adDataMapper = fieldPath => ({
  _mapping: `{{${fieldPath}}}`,
  _transformer: data => resolver.resolve({
    channel: '{{channels}}',
    content: {
      title: '{{adTitle}}',
      text: '{{adText}}',
      headline: '{{headline}}',
      description: '{{description}}',
      link: '{{link}}',
      cta: '{{cta}}',
    },
    to: {
      account: '{{adaccount}}',
      instagram: '{{instagram}}',
      page: '{{page}}',
    },
    campaign: {
      type: '{{campaignType}}',
      id: '{{campaign}}',
      name: '{{campaignName}}',
      objective: '{{campaignObjective}}',
    },
    adset: {
      name: '{{adSetName}}',
      startDate: '{{adStartDate}}',
      endDate: '{{adEndDate}}',
    },
    track: {
      pixel: '{{adsPixel}}',
      appevent: '{{application}}',
    },
  }, data)
});
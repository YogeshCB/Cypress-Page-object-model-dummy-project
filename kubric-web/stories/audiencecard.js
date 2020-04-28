import { h } from 'preact';

import { storiesOf } from '@storybook/react';

import AudienceCard from '../browser/js/components/AudienceCard';

storiesOf('AudienceCard', module)
  .add('Default', () => (
    <AudienceCard audience={{
      "status": 1,
      "lang": "en",
      "display_name": "Women 25-30 : (Tier-3)",
      "name": "aud.006",
      "tags": [],
      "created_on": "2018-01-26T09:40:48.404210",
      "meta": {
        "fb_id": "23842679539420148"
      },
      "intent": null,
      "attributes": [{
        "display_name": "location",
        "type": "string",
        "name": "location",
        "value": "Hyderabad",
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.location"
      }, {
        "display_name": "occasion",
        "type": "string",
        "name": "occasion",
        "value": "Ugadi",
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.occasion"
      }, {
        "display_name": "age",
        "type": "string",
        "name": "age",
        "value": {
          "max": "36",
          "min": "30"
        },
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.age"
      }, {
        "display_name": "gender",
        "type": "string",
        "name": "gender",
        "value": "Female",
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.gender"
      }, {
        "display_name": "income",
        "type": "string",
        "name": "income",
        "value": "30lac",
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.income"
      }, {
        "display_name": "products",
        "type": "string",
        "name": "products",
        "value": "pendant",
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.products"
      }, {
        "display_name": "brand",
        "type": "string",
        "name": "brand",
        "value": "Bluestone",
        "uid": "95bad783-cfd4-417e-a836-cb8311785b96.brand"
      }],
      "desc": null,
      "uid": "95bad783-cfd4-417e-a836-cb8311785b96"
    }}/>
  ));
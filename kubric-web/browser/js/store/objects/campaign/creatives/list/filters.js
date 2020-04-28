import { creativeTabs, statuses } from "../../../../../../../isomorphic/constants/creatives";

export const TABS_FILTER = 'tabs';
export default {
  source: [{
    label: "Assigned to me",
    id: "selfAssigned",
    field: "checkbox",
    input: "single",
    editable: true,
  }, {
    label: 'Status',
    id: 'status',
    field: "checkbox",
    input: 'multiple',
    editable: true,
    data: [{
      value: statuses.CREATION_ERRED,
      label: 'Assets missing'
    }, {
      value: statuses.CREATION_COMPLETED,
      label: 'Ready for generation'
    }, {
      value: statuses.GENERATION_PENDING,
      label: 'Queued for generation'
    }, {
      value: statuses.GENERATION_INPROGRESS,
      label: 'Generating'
    }, {
      value: statuses.GENERATION_ERRED,
      label: 'Generation failed'
    }, {
      value: statuses.GENERATION_COMPLETED,
      label: 'Ready for publishing'
    }, {
      value: statuses.PUBLISH_PENDING,
      label: 'Queued for publishing'
    }, {
      value: statuses.PUBLISH_INPROGRESS,
      label: 'Publishing'
    }, {
      value: statuses.PUBLISH_COMPLETED,
      label: 'Published'
    }, {
      value: statuses.PUBLISH_ERRED,
      label: 'Publish failed'
    }]
  }, {
    label: 'Search',
    field: "text",
    id: 'search',
    editable: true,
    visibility: false,
    showFiltersTab: true
  }, {
    label: 'Tabs',
    id: TABS_FILTER,
    input: 'single',
    visibility: false,
    data: [{
      value: creativeTabs.ALL,
      label: 'All'
    }, {
      value: creativeTabs.READY,
      label: 'Ready for generation'
    }, {
      value: creativeTabs.FAILED,
      label: 'Failed'
    }, {
      value: creativeTabs.INPROGRESS,
      label: 'In Progress'
    }, {
      value: creativeTabs.GENERATED,
      label: 'Generated'
    }, {
      value: creativeTabs.PUBLISHED,
      label: 'Published'
    }]
  }, {
    label: 'Copy Approved',
    id: 'manual_copy_qc_status',
    input: 'single',
    field: "radio",
    visibility: true,
    data: [{
      value: "success",
      label: 'Yes'
    }, {
      value: "failure",
      label: 'No'
    }, {
      value: "none",
      label: 'None'
    }]
  }, {
    label: 'Visual Approved',
    id: 'manual_visual_qc_status',
    input: 'single',
    field: "radio",
    visibility: true,
    data: [{
      value: "success",
      label: 'Yes'
    }, {
      value: "failure",
      label: 'No'
    }, {
      value: "none",
      label: 'None'
    }]
  }],
  selected: [],
}
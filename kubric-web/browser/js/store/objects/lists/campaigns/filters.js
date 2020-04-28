export default {
  source: [{
    label: 'Status',
    value: 'status',
    input: 'multiple',
    editable: true,
    data: [{
      value: 'generation-completed',
      label: 'Generated'
    }, {
      value: 'generation-erred',
      label: 'Generation Failed'
    }, {
      value: 'generation-inprogress',
      label: 'Generating'
    }, {
      value: 'generation-pending',
      label: 'Generation Pending'
    }, {
      value: 'publish-pending',
      label: 'Publish Pending'
    }, {
      value: 'publish-inprogress',
      label: 'Publishing'
    }, {
      value: 'publish-erred',
      label: 'Publish Failed'
    }, {
      value: 'publish-completed',
      label: 'Published'
    }, {
      value: 'created',
      label: 'Created'
    }, {
      value: 'adcreation-erred',
      label: 'Ad Creation Failed'
    }, {
      value: 'adcreation-pending',
      label: 'Ad Creation Pending'
    }, {
      value: 'adcreation-inprogress',
      label: 'Ad Creation In Progress'
    }, {
      value: 'adcreation-completed',
      label: 'Ad Created'
    }]
  }],
  selected: [],
}
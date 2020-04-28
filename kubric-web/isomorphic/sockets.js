export const errorEvents = {
  MISSING_UID: 'MISSING_UID',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
};

export const campaignEvents = {
  CSV_UPLOAD_PROGRESSED: 'CSV_UPLOAD_PROGRESSED',
  CSV_UPLOAD_COMPLETED: 'CSV_UPLOAD_COMPLETED',
  CSV_UPLOAD_ERRED: 'CSV_UPLOAD_ERRED',
  CSV_PROCESS_PROGRESSED: 'CSV_PROCESS_PROGRESSED',
  CSV_PROCESS_ERRED: "CSV_PROCESS_ERRED",
  CSV_PROCESS_COMPLETED: "CSV_PROCESS_COMPLETED",
};

export const connections = {
  CAMPAIGN: '/campaign'
};

export const rooms = {
  CAMPAIGN: 'campaign-{{id}}'
};

export const getSocketError = code => ({
  erred: true,
  data: {
    code: errorEvents[code]
  }
});
import Messages from '@bit/kubric.server.utils.messages';

const messages = {
  server: {
    EADDRINUSE: '{{port}} is already in use. Please use another port or free the port {{port}}',
    EACCES: 'No access to port {{port}}',
  },
  cache: {
    READ_ERROR: 'Unable to read from cache',
    WRITE_ERROR: 'Unable to write from cache',
  },
  auth: {
    COOKIE_MISSING: 'Authentication cookie missing. Not an authorized request.',
    SESSION_TIMEOUT: 'Session timed out. Please login again.',
  },
  services: {
    login: {
      BAD_REQUEST: 'Please provide valid email and userid',
      FAILED: 'Login failed',
      FIRST_TIME_USER: 'An email has been sent to {{email}}. Please click on the link provided in the mail and confirm your email.',
      UNAPPROVED_USER: 'Your request for access to the Kubric is still under process. Any updates in this regard will be conveyed to you via email({{email}}). Thank you.',
    },
    signup: {
      BAD_REQUEST: 'Please provide valid name and email',
      UNVERIFIED_EMAIL: 'Unable to verify your email',
    },
    verify: {
      FAILED: 'Verification failed',
    },
    drive: {
      CALLBACK_FAILED: 'Drive callback failed',
      GET_ACCOUNT_FAILED: 'Failed fetching credentials and folders',
      DISCONNECT_FAILED: 'Failed to disconnect your drive account',
    },
    segments: {
      CSV_READ_ERROR: 'Error while parsing csv',
      NO_CSV_FILES: 'No csv files attached with audience upload request',
      DOWNLOAD_FAILED: 'Downloading template failed'
    },
    assets: {
      RESOLVE_FAILED: 'Asset resolution failed',
    },
    downloadAdResults: {
      RETRIEVAL_FAILED: "Unable to retrieve ads for the campaign",
      CSV_FAILED: "Failed while creating csv file",
      DOWNLOAD_FAILED: 'Downloading campaign results failed'
    },
    downloadAdErrorReport: {
      RETRIEVAL_FAILED: "Unable to retrieve ads for the campaign",
      CSV_FAILED: "Failed while creating csv file",
      DOWNLOAD_FAILED: "Downloading error report failed",
      INVALID_ERROR_META: "Invalid error details found in ad - {{ad}}"
    },
    creativesResolution: {
      FAILED: 'Error while creating job for asset resolution',
    },
    retryCampaignAds: {
      FAILED: 'Error while retrying campaign ad creation for previously failed segments',
    },
    generateVideos: {
      FAILED: 'Error while creating video generation jobs',
    },
    retryVideos: {
      FAILED: 'Error while retrying video generation for previously failed ads',
    },
    publishAds: {
      FAILED: 'Error while creating ad publish jobs',
    },
    retryPublishAds: {
      FAILED: 'Error while retrying ad publish for previously failed ads',
    },
    generateAdVideo: {
      FAILED: 'Error while creating video job for campaign ad',
    },
    publishCampaignAd: {
      FAILED: 'Error while creating publish job for campaign ad',
    },
    createCampaign: {
      INVALID_REQUEST: "Both 'name' and 'storyboards' inputs should be valid strings",
      STORYBOARD_FAILED: "Error while fetching storyboards",
      NO_SHOTS: "No shots in the storyboard",
      TEMPLATE_FAILED: "Template creation failed",
      CAMPAIGN_FAILED: "Campaign creation failed",
    },
    campaign: {
      CREATIVES_DOWNLOAD_FAILED: "Unable to download creatives"
    },
    chat: {
      mentions: {
        NO_USERS: "No user provided",
        NO_CHANNEL: "Either channel or creative is mandatory provided",
        INVALID_USERS: "One or more of the users provided have 'email' field missing",
        NONMEMBER_USER: "User is not a member of the provided channel",
        DELETE_FAILED: "Unable to delete mentions",
      }
    }
  },
};

export default new Messages(messages);
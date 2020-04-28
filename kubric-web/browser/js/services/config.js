import {
  jsonMapper, audienceSizeMapper, adDataMapper, constraintMapper, attributeMapper, commaJoinMapper, sortMapper,
  assetAttributeMapper, excludeMapper, qcStatusMapper
} from "./utils";
import config from '../config';

const assetsConfig = config.assets;

export default {
  host: __kubric_config__.root,
  path: '/api',
  resources: {
    user: {
      path: 'user',
      services: {
        getIntegrations: {
          path: 'integrations/assets/credentials',
          method: 'get',
          storeKey: 'FETCH_INTEGRATIONS'
        },
        getProfile: {
          path: 'profile',
          method: 'get',
          storeKey: 'FETCH_PROFILE',
        },
        getSubscription: {
          path: 'subscriptions',
          method: 'get',
        },
        updateProfile: {
          path: 'profile',
          method: 'put',
          storeKey: 'UPDATE_PROFILE',
          data: {
            name: '{{name}}',
            background_image_url: '{{background_image_url}}',
            phone_no: '{{phone_no}}',
            gender: '{{gender}}',
            age: '{{age}}',
            topics: '{{topics}}',
            email: '{{email}}',
            profile_image_url: '{{profile_image_url}}',
            desc: '{{desc}}',
            company_profile: jsonMapper('companyProfile'),
          },
        },
        logout: {
          path: 'logout',
          method: 'post',
          storeKey: 'LOGOUT',
        },
      },
    },
    roles: {
      path: 'roles',
      services: {
        get: {
          type: 'auto',
          method: 'get',
          storeKey: 'ROLES_FETCHED'
        },
      },
    },
    filters: {
      path: 'filter',
      services: {
        get: {
          method: 'get',
          storeKey: 'GET_FILTERS'
        }
      }
    },
    team: {
      path: 'team',
      services: {
        getTeam: {
          method: 'get',
          storeKey: 'TEAM_FETCH'
        },
        getTeamsOfUser: {
          method: 'get',
          storeKey: 'TEAMS_FETCH',
          path: 'user/{{workspaceId}}',
        },
        create: {
          method: 'post',
          storeKey: 'CREATE_TEAM',
          type: 'auto',
        },
        updateUsers: {
          method: 'patch',
          storeKey: 'UPDATE_USERS',
          path: 'user',
          type: 'auto',
        },
        update: {
          method: 'put',
          storeKey: 'UPDATE_TEAM',
          type: 'auto',
        },
        delete: {
          method: 'delete',
          storeKey: 'DELETE_TEAM',
          path: '{{id}}',
        },
      },
    },
    workspace: {
      path: 'workspace',
      services: {
        getWorkspacesOfUser: {
          method: 'get',
          storeKey: 'WORKSPACES_FETCH',
        },
        revokeInvitation: {
          path: 'invite/{{token_id}}',
          method: 'delete',
          storeKey: 'INVITATION_DELETED'
        },
        getInvitations: {
          method: 'get',
          type: 'auto',
          path: '{{workspaceId}}/invite',
          storeKey: 'WORKSPACE_INVITATIONS'
        },
        get: {
          path: '{{workspaceId}}',
          method: 'get',
          storeKey: 'FETCH_WORKSPACE'
        },
        getCurrentWorkspaceUsers: {
          path: 'users',
          method: 'get',
          storeKey: 'FETCH_WORKSPACE_USERS'
        },
        set: {
          path: 'set',
          method: 'post',
          storeKey: 'SET_WORKSPACE',
          type: 'auto'
        },
        create: {
          method: 'post',
          storeKey: 'CREATE_WORKSPACE',
          type: 'auto',
        },
        updateUsers: {
          method: 'patch',
          storeKey: 'UPDATE_USERS',
          type: 'auto',
        },
        update: {
          method: 'put',
          storeKey: 'UPDATE_WORKSPACE',
          type: 'auto',
        },
        delete: {
          method: 'delete',
          storeKey: 'DELETE_WORKSPACE',
          path: '{{workspaceId}}',
        },
      },
    },
    ads: {
      path: 'publish/ads',
      query: {
        channel: 'facebook',
      },
      services: {
        updateAd: {
          method: 'put',
          storeKey: 'UPDATE_AD',
          data: {
            ad: '{{ad}}',
            campaign: '{{campaignId}}',
          },
        },
        postAds: {
          method: 'post',
          storeKey: 'POST_ADS',
          data: {
            campaignId: '{{campaignId}}',
            adData: adDataMapper('adData'),
            ad: '{{ad}}',
            renderData: '{{renderData}}',
            templates: '{{templates}}',
          },
        },
      },
    },
    notifications: {
      path: 'notifications',
      services: {
        getSubscriptions: {
          type: 'auto',
          method: 'get',
          path: 'subscriptions',
          storeKey: 'FETCH_NOTIFICATION_SUBSCRIPTIONS'
        },
        triggerSubscription: {
          type: 'auto',
          method: 'post',
          path: 'trigger',
          storeKey: 'TRIGGER_SUBSCRIPTION'
        },
        getConfig: {
          type: 'auto',
          mrthod: 'get',
          path: 'config',
          storeKey: 'GET_NOTIFICATION_CONFIG'
        },
        get: {
          type: 'auto',
          mrthod: 'get',
          storeKey: 'NOTIFICATIONS_FETCHED'
        }
      },
    },
    networks: {
      path: 'assets/networks',
      services: {
        getDriveOAuthUrl: {
          path: 'drive/oauth',
          query: {
            redirect: '{{redirect}}',
          },
          storeKey: 'GET_DRIVE_OAUTH_URL',
        },
        getDriveAccount: {
          path: 'drive/account',
          storeKey: 'GET_DRIVE_ACCOUNT',
        },
        getShutterstockOAuthUrl: {
          path: 'shutterstock/oauth',
          query: {
            redirect: '{{redirect}}',
          },
          storeKey: 'GET_SHUTTERSTOCK_OAUTH_URL',
        },
        getShutterstockAccount: {
          path: 'shutterstock/account',
          storeKey: 'GET_SHUTTERSTOCK_ACCOUNT',
        },
        getShutterstockSubscriptions: {
          path: 'shutterstock/list-subscriptions',
          storeKey: 'GET_SHUTTERSTOCK_SUBSCRIPTIONS',
        },
        licenseAsset: {
          path: 'shutterstock/license-asset',
          data: {
            "asset_id": '{{asset_id}}',
            "subscription_id": '{{subscription_id}}',
            "asset_type": '{{asset_type}}',
          },
          method: 'post',
          storeKey: 'LICENSE_ASSET',
        },
        syncCloudinary: {
          path: 'cloudinary/sync',
          method: 'post',
          type: 'auto',
          storeKey: 'SYNC_CLOUDINARY'
        },
        updateFolders: {
          method: 'put',
          path: 'drive/folders',
          data: {
            folders: '{{folders}}',
          },
          storeKey: 'UPDATE_DRIVE_FOLDERS',
        },
        updateShutterstockFolders: {
          method: 'post',
          path: 'shutterstock/folders',
          storeKey: 'UPDATE_SHUTTERSTOCK_FOLDERS',
        },
        unlinkDrive: {
          method: 'delete',
          path: 'drive',
          storeKey: 'UNLINK_DRIVE',
        },
        unlinkShutterstock: {
          method: 'delete',
          path: 'shutterstock',
          storeKey: 'UNLINK_SHUTTERSTOCK',
        },
        unlinkCloudinary: {
          method: 'delete',
          path: 'cloudinary',
          storeKey: 'UNLINK_CLOUDINARY',
        },
      },
    },
    assets: {
      path: 'assets',
      services: {
        getAssets: {
          path: 'search',
          storeKey: 'FETCH_ASSETS',
          query: {
            q: '{{query}}',
            type: '{{type}}',
            from: '{{from}}',
            private: '{{private}}',
            offer: '{{offer}}',
            exclude: excludeMapper('exclude'),
            exact_path: '{{exact_path}}',
            context: '{{context}}',
            path: '{{path}}',
            size: assetsConfig.pageSize,
            constraints: constraintMapper('constraints'),
            attributes: attributeMapper('attributes'),
            asset_attributes: assetAttributeMapper('attributes'),
            sort_by: sortMapper('sortBy')
          },
        },
        getFolderAssets: {
          path: 'search',
          storeKey: 'FETCH_FOLDER_ASSETS',
          query: {
            type: 'folder',
            exact_path: '{{exact_path}}',
            private: true,
            size: assetsConfig.pageSize,
            path: '{{path}}'
          },
        },
        download: {
          path: 'folder/zip/{{id}}',
          type: 'auto',
          storeKey: 'ZIP_FOLDER',
        },
        shareAssets: {
          method: 'patch',
          path: 'share/assets',
          type: 'auto',
          storeKey: 'SHARE_ASSETS',
        },
        shareFolders: {
          method: 'patch',
          path: 'share/folders',
          type: 'auto',
          storeKey: 'SHARE_FOLDERS',
        },
        unshareAssets: {
          method: 'patch',
          path: 'share/assets',
          type: 'auto',
          storeKey: 'UNSHARE_ASSETS',
        },
        unshareFolders: {
          method: 'patch',
          path: 'share/folders',
          type: 'auto',
          storeKey: 'UNSHARE_FOLDERS',
        },
        newFolder: {
          type: 'auto',
          storeKey: 'FOLDER_CREATE',
          path: 'newfolder',
          method: 'post'
        },
        deleteFolder: {
          type: 'auto',
          path: 'folder/{{id}}',
          method: 'delete',
          storeKey: 'FOLDER_DELETE',
        },
        moveToFolder: {
          type: 'auto',
          method: 'put',
          path: 'update/path/bulk',
          storeKey: 'MOVE_FOLDER',
        },
        bulkUpdate: {
          type: 'auto',
          method: 'put',
          path: 'update/bulk',
          storeKey: 'BULK_UPDATE_TAGS',
        },
        unzip: {
          type: 'auto',
          method: 'get',
          path: 'folder/unzip/{{id}}',
          storeKey: 'UNZIP_FOLDER',
        },
        getFilters: {
          type: 'auto',
          method: 'get',
          path: 'filters',
          storeKey: 'GET_FILTERS'
        },
        getFolders: {
          path: 'search',
          storeKey: 'FETCH_FOLDERS',
          query: {
            type: 'folder',
            exact_path: false,
            private: true,
            size: 500,
            path: '/root'
          }
        },
        load: {
          path: 'folder/{{id}}',
          type: 'auto'
        },
        getAsset: {
          path: '{{id}}',
          storyKey: 'FETCH_ASSET',
        },
        getUploadUrls: {
          path: 'uploadurls',
          query: {
            file: '{{files}}',
            attributes: jsonMapper('attributes'),
            tags: '{{tags}}',
            path: '{{path}}',
            variant: '{{variant}}',
            is_hidden: '{{is_hidden}}'
          },
        },
        upload: {
          method: 'post',
          type: 'auto',
        },
        uploadFont: {
          method: 'put',
          type: 'auto',
        },
        confirmUpload: {
          method: 'post',
          path: 'confirmupload',
          type: 'auto',
        },
        save: {
          method: 'post',
          path: 'update',
          type: 'auto',
          data: '{{postData}}',
          storeKey: 'SAVE_ASSET',
        },
        saveVariant: {
          method: 'patch',
          type: 'auto',
          storeKey: 'SAVE_ASSET_VARIANT'
        },
        saveFolder: {
          method: 'post',
          path: 'folder/{{id}}',
          type: 'auto',
          data: '{{postData}}',
          storeKey: 'SAVE_ASSET',
        },
        ingest: {
          method: 'post',
          path: 'ingest/{{network}}',
          type: 'auto',
          storeKey: 'INGEST_ASSET'
        },
        delete: {
          method: 'post',
          path: 'delete',
          type: 'auto',
          storeKey: 'DELETE_ASSET'
        },
      },
    },
    transform: {
      method: 'get',
      type: 'auto',
      path: 'transform/{{assetId}}',
      services: {
        transform: {
          method: 'get',
          path: '{{transformations}}',
          type: 'auto',
          storeKey: 'TRANSFORM'
        },
        filter: {
          method: 'get',
          path: '{{filter}}',
          type: 'auto',
          storeKey: 'FILTER'
        }
      },
    },
    sourcing: {
      path: 'sourcing',
      services: {
        getImageBank: {
          path: 'getImageBank',
          storeKey: 'FETCH_IMAGE_BANK',
        }
      }
    },
    mail: {
      path: 'mail',
      services: {
        requestInvite: {
          method: 'post',
          path:
            'invite',
          data: {
            email: '{{email}}',
            name: '{{name}}',
            companyName: '{{companyName}}',
            amountSpentPerMonth: '{{amount}}',
            numOfVideosPerMonth: '{{videoCount}}',
          },
        },
      },
    },
    campaignpublisher: {
      path: 'publish/ads/campaign/{{campaignId}}',
      query: {
        channel: 'facebook',
      },
      services: {
        publishCampaignAds: {
          method: 'put',
          storeKey: 'PUBLISH_CAMPAIGN_ADS',
        },
        retryPublishAds: {
          path: 'retry',
          method: 'put',
          storeKey: 'RETRY_PUBLISH_CAMPAIGN_ADS',
        },
        singleAdPublish: {
          path: 'ad',
          method: 'put',
          storeKey: 'SINGLE_AD_PUBLISH',
          data: {
            ad: '{{ad}}',
          },
        },
      },
    },
    publisher: {
      path: 'publish',
      services: {
        validateScopes: {
          path: 'profile/validate',
          storeKey: 'VALIDATE_CHANNEL',
          query: {
            channel: 'facebook',
          },
        },
        unlinkPublisherNetwork: {
          path: 'profile/unlink',
          method: 'delete',
          storeKey: 'UNLINK_CHANNEL',
          query: {
            channel: '{{channel}}',
          },
        },
        getUrl: {
          path: 'oauth',
          storeKey: 'GET_OAUTH_URL',
          query: {
            network: '{{channel}}',
            redirect: '{{redirect}}',
          },
        },
        getPublisherAccount: {
          path: 'account',
          storeKey: 'GET_PUBLISHER_ACCOUNT',
          query: {
            channel: 'facebook',
          },
        },
        getAdAccount: {
          path: 'account/adaccount',
          storeKey: 'GET_AD_ACCOUNT',
          query: {
            channel: 'facebook',
          },
        },
        getAdCampaigns: {
          path: 'account/campaigns',
          storeKey: 'GET_AD_CAMPAIGNS',
          query: {
            channel: 'facebook',
            query: '{{query}}'
          },
        },
        publishVideo: {
          method: 'post',
          query: {
            channel: '{{channel}}',
          },
          data: {
            data: '{{data}}',
            video: {
              title: '{{title}}',
              description: '{{description}}',
              video: '{{video}}',
            },
          },
        },
      },
    },
    jobs: {
      path: 'jobs',
      services: {
        get: {
          storeKey: 'FETCH_JOBS',
        },
        retry: {
          method: 'put',
          path: 'retry/{{jobId}}',
          storeKey: 'RETRY_JOB',
        },
        'delete': {
          method: 'delete',
          path: '{{jobId}}',
          storeKey: 'DELETE_JOB',
        },
      },
    },
    segments: {
      path: 'segments',
      services: {
        get: {
          query: {
            limit: audienceSizeMapper('limit'),
            start: '{{next}}',
            search: '{{query}}',
            campaign_id: `{{campaign_id}}`,
            all: '{{all}}',
          },
          storeKey: 'FETCH_SEGMENTS',
        },
        upload: {
          isFormData: true,
          method: 'post',
          path: 'upload',
          data: {
            file: '{{file}}',
          },
        },
        uploadSegmentsForCampaign: {
          isFormData: true,
          method: 'post',
          path: 'upload/{{campaign_id}}',
          data: {
            file: '{{file}}'
          },
          query: {
            preprocess: '{{preprocess}}'
          }
        },
        getAttributes: {
          path: 'attributes',
          storeKey: 'FETCH_ATTRIBUTES',
          query: {
            campaign_id: '{{campaign_id}}'
          },
        },
        delete: {
          method: 'delete',
          storeKey: 'DELETE_SEGMENTS',
          query: {
            campaign_id: '{{campaign_id}}',
          }
        }
      },
    },
    storyboards: {
      path: 'storyboards',
      services: {
        get: {
          query: {
            limit: config.storyboards.pageSize,
            start: '{{next}}',
            search: '{{query}}',
            content_type: '{{content_type}}',
            ids: '{{ids}}'
          },
          storeKey: 'FETCH_STORYBOARDS',
        },
        delete: {
          storeKey: 'DELETE_STORYBOARD',
          path: '{{storyboardId}}',
          type: 'auto',
          method: 'delete',
        },
        share: {
          storeKey: 'SHARE_STORYBOARDS',
          type: 'auto',
          method: 'patch'
        }
      },
    },
    storyboard: {
      path: "storyboard/{{storyboard}}/{{version}}"
    },
    templates: {
      path: 'templates',
      services: {
        get: {
          storeKey: 'FETCH_TEMPLATES'
        }
      }
    },
    template: {
      path: 'template/{{templateId}}',
      services: {
        get: {
          storeKey: 'FETCH_TEMPLATE',
        },
        save: {
          storeKey: 'SAVE_TEMPLATE',
          method: 'post',
          data: {
            storyboard: '{{storyboard}}',
            bindings: '{{parameters}}',
            name: '{{name}}',
          },
        },
        copy: {
          method: "post",
          path: 'copy',
          storeKey: 'COPY_TEMPLATE',
          data: {
            name: "{{name}}"
          }
        },
        remove: {
          storeKey: 'DELETE_TEMPLATE',
          method: 'delete'
        },
        downloadCSVTemplate: {
          path: "sheet.csv"
        },
      }
    },
    campaigns: {
      path: 'campaigns',
      services: {
        get: {
          storeKey: 'FETCH_CAMPAIGNS',
          query: {
            limit: '{{limit}}',
            start: '{{next}}',
            status: '{{status}}',
            search: '{{query}}',
          }
        },
        share: {
          storeKey: 'SHARE_CAMPAIGNS',
          method: 'patch',
          type: 'auto'
        },
      },
    },
    campaign: {
      path: 'campaign/{{campaignId}}',
      services: {
        downloadCSVTemplate: {
          path: "storyboard/{{storyboard}}/{{version}}/sheet.csv",
        },
        downloadRows: {
          path: 'download'
        },
        get: {
          storeKey: 'CAMPAIGN_FETCHED',
          query: {
            registerView: "{{registerView}}"
          }
        },
        getStats: {
          storeKey: 'STATS_FETCHED',
          path: 'creatives/stats'
        },
        create: {
          storeKey: "CREATE_CAMPAIGN",
          method: 'put',
          data: {
            name: "{{name}}",
            mediaFormat: "{{mediaFormat}}",
            storyboards: "{{storyboards}}"
          }
        },
        save: {
          storeKey: 'SAVE_CAMPAIGN',
          method: 'post',
          data: {
            campaignId: '{{campaignId}}',
            name: '{{name}}',
            template: '{{template}}',
            audiences: '{{audiences}}',
            mediaFormat: '{{publishData.outputFormat}}',
            publishData: adDataMapper('publishData'),
          },
        },
        getAd: {
          path: 'ad/{{adId}}'
        },
        deleteCreative: {
          storeKey: "DELETE_CREATIVE",
          method: "delete",
          path: 'creative/{{adId}}'
        },
        saveCreative: {
          path: 'creative/{{creativeId}}',
          storeKey: 'SAVE_CREATIVE',
          method: "put",
          data: {
            source: "{{source}}",
            meta: "{{meta}}",
            manual_copy_qc_status: "{{manualCopyQCStatus}}",
            manual_visual_qc_status: "{{manualVisualQCStatus}}",
          }
        },
        getAds: {
          path: 'ads',
          storeKey: 'GET_CAMPAIGN_ADS',
          query: {
            limit: config.ads.pageSize,
            start: '{{start}}',
            status: '{{status}}',
            qc_status: '{{qc_status}}',
            count: "{{count}}",
            tabs: "{{tabs}}",
            q: "{{search}}",
            manual_copy_qc_status: qcStatusMapper("manual_copy_qc_status"),
            manual_visual_qc_status: qcStatusMapper("manual_visual_qc_status"),
            selfassigned: "{{selfAssigned}}"
          },
        },
        downloadResults: {
          path: 'results',
        },
        downloadAdErrors: {
          path: 'aderrors',
        },
        generateCampaignAds: {
          path: 'ads',
          method: 'put',
          storeKey: 'GENERATE_CAMPAIGN_ADS',
          data: '{{data}}',
          query: {
            sample: '{{sample}}',
            columnNames: '{{columnNames}}',
            segments: commaJoinMapper('segments')
          },
        },
        resolveCreatives: {
          path: 'creatives/resolve',
          method: 'put',
          storeKey: 'RESOLVE_CREATIVES',
        },
        resolveCreative: {
          path: 'creative/{{creativeId}}/resolve',
          method: 'put',
          storeKey: 'RESOLVE_CREATIVE',
        },
        generateAdVideos: {
          path: 'videos',
          method: 'put',
          data: {
            status: '{{status}}',
            qcStatus: '{{qcStatus}}'
          },
          storeKey: 'GENERATE_AD_VIDEOS',
        },
        retryAdVideos: {
          path: 'videos/retry',
          method: 'put',
          storeKey: 'RETRY_ERRED_AD_VIDEOS',
        },
        singleAdVideo: {
          path: 'ad/{{adId}}/video',
          method: 'put',
          storeKey: 'GENERATE_SINGLE_AD_VIDEO',
        },
        approveCopyQC: {
          path: 'creatives/approve',
          method: 'put',
          storeKey: 'APPROVE_COPYQC',
        },
        rejectCopyQC: {
          path: 'creatives/reject',
          method: 'put',
          storeKey: 'REJECT_COPYQC',
        },
        approveVisualQC: {
          path: 'creatives/approve',
          method: 'put',
          query: {
            field: "manual_visual_qc_status"
          },
          storeKey: 'APPROVE_VISUALQC',
        },
        rejectVisualQC: {
          path: 'creatives/reject',
          method: 'put',
          query: {
            field: "manual_visual_qc_status"
          },
          storeKey: 'REJECT_VISUALQC',
        },
      },
    },
    creative: {},
    effects: {
      path: 'effects',
      services: {
        resolve: {
          method: 'post',
          path: 'resolve',
          data: {
            object: '{{object}}'
          }
        },
        getTaskStatus: {
          path: 'task/{{taskId}}',
        },
      },
    },
    resolver: {
      path: 'resolver',
      services: {
        resolve: {
          method: 'post',
          storeKey: 'RESOLVE_BINDINGS',
          data: {
            parameters: '{{parameters}}',
            segment: '{{segment}}',
          },
        },
      },
    },
    insights: {
      path: 'insights/{{ad}}',
      services: {
        get: {
          storeKey: 'FETCH_INSIGHTS',
          query: {
            entities: "{{entities}}",
          },
        },
      },
    },
    message: {
      path: "message/{{id}}",
      services: {
        clear: {
          method: "delete",
        }
      }
    },
    chat: {
      path: 'chat',
      services: {
        generateToken: {
          path: 'token',
        },
        setupChannel: {
          path: 'channel/create',
          method: 'post',
          data: {
            name: '{{name}}',
            id: '{{id}}'
          }
        },
        registerMentions: {
          path: 'mention',
          method: 'put',
          data: {
            channel: "{{channel}}",
            creative: "{{creativeId}}",
            user: "{{user}}",
            campaign: "{{campaign}}"
          }
        },
        clearMentions: {
          path: 'mention/{{creativeId}}',
          method: 'delete',
        }
      }
    },
    suggest: {
      path: 'suggest',
      services: {
        getSuggestions: {
          method: 'post',
          data: {
            data: "{{data}}"
          }
        }
      }
    }
  },
};

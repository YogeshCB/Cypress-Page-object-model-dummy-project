import { creativeTabs } from "../../../isomorphic/constants/creatives";

export default {
  defaultSBVersion: "oldest",
  gapi: {
    developerKey: 'AIzaSyB6OQzIeknGQ6utv61eHnUG_KWuOr_VMOo',
  },
  ads: {
    pageSize: 50,
  },
  navPanel: {
    fbPaths: {
      campaigns: '/recent/{{email}}/{{workspace}}/campaigns',
      assets: '/recent/{{email}}/{{workspace}}/assets',
      notifications: '/notifications/{{workspace}}/{{email}}'
    }
  },
  paths: {
    firestore: {
      campaignAd: "campaigns/{{campaign}}/ads/{{ad}}",
      campaignAds: "campaigns/{{campaign}}/ads",
    }
  },
  assets: {
    networks: {
      oauthRedirect: {
        drive: '/profile',
        shutterstock: '/profile',
      },
      active: ['cloudinary', 'drive', 'shutterstock'],
      labels: {
        drive: {
          heading: 'Google Drive',
          description: 'Sync assets from your Google Drive',
          icon: 'driveAssetIcon'
        },
        cloudinary: {
          heading: 'Cloudinary',
          description: 'Sync assets from your Cloudinary account',
          icon: 'cloudinaryAssetIcon'
        },
        shutterstock: {
          heading: 'Shutterstock',
          description: 'Sync assets from your Shutterstock account',
          icon: 'shutterstockAssetIcon'
        },
      },
    },
    pageSize: 50,
    thumbnailURL: 'https://res.cloudinary.com/dsvdhggfk/image/upload/v1549368899/kubric/apps/broken.png',
    validAssetTypes: 'image,audio,video,font,subtitle,archive,blob',
    gridStyles: {
      url: `http://storage.googleapis.com/kubric-temp/grid.png`,
      background: 'url(http://storage.googleapis.com/kubric-temp/grid.png)',
      backgroundColor: '#fff',
      backgroundSize: "cover",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    },
    gridStylesSmall: {
      url: `https://res.cloudinary.com/dsvdhggfk/image/upload/v1555172066/swiggy-grid-small.png`,
      background: 'url(https://res.cloudinary.com/dsvdhggfk/image/upload/v1555172066/swiggy-grid-small.png)',
      backgroundSize: "cover",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    },
  },
  fileAcceptTypes: {
    image: [".jpg", ".png", ".jpeg", ".jpe", ".gif", ".bmp", ".tif", ".tiff", ".cr2", ".psd"],
    video: [".mkv", ".mov", ".webm", ".mp4"],
    audio: [".mp3", ".wav"],
    font: [".ttf", ".otf", ".woff", ".woff2"],
    subtitle: [".srt"],
    archive: [".zip"],
    audience: [".csv"],
    blob: ['.aep', '.ai', '.aet', '.svg', '.eps']
  },
  audiences: {
    pageSize: 30,
  },
  storyboards: {
    pageSize: 50,
  },
  campaigns: {
    pageSize: 30,
  },
  publisher: {
    oauthRedirect: {
      youtube: '/profile?section=0&tab=1',
      facebook: '/profile?section=0&tab=0'
    },
    active: ['facebook', 'youtube'],
    labels: {
      facebook: {
        heading: 'Facebook',
        description: 'Publish video ads to Facebook',
        icon: 'facebookPublisherIcon',
      },
      youtube: {
        heading: 'Youtube',
        description: 'Publish videos to your youtube channel',
        icon: 'youtubePublisherIcon',
      },
    },
    campaigns: {
      objectives: [{
        label: 'Post Engagement',
        value: 'POST_ENGAGEMENT',
      }, {
        label: 'Video views',
        value: 'VIDEO_VIEWS',
      }],
    },
    ctaOptions: [{
      value: "REQUEST_TIME",
      label: "Request Time"
    }, {
      value: "APPLY_NOW",
      label: "Apply Now"
    }, {
      value: "BOOK_TRAVEL",
      label: "Book Now"
    }, {
      value: "CONTACT_US",
      label: "Contact Us"
    }, {
      value: "DOWNLOAD",
      label: "Download"
    }, {
      value: "GET_SHOWTIMES",
      label: "Get Showtimes"
    }, {
      value: "LEARN_MORE",
      label: "Learn More"
    }, {
      value: "LISTEN_NOW",
      label: "Listen now"
    }, {
      value: "MESSAGE_PAGE",
      label: "Send Message"
    }, {
      value: "SEE_MENU",
      label: "See Menu"
    }, {
      value: "SHOP_NOW",
      label: "Shop Now"
    }, {
      value: "SIGN_UP",
      label: "Sign Up"
    }, {
      value: "WATCH_MORE",
      label: "Watch More"
    }],
  },
  creatives: {
    tabs: {
      [creativeTabs.FILTERED]: {
        label: "Filtered creatives",
        headers: ["sequence", "creative", "status", "manual_copy_qc_status", "manual_visual_qc_status", "assigned_to", "created", "updated"]
      },
      [creativeTabs.ALL]: {
        label: "All creatives",
        headers: ["sequence", "creative", "status", "manual_copy_qc_status", "manual_visual_qc_status", "assigned_to", "created", "updated"]
      },
      [creativeTabs.GENERATED]: {
        label: "Generated",
        headers: ["sequence", "creative", "status", "manual_copy_qc_status", "manual_visual_qc_status", "assigned_to", "created", "updated"]
      },
      [creativeTabs.READY]: {
        label: "Ready for generation",
        headers: ["sequence", "creative", "status", "assigned_to", "created", "updated"]
      },
      [creativeTabs.FAILED]: {
        label: "Failed",
        headers: ["sequence", "creative", "status", "assigned_to", "created", "updated"]
      },
      [creativeTabs.INPROGRESS]: {
        label: "In progress",
        headers: ["sequence", "creative", "status", "manual_copy_qc_status", "manual_visual_qc_status", "assigned_to", "created", "updated"]
      }
    },
    order: [creativeTabs.FILTERED, creativeTabs.ALL, creativeTabs.READY, creativeTabs.FAILED, creativeTabs.INPROGRESS, creativeTabs.GENERATED, creativeTabs.PUBLISHED]
  },
  chat: {
    channels: {
      creative: "creative-{{id}}"
    },
    fbPaths: {
      mentions: "chat/mentions/{{channelId}}/{{user}}"
    }
  }
};
import { h } from 'preact';
import styles from 'stylesheets/apps';
import { Link } from "@bit/kubric.utils.common.router";
import appStyles from 'stylesheets/app';
import baseStyles from "@bit/kubric.components.styles.commons/styles/base";

const getApps = ({ campaignsUrl, studioUrl }) => [{
  url: campaignsUrl,
  title: "Marketing Campaigns",
  description: "Create and Deliver Personalized Video Marketing campaigns on Facebook & Youtube.",
  iconStyle: styles.campaignIcon,
}, {
  url: campaignsUrl,
  title: "Product Videos",
  description: "Automated creation of Product Explainers, Comparisons and Lots more.",
  iconStyle: styles.productvideosIcon,
}, {
  url: campaignsUrl,
  title: "Feed Cards",
  description: "Generate static and micro-animated content on the fly for your app and web feeds.",
  iconStyle: styles.feedIcon,
}, {
  url: campaignsUrl,
  title: "Smart Banners",
  description: "Design a single image/gif banner and adapt it to multiple form factors.",
  iconStyle: styles.bannersIcon,
}, {
  url: studioUrl,
  title: "Studio Director",
  description: "Create and collaborate on smart content types, creative guidelines and storylines for creative teams",
  iconStyle: styles.studioIcon,
}];

const App = ({ url, title, description, iconStyle }) => (
  <Link to={url} className={styles.app}>
    <div className={styles.iconContainer}>
      <div className={iconStyle}/>
    </div>
    <div className={styles.title}>{title}</div>
    <div className={styles.description}>{description}</div>
  </Link>
);

export default props => {
  const apps = getApps(props);
  return (
    <div className={styles.container}>
      <div className={appStyles.pageheading}>Apps</div>
      <div className={`${styles.apps} ${baseStyles.clearfix}`}>
        {apps.map(({ url, title, description, iconStyle }) => <App url={url} title={title} description={description}
                                                                   iconStyle={`${styles.icon} ${iconStyle}`}/>)}
      </div>
    </div>
  );
}
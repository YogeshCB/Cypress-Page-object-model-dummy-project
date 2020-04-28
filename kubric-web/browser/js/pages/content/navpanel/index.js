import { h } from 'preact';
import EmbeddedSelector from '../../../components/commons/EmbeddedSelector';
import styles from 'stylesheets/content/navpanel';
import fontIcons from 'stylesheets/icons/fonticons';
import appIcons from 'stylesheets/icons/app';
import HeaderMenu from './HeaderMenu';
import { isUndefined } from "@bit/kubric.utils.common.lodash";
import {
  ASSET_ROUTE,
  BANNERS_ROUTE,
  CAMPAIGNS_ROUTE,
  CATALOGUE_ROUTE,
  FEEDCARDS_ROUTE, MESSAGES_ROUTE,
  SOURCING_ROUTE
} from "../../../routes";
import DotLoader from '../../../components/commons/DotLoader';
import { getMessagesUrl } from "../../../lib/links";
import { Sidebar, Drawer } from '../../../components/Sidebar';
import Messages from '../../Messages';

const iconMap = {
  [CAMPAIGNS_ROUTE]: `${styles.navIcon} ${fontIcons.fonticonCampaigns}`,
  [CATALOGUE_ROUTE]: `${styles.navIcon} ${appIcons.iconCatalogue} ${styles.appIcon}`,
  [BANNERS_ROUTE]: `${styles.navIcon} ${fontIcons.fonticonBanner}`,
  [FEEDCARDS_ROUTE]: `${styles.navIcon} ${fontIcons.fonticonFeed}`,
  [ASSET_ROUTE]: `${styles.navIcon} ${fontIcons.fonticonFolder}`,
  [ASSET_ROUTE]: `${styles.navIcon} ${fontIcons.fonticonFolder}`,
  studio: `${styles.navIcon} ${fontIcons.fonticonStudio}`,
  [SOURCING_ROUTE]: `${styles.navIcon} ${appIcons.sourcing}`
};

const mapIcons = options => options.map(({ options, value, ...restOptions }) => ({
  ...restOptions,
  icon: isUndefined(value) ? undefined : iconMap[value],
  value,
  options: isUndefined(options) ? undefined : mapIcons(options)
}));

export default ({ notifications = [], selected, notificationsCount, options, email, workspace_id, onNavSelected }) => {
  options = mapIcons(options);

  /* Hardcoding email and  workspace id for hiding storyboards, tasks, campaigns tab*/
  if (email === 'aditi.sharma@myntra.com' || email === 'divya.ss@myntra.com' || email === 'karishma.bose@myntra.com' ||
    email === 'shilpa.jaichandran@myntra.com' || email === 'm.moktar0133@gmail.com') {
    options[2].options = options[2].options.filter(option => option.value !== 'studio')
  }
  if (email === 'test_segment@kubric.io') {
    options = options.filter(opt => opt.value !== 'assets');
    options[1].options = options[1].options.filter(option => option.value !== 'studio')
  }
  if (!(email.includes('kubric.io'))) {
    options = options.map(option => {
      if (option.value === 'apps' && option.options) {
        return { ...option, options: option.options.filter(option => option.value !== 'sourcing') }
      }
      return option;
    })
  }

  const hasNotifications = notifications.length > 0;
  return (
    <div className={styles.container}>
      <Sidebar>
				<HeaderMenu id={"controlpanel"} />
				{options.map(option => {
					const { label, icon, value, options: subOptions, link } = option;
					const isDirectLink = isUndefined(subOptions);
					return (
						<Drawer label={label} icon={label} link={link} isDirectLink={isDirectLink}>
							<EmbeddedSelector
								email={email}
								workspace_id={workspace_id}
								options={[{ ...option, helperText: option.label === "Gallery" ? "Browse" : "View All" }]}
								theme={styles}
								selected={selected}
								onSelected={onNavSelected}
								loader={<DotLoader />}
							/>
						</Drawer>
					);
				})}
				<Drawer
					icon={hasNotifications ? "NotificationsUnread" : "Notifications"}
					link={getMessagesUrl()}
					label={hasNotifications ? `Notifications (${notifications.length})` : "Notifications"}
          isDirectLink={false}>
          <Messages theme={styles} sidebar={true} showPreference={false}/>       
        </Drawer>
			</Sidebar>
    </div>
  );
};

import { h, Component } from "preact";
import { getPreactChildProps as getChildProp } from "@bit/kubric.utils.common.preact";
import styles from "stylesheets/components/sidebar";
import appIcons from "stylesheets/icons/app";
import { Link } from "@bit/kubric.utils.common.router";

export const DrawerTrigger = ({ iconClass, isSelected, label, onClick, showToolTipOnHover }) => {
  return (
    <div onClick={onClick} className={`${styles.drawerTrigger} ${isSelected ? styles.activeDrawerTrigger : ""}`}>
      <span className={`${appIcons[iconClass]}`}> </span>
      {showToolTipOnHover && <div className={`${styles.tooltip}`}>{label}</div>}
    </div>
  );
};

export const Drawer = ({ children }) => {
  return <div className={`${styles.drawerContainer}`}>{children}</div>;
};

const iconMap = {
  Recent: "sidebarIconRecent",
  Gallery: "sidebarIconGallery",
  Apps: "sidebarIconApps",
  Studio: "sidebarIconStudio",
  Notifications: "sidebarIconNotifications",
  NotificationsUnread: "sidebarIconNotificationsUnread",
};

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, selectedDrawerIndex: -1 };
  }

  render() {
    const { isOpen, selectedDrawerIndex } = this.state;
    const { children } = this.props;
    const controlpanel = children.filter(child => getChildProp(child, "id") === "controlpanel")[0];
    const drawerChildren = children.filter(child => getChildProp(child, "id") !== "controlpanel");
    const drawerIds = drawerChildren.map(child => getChildProp(child, "id"));
    const selectedChild = drawerChildren[selectedDrawerIndex];
    const drawers = drawerIds.map((id, index) => {
      const label = getChildProp(drawerChildren[index], "label");
      const icon = getChildProp(drawerChildren[index], "icon");
      const isDirectLink = getChildProp(drawerChildren[index], "isDirectLink");
      const link = getChildProp(drawerChildren[index], "link");
      const isSelected = selectedDrawerIndex === index;

      return isDirectLink ? (
        <Link to={link} className={styles.link}>
          <DrawerTrigger
            showToolTipOnHover={!isOpen}
            label={label}
            isSelected={isSelected}
            iconClass={iconMap[icon]}
            onClick={() => {
              this.setState({ selectedDrawerIndex: -1, isOpen: false });
            }}
          />
        </Link>
      ) : (
        <DrawerTrigger
          showToolTipOnHover={!isOpen}
          label={label}
          isSelected={isSelected}
          iconClass={iconMap[icon]}
          onClick={() => {
            !isDirectLink && this.setState({
              selectedDrawerIndex: index,
              isOpen: !(isOpen && index === selectedDrawerIndex)
            });
          }}
        />
      );
    });

    return (
      <div>
        <div className={styles.container}>
          {controlpanel}
          {drawers}
        </div>
        <div className={`${styles.expandedContainer}`} style={isOpen ? { left: "7rem" } : { left: "-40rem" }}>
          {selectedChild}
        </div>
        <div
          onClick={() => {
            this.setState({ isOpen: false, selectedDrawerIndex: -1 });
          }}
          className={`${styles.overlay}`}
          style={isOpen ? { opacity: "0.3", pointerEvents: "unset" } : { opacity: "0", pointerEvents: "none" }}
        />
      </div>
    );
  }
}

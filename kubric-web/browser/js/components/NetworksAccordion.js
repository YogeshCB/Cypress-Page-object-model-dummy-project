import { h, Component } from 'preact';
import styles from 'stylesheets/components/networkaccordion';
import appIcons from 'stylesheets/icons/app'
import Accordion from './commons/Accordion';
import { DummyContainer } from "./commons/misc";

const Header = ({ heading, description, isConnected, showStatus = true, icon }) => (
  <div className={styles.header}>
    {showStatus ? <div className={`${styles.status} ${ isConnected ? styles.connected : ''}`}/> : null}
    <div className={`${styles.icon} ${icon}`}/>
    <div className={styles.details}>
      <div className={styles.name}>{heading}</div>
      <div className={styles.desc}>{description}</div>
    </div>
  </div>
);

export default class NetworksAccordion extends Component {
  getCurrentNetwork(network) {
    const { networks = {} } = this.props;
    return networks[network] || {};
  }

  getCurrentUISettings(network) {
    const { ui = {} } = this.props;
    return ui[network] || {};
  }

  isConnected(network) {
    return this.getCurrentNetwork(network).isConnected;
  }

  render() {
    const { onSettingChange, current, onUIChange, onConfirm, onUnlink, showNetworks, networks,
      pickAsset, NetworkSettings, onOpenNetwork, isPickerOpen, pickerCallback } = this.props;
    const accordionTheme = {
      accordion: styles.accordion,
      section: styles.accordionSection,
      triangle: styles.triangle,
    };
    return (
      <Accordion onSelect={onOpenNetwork} theme={accordionTheme} current={current}>
        {showNetworks.map(network => {
          const isConnected = this.isConnected(network);
          const { heading, description, icon } = networks[network].headerUI;
          const Setting = NetworkSettings[network] || DummyContainer;
          const savedNetwork = this.getCurrentNetwork(network);
          const uiData = this.getCurrentUISettings(network);
          const headElement = <Header heading={heading} description={description} isConnected={isConnected}
                                      icon={appIcons[icon]}/>;
          return <Setting onChange={onSettingChange.bind(null, network)} pickerCallback={pickerCallback}
                          pickAsset={pickAsset} name={network} headElement={headElement} uiData={uiData} data={savedNetwork}
                          onUIChange={onUIChange.bind(null, network)} isConnected={isConnected} isPickerOpen={isPickerOpen}
                          onConfirm={onConfirm.bind(null, network)} onUnlink={onUnlink.bind(null, network)}
                          isLoading={uiData.isLoading}/>;
        })}
      </Accordion>
    );
  }
}
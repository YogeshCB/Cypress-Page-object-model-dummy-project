import { h, Component } from 'preact';
import ExpandableCard from './commons/ExpandableCard';
import styles from 'stylesheets/components/audiencecard';
import { capitalize } from "@bit/kubric.utils.common.lodash";
import fontIcons from 'stylesheets/icons/fonticons';

const valueParsers = {
  age({ min, max } = {}) {
    if (typeof min !== 'undefined' && typeof max !== 'undefined') {
      return `${min}-${max}`;
    } else if (min) {
      return `${min} and above`;
    } else {
      return `Below ${max}`
    }
  }
};

export default class AudienceCard extends Component {
  onClick() {
    this.props.onClick && this.props.onClick();
  }

  onRemove(e) {
    e.stopPropagation();
    this.props.onRemove && this.props.onRemove();
  }

  render() {
    const { audience = {}, active } = this.props;
    let { display_name: displayName, name: name, attributes = [] } = audience;
    displayName = displayName || name;
    return (
      <ExpandableCard theme={styles} expanded={active} onClick={::this.onClick}>
        <div className={styles.card} ref={node => this.cardNode = node}>
          <div className={styles.heading}>{displayName}</div>
          {attributes.length > 0 ? (
            <div className={styles.attributes}>
              {attributes.map(({ name, value }) => {
                return (
                  <div className={styles.attribute}>
                <span
                  className={styles.label}>{capitalize(name)}:</span>&nbsp;{typeof value === 'string' ? capitalize(value) : (valueParsers[name] ? valueParsers[name](value) : JSON.stringify(value))}
                  </div>
                )
              })}
            </div>
          ) : <span/>}
          <div className={`${styles.icon} ${fontIcons.fonticonClose}`} onClick={::this.onRemove}/>
        </div>
      </ExpandableCard>
    );
  }
};
import { h, Component } from 'preact';
import styles from 'stylesheets/components/commons/radio';
import baseStyles from '@bit/kubric.components.styles.commons';

export default class Radio extends Component {
  onChange(value) {
    this.props.onChange && this.props.onChange(value, this.props.name);
  }

  render() {
    const { options = [], label, name, theme = {}, value } = this.props;
    return (
      <div className={`${!label ? styles.noLabel : ''} ${theme.radioField || ''} ${styles.radioField}`}>
        <div className={`${styles.label || ''} ${theme.label || ''}`}>{label}</div>
        <div className={`${styles.buttons} ${baseStyles.clearfix}`}>
          {
            options.map(({ value: optionValue, label }) => {
              const isChecked = optionValue === value;
              return (
                <div className={styles.field} onClick={this.onChange.bind(this, optionValue)}>
                  <div className={`${styles.radio} ${isChecked ? styles.checked : ''}`}>
                    <div className={`${styles.ring} ${theme.ring}`}>
                      <div className={`${styles.circle} ${theme.circle}`}/>
                    </div>
                  </div>
                  <label className={theme.optionLabel} for={`${name}_${optionValue}`}>{label}</label>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}
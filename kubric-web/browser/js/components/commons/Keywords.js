import { h, Component } from 'preact';
import Field from './Field';
import styles from 'stylesheets/components/commons/keywords';

const Keyword = ({ data, onRemove }) => (
  <div className={styles.tag}>
    <span className={styles.value}>{data}</span>
    <span className={styles.iconTagClose} onClick={onRemove}>
      <svg viewBox="0 0 40 40" className={styles.icon}>
        <path className={styles.path} d="M 12,12 L 28,28 M 28,12 L 12,28"/>
      </svg>
    </span>
  </div>
);

export default class KeywordsField extends Component {
  state = {
    value: ''
  };

  onChange(value) {
    const { onChange } = this.props;
    this.setState({ value });
    onChange && onChange(value);
  }

  onDelete(value) {
    const { onDelete } = this.props;
    onDelete && onDelete(value);
  }

  onAdd() {
    const { onAdd } = this.props;
    const added = this.state.value;
    if (added && added.length > 0) {
      this.setState({ value: '' });
      onAdd && onAdd(added);
    }
  }

  onKeyPress(e) {
    if (e.charCode === 13) {
      this.onAdd();
    }
  }

  render() {
    const { values = [], label = '', SelectedComponent = Keyword, onFocus, showIcon = false } = this.props;
    return (
      <div className={styles.keywords}>
        <div className={styles.field}>
          <Field label={label} value={this.state.value} onChange={::this.onChange} onKeyPress={::this.onKeyPress}
                 onFocus={onFocus}/>
          {showIcon ? (
            <div className={styles.iconContainer}>
              <div className={styles.iconAdd} onClick={::this.onAdd}/>
            </div>
          ) : (
            <div className={styles.addText} onClick={::this.onAdd}>Add</div>
          )}
        </div>
        <div className={styles.selected}>
          {values.map(keyword => <SelectedComponent data={keyword}
                                                    onRemove={this.onDelete.bind(this, keyword)}/>)}
        </div>
      </div>
    );
  }
};

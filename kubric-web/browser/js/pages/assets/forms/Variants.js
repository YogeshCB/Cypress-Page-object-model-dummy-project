import { h, Component } from "preact";
import styles from 'stylesheets/assets/form';
import { copy } from "../../../components/commons/misc";
import appicons from 'stylesheets/icons/app';
import fonticons from 'stylesheets/icons/fonticons';
import ConfirmationDialog from "../../../components/commons/ConfirmationDialog";
import { getFullDate } from "../../../lib/date";

export default class Variants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: '',
      variantActive: ''
    }
  }

  selectVariant = active => {
    const { asset, setActiveVariant } = this.props;
    if (active.id === this.state.active) {
      this.setState({
        active: ''
      })
    } else {
      this.setState({
        active: active.id
      })
    }
    setActiveVariant(asset.id, active.url);
  };

  download = url => window.open(url, '_blank');

  setActive = variantActive =>
    this.setState({
      variantActive
    });

  onCopied = () => console.log('copied');

  render() {
    const { setActiveAsset, versions = [], asset, deleteAssetVariant, deleteVariantDialog, showDeleteVariant } = this.props;
    const { active, variantActive } = this.state;
    return <span>
            <div className={styles.variantContainer}>        
            {versions.length > 0 ? versions.map(variant => {
              const versionDate = new Date(variant.created_time);
              return <div className={`${styles.variantCard} ${variant.id === active ? styles.activeVariant : ''}`}>
                <div className={styles.imgVariant} onClick={this.selectVariant.bind(this, variant)}>
                  <img src={variant.url} className={styles.variant}/>
                </div>
                <div className={styles.variantContent}>
                  <span className={styles.name}>{variant.name}</span>
                  <span className={styles.date}>{getFullDate(versionDate)}</span>
                  <span onClick={setActiveAsset.bind(null, asset.id, variant.url, variant.id)}
                        className={`${asset.url === variant.url ? appicons.iconStarActive : appicons.iconStar} ${styles.icon}`}/>&nbsp;
                  <span onClick={(e) => copy(e, this.onCopied, variant.url)}
                        className={`${appicons.iconCBTheme} ${styles.icon}`}/>
                </div>
              </div>
            }) : 'No Versions to show.'}
            </div>
            <ConfirmationDialog onConfirm={() => {
              this.setActive('');
              deleteVariantDialog();
              deleteAssetVariant(asset.id, variantActive);
            }} onCancel={deleteVariantDialog} heading={'Are you sure you want to delete the variant?'}
                                visible={showDeleteVariant}/>
            </span>
  }
}
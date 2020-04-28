import { h, Component } from 'preact';
import ImageElmt from './commons/media/Image';
import styles from 'stylesheets/components/commons/keyframe';
import { debounce } from "@bit/kubric.utils.common.lodash";

const Rectangle = ({ objectStyles }) =>
  <div className={styles.object} style={objectStyles}/>;

const Circle = ({ objectStyles }) =>
  <div className={styles.object} style={objectStyles}/>;

const Image = ({ objectStyles, url }) =>
  <img className={styles.object} src={url} style={objectStyles}/>;

const Text = ({ objectStyles, text = '', onChange, onClick }) => (
  <div contentEditable={true} className={`${styles.object} ${styles.text}`} style={objectStyles}
       onKeyUp={onChange} onFocus={onClick}>{text}</div>
);

const objectMap = {
  'image': Image,
  'rectangle': Rectangle,
  'circle': Circle,
};

const normalizeData = data => ({
  ...data,
  objectStyles: {
    left: data.position ? (data.type === 'circle' ? `${data.position.x - data.radius}px` : `${data.position.x}px`) : undefined,
    top: data.position ? (data.type === 'circle' ? `${data.position.y - data.radius}px` : `${data.position.y}px`) : undefined,
    width: data.type === 'circle' ? `${2 * data.radius}px` : (data.width ? `${data.width}px` : 'auto'),
    height: data.type === 'circle' ? `${2 * data.radius}px` : (data.height ? `${data.height}px` : 'auto'),
    backgroundColor: data.background,
    borderRadius: data.type === 'circle' ? `${data.radius}px` : undefined,
  },
});

export default class KeyFrame extends Component {
  onImageClick(index) {
    const { onOpenAssets, onObjectClick } = this.props;
    onObjectClick && onObjectClick(index);
    onOpenAssets && onOpenAssets();
  }

  getOtherComponents() {
    const { objects = [], onObjectClick } = this.props;
    const others = objects.map(obj => obj.type !== 'background' && obj.type !== 'text' ? obj : undefined);
    return others.map(({ type = '' } = {}, index) => {
      const ObjectComponent = objectMap[type];
      return <ObjectComponent onClick={onObjectClick.bind(null, index)}/>
    });
  }

  render() {
    const { objects = [], onTextChange, onObjectClick } = this.props;
    const backgroundIndex = objects.findIndex(({ type }) => type === 'background');
    const background = objects[backgroundIndex] || {};
    const textIndex = objects.findIndex(({ type }) => type === 'text');
    const text = normalizeData(objects[textIndex] || {});
    return (
      <div className={styles.keyframe}>
        <ImageElmt image={background.url} onClick={this.onImageClick.bind(this, backgroundIndex)}
                   theme={{ container: styles.uploader }}/>
        {this.getOtherComponents()}
        <Text {...text} onClick={onObjectClick.bind(null, textIndex)} onChange={debounce(e => onTextChange(e.target.innerText), 150)}/>
      </div>
    );
  }
}
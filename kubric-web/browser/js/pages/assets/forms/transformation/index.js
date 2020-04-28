import { h } from 'preact';
import styles from 'stylesheets/assets/transform';
import appicons from 'stylesheets/icons/app';
import { Spinner } from "../../../../components";
import Effects from './effects';
import Rotate from './rotate';
import Resize from './resize';
import Crop from './crop';
import config from '../../../../config';
import { LinkButton } from '../../../../components/commons/misc';

const gridStylesSmall = config.assets.gridStylesSmall;

const Frame = ({ drawerWidth, width, height, transformData = { x0, x1, y0, y1, rotateBy } }) => {
  const heightRatio = 250 / height;
  const widthRatio = drawerWidth / width;

  return transformData ? <div style={{ width: `${width * widthRatio}px`, height: `${height * heightRatio}px` }}
                              className={styles.frameContainer}>
    <div style={{ left: 0, top: 0, bottom: 0, width: `${transformData.x0 * widthRatio}px` }} className={styles.filler}/>
    <div style={{
      bottom: 0,
      left: `${transformData.x0 * widthRatio}px`,
      top: `${transformData.y1 * heightRatio}px`,
      right: `${(width - transformData.x1) * widthRatio}px`
    }} className={styles.filler}/>
    <div style={{ left: `${transformData.x1 * widthRatio}px`, right: 0, top: 0, bottom: 0 }} className={styles.filler}/>
    <div style={{
      top: 0,
      left: `${transformData.x0 * widthRatio}px`,
      right: `${(width - transformData.x1) * widthRatio}px`,
      height: `${transformData.y0 * heightRatio}px`
    }} className={styles.filler}/>
    <div style={{
      width: `${(transformData.x1 - transformData.x0) * widthRatio}px`,
      height: `${(transformData.y1 - transformData.y0) * heightRatio}px`,
      left: `${transformData.x0}px`,
      margin: 'auto',
      top: `${transformData.y0}px`,
    }} className={styles.frwame}>
    </div>
  </div> : ''
};
const copy = (e, onCopied, value) => {
  e.preventDefault();
  let textField = document.createElement('textarea');
  textField.innerText = value;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  onCopied && setImmediate(onCopied, value);
};

const transformBarMenu = [{
  icon: `${styles.iconCrop} ${appicons.iconRotate}`,
  label: 'Rotate',
  id: 'ROTATE'
}, {
  icon: `${styles.iconCrop} ${appicons.iconResize}`,
  label: 'Resize',
  id: 'RESIZE'
}, {
  icon: `${styles.iconCrop} ${appicons.iconCrop}`,
  label: 'Crop',
  id: 'CROP'
}, {
  icon: `${styles.iconCrop} ${appicons.iconPalette}`,
  label: 'Filter',
  id: 'FILTER'
}]

const Transform = (props) => {
   
  const { transform, selected, loading, url, urls, grid, selectedForm, showTransformation, hideTransformation,
  onConfirmTransform, drawerWidth, width, height, form } = props;
  
  const spinnerStyles = {
    container: styles.spinnerContainer,
    overlay: styles.spinnerOverlay,
    spinner: styles.spinner
  }

  const getForm = (selected) => {
    switch (selected) {
      case 'resize': 
        return <Resize {...props}/>
      case 'filter':
        return <Effects {...props} />
      case 'rotate':
        return <Rotate {...props}/>
      case 'crop':
        return <Crop {...props}/>
      default:
        return ''
    }
  } 
  const { rotateBy, resize } = transform;
 

  return (<div className={styles.transform}>
      <div style={grid?gridStylesSmall:{}} className={styles.imgContainer}>
        {loading && <Spinner theme={spinnerStyles}/>}
        <img draggable="false" style={rotateBy !== '0' ? {  
            transform: `rotate(${-Number(rotateBy)}deg)`, 
            width: `${resize ? resize.w:''}px`, 
            height: `${resize?resize.h:''}px`,
            opacity: grid? '0.7':'1' 
          } : {}} className={styles.img}
             src={urls[selected[0]] ? urls[selected[0]] : url}/>
        {selectedForm === 'resize' || selectedForm === 'crop'  && <Frame drawerWidth={drawerWidth} width={width} height={height} transformData={transform}/>}        
      </div>      
      {form === 'transform' && <div className={`${styles.transformBar}`}>
        {transformBarMenu.map((menu,index)=> {
          return [<h4 className={`${styles.menu} ${selectedForm === menu.id.toLowerCase()? styles.menuActive:''}`} onClick={showTransformation.bind(null, menu.id)}>
            <span className={`${menu.icon}`}></span>&nbsp;
            <span className={selectedForm === menu.id.toLowerCase()?styles.menuLabel:''}>{menu.id.toLowerCase() === selectedForm ?menu.label : ''}</span>
          </h4>,selectedForm===''&&index!==transformBarMenu.length-1?<div className={styles.separator}></div>:'']
        })}
      </div>}
      <div className={styles.container}>
        {getForm(selectedForm)}
      </div>
    </div>
  );
}
export default Transform;

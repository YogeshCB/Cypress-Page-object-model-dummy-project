import { h } from 'preact';
import styles from 'stylesheets/assets/folderstatus';
import appIcon from 'stylesheets/icons/app';

export default ({selectedFolderPath, onClick})=>{
    const { folderPath = '', folderNames = [] } = selectedFolderPath;

    let path = folderPath.split('/').filter(paths => paths !== '');
    
    return <div className={styles.status}>
        <span className={`${appIcon.iconFolderFilled} ${styles.icon}`}></span>&nbsp;{path.map((paths, index) => {
        const showPath = path.length - 1 === index;

        return <span onClick={onClick.bind(null, paths)}>
                    {folderNames[index]}
          {showPath ? ' ' : ' > '}
      </span>
      })}</div>
}
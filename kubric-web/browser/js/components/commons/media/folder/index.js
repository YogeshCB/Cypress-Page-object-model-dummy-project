import { h } from 'preact';
import Media from '../Media';
import styles from 'stylesheets/components/commons/media/folder/index';

export default class Folder extends Media {
  render() {
    const {
      theme = {}, onClick, className = '', shrinkOptions, shared, name, view, actionable
    } = this.props;
    return (
      <div onClick={onClick} style={{ textAlign: 'center' }}
           className={`${theme.container} ${styles.container} ${className} ${actionable ? styles.actionable : ''}`}>
        <div className={`${styles.size} ${theme.size || ''}`}>
          {shared ? <FolderSharedIcon/> : <FolderIcon/>}
        </div>
        <div className={`${styles.nameTile} ${shrinkOptions ? styles.nameFont : ''}`} onClick={onClick}
             alt={name}>{name}</div>
      </div>)
  }
}

const FolderIcon = () => (
  <svg className={styles.folderIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 48">
    <defs>
      <linearGradient x1="0%" y1="10.4938272%" x2="100%" y2="89.5061728%" id="A">
        <stop stop-color="#715faa" offset="0%"/>
        <stop stop-color="#29146b" offset="100%"/>
      </linearGradient>
    </defs>
    <path
      d="M51.34 48H2.66C1.19 48 0 46.764 0 45.25V2.764C0 1.236 1.19 0 2.66 0h9.758a3.11 3.11 0 0 1 2.275 1.01l5.796 6.34a3.06 3.06 0 0 0 2.275 1.01H51.34C52.81 8.36 54 9.595 54 11.1v34.113C54 46.764 52.81 48 51.34 48z"
      fill="url(#A)" fill-rule="nonzero"/>
  </svg>
);
const FolderSharedIcon = () => (
  <svg className={styles.folderIcon} xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 55 48">
    <defs>
      <linearGradient x1="0%" y1="11.9173554%" x2="100%" y2="88.0826446%" id="A">
        <stop stop-color="#715faa" offset="0%"/>
        <stop stop-color="#29146b" offset="100%"/>
      </linearGradient>
    </defs>
    <g fill-rule="nonzero">
      <path
        d="M52.3 48H2.7C1.21 48 0 46.764 0 45.25V2.764C0 1.236 1.21 0 2.7 0h9.94c.876 0 1.718.372 2.318 1l5.904 6.34c.6.65 1.44 1 2.318 1H52.3c1.5 0 2.7 1.236 2.7 2.75v34.113C55 46.764 53.79 48 52.3 48z"
        fill="url(#A)"/>
      <path
        d="M37.813 17.357c-2.62 0-4.77 2.143-4.77 4.757s2.148 4.757 4.77 4.757 4.77-2.143 4.77-4.757-2.148-4.757-4.77-4.757zm7.09 12.086c-1.246-1.243-3.008-1.97-4.855-1.97h-4.47c-1.848 0-3.6.73-4.855 1.97-1.934 1.93-3.008 4.5-3.008 7.243a.86.86 0 0 0 .859.857h18.52a.86.86 0 0 0 .859-.857c-.043-2.786-1.117-5.357-3.05-7.243z"
        fill="#fff"/>
    </g>
  </svg>
);

export const InactiveFolder = props => <Folder {...props} theme={{ container: styles.inactive }} actionable={false}/>;


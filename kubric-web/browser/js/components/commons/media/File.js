import { h } from 'preact';
import styles from 'stylesheets/components/commons/media/file';
import MediaCard from './MediaCard';

export const FileSVG = ({ file_type, theme }) => (<svg className={`${styles.svgStyle} ${theme? theme.svgStyle:''}`} viewBox="0 0 64 66" version="1.1" xmlns="http://www.w3.org/2000/svg"> 
    <defs>
        <linearGradient x1="21.3039486%" y1="0%" x2="78.6960514%" y2="100%" id="linearGradient-1">
            <stop stop-color="#715FAA" offset="0%"></stop>
            <stop stop-color="#29146B" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="empty-state-copy" transform="translate(-513.000000, -95.000000)">
            <g id="file" transform="translate(513.000000, 95.000000)">
                <g id="Group-5">
                    <path d="M49.999984,53 L49.999984,62.7467866 C49.999984,64.5407784 48.5255811,66 46.7132155,66 L3.28676852,66 C1.47427268,66 0,64.5406495 0,62.7467866 L0,3.25321339 C0,1.4592216 1.47440292,0 3.28689875,0 L36.4877279,0 C36.9181582,0 37.3080851,0.172476899 37.5903067,0.451559476 C37.5908277,0.451946195 37.5912184,0.452075102 37.5917393,0.452590728 L49.5428553,12.2818248 C49.8373191,12.5734113 49.9923001,12.9619355 49.9967281,13.3584519 C49.997249,13.3639949 50.0002445,13.3687644 49.999984,13.3744363 L49.999984,21 L46.8777037,21 L46.8777037,14.9198963 L38.2134865,14.9198963 C36.4009906,14.9198963 34.9264575,13.460288 34.9264575,11.6664251 L34.9264575,3.09066229 L3.28689875,3.09066229 C3.19638466,3.09066229 3.12267103,3.16362337 3.12267103,3.25321339 L3.12267103,62.7469155 C3.12267103,62.8365055 3.19638466,62.9094666 3.28689875,62.9094666 L46.7133457,62.9094666 C46.8038598,62.9094666 46.8775734,62.8365055 46.8775734,62.7469155 L46.8777037,62.7469155 L46.8777037,53 L49.999984,53 Z M38.0489983,5.27627202 L38.0489983,11.6664251 C38.0489983,11.7560151 38.1228421,11.8291051 38.2133562,11.8291051 L44.6694203,11.8291051 L38.0489983,5.27627202 Z" id="Combined-Shape" fill="url(#linearGradient-1)" fill-rule="nonzero"></path>
                    <text id=".MP4" font-family="Proxima Nova" font-size="14" fill="#29146B">
                        <tspan x="22" y="40">{file_type && file_type.toUpperCase()}</tspan>
                    </text>
                </g>
            </g>
        </g>
    </g>
</svg>)

export const File = ({ filename, onClick, file_type, id, url, actionable, theme, className = '', shrinkOptions }) => (<div>
    <div onClick={onClick}
       className={`${styles.container}  ${className} ${actionable ? styles.actionable : ''} ${theme.container}`}>    
    <FileSVG file_type={file_type || ''} theme={theme}/>
  </div>
  <MediaCard file_type={file_type} filename={filename} theme={shrinkOptions?{...styles, name:styles.nameFont}:styles}/>
  </div>);

import { h } from 'preact';
import avatarStyles from 'stylesheets/components/commons/profileavatar';
import iconStyles from 'stylesheets/icons/shell';
import appicons from 'stylesheets/icons/app';
import buttonStyles from 'stylesheets/components/commons/button';
import fieldStyles from 'stylesheets/components/commons/staticfield';
import baseStyles from '@bit/kubric.components.styles.commons';
import mixinUploader from '../../mixins/uploader';

export const ProfileAvatar = ({ pic }) => (pic ? <img src={pic} className={avatarStyles.avatar}/> :
  <div className={`${avatarStyles.avatar} ${iconStyles.iconUser}`}/>);

const getButton = (type = 'link') => ({ type: customType, showDropArrow = false, icon, theme = {}, className, children, isDisabled, hidden = false, ...props }) => {
  type = customType || type;
  isDisabled && (props.disabled = true);
  return (<button {...props} tabIndex={"0"}
                  className={`${buttonStyles[type] || ''} ${theme.button} ${className || ''} ${isDisabled ? buttonStyles.disabled : ''} ${hidden ? buttonStyles.hidden : ''}`}>
    {icon ? <span className={`${buttonStyles.icon} ${theme.icon} ${icon}`}/> : <span/>}
    {children}
    {(type === 'dropdown' || showDropArrow) ? <span className={buttonStyles.triangle}/> : <span/>}
  </button>);
};

export const PrimaryButton = getButton('secondary');

export const SolidButton = getButton('primary');

export const LinkButton = getButton();

export const SecondaryButton = getButton();

export const DropDownButton = getButton('dropdown');

export const copy = (e, onCopied, value) => {
  e.preventDefault();
  let textField = document.createElement('textarea');
  textField.innerText = value;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  onCopied && setImmediate(onCopied, value);
};

export const StaticField = ({ label = '', value = '', copyValue, dark = false, theme = {}, enableCopy, showLabel = true, onCopied }) => (
  <div className={`${theme.field || ''} ${fieldStyles.field}`}>
    {showLabel ? <div className={`${baseStyles.fieldlabel} ${fieldStyles.label}`}>{label}</div> : ''}
    {showLabel ? <div className={`${theme.value} ${fieldStyles.value}`}>{value}</div> : ''}
    {enableCopy ? <span className={`${fieldStyles.icon} ${theme.icon} ${dark ? appicons.iconCBDark : appicons.iconCB}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copy(e, onCopied, copyValue || value)
                        }}/> : ''}
  </div>
);

export const getUploadButton = (options = {}) => mixinUploader(LinkButton, options);

export const DummyContainer = props => <div {...props}>{props.children}</div>;

export const FieldLabel = props => <label
  className={`${props.className || ''} ${baseStyles.fieldlabel}`} {...props}>{props.children}</label>;
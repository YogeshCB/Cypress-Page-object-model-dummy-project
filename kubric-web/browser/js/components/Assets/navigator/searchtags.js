import { h } from 'preact';
import { Tag } from "../../index";
import styles from 'stylesheets/assets/searchtags';
import { capitalize } from '@bit/kubric.utils.common.lodash';

const colorTag = (label) => <span>
<span style={{ background: `#${label}` }} className={styles.colorTile}/>#{label}
</span>;

export default ({ tags, onFilterDeleted }) => (<span className={styles.tagBubble}>
            {tags.filter(tag => tag.filter.id !== 'query' && (tag.filter.id !== 'auto_gen') && (tag.filter.id !== 'tr') && (tag.filter.id !== 'private' && tag.filter.data.value !== true))
              .map(tag => <Tag
                theme={styles}
                hideRemove={!tag.filter.editable}
                label={tag.filter.id ==='is_banner' && tag.filter.data.value==='false' ? 'Non Banners':tag.filter.id === 'co' ? colorTag(tag.value) : capitalize(tag.value)}
                onRemove={() => onFilterDeleted(tag.filter)}
              />)}
        </span>)

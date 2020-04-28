import { h, Component } from 'preact';
import styles from 'stylesheets/components/filters';
import Checkbox from './commons/Checkbox';
import ImageGrid from './commons/MediaGrid';
import Image from './commons/media/Image';

const addIndices = (filters, parentIndex) =>
  filters.map((filter, index) => ({
    ...filter,
    index: `${typeof parentIndex !== 'undefined' ? `${parentIndex}.` : ''}${index}`,
  }));

const FilterSection = ({ name, children, partial, selected, index, onSelected, onUnselected }) => {
  return (
    <ul className={styles.section}>
      <li className={styles.sectionName}>
        <Checkbox checked={selected || partial} partial={partial} label={name} theme={styles} id={index}
                  onChange={checked => checked ? onSelected(index) : onUnselected(index)}/>
        {
          children.length > 0 && children[0].image ? (
            <div className={styles.sectionName}>
              <ImageGrid selectable={true} multiple={true} onSelected={onSelected}
                         selected={children.map((child, index) => child.selected ? index : undefined).filter(elmt => typeof elmt !== 'undefined')}
                         images={addIndices(children, index).map(imageData => <Image image={imageData.image}
                                                                                     theme={{ container: styles.imageContainer }}
                                                                                     data={imageData.index}/>)}
                         onUnselected={onUnselected}/>
            </div>
          ) : (
            addIndices(children, index)
              .map(child => <FilterSection {...child} onSelected={onSelected} onUnselected={onUnselected}/>)
          )
        }
      </li>
    </ul>
  );
};

export default ({ filters, onUnselected, onSelected }) => (
  <div className={styles.filters}>
    {
      addIndices(filters)
        .map(filter => <FilterSection {...filter} onSelected={onSelected} onUnselected={onUnselected}/>)
    }
  </div>
);
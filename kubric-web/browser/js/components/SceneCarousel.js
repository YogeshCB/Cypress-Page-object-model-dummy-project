import { h, Component } from 'preact';
import Carousel from './commons/Carousel';
import { getMediaTime } from "../lib/utils";
import { SelectableGrid } from "./commons/hoc";
import styles from 'stylesheets/components/scenecarousel';

export default ({ scenes = [], selected, onSelected }) => {
  let previousDuration = 0;
  return (
    <Carousel className={styles.sceneCarousel}>
      <SelectableGrid selected={selected} onSelected={onSelected}>
        {scenes.map((scene, index) => {
          const time = getMediaTime(previousDuration);
          previousDuration += (scene.duration / 1000);
          return (
            <div className={styles.screenshot} data={scene}>
              <img className={styles.image} src={scene.cover}/>
              <div className={styles.moment}>{time}</div>
            </div>
          )
        })}
      </SelectableGrid>
    </Carousel>
  );
};

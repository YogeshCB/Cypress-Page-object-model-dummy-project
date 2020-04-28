import { h } from 'preact';
import styles from "stylesheets/campaign/index";
import NextButton from './NextButton';
import appIcons from 'stylesheets/icons/app';

const getPageNumberClasses = (pageNumber, current) => `${pageNumber === current ? styles.selected : ''}  ${pageNumber > current ? styles.pending : ''} ${pageNumber < current ? styles.done : ''}`;

export default ({ children, name, pageNumber, feed }) => (
  <div className={styles.container}>
    {(pageNumber === 0 || pageNumber === 1) ? (
      <div className={styles.header}>
        <div>
          <div className={styles.navigation}>
            <div className={`${styles.section} ${getPageNumberClasses(0, pageNumber)}`}>Choose Storyboard</div>
            <div className={`${styles.seperator} ${getPageNumberClasses(1, pageNumber)}`}>></div>
            <div className={`${styles.section} ${getPageNumberClasses(2, pageNumber)}`}>Generate Creatives</div>
          </div>
          <div className={styles.name}>{name} &nbsp;<span className={`${appIcons.iconFeed} ${styles.feed}}`}
                                                          onClick={() => window.open(feed, "_blank")}/></div>
        </div>
        <NextButton pageNumber={pageNumber}/>
      </div>
    ) : <span/>}
    <div className={`${styles.content} ${styles[`page${pageNumber}`]}`}>
      {children}
    </div>
  </div>
);
import { h } from 'preact';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ExpandableCard from '../../browser/js/components/commons/ExpandableCard';
import styles from './styles.scss';

storiesOf('ExpandableCard', module)
  .add('Default', () => (
    <div>
      <ExpandableCard className={styles.expandable}>
        <div className={styles.card}>
          Our service dependency layer is still very new and there are a number of improvements we want to make, but
          it’s
          been great to see the thinking translate into higher availability and a better experience for members. That
          said, a ton of work remains to bolster the system, increase fallback coverage, refine visualizations and
          insights, etc. If these kinds of challenges excite you, especially at large scale, in the cloud, and on a
          small,
          fast-moving team, we’re actively looking for DevOps engineers.
        </div>
      </ExpandableCard>
      <ExpandableCard className={styles.expandable}>
        <div className={styles.card}>
          Our service dependency layer is still very new and there are a number of improvements we want to make, but
          it’s
          been great to see the thinking translate into higher availability and a better experience for members. That
          said, a ton of work remains to bolster the system, increase fallback coverage, refine visualizations and
          insights, etc. If these kinds of challenges excite you, especially at large scale, in the cloud, and on a
          small,
          fast-moving team, we’re actively looking for DevOps engineers.
        </div>
      </ExpandableCard>
      <ExpandableCard className={styles.expandable}>
        <div className={styles.card}>
          Our service dependency layer is still very new and there are a number of improvements we want to make, but
          it’s
          been great to see the thinking translate into higher availability and a better experience for members. That
          said, a ton of work remains to bolster the system, increase fallback coverage, refine visualizations and
          insights, etc. If these kinds of challenges excite you, especially at large scale, in the cloud, and on a
          small,
          fast-moving team, we’re actively looking for DevOps engineers.
        </div>
      </ExpandableCard>
    </div>
  ));
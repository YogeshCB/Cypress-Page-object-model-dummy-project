import { h } from 'preact';
import Drawer from '../../../components/commons/Drawer';
import styles from 'stylesheets/assets/form';
import StaticForm from './staticform';
import EditForm from './editform';
import FilterPanel from './FilterPanel';

export default props => {
  const { show, onHide, staticForm = false, showFilters } = props;

  return (
    show ? (
      <Drawer show={show} onHide={onHide} theme={styles} heading={''}>
        {staticForm ? <StaticForm {...props}/> :<EditForm {...props}/>}
      </Drawer>
    ) : showFilters?  (
      <Drawer showClose={false} show={!show} onHide={onHide} theme={styles} heading={''}>
        <FilterPanel/>
      </Drawer>
    ) : ''
  );
}

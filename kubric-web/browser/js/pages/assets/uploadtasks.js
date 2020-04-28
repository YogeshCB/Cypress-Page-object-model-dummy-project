import { h } from 'preact';
import TaskProgress from '../../components/commons/TaskProgress';
import styles from 'stylesheets/assets/uploaddialog';


export default ({ tasks = [], onRetryTask }) => {
  tasks = tasks.reverse();
  return <div className={styles.uploadTasks}>
    {tasks.map(task => {
      return <TaskProgress onRetryTask={onRetryTask} data={task}/>
    })}
  </div>
}
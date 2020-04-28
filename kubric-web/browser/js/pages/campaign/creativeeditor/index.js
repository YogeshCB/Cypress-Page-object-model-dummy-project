import { h } from 'preact';
import styles from 'stylesheets/campaign/creative/index';
import appStyles from 'stylesheets/app';
import Player from './Player';
import { SingleEditor, BulkEditor } from './Editor';
import { SinglePlayer, BulkPlayer } from './Player';

export default ({ name = '', shotCount = 0, mode = 'single' }) => {
  const Editor = mode === 'single' ? SingleEditor : BulkEditor;
  const Player = mode === 'single' ? SinglePlayer : BulkPlayer;
  return (
    <div className={styles.container}>
      {name.length > 0 ? <div className={appStyles.pageheading}>{name}</div> : <span/>}
      {shotCount > 0 ? <Editor/> : <span/>}
      {shotCount > 0 ? <Player/> : <span/>}
    </div>
  );
}
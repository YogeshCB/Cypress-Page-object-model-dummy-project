import { h } from 'preact';
import { isString } from "@bit/kubric.utils.common.lodash";
import styles from 'stylesheets/components/commons/chatter';

const User = ({ name, email, dp, color = {} }) => {
  const userLabel = name || email || '';
  return (
    <div className={styles.user}>
      {dp ? <div className={styles.avatar} style={{ backgroundImage: `url(${dp})` }}/> :
        <div className={styles.initial} style={{
          color: color.text,
          backgroundColor: color.bg,
          borderColor: color.text
        }}>{userLabel[0].toUpperCase()}</div>}
      <div className={styles.name} style={{ color: color.text }}>{userLabel}</div>
    </div>
  );
};

const MentionPart = ({ value = {} }) => <span className={styles.mention}>{value.text}</span>;

const TextPart = ({ value }) => <span>{value}</span>;

const typeMap = {
  mention: MentionPart,
  text: TextPart
};

const MessageLine = ({ parts = [] }) => (
  <p>
    {parts.map(({ type, value }) => {
      const TypeComponent = typeMap[type];
      return <TypeComponent value={value}/>;
    })}
  </p>
);

const getLines = (text = []) => text.map(line => <MessageLine parts={line}/>);

export default ({ text, user = {}, time, align = "left", showUser = true, sent }) => (
  <div className={`${styles.message} ${!sent ? styles.unsent : ''} ${styles[align]}`}>
    {showUser ? <User {...user}/> : <span/>}
    <div className={styles.text}>
      {isString(text) ? text : getLines(text)}
      <div className={styles.time}>{time}</div>
    </div>
  </div>
);

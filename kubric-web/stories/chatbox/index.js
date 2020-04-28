import { h, Component } from 'preact';

import ChatBox from '../../browser/js/components/commons/Chatter/ChatBox/index';
import { storiesOf } from '@storybook/react';
import theme from './styles.scss';

const tagUsers = [
  {
    "id": "suresh@kubric.io",
    "label": "suresh",
    "dp": {
      "bg": "hsl(47, 30%, 80%)",
      "text": "hsl(47, 30%, 50%)"
    }
  },
  {
    "id": "somay@kubric.io",
    "label": "Somay Bhatnagar",
    "dp": {
      "bg": "hsl(191, 30%, 80%)",
      "text": "hsl(191, 30%, 50%)"
    }
  },
  {
    "id": "barada@kubric.io",
    "label": "Barada Sahu",
    "dp": {
      "bg": "hsl(306, 30%, 80%)",
      "text": "hsl(306, 30%, 50%)"
    }
  },
  {
    "id": "chaitanya@kubric.io",
    "label": "Chaitanya Nettem",
    "dp": "https://lh5.googleusercontent.com/-936j7xPO_fI/AAAAAAAAAAI/AAAAAAAAAAA/AAN31DXY_Id-QroADvHfjTWGYKjrabyhHw/mo/photo.jpg"
  },
  {
    "id": "jainy@kubric.io",
    "label": "Jainy Talreja",
    "dp": {
      "bg": "hsl(244, 30%, 80%)",
      "text": "hsl(244, 30%, 50%)"
    }
  },
  {
    "id": "aashay@kubric.io",
    "label": "Aashay Sachdeva",
    "dp": "https://lh4.googleusercontent.com/-f81s76xGSjM/AAAAAAAAAAI/AAAAAAAAAAA/AKxrwcbysAELOM10niefYgSylDeJFR7yGw/mo/photo.jpg"
  },
  {
    "id": "sureshkumark.scorp@gmail.com",
    "label": "Suresh Kumar",
    "dp": "https://lh4.googleusercontent.com/-o_kfKbLs4I0/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfZj0xauZ9ZMRlTfZ4kI7mZAzG0tw/mo/photo.jpg"
  },
  {
    "id": "paroksh@kubric.io",
    "label": "Paroksh",
    "dp": {
      "bg": "hsl(-147, 30%, 80%)",
      "text": "hsl(-147, 30%, 50%)"
    }
  },
  {
    "id": "vinita@kubric.io",
    "label": "Vinita Sharma",
    "dp": "https://lh6.googleusercontent.com/-47-wRjbmkqU/AAAAAAAAAAI/AAAAAAAAAAA/AAN31DX5AfVz_nESzPru49fFJFxbEIpAWA/mo/photo.jpg"
  },
  {
    "id": "kaus@kubric.io",
    "label": "kaus",
    "dp": {
      "bg": "hsl(-233, 30%, 80%)",
      "text": "hsl(-233, 30%, 50%)"
    }
  },
  {
    "id": "amit.phadke@kubric.io",
    "label": "Amit Phadke",
    "dp": "https://lh3.googleusercontent.com/-Aflidj-XofM/AAAAAAAAAAI/AAAAAAAAAAA/ABtNlbBt0oFlIpIWFwUrIA973MWA3cxK4Q/mo/photo.jpg"
  },
  {
    "id": "jophin@kubric.io",
    "label": "Jophin Joseph",
    "dp": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
  },
  {
    "id": "kunal@kubric.io",
    "label": "kunal",
    "dp": {
      "bg": "hsl(55, 30%, 80%)",
      "text": "hsl(55, 30%, 50%)"
    }
  }
];

storiesOf('Chatbox', module)
  .add('Default', () => (
    <div>
      <div className={theme.test}/>
      <ChatBox placeholder="Enter feedback" theme={theme} onSend={console.log} tagUsers={tagUsers}/>
    </div>
  ));
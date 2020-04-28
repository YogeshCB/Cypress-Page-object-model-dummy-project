import { h, Component } from 'preact';
import { storiesOf } from '@storybook/react';
import Chatter from '../../browser/js/components/commons/Chatter/index';

const messages = [
  {
    "type": "datebucket",
    "payload": {
      "date": "Yesterday"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my first message",
      "user": {
        "email": "jo@phi.n",
        "name": "Jophin Joseph",
        "dp": "https://trello-avatars.s3.amazonaws.com/d0a218b2d0538aff11dc45963a9609db/50.png",
        "color": {
          "text": "#83BCA9"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my second and third message",
      "user": {
        "email": "jo@phi.n",
        "name": "Jophin Joseph",
        "dp": "https://trello-avatars.s3.amazonaws.com/d0a218b2d0538aff11dc45963a9609db/50.png",
        "color": {
          "text": "#83BCA9"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my third message",
      "user": {
        "email": "jo@phi.n",
        "name": "Jophin Joseph",
        "dp": "https://trello-avatars.s3.amazonaws.com/d0a218b2d0538aff11dc45963a9609db/50.png",
        "color": {
          "text": "#83BCA9"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my 4th message",
      "user": {
        "email": "jo@phi.n",
        "name": "Jophin Joseph",
        "dp": "https://trello-avatars.s3.amazonaws.com/d0a218b2d0538aff11dc45963a9609db/50.png",
        "color": {
          "text": "#83BCA9"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my first messageHe was promoted to Army Commander, January 2016 and assumed Command of Southern Command..\nThe same year, he moved to Delhi as VCOAS. \nIt was during his tenure as VCOAS, the Army went for the Post Uri Cross LoC strikes.\nIn December 2016, it was announced Gen Bipin Rawat UYSM, AVSM, YSM, SM, VSM would assume command of the Indian Army, as COAS.\nHe assumed office on 1 Jan 2017, and, it was assumed he would receive his PVSM in 2017.",
      "user": {
        "email": "an@to.n",
        "name": "Anton Jophin",
        "dp": "https://trello-avatars.s3.amazonaws.com/fc3e6a0f7dcfeb98da54b3a489268e8a/original.png",
        "color": {
          "text": "#FF1053"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my first message",
      "user": {
        "email": "an@to.n",
        "name": "Anton Jophin",
        "dp": "https://trello-avatars.s3.amazonaws.com/fc3e6a0f7dcfeb98da54b3a489268e8a/original.png",
        "color": {
          "text": "#FF1053"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "datebucket",
    "payload": {
      "date": "Today"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my last message",
      "user": {
        "email": "an@to.n",
        "name": "Anton Jophin",
        "dp": "https://trello-avatars.s3.amazonaws.com/fc3e6a0f7dcfeb98da54b3a489268e8a/original.png",
        "color": {
          "text": "#FF1053"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "payload": {
      "text": "This is my last message",
      "user": {
        "email": "si@lb.y",
        "name": "Silby Jophin",
        "color": {
          "text": "#D76F47",
          "bg": "#EBB7A3"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "sent": true,
    "payload": {
      "text": "This is my last message",
      "user": {
        "name": "Silby Jophin",
        "email": "si@lb.y",
        "color": {
          "text": "#D76F47",
          "bg": "#EBB7A3"
        }
      },
      "time": "5:30 AM",
    }
  },
  {
    "type": "message",
    "sent": true,
    "payload": {
      "text": [
        [
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Jophin Joseph",
              "id": "jophin@joseph.io"
            }
          },
          {
            "type": "text",
            "value": " Please do this "
          },
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Rishi",
              "id": "rishi@raj.io"
            }
          },
          {
            "type": "text",
            "value": " You should do this too"
          },
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Barada Sahu",
              "id": "barada@sahu.io"
            }
          },
          {
            "type": "text",
            "value": " How will this be done? Are you sure we are going in the right way"
          }
        ]
      ],
      "user": {
        "name": "Silby Jophin",
        "email": "si@lb.y",
        "color": {
          "text": "#D76F47",
          "bg": "#EBB7A3"
        }
      },
      "time": "5:30 AM"
    }
  },
  {
    "type": "message",
    "sent": true,
    "payload": {
      "text": [
        [
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Jophin Joseph",
              "id": "jophin@joseph.io"
            }
          },
          {
            "type": "text",
            "value": " Please do this "
          },
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Rishi",
              "id": "rishi@raj.io"
            }
          },
          {
            "type": "text",
            "value": " You should do this too"
          },
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Barada Sahu",
              "id": "barada@sahu.io"
            }
          },
          {
            "type": "text",
            "value": " How will this be done? Are you sure we are going in the right way"
          }
        ],
        [
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Jophin Joseph",
              "id": "jophin@joseph.io"
            }
          },
          {
            "type": "text",
            "value": " Please do this "
          },
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Rishi",
              "id": "rishi@raj.io"
            }
          },
          {
            "type": "text",
            "value": " You should do this too"
          },
          {
            "type": "mention",
            "value": {
              "type": "user",
              "text": "@Barada Sahu",
              "id": "barada@sahu.io"
            }
          },
          {
            "type": "text",
            "value": " How will this be done? Are you sure we are going in the right way"
          }
        ],
      ],
      "user": {
        "email": "an@to.n",
        "name": "Anton Jophin",
        "dp": "https://trello-avatars.s3.amazonaws.com/fc3e6a0f7dcfeb98da54b3a489268e8a/original.png",
        "color": {
          "text": "#FF1053"
        }
      },
      "time": "5:30 AM"
    }
  },
];

class LoadingTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  onLoadNext() {
    this.setState({
      loading: true
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <Chatter messages={messages} currentUser="an@to.n" isConnected={true} messagesLoading={loading}
               onLoadNext={::this.onLoadNext}/>
    )
  }
}

storiesOf('Chatter', module)
  .add('Default', () => (
    <div style={{ height: "30rem", borderBottom: "1px solid" }}>
      <Chatter messages={messages} currentUser="an@to.n" isConnected={true}/>
    </div>
  ))
  .add('No scroll', () => (
    <div style={{ height: "30rem", borderBottom: "1px solid" }}>
      <Chatter messages={messages.slice(0, 2)} currentUser="an@to.n" isConnected={true}/>
    </div>
  ))
  .add('Loading previous messages', () => (
    <div style={{ height: "30rem", borderBottom: "1px solid" }}>
      <Chatter messages={messages} currentUser="an@to.n" isConnected={true} loading={true}/>
    </div>
  ))
  .add('Connecting', () => (
    <div style={{ height: "30rem", borderBottom: "1px solid" }}>
      <Chatter messages={messages} currentUser="an@to.n" isConnected={false}/>
    </div>
  ))
  .add('Loading messages', () => (
    <div style={{ height: "30rem", borderBottom: "1px solid" }}>
      <LoadingTest/>
    </div>
  ));
import { h } from 'preact';
import Chatter from '../../components/commons/Chatter';
import { connect } from "preact-redux";
import chatOperations from '../../store/objects/chat/operations';
import creativesListPack from '../../store/objects/campaign/creatives/list';
import userSelectors from '../../store/objects/user/selectors';
import chatListPack from '../../store/objects/chat/list';
import Chat from "../../lib/chat";
import PropResolver from "../../mixins/PropResolver";
import chatSelectors from "../../store/objects/chat/selectors";

const StoreResolvedComponent = PropResolver(props => <Chatter placeholder="Send feedback"
                                                              messages={props.chatData.results} {...props}/>, {
  chatData: chatListPack.resolvers.getListData
});

export default connect(state => {
  const [currentCreative] = creativesListPack.selectors.getSelectedRows(state);
  const { uid: creativeId } = currentCreative;
  const channelId = Chat.getChannelId(Chat.channelTypes.CREATIVE, creativeId);
  return ({
    isConnected: true,
    queryData: chatListPack.selectors.getQueryData(channelId),
    currentUser: userSelectors.getUserEmail(state),
    messagesLoading: chatListPack.selectors.isQueryLoadingNext(state),
    loadingCompleted: chatListPack.selectors.isQueryFilterCompleted(state),
    tagUsers: chatSelectors.getTagUsers(state)
  });
}, {
  ...chatOperations,
  ...chatListPack.operations,
})(StoreResolvedComponent);
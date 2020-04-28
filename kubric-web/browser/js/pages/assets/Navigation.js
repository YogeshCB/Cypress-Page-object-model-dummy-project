import Navigator from "../../components/Assets/navigator/navigation";
import assetListPack from '../../store/objects/lists/assets';
import assetOperations from '../../store/objects/assets/operations';
import assetActions from '../../store/objects/assets/actions';
import assetSelectors from "../../store/objects/assets/selectors/index";
import folderListPack from '../../store/objects/lists/assets/folders';
import teamSelectors from '../../store/objects/team/selectors';
import teamOperations from '../../store/objects/team/operations';
import { connect } from 'preact-redux';

export default connect(state => { 
    return {
    filters: assetListPack.selectors.getFilters(),
    assetCount: assetListPack.selectors.getCurrentQueryTotal(),
    folderCount: folderListPack.selectors.getCurrentQueryTotal(),
    path: assetSelectors.getNavPath(),
    grid: assetSelectors.getGridStatus(),
    names: assetSelectors.getNames(),
    folder: assetSelectors.getFolderData(),
    teams: teamSelectors.getTeams(),
    showFolderDetailsStatus: assetSelectors.getFolderDetailStatus(),
    selectedTeams: teamSelectors.getSelectedTeams(),
    folders: assetSelectors.getFolders(),
    loading: assetListPack.selectors.isQueryFilterLoading() || folderListPack.selectors.isQueryFilterLoading(),
    taggingForm: assetSelectors.tagFormStatus(),
    showFilters: assetSelectors.getFilterStatus(),    
    appliedFilters: assetSelectors.getAppliedFilters(),    
    }
},{
    ...assetActions,
    ...assetOperations,
    ...teamOperations,    
    onFilterSelected: assetListPack.operations.onFilterSelected,
    onFilterDeleted: assetListPack.operations.onFilterDeleted,
    onClick: assetOperations.onFolderClicked
})(Navigator);
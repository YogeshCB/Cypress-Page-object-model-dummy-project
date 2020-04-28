import { h, Component } from 'preact';
import ConfirmationDialog from '../../../components/commons/ConfirmationDialog';
import Field from '../../../components/commons/Field';
import { PrimaryButton } from '../../../components/commons/misc';
import styles from 'stylesheets/assets/form';

export default class VariantName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            error: ''
        }
    }

    onChange=(name)=>{
        this.setState({
            name,
            error: ''
        })
    }
    componentDidMount(){
        this.setState({
            name:''
        })
    }
    validateConfirm = () => {
        const { variantDialog, asset, onConfirm } = this.props;
        const { name } = this.state;

        if(name.length === 0) {
            this.setState({
                error: 'Name cannot be blank'
            })
        }
        else {
            variantDialog();
            onConfirm(asset.id, name);
        }
    }
    render() {
        const { name, error } = this.state;
        const { variantNameDialog,  onCancel } = this.props;
        return (
            <ConfirmationDialog confirmBtn={<PrimaryButton onClick={this.validateConfirm} theme={styles}>&nbsp;Save</PrimaryButton>} onCancel={onCancel} heading={'Please enter the name of the variant'} visible={variantNameDialog}>
                <Field error={error} value={name} onChange={this.onChange} label={'Name'}/>
            </ConfirmationDialog>
        )
        
    }
}
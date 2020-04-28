import { h } from 'preact';
import spinnerStyles from 'stylesheets/components/themed/spinner';
import UnstyledSpinner from '@bit/kubric.components.commons.spinner';
import searchboxStyles from 'stylesheets/components/themed/searchbox';
import UnstyledSearchbox from '@bit/kubric.components.commons.searchbox';
import tagStyles from 'stylesheets/components/themed/tag';
import UnstyledTag from '@bit/kubric.components.commons.tag';

export const Spinner = props => <UnstyledSpinner styles={spinnerStyles} {...props}/>;

export const SearchBox = props => <UnstyledSearchbox styles={searchboxStyles}
                                                     styleMap={{ tag: tagStyles, spinner: spinnerStyles }}
                                                     {...props}/>;

export const Tag = props => <UnstyledTag styles={tagStyles} {...props}/>;
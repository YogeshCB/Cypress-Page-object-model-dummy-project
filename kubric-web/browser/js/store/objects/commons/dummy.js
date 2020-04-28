//While composing reducers if there is a combined reducer in between, it expects the full structure to be defined in the
//combine config. This dummy reducer can be used as placeholders so that combineReducer takes them into consideration
export default (defaultValue = '') => (state = defaultValue) => state;
import { h } from "preact";
import Field from "../commons/Field";
import Checkbox from "../commons/Checkbox";
import styles from "stylesheets/components/parameters/index";
import { isUndefined, at } from "@bit/kubric.utils.common.lodash";
import fields from "./fields";
import fontIcons from "stylesheets/icons/fonticons";

const getValue = (isCreative, parameter, defaultValue, key) => (!isCreative ? defaultValue : !key ? parameter : parameter[key]);

const hasJoystickControl = meta => meta && meta.type === "joystick";

const hasSizeControl = meta => meta && meta.type === "size";

const getParameterField = type => {
  return fields[type] || Field;
};

const Parameter = ({ hideCheckbox, value, selected, label, onChange, onSelectionChange, type, meta, pickAsset }) => {
  const ParameterField = getParameterField(meta && meta.type ? meta.type : type);
  return (
    <div className={styles.paramContainer}>
      <div className={styles.param}>
        {!hideCheckbox ? <Checkbox checked={selected} onChange={onSelectionChange}/> : <span/>}
        <ParameterField label={label} value={value} onChange={onChange} meta={meta} pickAsset={pickAsset}/>
      </div>
    </div>
  );
};

const CompositeParameter = ({ value, label, selected, onChange, onSelectionChange, hideCheckbox = false }) => (
  <div className={styles.compositeParam}>
    <div className={styles.header}>
      {!hideCheckbox ? <Checkbox checked={selected} onChange={onSelectionChange}/> : <span/>}
      <div className={styles.title}>{label}</div>
    </div>
    <div className={styles.fields}>
      {Object.keys(value).map(key => (
        <Parameter value={value[key]} hideCheckbox={true} label={key} onChange={onChange.bind(null, key)}/>
      ))}
    </div>
  </div>
);

export default ({ suggest: shouldSuggest = true, currentBindings: bindings = {}, theme = {}, loading = {}, onValueChanged, onSuggest, onSelectionChanged, meta, creativeView = false, parameters = {}, pickAsset }) => {
  const renderBindings = (bindings, parentId) => {
    const keysWithoutOrder = Object.keys(bindings)
      .filter(o => isUndefined(bindings[o].editorMeta) || isUndefined(bindings[o].editorMeta.order))
      .sort((a, b) => at(bindings[a] || {}, "title", "")[0].localeCompare(at(bindings[b] || {}, "title", "")[0]));

    const keysWithOrder = Object.keys(bindings)
      .filter(o => !isUndefined(bindings[o].editorMeta) && !isUndefined(bindings[o].editorMeta.order))
      .sort((a, b) => bindings[a].editorMeta.order - bindings[b].editorMeta.order);

    const mergedKeys = [...keysWithOrder, ...keysWithoutOrder];

    return mergedKeys
      .filter(paramId => !bindings[paramId].hide)
      .map(paramId => {
        const binding = bindings[paramId];
        const parameter = parameters[parentId || paramId];
        const key = parentId ? paramId : undefined;
        const { title, type, default: defaultValue, isComposite, shouldParametrize, bindings: subBindings = {} } = binding;
        let editorMeta = {};

        if (binding.editorMeta) {
          editorMeta = {
            ...meta[paramId],
            suggest: binding.editorMeta.suggest
          };
        }
        if (Object.keys(subBindings).length === 0 || hasJoystickControl(editorMeta) || hasSizeControl(editorMeta)) {
          const ParameterComponent = isComposite && (!hasJoystickControl(editorMeta) || hasSizeControl(editorMeta)) ? CompositeParameter : Parameter;
          const eventObject = {
            parent: parentId,
            parameter: paramId
          };
          const props = {
            onSelectionChange: isUndefined(onSelectionChanged) ? undefined : onSelectionChanged.bind(null, eventObject)
          };
          const { suggest } = editorMeta;
          return (
            <div className={styles.paramBlock}>
              <ParameterComponent
                {...props}
                meta={editorMeta}
                pickAsset={pickAsset}
                value={getValue(creativeView, parameter, defaultValue, key)}
                label={title}
                type={type}
                selected={shouldParametrize}
                hideCheckbox={creativeView}
                onChange={onValueChanged.bind(null, eventObject)}
              />
              {(shouldSuggest && suggest) ?
                <span onClick={onSuggest.bind(null, paramId, suggest)}
                      className={`${fontIcons.fonticonWand} ${styles.suggest}`}/> :
                <span/>}
              {(shouldSuggest && loading[paramId]) ? <div className={styles.overlay}/> : <span/>}
            </div>
          );
        } else {
          return (
            <div className={styles.multiParam}>
              <div className={styles.paramTitle}>{title}</div>
              <div className={styles.subParams}>{renderBindings(subBindings, paramId)}</div>
            </div>
          );
        }
      });
  };
  return (
    <div className={`${theme.container} ${styles.container}`}>
      <div
        className={styles.bindings}>{!creativeView || (creativeView && Object.keys(parameters).length > 0) ? renderBindings(bindings) :
        <span/>}</div>
    </div>
  );
};

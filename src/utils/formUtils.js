import { Input, Select, DatePicker, Cascader } from 'antd';

function getTree(id, options) {
  if (id) {
    let ids = null;
    for (let o of options) {
      if (o.value === id) {
        ids = [o.value];
        return ids;
      } else if (o.children) {
        ids = getTree(id, o.children);
        if (ids) {
          ids = [o.value].concat(ids);
          return ids;
        }
      }
    }
  }
}

function getCascader(context, field, placeholder, options, onChange) {
  let dv = getTree(context.entity[field], options);
  return (
    <Cascader
      options={options}
      style={{ width: '100%' }}
      defaultValue={dv || undefined}
      placeholder={placeholder}
      onChange={((v, o) => {
        context.mObj[field] = v.join('.');
        if (onChange) {
          onChange(v, o);
        }
      }).bind(context)}
      expandTrigger="hover"
      changeOnSelect
      allowClear
    />
  );
}

function getInput(context, field, placeholder, addonAfter, addonBefore, onChange) {
  return (
    <Input
      defaultValue={context.entity[field] || undefined}
      placeholder={placeholder}
      onChange={(e => {
        context.mObj[field] = e.target.value;
        if (onChange) {
          onChange(e.target.value);
        }
      }).bind(context)}
      addonAfter={addonAfter || false}
      addonBefore={addonBefore || false}
    />
  );
}

function getTextArea(context, field, placeholder, height) {
  return (
    <Input.TextArea
      defaultValue={context.entity[field] || undefined}
      placeholder={placeholder}
      onChange={(e => {
        context.mObj[field] = e.target.value;
      }).bind(context)}
      style={{
        height: height || 80,
        resize: 'none',
      }}
    />
  );
}

function getSelect(
  context,
  iField,
  nField,
  placeholder,
  options,
  onSearch,
  onChange,
  showSearch,
  disabled
) {
  nField = nField || iField;
  let dv = context.entity[iField] || undefined;
  if (dv) {
    if (!options.find(o => o.id == dv)) {
      options = [{ id: dv, name: context.entity[nField] }].concat(options);
    }
  }

  disabled = disabled === undefined ? false : !!disabled;
  return (
    <Select
      disabled={disabled}
      allowClear
      showSearch={showSearch}
      defaultValue={dv}
      placeholder={placeholder}
      onSearch={onSearch}
      style={{ width: '100%' }}
      filterOption={(inputValue, option) => {
        return !!(option.props.children && option.props.children.indexOf(inputValue) != -1);
      }}
      onChange={((v, option) => {
        // 可能 nField、iField相等 后赋值iField
        context.mObj[nField] = option.props.children;
        context.mObj[iField] = option.props.value;
        if (onChange) {
          onChange(v, option);
        }
      }).bind(context)}
    >
      {options.map(o => (
        <Select.Option value={o.id}>{o.name}</Select.Option>
      ))}
    </Select>
  );
}

function getDatePicker(context, field, placeholder, today = false) {
  let dValue = undefined;
  if (context.entity[field]) {
    dValue = moment(context.entity[field]);
  } else if (today) {
    dValue = moment();
    context.mObj[field] = dValue.format('YYYY-MM-DD');
  }

  return (
    <DatePicker
      defaultValue={dValue}
      placeholder={placeholder}
      style={{ width: '100%' }}
      onChange={(e => {
        context.mObj[field] = e ? e.format('YYYY-MM-DD') : undefined;
      }).bind(context)}
    />
  );
}

export { getInput, getTextArea, getDatePicker, getSelect, getCascader };

import React from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { components } from 'react-select';

const styles = {
  control: (provided) => {

    return ({
      ...provided,
      background: '#fff',
      borderColor: '#B8B8B8',
      height: '28px',
      borderRadius: '12px',
    })
  },

  container: (provided) => ({
    ...provided,
  }),

  valueContainer: (provided) => ({
    ...provided,
    overflow: "visible",
    marginLeft: '6px',
    padding: '4px',
  }),

  placeholder: (provided, state) => ({
    ...provided,
    position: "absolute",
    top: state.hasValue || state.selectProps.inputValue || state.isFocused ? -7 : "15%",
    transition: "top 0.1s, font-size 0.1s",
    fontSize: (state.hasValue || state.selectProps.inputValue) && 10,
    color: "#00000"
  }),

  menuPortal: base => ({ ...base, zIndex: 5 }),
};

export default function SelectAsync(props) {
  const { ...rest } = props;

  const { ValueContainer, Placeholder } = components;

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, child =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };

  return (
    <AsyncPaginate
      menuPortalTarget={document.body}
      styles={styles}
      components={{ ValueContainer: CustomValueContainer }}
      {...rest}
    />
  )

}

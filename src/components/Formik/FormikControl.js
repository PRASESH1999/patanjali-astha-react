import React from 'react'
import Checkbox from '../FormField/Checkbox'
import LoginInputs from '../FormField/LoginInput'
import Inputs from '../FormField/Input'
import Radiobuttons from '../FormField/Radiobutton'
import Select from '../FormField/Select'
import TextAreas from '../FormField/TextArea'
import AutocompleteMultiple from '../FormField/AutocompleteMultiple'
import Autocomplete from '../FormField/Autocomplete'
import DatePicker from '../FormField/DatePicker'
import SelectAsync from '../FormField/SelectAsync'

function FormikControl(props) {
  const { control, ...rest } = props
  switch (control) {
    case 'loginInput':
      return <LoginInputs {...rest} />
    case 'input':
      return <Inputs {...rest} />
    case 'textarea':
      return <TextAreas {...rest} />
    case 'select':
      return <Select {...rest} />
    case 'autocompleteMultiple':
      return <AutocompleteMultiple {...rest} />
    case 'autocomplete':
      return <Autocomplete {...rest} />
    case 'radio':
      return <Radiobuttons {...rest} />
    case 'date':
      return <DatePicker {...rest} />
    case 'checkbox':
      return <Checkbox {...rest} />
    case 'selectAsync':
      return <SelectAsync {...rest} />
    default: return null
  }
}

export default FormikControl;
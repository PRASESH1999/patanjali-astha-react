import { ErrorMessage, Field } from 'formik'
import React from 'react'


function Checkbox(props) {
  const { label, name, options, ...rest } = props
  return (
    <div>
      {/* <label className="mt-2 font-semibold text-xl">{label}</label> */}
      <Field name={name} {...rest}>
        {
          ({ field }) => (
            <div className="flex flex-col gap-6">
              {options.map(option => {
                return (
                  <React.Fragment key={option.value}>
                    <fieldset className="border-2 border-gray-400 rounded-lg px-8 pb-6 pt-2">
                      <legend className="px-2 text-xl">
                        <input
                          type='checkbox'
                          id={option.value}
                          {...field}
                          value={option.value}
                          checked={field.value.includes(option.value)}
                        />
                        {/* <label className="pl-1" htmlFor={option.value}>{option.value}</label> */}
                      </legend>
                    </fieldset>
                  </React.Fragment>
                )
              })}
            </div>
          )
        }
      </Field>
      <ErrorMessage name={name} />

    </div>
  )
}

export default Checkbox
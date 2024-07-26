import Label from "./Label"

const Fields = ({fields, register, setFocus, onSubmit}) => {
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < fields.length - 1) {
        setFocus(fields[index + 1]?.name);
      } else {
        onSubmit()
      }
    }
  }

  return (
    fields.map((field, i) => {
      const Component = field.component
      const newProps = {}
      !field.common && (newProps.options = field.options)
      return <Component key={"f"+i} {...newProps} className={field.className || ""} containerClassName={field.containerClassName || ""} register={{...register(field?.name, {required: field.required || false})}} onKeyDown={(e) => handleKeyDown(e, i)} type={field.type}>
      <Label name={field?.name} text={field.text} className={field.labelClassName || ""}/>
    </Component>
    })
  )
}

export default Fields
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import Main from "../containers/Main"
import Section from "../containers/Section"
import Form from "../components/Form"
import Input from "../components/FormInput/Input"
import Label from "../components/Label"
import Button from "../components/Button"
import Title from "../components/Title"
import customAxios from "../config/axios.config"
import { useEffect, useState } from "react"
import SelectInput from "../components/FormInput/SelectInput"

const NewMovement = () => {
  const [cashAccounts, setCashAccounts] = useState(false)
  const navigate = useNavigate()
  const {aid} = useParams()
  const {register, handleSubmit, setFocus} = useForm()
  const fields = [
    {name: "emissionDate", type: "date", text: "Emisión", required: true},
    {name: "expirationDate", type: "date", text: "Vencimiento", required: false},
    {name: "checkCode", text: "N° de cheque:", required: false},
    {name: "detail", text: "Detalle:", required: false},
    {name: "credit", text: "Crédito:", required: false},
    {name: "debit", text: "Débito:", required: false},
    {name: "tax", text: "Ingresos brutos:", required: false, placeholder: "%"}
  ]

  const onSubmit = handleSubmit(async data => {
    data.account = aid
    data.expirationDate = data.expirationDate || data.emissionDate
    if (!data.cashAccount) {
      delete data.cashAccount
    } else if (!data.detail) {
      data.detail = cashAccounts.find(a => a.value == data.cashAccount)?.text
    }
    await customAxios.post("/movement", data)
    navigate(`/accounts/${aid}`)
  })

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

  useEffect(() => {
    customAxios.get("/cash-account").then(res => {
      setCashAccounts(res?.data?.payload?.map(a => {
        return {text: a?.name, value: a?._id}
      }) || "")
    })
  }, [])

  return (
    <Main className={"grid items-center justify-center gap-y-[30px] pb-4"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nuevo movimiento bancario
        </Title>
      </section>
      <Section style="form"  className={"!bg-primary"}>
        <Form onSubmit={onSubmit} className={"bg-primary"}>
          {fields.map((field, i) => {
            return <Input key={"f"+i} register={{...register(field?.name, {required: field.required})}} onKeyDown={(e) => handleKeyDown(e, i)} type={field.type}>
            <Label name={field?.name} text={field.text}/>
          </Input>
          })}
          {cashAccounts ? <SelectInput register={{...register("cashAccount")}} options={[{text: null, value: undefined}, ...cashAccounts]}>
            <Label name={"cashAccount"} text={"Cuenta de ingreso:"}/>
          </SelectInput> : null}
          <Button type="submit" style="submit" className={"text-black"}>
            Agregar Movimiento
          </Button>
        </Form>
      </Section>
    </Main>
  )
}

export default NewMovement
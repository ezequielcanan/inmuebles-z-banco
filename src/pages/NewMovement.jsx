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
  const [cashAccounts, setCashAccounts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const navigate = useNavigate()
  const {aid} = useParams()
  const {register, handleSubmit, setFocus} = useForm()
  const fields = [
    {name: "emissionDate", type: "date", text: "Emisión", required: true, component: Input},
    {name: "expirationDate", type: "date", text: "Vencimiento", required: false, component: Input},
    {name: "movementType", text: "Tipo:", options: [{text: "Cheque", value: "Cheque"}, {text: "Transferencia", value: "Transferencia"}], required: false, component: SelectInput, common: false},
    {name: "code", text: "Número:", required: false, component: Input},
    {name: "detail", text: "Detalle:", required: false, component: Input},
    {name: "credit", text: "Crédito:", type: "number", required: false, component: Input},
    {name: "debit", text: "Débito:", type: "number", required: false, component: Input},
    {name: "paid", text: "Finalizado:", type: "checkbox", required: false, component: Input, className: "scale-[2] -translate-x-1 justify-self-end"},
    {name: "tax", text: "Ingresos brutos:", type: "number", required: false, placeholder: "%", component: Input},
    {name: "supplier", text: "Proveedor:", options: [{text: null, value: undefined}, ...suppliers], required: false, component: SelectInput, common: false},
    {name: "cashAccount", text: "Cuenta de ingreso:", options: [{text: null, value: undefined}, ...cashAccounts], required: false, component: SelectInput, common: false}
  ]

  const onSubmit = handleSubmit(async data => {
    data.account = aid
    data.expirationDate = data.expirationDate || data.emissionDate
    if (!data.cashAccount) {
      delete data.cashAccount
    } else if (!data.detail) {
      data.detail = cashAccounts.find(a => a.value == data.cashAccount)?.text
    }

    !data.supplier && delete data.supplier

    if (data.movementType != "Cheque") {
      data.paid = true
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

  useEffect(() => {
    customAxios.get(`/account/${aid}`).then(res => {
      customAxios.get(`/supplier?pid=${res?.data?.payload?.society?._id}`).then((suppliersRes) => setSuppliers(suppliersRes?.data?.payload?.map(s => {
        return {text: s?.name, value: s?._id}
      })))
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
            const Component = field.component
            const newProps = {}
            !field.common && (newProps.options = field.options)
            return <Component key={"f"+i} {...newProps} className={field.className || ""} register={{...register(field?.name, {required: field.required})}} onKeyDown={(e) => handleKeyDown(e, i)} type={field.type}>
            <Label name={field?.name} text={field.text}/>
          </Component>
          })}
          <Button type="submit" style="submit" className={"text-black"}>
            Agregar Movimiento
          </Button>
        </Form>
      </Section>
    </Main>
  )
}

export default NewMovement
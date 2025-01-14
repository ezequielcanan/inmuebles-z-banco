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
import Fields from "../components/Fields"
import moment from "moment"
import { TbDeviceAirtag } from "react-icons/tb"

const NewMovement = ({project}) => {
  const [cashAccounts, setCashAccounts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [services, setServices] = useState([])
  const navigate = useNavigate()
  const {aid} = useParams()
  const {register, handleSubmit, setFocus, watch} = useForm()
  const movementType = watch("movementType")
  const fields = [
    {name: "date", type: "date", text: "Fecha", required: true, component: Input},
    {name: "movementType", text: "Tipo:", options: [{text: "Transferencia", value: "Transferencia"}, {text: "VEP", value: "VEP"}, {text: "Gastos Bancarios", value: "Gastos Bancarios"}], component: SelectInput, common: false},
    {name: "code", text: "Número:", component: Input},
    {name: "detail", text: "Detalle:", component: Input},
    {name: "credit", text: "Crédito:", type: "number", component: Input},
    {name: "debit", text: "Débito:", type: "number", component: Input},
    {name: "tax", text: "Ingresos brutos:", type: "number", placeholder: "%", component: Input},
    {name: "supplier", text: "Proveedor:", options: [{text: null, value: undefined}, ...suppliers], component: SelectInput, common: false},
    {name: "cashAccount", text: "Cuenta de ingreso:", options: [{text: null, value: undefined}, ...cashAccounts], component: SelectInput, common: false}
  ]

  const onSubmit = handleSubmit(async data => {
    data.account = aid
    data.emissionDate = data.date
    data.expirationDate = data.date
    !data.cashAccount ? delete data.cashAccount : (data.detail = `${data.detail} ${cashAccounts.find(a => a.value == data.cashAccount)?.text}`)
    !data.supplier && delete data.supplier
    !data.service && delete data.service
    !data.lastCheck && delete data.lastCheck

    
    if (data.movementType != "Cheque") {
      data.paid = true
      data.state = "REALIZADO"
    } else {
      data.state = data?.paid ? "REALIZADO" : "PENDIENTE"
    }

    if (data?.credit) {
      const monthTax = await customAxios.get(`/tax/date?date=${moment(data?.date, "YYYY-MM-DD")}&project=${project}`)
      data.tax = data?.tax || monthTax?.data?.payload?.tax
    }
    
    if (!data.detail) {
      data.supplier && (data.detail = suppliers.find(s => s.value == data.supplier)?.text)
      data.service && (data.detail = services.find(s => s.value == data.service)?.text)
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
    customAxios.get(`/service/project/${project}`).then(res => {
      setServices(res?.data?.payload?.map(a => {
        return {text: `${a?.name}: ${a?.code}`, value: a?._id}
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
          <Fields movementType={movementType} fields={fields} onSubmit={onSubmit} setFocus={setFocus} register={register}/>
          <Button type="submit" style="submit" className={"text-black"}>
            Agregar Movimiento
          </Button>
        </Form>
      </Section>
    </Main>
  )
}

export default NewMovement
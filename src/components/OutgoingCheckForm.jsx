import { MdAccountBalanceWallet } from "react-icons/md"
import Section from "../containers/Section"
import Form from "./Form"
import Fields from "./Fields"
import Button from "./Button"
import SelectInput from "./FormInput/SelectInput"
import Input from "./FormInput/Input"
import { useEffect, useState } from "react"
import customAxios from "../config/axios.config"
import moment from "moment"

const OutgoingCheckForm = ({ onSubmit, setFocus, project, register, check, text = "Agregar" }) => {
  const [suppliers, setSuppliers] = useState([])
  const [accounts, setAccounts] = useState([])


  useEffect(() => {
    customAxios.get(`/supplier`).then((suppliersRes) => setSuppliers(suppliersRes?.data?.payload?.map(s => {
      return {text: s?.name, value: s?._id}
    }))).catch(e => {
      console.log(e)
      setSuppliers(false)
    })
  }, [])

  useEffect(() => {
    project ? customAxios.get(`/account?project=${project}`).then(res => {
      setAccounts(res?.data?.payload?.map(a => {
        return {text: a?.bank, value: a?._id}
      }) || [])
    }) : setAccounts([])
  }, [])


  const fields = [
    {name: "code", text: "N°", component: Input, otherProps: {defaultValue: check?.code}},
    {name: "date", type: "date", text: "Fecha", component: Input, otherProps: {defaultValue: moment.utc(check?.date).format("YYYY-MM-DD")}},
    {name: "emissionDate", type: "date", text: "Emisión", component: Input, otherProps: {defaultValue: moment.utc(check?.emissionDate).format("YYYY-MM-DD")}},
    {name: "expirationDate", type: "date", text: "Vencimiento", component: Input, otherProps: {defaultValue: moment.utc(check?.expirationDate).format("YYYY-MM-DD")}},
    {name: "supplier", text: "Proveedor", component: SelectInput, common: false, options: [{text: null, value: undefined}, ...suppliers], className: "max-w-[200px]", otherProps: {disabled: check}},
    {name: "detail", text: "Concepto", component: Input, otherProps: {defaultValue: check?.detail}},
    {name: "amount", type: "number", text: "Importe", component: Input, otherProps: {defaultValue: check?.debit}},
    {name: "checkType", text: "Tipo:", options: [{text: "ECHEQ", value: "ECHEQ"}, {text: "FISICO", value: "FISICO"}], component: SelectInput, common: false, otherProps: {defaultValue: check?.checkType}},  
    {name: "lastCheck", text: "Cheque vencido", component: Input},
  ]

  if (accounts?.length) {
    fields.unshift({name: "account", text: "Banco", component: SelectInput, common: false, options: [...accounts], className: "max-w-[200px]", otherProps: {defaultValue: accounts[0]?._id}})
  }
  
  if (!check) fields.splice(2,1)

  return (
    <Section style="form" className={""}>
      <MdAccountBalanceWallet className="text-[100px] md:text-[180px]" />
      <Form onSubmit={onSubmit} className={""}>
        <Fields fields={fields} setFocus={setFocus} register={register} onSubmit={onSubmit} />
        <Button type="submit" style="submit" className={"text-black"}>
          {text} Cheque
        </Button>
      </Form>
    </Section>
  )
}

export default OutgoingCheckForm
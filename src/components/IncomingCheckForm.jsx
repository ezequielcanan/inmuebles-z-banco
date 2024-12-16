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

const IncomingCheckForm = ({ onSubmit, setFocus, register, check, text = "Agregar" }) => {
  const [owners, setOwners] = useState([])
  const [cashAccounts, setCashAccounts] = useState([])

  useEffect(() => {
    customAxios.get(`/owner/all`).then(res => {
      setOwners((res?.data?.payload || []).map(owner => {
        return {text: owner?.name, value: owner?._id}
      }))
    }).catch(e => {
      console.log(e)
      setOwners(false)
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/cash-account`).then(res => {
      setCashAccounts((res?.data?.payload || []).map(account => {
        return {text: account?.name, value: account?._id}
      }))
    }).catch(e => {
      console.log(e)
      setCashAccounts(false)
    })
  }, [])

  const fields = [
    {name: "receivedDate", type: "date", text: "Recibido", component: Input, otherProps: {defaultValue: moment.utc(check?.receivedDate).format("YYYY-MM-DD")}},
    {name: "code", text: "N°", component: Input, otherProps: {defaultValue: check?.code}},
    {name: "emissionDate", type: "date", text: "Emisión", component: Input, otherProps: {defaultValue: moment.utc(check?.emissionDate).format("YYYY-MM-DD")}},
    {name: "date", type: "date", text: "Pago", component: Input, otherProps: {defaultValue: moment.utc(check?.date).format("YYYY-MM-DD")}},
    {name: "origin", text: "Librador", component: Input, otherProps: {defaultValue: check?.origin}},
    {name: "owner", text: "Comprador", component: SelectInput, common: false, options: [{text: null, value: undefined}, ...owners], className: "max-w-[200px]",},
    {name: "cashAccount", text: "Sociedad", component: SelectInput, common: false, options: [{text: null, value: undefined}, ...cashAccounts], className: "max-w-[200px]"},
    {name: "specialFrom", text: "Otro", component: Input, otherProps: {defaultValue: check?.specialFrom}},
    {name: "detail", text: "Concepto", component: Input, otherProps: {defaultValue: check?.detail}},
    {name: "amount", type: "number", text: "Importe", component: Input, otherProps: {defaultValue: check?.amount}},
    {name: "checkType", text: "Tipo:", options: [{text: "ECHEQ", value: "ECHEQ"}, {text: "FISICO", value: "FISICO"}], component: SelectInput, common: false, otherProps: {defaultValue: check?.checkType}},
    {name: "operationDate", type: "date", text: "Operacion", component: Input, otherProps: {defaultValue: check?.operationDate ? moment.utc(check?.operationDate).format("YYYY-MM-DD") : undefined}},
    {name: "transferDetail", text: "Detalle Operacion", component: Input, otherProps: {defaultValue: check?.transferDetail}},
  
  ]

  if (check) fields.splice(5,3)
  if (!check) fields.splice(11,2)

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

export default IncomingCheckForm
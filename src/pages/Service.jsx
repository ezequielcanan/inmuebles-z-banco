import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import Title from "../components/Title"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { Link, useParams } from "react-router-dom"
import Button from "../components/Button"
import { FaArrowRight, FaFileExcel, FaPlus, FaTrash } from "react-icons/fa"
import Section from "../containers/Section"
import Input from "../components/FormInput/Input"
import { BsCheck } from "react-icons/bs"
import Fields from "../components/Fields"
import { useForm } from "react-hook-form"
import Form from "../components/Form"
import moment from "moment"
import SelectInput from "../components/FormInput/SelectInput"


const Service = ({ project }) => {
  const [service, setService] = useState(false)
  const [movements, setMovements] = useState([])
  const [accounts, setAccounts] = useState(false)


  const [reload, setReload] = useState(false)
  const { sid } = useParams()

  const { register, handleSubmit, setFocus, reset } = useForm()

  const notPlanFields = [
    { name: "date", text: "Fecha", type: "date", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input, otherProps: { required: true } },
    { name: "debit", text: "Monto", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", type: "number", component: Input },
  ]

  const vepFields = [
    { name: "date", text: "Fecha VEP", type: "date", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input, otherProps: { required: true } },
    { name: "code", text: "N° VEP", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input, otherProps: { required: true } },
    { name: "debit", text: "Monto", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", type: "number", component: Input },
  ]

  const planFields = [
    { name: "month", text: "Mes", type: "month", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input, otherProps: { required: true } },
    { name: "first", text: "1er Vencimiento", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", type: "number", component: Input },
    { name: "second", text: "2do Vencimiento", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", type: "number", component: Input },
  ]

  const fields = service?.plan ? (!movements?.length ? vepFields : planFields) : notPlanFields


  if (accounts?.length) fields.unshift({ name: "account", text: "Banco", component: SelectInput, common: false, options: [...accounts], labelClassName: "!text-lg", className: "!text-lg !w-full max-w-[200px]", containerClassName: "max-w-full", otherProps: { defaultValue: accounts[0]?._id } })

  useEffect(() => {
    customAxios.get(`/service/${sid}`).then(res => {
      setService(res?.data?.payload || [])
    })
  }, [reload])

  useEffect(() => {
    project ? customAxios.get(`/account?project=${project}`).then(res => {
      setAccounts(res?.data?.payload?.map(a => {
        return { text: a?.bank, value: a?._id }
      }) || [])
    }) : setAccounts([])
  }, [])

  useEffect(() => {
    customAxios.get(`/movement/service/movements/${sid}`).then(res => {
      setMovements(res?.data?.payload?.reverse() || [])
    })
  }, [reload])

  const onSubmit = handleSubmit(async data => {
    if (!movements?.length || !service?.plan) {
      data.emissionDate = data?.date
      data.expirationDate = data?.date
      data.movementType = (!service?.plan) ? "Pago Servicios" : "VEP"
      data.paid = false
      data.error = false
      data.state = "PENDIENTE"
      data.detail = `${service?.plan ? "SUSCRIPCION " : ""}${service?.name}: ${service?.code}`
      data.service = sid

      await customAxios.post("/movement", data)
    } else {
      data.date = data.month + "-16"
      data.emissionDate = data?.date
      data.expirationDate = data?.date
      data.movementType = "Pago Servicios"
      data.paid = false
      data.error = false
      data.state = "PENDIENTE"
      data.detail = `1° ${service?.name}: ${service?.code}`
      data.service = sid
      data.debit = data.first

      await customAxios.post("/movement", data)

      data.date = data.month + "-26"
      data.emissionDate = data?.date
      data.expirationDate = data?.date
      data.debit = data.second || 0

      await customAxios.post("/movement", data)
    }


    reset()
    setReload(!reload)
  })

  const changeState = async (mid, newState) => {
    await customAxios.put(`/movement/${mid}`, { state: newState, paid: newState == "REALIZADO", error: newState == "CANCELADO" })
    setReload(!reload)
  }

  const onChangeProperty = async (mid, property, value) => {
    const updateObj = { [property]: value }

    if (property == "date") {
      updateObj["emissionDate"] = value
      updateObj["expirationDate"] = value
    }

    await customAxios.put(`/movement/${mid}`, updateObj)
  }

  const onDeleteMovement = async (mid) => {
    await customAxios.delete(`/movement/${mid}`)
    setReload(!reload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      {service ? (
        <>
          <Section>
            <Title className={"text-center md:text-start"}>
              {service?.project?.title} - {service?.name} {service?.code}
            </Title>
          </Section>
          <section className="grid sm:grid-cols-2 gap-6">
            <div>
              <Form className={"bg-third p-4 text-white"}>
                <Fields fields={fields} onSubmit={onSubmit} register={register} setFocus={setFocus} />
                <Button className={"!text-lg items-center justify-center !p-2"} onClick={e => (e.preventDefault(), onSubmit())}>Agregar Pago <FaPlus /></Button>
              </Form>
            </div>
            {movements?.length ? (
              movements?.map(movement => {
                return <div key={movement?._id} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col w-full gap-y-4 py-6 px-6 text-black duration-300">
                  <h3 className="text-3xl">BANCO {movement?.account?.bank}</h3>
                  <Input defaultValue={moment.utc(movement?.date).format("YYYY-MM-DD")} onChange={(e) => onChangeProperty(movement?._id, "date", e?.target?.value)} type="date" labelClassName="!text-lg" className="!text-lg !w-full" containerClassName="max-w-full" />
                  <Input defaultValue={movement?.debit} onChange={(e) => onChangeProperty(movement?._id, "debit", e?.target?.value)} type="number" labelClassName="!text-lg" className="!text-lg !w-full" containerClassName="max-w-full" />
                  <div className="flex items-center gap-2">
                    <p className="text-lg">ESTADO:</p>
                    <Button className={`${!movement?.paid ? (movement?.error ? "bg-red-500 after:!bg-red-600" : "bg-yellow-700 after:bg-yellow-600") : ""} text-lg`} onClick={() => changeState(movement?._id, movement?.state == "PENDIENTE" ? "REALIZADO" : (movement?.state == "REALIZADO") ? "CANCELADO" : "PENDIENTE")}>{movement?.state}</Button>
                    <Button style="icon" className={"!bg-red-600 text-white rounded-md duration-300 hover:scale-90 h-full ml-auto"} onClick={() => onDeleteMovement(movement?._id)}>
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              })
            ) : null}
          </section>
        </>
      ) : <BounceLoader />}
    </Main>
  )
}

export default Service
import { useEffect, useState } from "react"
import Title from "../components/Title"
import Main from "../containers/Main"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import customAxios from "../config/axios.config"
import Section from "../containers/Section"
import Form from "../components/Form"
import Fields from "../components/Fields"
import { AnimatePresence } from "framer-motion"
import Button from "../components/Button"
import { useForm } from "react-hook-form"
import { MdAccountBalanceWallet } from "react-icons/md"
import Input from "../components/FormInput/Input"
import SelectInput from "../components/FormInput/SelectInput"
import IncomingCheckForm from "../components/IncomingCheckForm"
import { FaMoneyBill } from "react-icons/fa"

const NewCashMovement = () => {
  const [project, setProject] = useState(null)
  const { register, setFocus, handleSubmit } = useForm()
  const { pid } = useParams()
  const [query] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || [])
    }).catch(e => {
      console.log(e)
      setProject(false)
    })
  }, [])

  const onSubmit = handleSubmit(async data => {
    data.project = pid
    if (query.get("dollar")) data.dollar = true

    await customAxios.post("/movement", data)
    navigate(`/cash/${pid}`)
  })

  const fields = [
    {name: "date", type: "date", text: "Fecha", component: Input},
    {name: "detail", text: "Concepto", component: Input},
    {name: "credit", text: "Ingreso", component: Input, type: "number"},
    {name: "debit", text: "Egreso", component: Input, type: "number"},
  ]

  return (
    <Main className={"grid items-center justify-center gap-y-[30px] pb-4"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nuevo movimiento de caja {project ? project?.title : ""}
        </Title>
      </section>
      <Section style="form" className={""}>
        <FaMoneyBill className="text-[100px] md:text-[180px]" />
        <Form onSubmit={onSubmit} className={""}>
          <Fields fields={fields} setFocus={setFocus} register={register} onSubmit={onSubmit} />
          <Button type="submit" style="submit" className={"text-black"}>
            Confirmar
          </Button>
        </Form>
      </Section>
    </Main>
  )
}

export default NewCashMovement
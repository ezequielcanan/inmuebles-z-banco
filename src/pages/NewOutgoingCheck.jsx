import { useEffect, useState } from "react"
import Title from "../components/Title"
import Main from "../containers/Main"
import { useNavigate, useParams } from "react-router-dom"
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
import OutgoingCheckForm from "../components/OutgoingCheckForm"

const NewOutgoingCheck = () => {
  const [project, setProject] = useState(null)
  const {register, setFocus, handleSubmit} = useForm()
  const { pid } = useParams()
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
    console.log(data)

    data.project = pid
    data.expirationDate = data.expirationDate || data.emissionDate
    !data.supplier && delete data.supplier
    !data.cashAccount && delete data.cashAccount
    !data.lastCheck && delete data.lastCheck
    data.movementType = "Cheque"
    data.debit = data?.amount || 0
    data.paid = false
    data.error = false
    data.state = "PENDIENTE"
    
    /*if (data.movementType != "Cheque") {
      data.paid = true
      data.state = "REALIZADO"
      data.date = data.date || data.emissionDate
      data.emissionDate = data.date
      data.expirationDate = data.date
    } else {
      data.state = data?.paid ? "REALIZADO" : "PENDIENTE"
    }*/
    
    console.log(data)

    await customAxios.post("/movement", data)
    navigate(`/outgoing-checks/${pid}`)
  })

  return (
    <Main className={"grid items-center justify-center gap-y-[30px] pb-4"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nuevo cheque {project ? project?.title : ""}
        </Title>
      </section>
      <OutgoingCheckForm onSubmit={onSubmit} project={pid} setFocus={setFocus} register={register}/>
    </Main>
  ) 
}

export default NewOutgoingCheck
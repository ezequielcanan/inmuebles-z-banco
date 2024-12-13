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

const NewIncomingCheck = () => {
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
    if (!data?.cashAccount) delete data.cashAccount
    if (!data?.owner) delete data.owner
    data.project = pid

    await customAxios.post("/incoming-check", data)
    navigate(`/incoming-checks/${pid}`)
  })

  return (
    <Main className={"grid items-center justify-center gap-y-[30px] pb-4"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nuevo cheque {project ? project?.title : ""}
        </Title>
      </section>
      <IncomingCheckForm onSubmit={onSubmit} setFocus={setFocus} register={register}/>
    </Main>
  ) 
}

export default NewIncomingCheck
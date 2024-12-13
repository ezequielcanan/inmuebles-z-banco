import { MdAccountBalanceWallet } from "react-icons/md"
import Form from "../components/Form"
import Title from "../components/Title"
import Main from "../containers/Main"
import Section from "../containers/Section"
import Input from "../components/FormInput/Input"
import { useForm } from "react-hook-form"
import Label from "../components/Label"
import Button from "../components/Button"
import customAxios from "../config/axios.config"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SelectInput from "../components/FormInput/SelectInput"
import { FaPlus, FaTrash } from "react-icons/fa6"
import SignatoryCard from "../components/SignatoryCard"
import { AnimatePresence } from "framer-motion"
import Fields from "../components/Fields"
import { PiBank } from "react-icons/pi"

const NewAccount = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, setFocus } = useForm()
  const [projects, setProjects] = useState([])
  const [firmantes, setFirmantes] = useState([])

  const fields = [
    {name: "society", text: "Sociedad", options: projects, component: SelectInput, common: false},
    {name: "accountNumber", text: "N° de cuenta:", component: Input},
    {name: "cbu", text: "CBU:", component: Input},
    {name: "alias", text: "Alias:", component: Input},
    {name: "cuit", text: "CUIT:", component: Input},
    {name: "bank", text: "Banco:", component: Input},
    {name: "name", text: "Titular:", component: Input},
    {name: "initialBalance", text: "Saldo inicial:", type: "number", component: Input},
  ]

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload.map((project => {
        return { text: project.title, value: project._id }
      })) || [])
    }).catch(e => {
      setProjects([])
    })
  }, [])

  const onSubmit = handleSubmit(async data => {
    const result = (await customAxios.post("/account", {...data, signatories: firmantes})).data
    navigate("/accounts")
  }) 

  const deleteFirmante = (firmanteIndex) => {
    firmantes.splice(firmanteIndex,1)
    setFirmantes([...firmantes])
  }

  const changeFirmanteProperty = (property, value, firmanteIndex) => {
    const updateObj = {}
    updateObj[property] = value
    firmantes[firmanteIndex] = {...firmantes[firmanteIndex], ...updateObj}
    setFirmantes([...firmantes])
  }

  return (
    <Main className={"grid items-center justify-center gap-y-[30px] pb-4"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nueva cuenta bancaria
        </Title>
      </section>
      {projects.length ? <Section style="form" className={""}>
        <PiBank className="text-[100px] md:text-[180px]" />
        <Form onSubmit={onSubmit} className={""}>
          <Fields fields={fields} setFocus={setFocus} register={register} onSubmit={onSubmit}/>
          <p className="text-xl md:text-4xl font-ubuntu">Firmantes:</p>
            <div className="flex flex-col gap-4 items-start max-w-full">
            <AnimatePresence>
              {firmantes.map((firmante, i) => {
                return <SignatoryCard changeFirmanteProperty={changeFirmanteProperty} firmante={firmante} deleteFirmante={deleteFirmante} i={i}/>
              })}
              <Button className={"bg-teal-700 after:bg-teal-600"} type="button" onClick={() => setFirmantes([...firmantes, {}])}>Agregar Firmante <FaPlus/></Button>
            </AnimatePresence>
            </div>
          <Button type="submit" style="submit" className={"text-black"}>
            Agregar Cuenta
          </Button>
        </Form>
      </Section> : null}
    </Main>
  )
}

export default NewAccount
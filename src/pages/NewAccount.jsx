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

const NewAccount = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [projects, setProjects] = useState(false)
  const [firmantes, setFirmantes] = useState([])

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
    const result = (await customAxios.post("/account", data)).data
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
    <Main className={"grid items-center justify-center gap-y-[30px]"} paddings>
      <section>
        <Title className={"text-start md:text-center"}>
          Nueva cuenta bancaria
        </Title>
      </section>
      {projects ? <Section style="form" className={""}>
        <MdAccountBalanceWallet className="text-[100px] md:text-[180px]" />
        <Form onSubmit={onSubmit} className={""}>
          <SelectInput register={{...register("society")}} options={projects}>
            <Label name={"society"} text={"Sociedad:"}/>
          </SelectInput>
          <Input register={{...register("accountNumber")}}>
            <Label name={"accountNumber"} text={"N° de cuenta:"}/>
          </Input>
          <Input register={{...register("cbu")}}>
            <Label name={"cbu"} text={"CBU:"}/>
          </Input>
          <Input register={{...register("alias")}}>
            <Label name={"alias"} text={"Alias:"}/>
          </Input>
          <Input register={{...register("cuit")}}>
            <Label name={"cuit"} text={"CUIT:"}/>
          </Input>
          <Input register={{...register("bank")}}>
            <Label name={"bank"} text={"Banco:"}/>
          </Input>
          <Input register={{...register("name")}}>
            <Label name={"name"} text={"Titular:"}/>
          </Input>
          <Input register={{...register("initialBalance", {required: true})}} type="number">
            <Label name={"initialBalance"} text={"Saldo inicial:"}/>
          </Input>
          <p className="text-xl md:text-4xl font-ubuntu">Firmantes:</p>
          <div className="flex flex-col gap-4 items-start max-w-full">
            {firmantes.map((firmante, i) => {
              return <div className="flex flex-col gap-2 bg-fourth p-4 rounded items-center w-full justify-between" key={"f"+i}>
                <div className="flex gap-4 justify-between w-full">
                  <Input placeholder={"Nombre"} value={firmante?.name} className={"!w-full"} containerClassName={"w-full"} onInput={(e) => changeFirmanteProperty("name", e.currentTarget.value, i)}/>
                  <Button style="icon" type="button" className={"!bg-red-600 text-lg"} onClick={() => deleteFirmante(i)}><FaTrash/></Button>
                </div>
                <Input containerClassName={"w-full"} type="date" onInput={(e) => changeFirmanteProperty("from", e.currentTarget.value, i)}>
                  <Label text={"Desde"} value={firmante?.from}/>
                </Input>
                <Input containerClassName={"w-full"} type="date" onInput={(e) => changeFirmanteProperty("to", e.currentTarget.value, i)}>
                  <Label text={"Hasta"} value={firmante?.to}/>
                </Input>
              </div>
            })}
            <Button className={"bg-teal-700 after:bg-teal-600"} type="button" onClick={() => setFirmantes([...firmantes, {}])}>Agregar Firmante <FaPlus/></Button>
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
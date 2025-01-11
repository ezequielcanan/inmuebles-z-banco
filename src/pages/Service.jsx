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


const Service = ({ project }) => {
  const [service, setService] = useState(false)
  const [reload, setReload] = useState(false)
  const {sid} = useParams()
  const { register, handleSubmit, setFocus, reset } = useForm()
  const fields = [
    { name: "name", text: "Servicio:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input },
    { name: "code", text: "N° de cuenta:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input },
    { name: "description", text: "Detalle:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input },
  ]


  useEffect(() => {
    customAxios.get(`/service/${sid}`).then(res => {
      setService(res?.data?.payload || [])
    })
  }, [reload])

  const onSubmit = handleSubmit(async data => {
    await customAxios.post("/service", { ...data, project })
    reset()
    setReload(!reload)
  })

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      {service ? (
        <>
          <Section>
            <Title className={"text-center md:text-start"}>
              {service?.project?.title} - {service?.name} {service?.code}
            </Title>
          </Section>
          <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">

          </section>
        </>
      ) : <BounceLoader />}
    </Main>
  )
}

export default Service
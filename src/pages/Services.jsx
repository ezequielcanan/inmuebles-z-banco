import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import Title from "../components/Title"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaArrowRight, FaFileExcel, FaPlus, FaTrash } from "react-icons/fa"
import Section from "../containers/Section"
import Input from "../components/FormInput/Input"
import { BsCheck } from "react-icons/bs"
import Fields from "../components/Fields"
import { useForm } from "react-hook-form"
import Form from "../components/Form"


const Services = ({project}) => {
  const [services, setServices] = useState(false)
  const [reload, setReload] = useState(false)
  const {register, handleSubmit, setFocus, reset} = useForm()
  const fields = [
    {name: "name", text: "Servicio:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input},
    {name: "code", text: "N° de cuenta:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input},
    {name: "description", text: "Detalle:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input},
  ]


  useEffect(() => {
    customAxios.get(`/service/project/${project}`).then(res => {
      setServices(res?.data?.payload || [])
    })
  }, [reload])

  const onSubmit = handleSubmit(async data => {
    await customAxios.post("/service", {...data, project})
    reset()
    setReload(!reload)
  })

  const onDeleteService = async (id) => {
    await customAxios.delete(`/service/${id}`)
    setReload(!reload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title className={"text-center md:text-start"}>
          Servicios
        </Title>
      </Section>
      <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
        {services ? (
          <>
            {services.length ? (
              services.map((service, i) => {
                return <div key={"c"+i} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
                <h3 className="text-3xl">{service?.name}: {service?.code}</h3>
                <h4 className="text-xl">Cantidad de movimientos: {service?.movements}</h4>
                <p>{service?.description}</p>
                <div className="flex items-center text-2xl gap-x-4">
                  <a href={`${import.meta.env.VITE_REACT_API_URL}/api/movement/excel/service/${service?._id}` }>
                    <Button style="icon" className={"!bg-third text-white rounded-md duration-300 hover:scale-90"}>
                      <FaFileExcel/>
                    </Button>
                  </a>
                  {!service?.movements ? <Button style="icon" className={"!bg-red-600 text-white rounded-md duration-300 hover:scale-90"} onClick={() => onDeleteService(service?._id)}>
                    <FaTrash/>
                  </Button> : null}
                  <Link to={`/services/${service?._id}`}>
                    <Button style="icon" className={"!bg-blue-600 text-white rounded-md duration-300 hover:scale-90"}><FaArrowRight/></Button>
                  </Link>
                </div>
              </div>
              })
            ) : (
              null
            )}
            <div>
              <Form className={"bg-third p-4 text-white"}>
                <Fields fields={fields} onSubmit={onSubmit} register={register} setFocus={setFocus}/>
                <Button className={"!text-lg items-center justify-center !p-2"} onClick={e => (e.preventDefault(), onSubmit())}>Agregar Servicio <FaPlus/></Button>
              </Form>
            </div>
          </>
        ) : <BounceLoader />}
      </section>
    </Main>
  )
}

export default Services
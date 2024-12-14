import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import Title from "../components/Title"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { FaFileExcel, FaPlus, FaTrash } from "react-icons/fa"
import Section from "../containers/Section"
import Input from "../components/FormInput/Input"
import { BsCheck } from "react-icons/bs"
import Fields from "../components/Fields"
import { useForm } from "react-hook-form"
import Form from "../components/Form"
import moment from "moment"
import "moment/locale/es"
moment.locale("es")

const Tax = () => {
  const [taxes, setTaxes] = useState(false)
  const [reload, setReload] = useState(false)
  const {register, handleSubmit, setFocus, reset} = useForm()
  const fields = [
    {name: "percentage", text: "Porcentaje:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input, type: "number"},
    {name: "month", text: "Mes:", labelClassName: "!text-lg", className: "!text-lg !w-full", containerClassName: "max-w-full", component: Input, type: "month"},
  ]


  useEffect(() => {
    customAxios.get("/tax").then(res => {
      setTaxes(res?.data?.payload || [])
    })
  }, [reload])

  const onSubmit = handleSubmit(async data => {
    await customAxios.post("/tax", data)
    reset()
    setReload(!reload)
  })

  const onDeleteTax = async (id) => {
    await customAxios.delete(`/tax/${id}`)
    setReload(!reload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title className={"text-center md:text-start"}>
          Ingresos Brutos
        </Title>
      </Section>
      <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
        {taxes ? (
          <>
            {taxes.length ? (
              taxes.map((tax, i) => {
                return <div key={"c"+i} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
                <h3 className="text-3xl">{moment.utc(tax?.month).format("MM/YYYY")}</h3>
                <h4 className="text-xl">Porcentaje: {tax?.percentage}</h4>
                <div className="flex items-center text-2xl gap-x-4">
                  {!tax?.movements ? <Button style="icon" className={"!bg-red-600 text-white rounded-md duration-300 hover:scale-90"} onClick={() => onDeleteTax(tax?._id)}>
                    <FaTrash/>
                  </Button> : null}
                </div>
              </div>
              })
            ) : (
              null
            )}
            <div>
              <Form className={"bg-third p-4 text-white"}>
                <Fields fields={fields} onSubmit={onSubmit} register={register} setFocus={setFocus}/>
                <Button className={"!text-lg items-center justify-center !p-2"} onClick={e => (e.preventDefault(), onSubmit())}>Confirmar <FaPlus/></Button>
              </Form>
            </div>
          </>
        ) : <BounceLoader />}
      </section>
    </Main>
  )
}

export default Tax
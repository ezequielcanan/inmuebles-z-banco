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


const Services = () => {
  const [services, setServices] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get("/service").then(res => {
      setServices(res?.data?.payload || [])
    })
  }, [reload])

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
              services.map((account, i) => {
                return <div key={"c"+i} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
                <h3 className="text-3xl">{account?.name}</h3>
                <div className="flex items-center text-2xl gap-x-4">
                  <a href={`${import.meta.env.VITE_REACT_API_URL}/api/cash-account/excel/${account?._id}` }>
                    <Button style="icon" className={"!bg-third text-white rounded-md duration-300 hover:scale-90"}>
                      <FaFileExcel/>
                    </Button>
                  </a>
                  <Button style="icon" className={"!bg-red-600 text-white rounded-md duration-300 hover:scale-90"} onClick={() => onDeleteAccount(account?._id)}>
                    <FaTrash/>
                  </Button>
                </div>
              </div>
              })
            ) : (
              <p className="text-lg">No hay servicios</p>
            )}
          </>
        ) : <BounceLoader />}
      </section>
    </Main>
  )
}

export default Services
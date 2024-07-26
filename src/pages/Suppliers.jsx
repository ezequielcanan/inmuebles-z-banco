import { useEffect, useState } from "react"
import { BounceLoader } from "react-spinners"
import Title from "../components/Title"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { FaFileExcel, FaPlus, FaTrash } from "react-icons/fa"
import Section from "../containers/Section"
import SelectInput from "../components/FormInput/SelectInput"
import Label from "../components/Label"
import Button from "../components/Button"

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(false)
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(false)

  useEffect(() => {
    customAxios.get("/supplier").then(res => {
      setSuppliers(res?.data?.payload || [])
    })
  }, [])

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      const data = res?.data?.payload?.map(p => {return {value: p._id, text: p?.title}})
      setProject(data[0]?.value)
      setProjects(data || [])
    })
  }, [])
  console.log(project)
  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title className={"text-center md:text-start"}>
          Servicios
        </Title>
        <SelectInput options={projects} className={"text-white"} containerClassName={"bg-fourth text-white p-2 px-4"} onChange={(e) => setProject(e.target.value)}>
          <Label>Projecto del excel:</Label>
        </SelectInput>
      </Section>
      <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
        {suppliers ? (
          <>
            {suppliers.length ? (
              suppliers.map((supplier, i) => {
                return <div key={"c"+i} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
                <h3 className="text-3xl">{supplier?.name}: {supplier?.code}</h3>
                <h4 className="text-xl">Cantidad de movimientos: {supplier?.movements}</h4>
                <div className="flex items-center text-2xl gap-x-4">
                  <a href={`${import.meta.env.VITE_REACT_API_URL}/api/movement/${supplier?._id}/${project}` }>
                    <Button style="icon" className={"!bg-third text-white rounded-md duration-300 hover:scale-90"}>
                      <FaFileExcel/>
                    </Button>
                  </a>
                </div>
              </div>
              })
            ) : (
              null
            )}
          </>
        ) : <BounceLoader />}
      </section>
    </Main>
  )
}

export default Suppliers
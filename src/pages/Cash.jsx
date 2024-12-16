import { useEffect, useState } from "react"
import Main from "../containers/Main"
import customAxios from "../config/axios.config"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import Title from "../components/Title"
import Section from "../containers/Section"
import Button from "../components/Button"
import moment from "moment"
import { FaArrowRight, FaFileExcel } from "react-icons/fa"
import SelectInput from "../components/FormInput/SelectInput"

const Cash = () => {
  const [project, setProject] = useState(null)
  const [movements, setMovements] = useState(null)
  const [dollar, setDollar] = useState(false)
  const { pid } = useParams()

  useEffect(() => {
    customAxios.get(`/projects/${pid}`).then(res => {
      setProject(res?.data?.payload || {})
    }).catch(e => {
      console.log(e)
      setProject(false)
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/movement/cash/projects/${pid}${dollar ? "?dollar=true": ""}`).then(res => {
      setMovements(res?.data?.payload || [])
    }).catch(e => {
      console.log(e)
      setMovements(false)
    })
  }, [dollar])

  const dateFormat = "DD-MM-YYYY"

  let balance = 0

  return (
    <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
      {(project && movements) ? (
        <>
          <Section className={"flex gap-x-[40px] items-center flex-wrap"}>
            <Title className={"text-center xl:text-start"}>CAJA - {project?.title}</Title>
            <Link to={`new${dollar ? "?dollar=true" : ""}`}><Button>Nuevo movimiento</Button></Link>
          </Section>
          <SelectInput containerClassName={"self-center md:self-start"} options={[{text: "Pesos", value: false}, {text: "Dolares", value: false}]} optionClassName={"text-white"} onChange={(e) => setDollar(!dollar)}/>
          <a href={`${import.meta.env.VITE_REACT_API_URL}/api/movement/cash/excel/${pid}${dollar ? "?dollar=true" : ""}`} download className="self-center md:self-start"><Button className={"self-center md:self-start"}>Archivo <FaFileExcel /></Button></a>
          <section className="flex flex-col items-start gap-y-[30px] pt-[60px]">
            <div className="w-full flex flex-col gap-y-[30px]">
              <div className="overflow-x-scroll">
                <table className="max-w-full w-full border-4 border-b-0 border-third">
                  <thead className="border-b-4 border-third">
                    <tr>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Fecha</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Concepto</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Ingreso</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Egreso</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement, i) => {
                      balance += (movement?.credit || 0) - (movement?.debit || 0)
                      return (
                        <tr className="border-b-4 border-third duration-300">
                          <td className="p-3">{moment.utc(movement.date).format(dateFormat)}</td>
                          <td className="p-3">{movement?.detail}</td>
                          <td className="p-3">{movement?.credit}</td>
                          <td className="p-3">{movement.debit}</td>
                          <td className="p-3">{balance}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
        <BounceLoader />
      )}
    </Main>
  )
}

export default Cash
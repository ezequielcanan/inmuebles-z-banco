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
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { BiTransferAlt } from "react-icons/bi"

const OutGoingChecks = () => {
  const [project, setProject] = useState(null)
  const [checks, setChecks] = useState(null)
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
    customAxios.get(`/movement/checks/out/${pid}`).then(res => {
      setChecks(res?.data?.payload || [])
    }).catch(e => {
      console.log(e)
      setChecks(false)
    })  
  }, [])


  const dateFormat = "DD-MM-YYYY"

  return <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
    {(project && checks) ? (
      <>
        <Section className={"flex gap-x-[40px] items-center flex-wrap"}>
          <Title className={"text-center xl:text-start"}>Cheques emitidos - {project?.title}</Title>
          <Link to={"new"}><Button>Nuevo Cheque</Button></Link>
        </Section>        
        <a href={`${import.meta.env.VITE_REACT_API_URL}/api/movement/checks/excel/${pid}`} download className="self-center md:self-start"><Button className={"self-center md:self-start"}>Archivo <FaFileExcel/></Button></a>
        <section className="flex flex-col items-start gap-y-[30px] pt-[60px]">
          <div className="w-full flex flex-col gap-y-[30px]">
            {/*<div className="flex flex-wrap gap-8 justify-between items-center">
                <Button className="self-start bg-teal-400 hover:after:!left-[-100%] !text-black border-2 border-black" onClick={() => setFilter(!filter)}>Ordenado por: {filter ? "Vencimiento" : "Emisión"}</Button>
                <div className="flex flex-wrap items-center gap-4">
                <a href={`${import.meta.env.VITE_REACT_API_URL}/api/movement/checks/excel/${account?.society?._id}?filter=${filter}`} className="text-success text-3xl flex gap-2 items-center bg-primary p-2 text-white rounded-lg">Cheques <FaFileDownload /></a>
                  <a href={`${import.meta.env.VITE_REACT_API_URL}/api/account/excel/${aid}?filter=${filter}`} className="text-success text-3xl flex gap-2 items-center bg-primary p-2 text-white rounded-lg">Diario <FaFileDownload /></a>
                </div>
              </div>*/}
            <div className="overflow-x-scroll">
              <table className="max-w-full w-full border-4 border-b-0 border-third">
                <thead className="border-b-4 border-third">
                  <tr>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Banco</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Fecha</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Emisión</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Vencimiento</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">N°</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">A la orden</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Detalle</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Importe</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Estado</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Tipo</th>
                    <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {checks.map((check, i) => {
                    const isExpired = moment(check?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) && check?.state == "PENDIENTE"

                    return (
                      <tr className={`border-b-4 border-third duration-300 ${isExpired || check?.error ? "bg-red-300" : !check?.paid ? "bg-yellow-300" : "bg-green-300"}`}>
                        <td className="p-3">{check?.account?.bank}</td>
                        <td className="p-3">{check?.date || ""}</td>
                        <td className="p-3">{check?.emissionDate || ""}</td>
                        <td className="p-3">{check?.expirationDate || ""}</td>
                        <td className="p-3">{check.code}</td>
                        <td className="p-3">{check?.supplier?.name || check?.cashAccount?.name || ""}</td>
                        <td className="p-3">{check?.detail}</td>
                        <td className="p-3">{check?.debit}</td>
                        <td className="p-3">{check?.state == "PENDIENTE" && isExpired ? "VENCIDO" : check?.state}</td>
                        <td className="p-3">{check?.checkType}</td>
                        <td className="p-3"><Link to={`/outgoing-checks/actions/${check?._id}`}><FaArrowRight size={20}/></Link></td>
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
}

export default OutGoingChecks
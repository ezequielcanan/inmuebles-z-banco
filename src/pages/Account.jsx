import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import Main from "../containers/Main"
import Title from "../components/Title"
import Section from "../containers/Section"
import customAxios from "../config/axios.config"
import Subtitle from "../components/Subtitle"
import Button from "../components/Button"
import { FaChevronLeft, FaChevronRight, FaEdit, FaFileDownload, FaPlus } from "react-icons/fa"
import MovementRow from "../components/MovementRow"
import Input from "../components/FormInput/Input"
import Label from "../components/Label"
import { useForm } from "react-hook-form"
import SelectInput from "../components/FormInput/SelectInput"
import Form from "../components/Form"
import SignatoryCard from "../components/SignatoryCard"

const Account = () => {
  const { aid } = useParams()
  const [account, setAccount] = useState(false)
  const [movements, setMovements] = useState([])
  const [paginatedMovements, setPaginatedMovements] = useState([])
  const [filter, setFilter] = useState(false)
  const [projects, setProjects] = useState(false)
  const [editing, setEditing] = useState(false)
  const [reload, setReload] = useState(false)
  const [signatories, setSignatories] = useState([])
  const [page, setPage] = useState(1)
  const movementsLimit = 2

  const { register, handleSubmit } = useForm()

  useEffect(() => {
    customAxios.get("/projects?filter=false").then(res => {
      setProjects(res?.data?.payload.map((project => {
        return { text: project.title, value: project._id }
      })) || [])
    }).catch(e => {
      setProjects([])
    })
  }, [reload, editing])

  useEffect(() => {
    customAxios.get(`/account/${aid}`).then(res => {
      setAccount(res?.data?.payload)
      setSignatories(res?.data?.payload?.signatories || [])
    })
  }, [reload, editing])

  useEffect(() => {
    customAxios.get(`/movement/${aid}?filter=${filter}&page=${page-1}`).then(res => setPaginatedMovements(res?.data?.payload))
  }, [filter, reload, editing, page])

  const onSubmit = handleSubmit(async data => {
    await customAxios.put(`/account/${aid}`, { ...data, signatories })
    setEditing(false)
    setReload(!reload)
  })

  const deleteFirmante = (firmanteIndex) => {
    signatories.splice(firmanteIndex, 1)
    setSignatories([...signatories])
  }

  const changeFirmanteProperty = (property, value, firmanteIndex) => {
    const updateObj = {}
    updateObj[property] = value
    signatories[firmanteIndex] = { ...signatories[firmanteIndex], ...updateObj }
    setSignatories([...signatories])
  }

  const onChangePage = (qty = 1) => {
    setPage(p => p+qty)
  }

  return (
    <Main className={"flex flex-col gap-y-[20px] pb-[120px]"} paddings>
      {(account && account != "error" && projects) ? (
        <>
          <Section className={"flex gap-x-[40px] items-center"}>
            <Title>Banco {account.bank} {account.society?.title}</Title>
            <FaEdit className="text-5xl cursor-pointer" onClick={() => setEditing(!editing)} />
          </Section>
          <section className="grid lg:grid-cols-2 gap-x-4 gap-y-[10px] text-xl">
            <Form onSubmit={onSubmit}>
              <SelectInput register={{ ...register("society") }} defaultValue={account?.society?._id} options={projects} disabled={!editing} optionClassName={"text-white"} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Sociedad:"} name={"society"} className={"!text-2xl"} />
              </SelectInput>
              <Input register={{ ...register("bank") }} defaultValue={account?.bank} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Banco:"} name={"bank"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("accountNumber") }} defaultValue={account?.accountNumber} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"N° de cuenta:"} name={"accountNumber"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("cuit") }} defaultValue={account?.cuit} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"CUIT:"} name={"cuit"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("cbu") }} defaultValue={account?.cbu} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"CBU:"} name={"cbu"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("alias") }} defaultValue={account?.alias} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Alias:"} name={"alias"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("name") }} defaultValue={account?.name} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Titular"} name={"name"} className={"!text-2xl"} />
              </Input>
              <Input register={{ ...register("initialBalance") }} type="number" defaultValue={account?.initialBalance} disabled={!editing} containerClassName={"!border-b-0 !w-full !justify-start"} className={"!text-2xl"}>
                <Label text={"Saldo inicial:"} name={"initialBalance"} className={"!text-2xl"} />
              </Input>
              {editing && <Button style="submit" type="submit" className={"!text-xl self-start border-4 border-black"}>
                Actualizar cuenta
              </Button>}
            </Form>
            <div className={`grid grid-cols-2 gap-4 text-white grid-rows-3 w-full`}>
              {signatories?.map((sign, i) => {
                return <SignatoryCard accountPanel firmante={sign} i={i} editing={editing} labelClassName={"!text-lg"} className={"!text-lg"} changeFirmanteProperty={changeFirmanteProperty} deleteFirmante={deleteFirmante} />
              })}
              {editing ? <div className="border-dashed border-4 border-third/50 w-full flex items-center justify-center h-full text-third" onClick={() => setSignatories([...signatories, {}])}>
                <FaPlus />
              </div> : null}
            </div>
          </section>
          <section className="flex flex-col items-start gap-y-[30px] pt-[60px]">
            <div className="flex w-full gap-8 items-center flex-col sm:flex-row justify-between">
              <Subtitle>Movimientos</Subtitle>
              <Link to={`/accounts/${aid}/new-movement`}>
                <Button className={"flex"}>
                  Agregar movimiento <FaPlus />
                </Button>
              </Link>
            </div>
            <div className="w-full flex flex-col gap-y-[30px]">
              <div className="flex flex-wrap gap-8 justify-between items-center">
                <Button className="self-start bg-teal-400 hover:after:!left-[-100%] !text-black border-2 border-black" onClick={() => setFilter(!filter)}>Ordenado por: {filter ? "Vencimiento" : "Emisión"}</Button>
                <div className="flex flex-wrap items-center gap-4">
                  <a href={`${import.meta.env.VITE_REACT_API_URL}/api/movement/checks/excel/${account?.society?._id}?filter=${filter}`} className="text-success text-3xl flex gap-2 items-center bg-primary p-2 text-white rounded-lg">Cheques <FaFileDownload /></a>
                  <a href={`${import.meta.env.VITE_REACT_API_URL}/api/account/excel/${aid}?filter=${filter}`} className="text-success text-3xl flex gap-2 items-center bg-primary p-2 text-white rounded-lg">Diario <FaFileDownload /></a>
                </div>
              </div>
              <div className="overflow-x-scroll">
                <table className="max-w-full border-4 border-b-0 border-third">
                  <thead className="border-b-4 border-third">
                    <tr>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Fecha</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Emisión</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Vencimiento</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Tipo</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Número</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Estado</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Cheque anterior</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Proveedor</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Servicio</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Detalle</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Credito</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Debito</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Brutos</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">6XMIL</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Saldo Real</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Saldo Proyectado</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Borrar</th>
                      <th className="text-start p-3 whitespace-nowrap bg-third text-2xl text-white">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMovements.map((movement, i) => {
                      return <MovementRow movement={movement} editing={editing} key={movement?._id} setReload={setReload} />
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 justify-center">
                {paginatedMovements?.length < 30 ? null : <FaChevronLeft className="text-2xl cusor-pointer" onClick={() => onChangePage()}/>}
                {page != 1 && <FaChevronRight className="text-2xl cusor-pointer" onClick={() => onChangePage(-1)}/>}
              </div>
            </div>
          </section>
        </>
      ) : (
        !account ? <BounceLoader size={100} /> : <Title>ERROR</Title>
      )}
    </Main>
  )
}

export default Account
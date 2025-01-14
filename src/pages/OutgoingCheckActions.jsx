import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import customAxios from "../config/axios.config"
import Section from "../containers/Section"
import Title from "../components/Title"
import { BounceLoader } from "react-spinners"
import moment from "moment"
import Main from "../containers/Main"
import AccountCard from "../components/AccountCard"
import Button from "../components/Button"
import { useForm } from "react-hook-form"
import SelectInput from "../components/FormInput/SelectInput"
import Input from "../components/FormInput/Input"
import Fields from "../components/Fields"
import Form from "../components/Form"
import { FaPlusCircle, FaTrash } from "react-icons/fa"
import Swal from "sweetalert2"
import OutgoingCheckForm from "../components/OutgoingCheckForm"

const OutgoingChekcActions = () => {
  const [check, setCheck] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [reload, setReload] = useState(false)
  const { register, handleSubmit, setFocus } = useForm()
  const { register: transferRegister, handleSubmit: handleTransferSubmit, setFocus: setTransferFocus } = useForm()
  const { register: newTransferRegister, handleSubmit: handleNewTransferSubmit, setFocus: setNewTransferFocus, reset: resetNewTransfer } = useForm()
  const { cid } = useParams()
  const navigate = useNavigate()


  useEffect(() => {
    customAxios.get(`/movement/single/movement/${cid}`).then(res => {
      setCheck(res?.data?.payload || {})
    }).catch(e => {
      console.log(e)
      setCheck(false)
    })
  }, [reload])


  useEffect(() => {
    customAxios.get(`/supplier`).then(res => {
      setSuppliers((res?.data?.payload || []).map(supplier => {
        return { text: supplier?.name, value: supplier?._id }
      }))
    }).catch(e => {
      console.log(e)
      setSuppliers(false)
    })
  }, [])



  const changeState = async (newState) => {
    await customAxios.put(`/movement/${cid}`, {state: newState, paid: newState == "COBRADO", error: newState == "RECHAZADO"})
    setReload(!reload)
  }

  const onSubmit = handleSubmit(async data => {
    !data.lastCheck && delete data.lastCheck
    data.debit = data?.amount || 0



    await customAxios.put("/movement/" + cid, data)
    setReload(!reload)
  })


  const deleteOutgoingCheck = async () => {
    await customAxios.delete(`/movement/${cid}`)
    navigate(`/outgoing-checks/${check?.account?.society?._id}`)
  }

  const isExpired = moment(check?.expirationDate).add(33, "days")?.isBefore(moment()) && check?.state == "PENDIENTE"
  
  return (
    <Main className={"flex flex-col gap-y-[50px] pb-[120px]"} paddings>
      {(check) ? (
        <>
          <Section className={"flex !flex-col gap-y-[20px] items-center md:items-start flex-wrap"}>
            <Title className={"text-center xl:text-start"}>Cheque {check?.account?.society?.title}: {check?.code}</Title>
            <FaTrash className="text-red-600 hover:text-red-800 duration-300 text-3xl" onClick={deleteOutgoingCheck} />
          </Section>
          <section className="grid md:grid-cols-2 gap-8">
            <OutgoingCheckForm text="Editar" register={register} onSubmit={onSubmit} project={check?.account?.society?._id} setFocus={setFocus} check={check} />
            <div className="flex flex-col gap-8">
              <>
                <div className="flex items-center gap-2">
                  <p className="text-3xl">ESTADO:</p>
                  <Button className={(check?.state == "RECHAZADO" || isExpired) ? "bg-red-500 after:!bg-red-600" : ""} onClick={() => changeState(check?.state == "PENDIENTE" ? "COBRADO" : check?.state == "COBRADO" ? "RECHAZADO" : "PENDIENTE")}>{check?.state == "PENDIENTE" && isExpired ? "VENCIDO" : check?.state}</Button>
                </div>
              </>
            </div>
          </section>
        </>
      ) : (
        <BounceLoader />
      )}
    </Main>
  )
}

export default OutgoingChekcActions
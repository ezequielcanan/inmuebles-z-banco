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
import IncomingCheckForm from "../components/IncomingCheckForm"
import { useForm } from "react-hook-form"
import SelectInput from "../components/FormInput/SelectInput"
import Input from "../components/FormInput/Input"
import Fields from "../components/Fields"
import Form from "../components/Form"
import { FaPlusCircle, FaTrash } from "react-icons/fa"

const ChekcActions = () => {
  const [check, setCheck] = useState(null)
  const [accounts, setAccounts] = useState(false)
  const [cashAccounts, setCashAccounts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [reload, setReload] = useState(false)
  const { register, handleSubmit, setFocus } = useForm()
  const { register: transferRegister, handleSubmit: handleTransferSubmit, setFocus: setTransferFocus } = useForm()
  const { register: newTransferRegister, handleSubmit: handleNewTransferSubmit, setFocus: setNewTransferFocus, reset: resetNewTransfer } = useForm()
  const { cid } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    customAxios.get("/account").then(res => {
      setAccounts(res?.data?.payload || [])
    })
  }, [])

  useEffect(() => {
    customAxios.get(`/incoming-check/${cid}`).then(res => {
      setCheck(res?.data?.payload || {})
    }).catch(e => {
      console.log(e)
      setCheck(false)
    })
  }, [reload])

  useEffect(() => {
    customAxios.get(`/cash-account`).then(res => {
      setCashAccounts((res?.data?.payload || []).map(account => {
        return { text: account?.name, value: account?._id }
      }))
    }).catch(e => {
      console.log(e)
      setCashAccounts(false)
    })
  }, [])

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

  const onClickAccountCard = async (account) => {
    const monthTax = await customAxios.get(`/tax/date?date=${check?.operationDate}`)
    await customAxios.put(`/incoming-check/${cid}?property=account&value=${account?._id}`)
    await customAxios.put(`/incoming-check/${cid}?property=state&value=ACEPTADO`)
    await customAxios.post("/movement", { incomingCheck: cid, account: account?._id, tax: monthTax?.data?.payload?.tax || 0 })
    setReload(!reload)
  }

  const changeState = async (newState) => {
    await customAxios.put(`/incoming-check/${cid}?property=state&value=${newState}`)
    setReload(!reload)
  }

  const onSubmit = handleSubmit(async data => {
    if (!data?.cashAccount) delete data.cashAccount
    if (!data?.owner) delete data.owner

    await customAxios.put("/incoming-check/all/" + cid, data)
    setReload(!reload)
  })

  const onTransferSubmit = handleTransferSubmit(async data => {
    if (!data?.cashAccount) delete data.cashAccount
    if (!data?.supplier) delete data.supplier
    if (!data?.other) delete data.other

    await customAxios.put("/incoming-check/all/" + cid, {
      state: `ENDOSADO A ${data?.supplier ?
        suppliers.find(s => s?.value == data?.supplier)?.text :
        (data?.cashAccount ? cashAccounts.find(s => s?.value == data?.cashAccount)?.text :
          data?.other)}`,
      transfer: data
    })
    setReload(!reload)
  })

  const onNewTransferSubmit = handleNewTransferSubmit(async data => {
    await customAxios.post(`/incoming-check/transfer/${cid}`, data)
    resetNewTransfer()
    setReload(!reload)
  })

  const handleDeleteTransfer = async (tid) => {
    await customAxios.delete(`/incoming-check/transfer/${cid}/${tid}`)
    setReload(!reload)
  }

  const cancelAction = async () => {
    await customAxios.put(`/incoming-check/${cid}?property=account&action=$unset`)
    await customAxios.put(`/incoming-check/${cid}?property=state&action=$unset`)
    await customAxios.put(`/incoming-check/${cid}?property=transfer&action=$unset`)
    await customAxios.delete(`/movement/check/${cid}`)
    setReload(!reload)
  }

  const deleteIncomingCheck = async () => {
    await customAxios.delete(`/incoming-check/${cid}`)
    await customAxios.delete(`/movement/check/${cid}`)
    navigate(`/incoming-checks/${check?.project?._id}`)
  }

  const transferFields = [
    { name: "supplier", text: "Proveedor", component: SelectInput, common: false, options: [{ text: null, value: undefined }, ...suppliers], className: "max-w-[200px]", },
    { name: "cashAccount", text: "Sociedad", component: SelectInput, common: false, options: [{ text: null, value: undefined }, ...cashAccounts], className: "max-w-[200px]" },
    { name: "other", text: "Otro", component: Input }
  ]

  const newTransferFields = [
    { name: "subject", text: "Nombre", component: Input, className: "!text-xl", labelClassName: "!text-xl" },
    { name: "date", type: "date", text: "Fecha", component: Input, className: "!text-xl", labelClassName: "!text-xl" },
  ]


  return (
    <Main className={"flex flex-col gap-y-[50px] pb-[120px]"} paddings>
      {(check && accounts) ? (
        <>
          <Section className={"flex !flex-col gap-y-[20px] items-center md:items-start flex-wrap"}>
            <Title className={"text-center xl:text-start"}>Cheque {check?.project?.title}: {check?.code}</Title>
            <FaTrash className="text-red-600 hover:text-red-800 duration-300 text-3xl" onClick={deleteIncomingCheck}/>
            <p className="text-3xl">Recibido: {moment.utc(check?.receivedDate).format("DD-MM-YYYY")} - {check?.owner ? check?.owner?.name : (check?.cashAccount ? check?.cashAccount?.name : check?.specialFrom)}</p>
          </Section>
          <section className="grid md:grid-cols-2 gap-8">
            <IncomingCheckForm text="Editar" register={register} onSubmit={onSubmit} setFocus={setFocus} check={check} />
            <div className="flex flex-col gap-8">
              {!check?.state ? (
                <>
                  <div className="grid md:grid-cols-2 items-center gap-4 bg-third text-white rounded-lg p-4">
                    <h2 className="text-2xl md:col-span-2 text-center">Depositar</h2>
                    {accounts.length ? (
                      accounts.map((account, i) => {
                        return <AccountCard account={account} key={i} onClick={onClickAccountCard} />
                      })
                    ) : (
                      <h2>No hay cuentas registradas</h2>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-4 bg-third text-white rounded-lg p-4">
                    <h2 className="text-2xl md:col-span-2 text-center">Endosar</h2>
                    <Form onSubmit={onTransferSubmit} className={""}>
                      <Fields fields={transferFields} setFocus={setTransferFocus} register={transferRegister} onSubmit={onTransferSubmit} />
                      <Button type="submit" style="submit" className={"text-black"}>
                        Confirmar
                      </Button>
                    </Form>
                  </div>
                </>
              ) : (
                check?.state == "ACEPTADO" || check?.state == "DEPOSITADO" || check?.state == "RECHAZADO" ? (
                  <>
                    <div className="flex flex-wrap gap-4 items-center">
                      <h2 className="text-3xl">Accion tomada: deposito a {check?.account?.bank}</h2>
                      <Button onClick={cancelAction} className={"bg-red-600 after:!bg-red-700"}>Cancelar</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl">ESTADO:</p>
                      <Button className={check?.state == "RECHAZADO" ? "bg-red-500 after:!bg-red-600" : ""} onClick={() => changeState(check?.state == "ACEPTADO" ? "DEPOSITADO" : check?.state == "DEPOSITADO" ? "RECHAZADO" : "ACEPTADO")}>{check?.state}</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-4 items-center flex-wrap">
                      <h2 className="text-3xl">Accion tomada: {check?.state}</h2>
                      <Button onClick={cancelAction} className={"bg-red-600 after:!bg-red-700"}>Cancelar</Button>
                    </div>
                  </>
                )
              )}
            </div>
          </section>
          <section className="grid lg:grid-cols-2 xl:grid-cols-4 items-start gap-8">
            <h3 className="lg:col-span-2 xl:col-span-4 font-bold text-4xl">Historia de endosos</h3>
            {check?.transfers?.length ? (
              check.transfers?.map((transfer, i) => {
                return <div className="flex flex-col items-center gap-4 bg-third p-4 text-white rounded">
                  <div className="flex w-full items-center justify-between">
                    <h4 className="text-xl">Endoso: {i + 1}</h4>
                    <FaTrash className="text-2xl text-red-800 cursor-pointer" onClick={() => handleDeleteTransfer(transfer?._id)} />
                  </div>
                  <p className="text-3xl font-bold">{transfer?.subject}</p>
                  <p className="text-3xl">{moment.utc(transfer?.date).format("DD-MM-YYYY")}</p>
                </div>
              })
            ) : (
              null
            )}
            <div className="flex flex-col items-center gap-4 bg-primary p-4 text-white rounded">
              <h4 className="text-xl">Endoso: {(check?.transfers?.length || 0) + 1}</h4>
              <p className="text-3xl font-bold">{check?.project?.title}</p>
              <p className="text-3xl">{moment.utc(check?.receivedDate).format("DD-MM-YYYY")}</p>
            </div>
            {check?.transfer ? <div className="flex flex-col items-center gap-4 bg-primary p-4 text-white rounded">
              <h4 className="text-xl">Endoso: {(check?.transfers?.length || 0) + 2}</h4>
              <p className="text-3xl font-bold">{check?.transfer?.supplier ? check?.transfer?.supplier?.name : (check?.transfer?.cashAccount ? check?.transfer?.cashAccount?.name : check?.transfer?.other)}</p>
              <p className="text-3xl">{moment.utc(check?.operationDate).format("DD-MM-YYYY")}</p>
            </div> : null}
            <div className="flex flex-col items-center gap-4 bg-primary p-4 text-white rounded">
              <h4 className="text-2xl">Agregar endoso</h4>
              <Form onSubmit={onNewTransferSubmit} className={""}>
                <Fields fields={newTransferFields} setFocus={setNewTransferFocus} register={newTransferRegister} onSubmit={onNewTransferSubmit} />
                <Button type="submit" style="submit" className={"text-black !text-2xl"}>
                  Confirmar
                </Button>
              </Form>
            </div>
          </section>
        </>
      ) : (
        <BounceLoader />
      )}
    </Main>
  )
}

export default ChekcActions
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


const CashAccounts = () => {
  const [cashAccounts, setCashAccounts] = useState(false)
  const [newAccount, setNewAccount] = useState("")
  const [reload, setReload] = useState(false)

  useEffect(() => {
    customAxios.get("/cash-account").then(res => {
      setCashAccounts(res?.data?.payload || [])
    })
  }, [reload])

  const onNewAccount = async () => {
    await customAxios.post("/cash-account", {name: newAccount})
    setNewAccount("")
    setReload(!reload)
  }

  const onDeleteAccount = async (aid) => {
    await customAxios.delete("/cash-account/"+aid)
    setReload(!reload)
  }

  return (
    <Main className={"flex flex-col gap-y-[70px]"} paddings>
      <Section>
        <Title className={"text-center md:text-start"}>
          Cuentas de ingreso
        </Title>
      </Section>
      <section className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
        {cashAccounts ? (
          <>
            {cashAccounts.length ? (
              cashAccounts.map((account, i) => {
                return <div key={"c"+i} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
                <h3 className="text-3xl">{account?.name}</h3>
                <div className="flex items-center text-2xl gap-x-4">
                  <Button style="icon" className={"!bg-third text-white rounded-md duration-300 hover:scale-90"}>
                    <FaFileExcel/>
                  </Button>
                  <Button style="icon" className={"!bg-red-600 text-white rounded-md duration-300 hover:scale-90"} onClick={() => onDeleteAccount(account?._id)}>
                    <FaTrash/>
                  </Button>
                </div>
              </div>
              })
            ) : (
              null
            )}
            <div className="flex items-center justify-between text-black bg-teal-600 p-2 rounded-md self-start">
              <Input placeholder={"Nombre"} className={"!text-xl h-full max-w-[100%] text-white"} value={newAccount} onChange={(e) => setNewAccount(e?.target?.value || "")} containerClassName={"max-w-[80%] border-none"}/>
              <button className="p-2 rounded-md bg-fourth duration-300 hover:scale-90 text-white" onClick={onNewAccount}>
                <BsCheck className="text-2xl"/>
              </button>
            </div>
          </>
        ) : <BounceLoader />}
      </section>
    </Main>
  )
}

export default CashAccounts
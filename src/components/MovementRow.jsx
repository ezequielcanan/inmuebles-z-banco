import { FaChevronRight, FaTrashAlt } from "react-icons/fa"
import customAxios from "../config/axios.config"
import { formatNumber } from "../utils/numbers"
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import Input from "./FormInput/Input"
import moment from "moment"

const MovementRow = ({movement, editing, setReload}) => {
  const [note, setNote] = useState(false)
  const noteRef = useRef()
  const inputProps = {
    className: "!text-base !p-1 !bg-fifth !p-0",
    containerClassName: "!border-b-0 !bg-transparent !p-0",
    disabled: !editing 
  }

  const formatDate = date => moment.utc(date, "DD-MM-YYYY").format("YYYY-MM-DD")

  const deleteMovement = async () => {
    await customAxios.delete(`/movement/${movement?._id}`)
    setReload(prev => !prev)
  }

  const changeMovementState = async () => {
    await customAxios.put(`/movement/${movement?._id}`, {paid: !movement?.paid})
    setReload(prev => !prev)
  }

  const updateNote = async () => {
    await customAxios.put(`/movement/${movement?._id}`, {note: noteRef?.current?.value})
    setNote(false)
    setReload(prev => !prev)
  }

  const toggleNote = () => setNote(prev => !prev)
  
  const onInputProperty = async (e, property) => {
    const updateObj = {}
    updateObj[property] = e.target?.value
    await customAxios.put(`/movement/${movement?._id}`, updateObj)
  }

  return (
    <tr className="border-b-4 border-third duration-300">
      <td className="p-3"><Input defaultValue={formatDate(movement?.date)} {...inputProps} onInput={e => onInputProperty(e, "date")} type="date"/></td>
      <td className="p-3"><Input defaultValue={formatDate(movement?.emissionDate)} {...inputProps} onInput={e => onInputProperty(e, "emissionDate")} type="date"/></td>
      <td className="p-3"><Input defaultValue={formatDate(movement?.expirationDate)} {...inputProps} onInput={e => onInputProperty(e, "expirationDate")} type="date"/></td>
      <td className="p-3">{movement?.movementType}</td>
      <td className={`p-3 duration-150 ${(!movement?.paid && movement.movementType == "Cheque") ? "bg-red-600/30 hover:bg-red-600/50" : "bg-green-600/30 hover:bg-green-600/50"} w-full`} onClick={changeMovementState}><Input defaultValue={movement?.code} {...inputProps} onInput={e => onInputProperty(e, "code")}/></td>
      <td className="p-3">{movement?.lastCheck}</td>
      <td className="p-3">{movement?.supplier?.name}</td>
      <td className="p-3">{movement?.service?.name}{movement?.service ? ":" : ""} {movement?.service?.code}</td>
      <td className="p-3"><Input defaultValue={movement?.detail} {...inputProps} onInput={e => onInputProperty(e, "detail")}/></td>
      <td className="p-3">{formatNumber(movement?.credit)}</td>
      <td className="p-3">{formatNumber(movement?.debit)}</td>
      <td className="p-3">{formatNumber(movement?.tax)}</td>
      <td className="p-3">{formatNumber(movement?.sixThousandths)}</td>
      <td className="p-3">{formatNumber(movement?.realBalance)}</td>
      <td className="p-3">{formatNumber(movement?.balance)}</td>
      {movement?.canBeDeleted != false && <td className="p-3 text-red-600"><FaTrashAlt className="cursor-pointer" onClick={() => deleteMovement()}/></td>}
      <td className="p-3 text-fourth cursor-pointer" onClick={toggleNote}><FaChevronRight/></td>
      {note ? (
         <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         exit={{ opacity: 0 }}
         onClick={toggleNote}
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
       >
         <div 
           onClick={(e) => e.stopPropagation()}
           className="bg-white p-6 flex flex-col gap-y-4 rounded shadow-md w-1/2"
         >
           <textarea 
             className="w-full h-32 p-4 border rounded resize-none" 
             placeholder="Escribe tu nota aquí..."
             defaultValue={movement?.note} ref={noteRef}/>
          <div className="flex gap-x-8">
            <button 
              onClick={updateNote} 
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
              Confirmar
            </button>
            <button 
              onClick={toggleNote} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
              Cerrar
            </button>
          </div>
         </div>
       </motion.div>
      ) : null}
    </tr>
  )
}

export default MovementRow
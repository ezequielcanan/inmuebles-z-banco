import { FaTrashAlt } from "react-icons/fa"
import customAxios from "../config/axios.config"
import { formatNumber } from "../utils/numbers"

const MovementRow = ({movement, setReload}) => {

  const deleteMovement = async () => {
    await customAxios.delete(`/movement/${movement?._id}`)
    setReload(prev => !prev)
  }

  const changeMovementState = async () => {
    await customAxios.put(`/movement/${movement?._id}`, {paid: !movement?.paid})
    setReload(prev => !prev)
  }

  return (
    <tr className="border-b-4 border-third duration-300">
      <td className="p-3">{movement?.date?.toLowerCase() != "fecha inválida" ? movement?.date : ""}</td>
      <td className="p-3">{movement?.emissionDate}</td>
      <td className="p-3">{movement?.expirationDate}</td>
      <td className="p-3">{movement?.movementType}</td>
      <td className={`p-3 duration-300 ${(!movement?.paid && movement.movementType == "Cheque") ? "bg-red-600/30 hover:bg-red-600/50" : "bg-green-600/30 hover:bg-green-600/50"}`} onClick={changeMovementState}>{movement?.code}</td>
      <td className="p-3">{movement?.lastCheck?.code}</td>
      <td className="p-3">{movement?.supplier?.name}</td>
      <td className="p-3">{movement?.service?.name}{movement?.service ? ":" : ""} {movement?.service?.code}</td>
      <td className="p-3">{movement?.detail}</td>
      <td className="p-3">{formatNumber(movement?.credit)}</td>
      <td className="p-3">{formatNumber(movement?.debit)}</td>
      <td className="p-3">{formatNumber(movement?.tax)}</td>
      <td className="p-3">{formatNumber(movement?.sixThousandths)}</td>
      <td className="p-3">{formatNumber(movement?.balance)}</td>
      {movement?.canBeDeleted != false && <td className="p-3 text-red-600"><FaTrashAlt className="cursor-pointer" onClick={() => deleteMovement()}/></td>}
    </tr>
  )
}

export default MovementRow
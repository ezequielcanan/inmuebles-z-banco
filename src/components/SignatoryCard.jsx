import Input from "./FormInput/Input"
import Button from "./Button"
import Label from "./Label"
import { motion } from 'framer-motion';
import { FaTrash } from "react-icons/fa6"
import moment from "moment";

const SignatoryCard = ({firmante, changeFirmanteProperty, className, labelClassName, deleteFirmante, i, editing = true, accountPanel = false}) => {
  return (
    <motion.li initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} layout className="flex flex-col h-full gap-2 bg-fourth p-4 rounded items-center w-full justify-between" key={"f" + i}>
      <div className="flex gap-4 justify-between w-full">
        <Input placeholder={"Nombre"} value={firmante?.name} disabled={!editing} className={"!w-full " + className} containerClassName={"w-full"} onInput={(e) => changeFirmanteProperty("name", e.currentTarget.value, i)} />
        <Button style="icon" type="button" className={`!bg-red-600 ${!editing && "opacity-50"} text-lg`} onClick={() => editing && deleteFirmante(i)}><FaTrash /></Button>
      </div>
      <Input containerClassName={"w-full"} className={className} disabled={!editing} value={!accountPanel ? firmante?.from : moment.utc(firmante?.from)?.format("YYYY-MM-DD")} type="date" onInput={(e) => changeFirmanteProperty("from", e.currentTarget.value, i)}>
        <Label text={"Desde"} className={labelClassName}/>
      </Input>
      <Input containerClassName={"w-full"} className={className} disabled={!editing} value={!accountPanel ? firmante?.to : moment.utc(firmante?.to)?.format("YYYY-MM-DD")} type="date" onInput={(e) => changeFirmanteProperty("to", e.currentTarget.value, i)}>
        <Label text={"Hasta"} className={labelClassName}/>
      </Input>
    </motion.li>
  )
}

export default SignatoryCard
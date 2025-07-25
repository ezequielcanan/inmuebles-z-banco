import { Link } from "react-router-dom"

const AccountCard = ({account, onClick}) => {
  return !onClick ? <Link to={`/accounts/${account?._id}`} className="bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
    <h3 className="text-3xl">{account.society?.title} - {account.bank}</h3>
    <p className="text-xl">Alias: {account.alias}</p>
    <p className="text-xl">CBU: {account.cbu}</p>
    <p className="text-xl">CUIT: {account.cuit}</p>
  </Link> : <div onClick={() => onClick(account)} to={`/accounts/${account?._id}`} className="cursor-pointer bg-teal-500 shadow-[10px_10px_15px_0px_#2226] border-primary flex flex-col justify-between w-full gap-y-4 py-6 px-6 text-black duration-300">
    <h3 className="text-3xl">{account.society?.title} - {account.bank}</h3>
    <p className="text-xl">Alias: {account.alias}</p>
    <p className="text-xl">CBU: {account.cbu}</p>
    <p className="text-xl">CUIT: {account.cuit}</p>
  </div>
}

export default AccountCard
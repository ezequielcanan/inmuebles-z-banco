import { Link, NavLink } from "react-router-dom"
import { MdAccountBalanceWallet, MdAttachMoney, MdConstruction, MdMoney, MdNotifications, MdOutlineMenu } from "react-icons/md"
import { FaHelmetSafety } from "react-icons/fa6"
import { FaCertificate, FaChevronDown, FaMoneyCheckAlt, FaTicketAlt, FaUser, FaUserAlt } from "react-icons/fa"
import { HiOutlineDocument } from "react-icons/hi"
import { LuLogOut } from "react-icons/lu"
import { GiMoneyStack } from "react-icons/gi"
import { useState, useEffect, useContext } from "react"
import CookiesJs from "js-cookie"
import Button from "./Button"
import { UserContext } from "../context/UserContext"
import { CiCircleMore } from "react-icons/ci"
import { FiMoreHorizontal } from "react-icons/fi"

const Navbar = ({ user, setUser }) => {
  const [dropdown, setDropdown] = useState("")
  const [width, setWidth] = useState(window.innerWidth)
  const [nav, setNav] = useState(false)
  const {newNotification} = useContext(UserContext)

  const headerSections = [
    {
      title: "Obras",
      data: [
        { text: "Proyectos", to: "/projects", logo: MdConstruction },
        { text: "Proveedores", to: "/suppliers", logo: FaHelmetSafety },
        { text: "Presupuestos", to: "/budgets", logo: GiMoneyStack },
        { text: "Certificados", to: "/payments", logo: FaCertificate },
        { text: "Facturas", to: "/bills", logo: HiOutlineDocument },
      ]
    },
    {
      title: "Banco",
      data: [
        { text: "Cuentas", to: "/accounts", logo: MdAccountBalanceWallet },
      ]
    }
  ]

  window.addEventListener("resize", e => setWidth(window.innerWidth))

  return (
    <header className="fixed z-40 h-[120px] w-full xl:h-screen xl:w-[250px] bg-[#111]">
      <nav className="w-full px-5 py-5 flex justify-between h-full items-center xl:flex-col xl:gap-y-[40px] xl:justify-center xl:h-auto">
        <Link to={"/"} onClick={() => setNav(false)}>
          <img src="logo.svg" alt="" className="py-4 w-[200px] xl:w-auto" />
        </Link>
        <div className="md:flex md:gap-x-[20px] xl:flex-col xl:gap-y-[30px] xl:w-full">
          <ul className="hidden xl:w-full md:flex md:flex-row xl:flex-col gap-x-[10px] gap-y-[20px] justify-center xl:justify-start relative">
            <li className={`${"block w-full h-full md:w-auto"} xl:block w-full text-xl`}>
              <NavLink to={"/accounts"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-black" : "bg-inherit text-secondary"}`} onClick={() => setNav(false)}><MdAccountBalanceWallet /> Bancos</NavLink>
            </li>
            <li className={`${"block w-full h-full md:w-auto"} xl:block w-full text-xl`}>
              <NavLink to={"/cash-accounts"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-black" : "bg-inherit text-secondary"}`} onClick={() => setNav(false)}><MdAttachMoney /> Ingresos</NavLink>
            </li>
            <li className={`${"block w-full h-full md:w-auto"} xl:block w-full text-xl`}>
              <NavLink to={"/services"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-black" : "bg-inherit text-secondary"}`} onClick={() => setNav(false)}><FiMoreHorizontal /> Servicios</NavLink>
            </li>
            <li className={`${"block w-full h-full md:w-auto"} xl:block w-full text-xl`}>
              <NavLink to={"/suppliers"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-black" : "bg-inherit text-secondary"}`} onClick={() => setNav(false)}><FaHelmetSafety /> Proveedores</NavLink>
            </li>
          </ul>
        </div>
        {user ? <div className="xl:self-start">
          <Link to={"/"} className="hidden md:flex items-center">
            <Button style="icon" className={"text-sm"} onClick={() => (CookiesJs.set("jwt", ""), setUser(false))}><LuLogOut size={30} /></Button>
          </Link>
        </div> : null}

        {<div className={`${(nav && window.innerWidth < 768) ? "!left-0 bg-black" : ""} px-5 py-7 duration-300 fixed top-[100px] left-[-120%] flex flex-col gap-y-[20px] h-screen w-screen`}>
          <div className={`xl:block w-full text-xl`}>
            <NavLink to={"/"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-textColor" : "text-secondary bg-inherit"}`} onClick={() => setNav(false)}><MdAccountBalanceWallet /> Bancos</NavLink>
          </div>
          <div className={`xl:block w-full text-xl`}>
            <NavLink to={"/cash-accounts"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-textColor" : "text-secondary bg-inherit"}`} onClick={() => setNav(false)}><MdAttachMoney /> Ingresos</NavLink>
          </div>
          <div className={`xl:block w-full text-xl`}>
            <NavLink to={"/services"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-textColor" : "text-secondary bg-inherit"}`} onClick={() => setNav(false)}><FiMoreHorizontal /> Servicios</NavLink>
          </div>
          <div className={`xl:block w-full text-xl`}>
            <NavLink to={"/suppliers"} className={({ isActive }) => `duration-500 py-3 px-3 flex w-full gap-x-[20px] items-center ${isActive ? "bg-secondary text-textColor" : "text-secondary bg-inherit"}`} onClick={() => setNav(false)}><FaHelmetSafety /> Proveedores</NavLink>
          </div>
          <ul className="flex flex-col gap-x-[30px] gap-y-[20px] rounded-md text-black py-6 text-2xl">
            {user ? <li className="pb-2">
              <Link to={"/"}>
                <Button style="first" className={"text-sm"} onClick={() => (CookiesJs.set("jwt", ""), setUser(false))}><LuLogOut size={30} /> Cerrar Sesion</Button>
              </Link>
            </li> : null}
          </ul>
        </div>}
        <MdOutlineMenu className="text-white text-6xl md:hidden cursor-pointer" onClick={() => (setNav(!nav))} />
      </nav>
    </header>
  )
}

export default Navbar
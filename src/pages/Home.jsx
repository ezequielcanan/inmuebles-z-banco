import Button from "../components/Button"
import { FaArrowRight } from "react-icons/fa"
import Main from "../containers/Main"
import { Link } from "react-router-dom"

const Home = ({ user }) => {
  return (
    <Main className={"bg-[url('/home.jpg')] bg-no-repeat bg-cover bg-blend-multiply !bg-[#666] flex flex-col pt-48 items-center px-[50px]"}>
      <div className="grid gap-y-[70px]">
        <div className="grid gap-y-[40px]">
          <h1 className="text-5xl md:text-7xl font-bold title">Bancos</h1>
          <p className="text-lg md:text-2xl text-white">Manejo de ingresos y egresos de cuentas bancarias.</p>
        </div>
        <Link to={!user ? "/login" : "/accounts"}>
          <Button style="first">
            {!user ? "Iniciar sesion" : "Empezar"} <FaArrowRight />
          </Button>
        </Link>
      </div>
    </Main>
  )
}

export default Home
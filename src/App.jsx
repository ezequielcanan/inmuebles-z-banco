import Router from "./Router/Router.jsx"
import { UserContextProvider } from "./context/UserContext.jsx"

const App = () => {


  return (
    <UserContextProvider>
      <Router />
    </UserContextProvider>
  )
}

export default App

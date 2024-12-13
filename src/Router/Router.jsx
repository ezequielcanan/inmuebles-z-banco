import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Accounts from "../pages/Accounts";
import Account from "../pages/Account";
import NewMovement from "../pages/NewMovement";
import NewAccount from "../pages/NewAccount"
import CashAccounts from "../pages/CashAccounts";
import Services from "../pages/Services";
import Suppliers from "../pages/Suppliers";
import Agenda from "../pages/Agenda";
import ProjectAgenda from "../pages/ProjectAgenda";
import NewIncomingCheck from "../pages/NewIncomingCheck";
import ChekcActions from "../pages/CheckActions";

const Router = () => {
  const { getUser, setUser } = useContext(UserContext);

  return (
    <HashRouter>
      <Navbar user={getUser()} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={getUser()} />} />
        {!getUser() ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        ) : (
          <>
          <Route path="/accounts" element={<Accounts/>}/>
          <Route path="/accounts/new" element={<NewAccount/>}/>
          <Route path="/accounts/:aid" element={<Account/>}/>
          <Route path="/accounts/:aid/new-movement" element={<NewMovement/>}/>
          <Route path="/cash-accounts" element={<CashAccounts/>}/>
          <Route path="/services" element={<Services/>}/>
          <Route path="/suppliers" element={<Suppliers/>}/>
          <Route path="/incoming-checks" element={<Agenda/>}/>
          <Route path="/incoming-checks/:pid" element={<ProjectAgenda/>}/>
          <Route path="/incoming-checks/:pid/new" element={<NewIncomingCheck/>}/>
          <Route path="/incoming-checks/actions/:cid" element={<ChekcActions/>}/>

          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default Router;

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
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
import Tax from "../pages/Tax";
import ProjectsCash from "../pages/ProjectsCash";
import Cash from "../pages/Cash";
import NewCashMovement from "../pages/NewCashMovement";
import Projects from "../pages/Projects";
import CookiesJs from "js-cookie"
import OutGoingChecks from "../pages/OutGoingChecks";
import NewOutgoingCheck from "../pages/NewOutgoingCheck";
import OutgoingChekcActions from "../pages/OutgoingCheckActions";
import Service from "../pages/Service";

const Router = () => {
  const { getUser, setUser } = useContext(UserContext);
  const [project, setProject] = useState(CookiesJs.get("banksProject") || null)

  return (
    <HashRouter>
      <Navbar user={getUser()} setUser={setUser} project={project} setProject={setProject} />
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
          <Route path="/projects" element={<Projects setProject={setProject}/>}/>
          {project ? <>
          <Route path="/accounts" element={<Accounts project={project}/>}/>
          <Route path="/accounts/new" element={<NewAccount/>}/>
          <Route path="/accounts/:aid" element={<Account/>}/>
          <Route path="/accounts/:aid/new-movement" element={<NewMovement project={project}/>}/>
          <Route path="/cash-accounts" element={<CashAccounts/>}/>
          <Route path="/services" element={<Services project={project}/>}/>
          <Route path="/services/:sid" element={<Service />}/>
          <Route path="/suppliers" element={<Suppliers project={project}/>}/>
          <Route path="/tax" element={<Tax project={project}/>}/>
          <Route path="/incoming-checks" element={<Agenda/>}/>
          <Route path="/incoming-checks/:pid" element={<ProjectAgenda/>}/>
          <Route path="/incoming-checks/:pid/new" element={<NewIncomingCheck/>}/>
          <Route path="/incoming-checks/actions/:cid" element={<ChekcActions/>}/>
          <Route path="/outgoing-checks/:pid" element={<OutGoingChecks/>}/>
          <Route path="/outgoing-checks/:pid/new" element={<NewOutgoingCheck/>}/>
          <Route path="/outgoing-checks/actions/:cid" element={<OutgoingChekcActions/>}/>
          <Route path="/cash" element={<ProjectsCash/>}/>
          <Route path="/cash/:pid" element={<Cash/>}/>
          <Route path="/cash/:pid/new" element={<NewCashMovement/>}/>
          </> : (
            <Route path="*" element={<Navigate to={"/projects"} />} />
          )}

          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default Router;

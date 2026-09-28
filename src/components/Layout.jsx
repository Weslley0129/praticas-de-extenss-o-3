import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Rodape from "./Rodape";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__conteudo">
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}

export default Layout;

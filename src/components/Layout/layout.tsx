import { AiFillCloseCircle } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/navbar";
import Header from "./Header/header";
import { Button } from "antd";
import { useState } from "react";
import Backdrop from "../Common/Backdrop/backdrop";

export default function Layout() {
  const [toggle, setToggle] = useState(false);

  const handleNavCollapse = () => {
    setToggle((prev) => !prev);
  };
  return (
    <div className="h-screen overflow-hidden">
      <section className="flex items-start size-full">
        <aside
          className={`lg:basis-[25%] xl:basis-[20%] min-w-[300px] max-w-[300px] lg:min-w-0 h-full bg-mainColor transition-all z-99999 fixed md:relative ${
            toggle ? "-left-full md:left-0" : "left-0"
          }`}
        >
          <nav className="size-full">
            <Navbar setToggle={setToggle} />
          </nav>

          <span className="absolute top-3 right-2 block md:hidden">
            <Button
              onClick={handleNavCollapse}
              className="bg-transparent border-none text-center "
              shape="circle"
              icon={<AiFillCloseCircle className="text-white" size={"100%"} />}
            />
          </span>
          <Backdrop open={toggle} toggle={handleNavCollapse} />
        </aside>

        <div className="basis-[80%] grow h-full overflow-y-auto flex flex-col">
          <header>
            <Header toggleNav={handleNavCollapse} />
          </header>
          <main className="grow min-h-[600px] overflow-y-auto px-10 p-4">
            <Outlet />
          </main>
        </div>
      </section>
    </div>
  );
}

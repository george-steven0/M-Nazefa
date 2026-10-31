import { AiFillCloseCircle } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/navbar";
import Header from "./Header/header";
import { Button } from "antd";
import { useState } from "react";
import Backdrop from "../Common/Backdrop/backdrop";

export default function Layout() {
  const [toggle, setToggle] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleNavCollapse = () => {
    setToggle((prev) => !prev);
  };

  // Desktop-only width: narrow (icon rail) when collapsed, full otherwise.
  const asideDesktopWidth = collapsed
    ? "md:w-20 md:min-w-20 md:max-w-20 md:basis-20"
    : "lg:basis-[25%] xl:basis-[20%] lg:min-w-0";

  return (
    <div className="h-screen overflow-hidden">
      <section className="flex items-start size-full">
        <aside
          className={`min-w-[300px] max-w-[300px] h-full bg-mainColor transition-all duration-300 z-99999 md:z-99 fixed md:relative ${asideDesktopWidth} ${
            toggle ? "-left-full md:left-0" : "left-0"
          }`}
        >
          <nav className="size-full">
            <Navbar
              setToggle={setToggle}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
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

        <div className="basis-[80%] grow h-full overflow-y-auto flex flex-col transition-all duration-300">
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

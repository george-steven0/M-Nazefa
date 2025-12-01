import { AiOutlineMenu } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "antd";
const Header = ({ toggleNav }: { toggleNav: () => void }) => {
  return (
    <div className="bg-lightGray w-full min-h-20 flex items-center justify-between md:justify-end px-8">
      <div className="block md:hidden">
        <Button
          onClick={toggleNav}
          className="bg-transparent border-none text-center "
          shape="circle"
          icon={<AiOutlineMenu className="text-mainColor" size={"100%"} />}
        />
      </div>

      <div className="flex items-center gap-5">
        <section>
          <IoMdNotifications size={20} />
        </section>

        <section className="flex items-center gap-2">
          <FaUserCircle size={30} />
          <span>User</span>
        </section>
      </div>
    </div>
  );
};

export default Header;

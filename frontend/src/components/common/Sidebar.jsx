import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaFacebookMessenger, FaSearch } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import useLogout from "../../hooks/useLogout";

const Sidebar = () => {
  const { mutate: logout } = useLogout();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div>

      <div className="hidden md:flex sticky top-0 left-0 h-screen md:flex-[2_2_0] w-18 max-w-52">
        <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
          <ul className="flex flex-col gap-3 mt-4">
            <li className="flex justify-center md:justify-start">
              <Link
                to="/"
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <MdHomeFilled className="w-8 h-8" />
                <span className="text-lg hidden md:block">Home</span>
              </Link>
            </li>
            <li className="flex justify-center md:justify-start">
              <Link
                to="/notifications"
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <IoNotifications className="w-6 h-6" />
                <span className="text-lg hidden md:block">Notifications</span>
              </Link>
            </li>
            <li className="flex justify-center md:justify-start">
              <Link
                to={`/profile/${authUser?.username}`}
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <FaUser className="w-6 h-6" />
                <span className="text-lg hidden md:block">Profile</span>
              </Link>
            </li>
          </ul>
          {authUser && (
            <Link
              to={`/profile/${authUser.username}`}
              className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
            >
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.profileImg || "/avatar-placeholder.png"}
                  />
                </div>
              </div>
              <div className="flex justify-between flex-1">
                <div className="hidden md:block">
                  <p className="text-white font-bold text-sm w-20 truncate">
                    {authUser?.fullName}
                  </p>
                  <p className="text-slate-500 text-sm">
                    @{authUser?.username}
                  </p>
                </div>

                <BiLogOut
                  className="w-5 h-5 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 flex justify-around py-2 z-50">
        <Link to="/" className="flex flex-col items-center">
          <MdHomeFilled className="w-7 h-7 text-white" />
          <span className="text-xs text-gray-400">Home</span>
        </Link>

        <Link to="/search" className="flex flex-col items-center">
          <FaSearch className="w-7 h-7 text-white" />
          <span className="text-xs text-gray-400">Search</span>
        </Link>

        <Link
          to={`/messages/${authUser?.id}`}
          className="flex flex-col items-center"
        >
          <FaFacebookMessenger className="w-7 h-7 text-white" />
          <span className="text-xs text-gray-400">Messages</span>
        </Link>

        <Link to="/notifications" className="flex flex-col items-center">
          <IoNotifications className="w-7 h-7 text-white" />
          <span className="text-xs text-gray-400">Notifications</span>
        </Link>

        <Link
          to={`/profile/${authUser?.username}`}
          className="flex flex-col items-center"
        >
          <FaUser className="w-7 h-7 text-white" />
          <span className="text-xs text-gray-400">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

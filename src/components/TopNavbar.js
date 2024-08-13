import React from "react";

const TopNavbar = () => {
  return (
    <div>
      <div className={`mb-4 lg:px-32 bg-black text-white`}>
        <div className="py-4 mx-4 flex justify-between  ">
          <a href="/" className="pt-2 text-2xl font-bold">
            Student Services
          </a>

          <div className="flex space-x-4 ml-4 pt-2">
            <a href="/" className=" hover:text-gray-300">
              Home
            </a>
            <a href="/standard" className=" hover:text-gray-300">
              Standard
            </a>
            <a href="/advanced" className=" hover:text-gray-300">
              Advanced
            </a>
            <a href="/resources" className=" hover:text-gray-300">
              Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

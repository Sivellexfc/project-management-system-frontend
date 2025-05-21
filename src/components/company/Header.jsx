import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({setSelectedComponent}) => {
  return (
    <header className="border rounded-lg border-borderColor bg-colorFirst px-10">
        <nav className=" flex justify-start gap-6 py-4 text-gray-700">

          <button
          onClick={() =>setSelectedComponent("profile")}
            className="hover:text-black"
          >
            Profil
          </button>

          <button
          onClick={() =>setSelectedComponent("projects")}
            className="hover:text-black"
          >
            Projeler
          </button>
          
          <button
          onClick={() =>setSelectedComponent("employees")}
            className="hover:text-black"
          >
            Üyeler
          </button>
        </nav>
      </header>
  )
}

export default Header
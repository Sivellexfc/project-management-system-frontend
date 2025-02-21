import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({setSelectedComponent}) => {
  return (
    <header className="fixed top-10 container border border-[#EEEEEE] shadow-sm bg-colorFirst px-10">
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
            href="/contact"
            className="hover:text-black"
          >
            Gruplar
          </button>
          <button
            href="/contact"
            className="hover:text-black"
          >
            Alt-gruplar
          </button>
          <button
            href="/contact"
            className="hover:text-black"
          >
            Üyeler
          </button>
        </nav>
      </header>
  )
}

export default Header
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo_nobg from '../assets/logo_nobg.png';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">

      {/* MAIN NAVBAR */}
      <div className="flex justify-center gap-10 items-center px-5 md:px-10 lg:px-15 py-2">

        {/* LOGO */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img
            src={logo_nobg}
            alt="BFBF Logo"
            className="w-23 h-17 object-contain"
          />
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="hidden lg:flex flex-1 flex-row justify-between items-center gap-1 text-sm ml-8 max-w-225">

          <li className="hover:text-[#8F6C54]">
            <Link to="/">Home</Link>
          </li>

          <li className="hover:text-[#8F6C54]">
            <Link to="/get-support">Get Support</Link>
          </li>

          <li className="hover:text-[#8F6C54]">
            <Link to="/learn">Learn</Link>
          </li>

          <li className="hover:text-[#8F6C54]">
            <Link to="/what-we-do">What We Do</Link>
          </li>

          <li className="hover:text-[#8F6C54]">
            <Link to="/get-involved">Get Involved</Link>
          </li>

          <li className="hover:text-[#8F6C54]">
            <Link to="/about">About</Link>
          </li>

          <li className="hover:text-[#8F6C54]">
            <Link to="/contact">Contact</Link>
          </li>

          <li className="w-fit px-5 py-2 bg-[#8F6C54] text-white rounded-lg hover:bg-[#62422C]">
            <Link to="/donate">Donate</Link>
          </li>

        </ul>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-3xl text-[#8F6C54] cursor-pointer"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">

          <ul className="flex flex-col items-center gap-5 py-6 text-sm">

            <li className="hover:text-[#8F6C54]">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>

            <li className="hover:text-[#8F6C54]">
              <Link to="/get-support" onClick={() => setMenuOpen(false)}>Get Support</Link>
            </li>

            <li className="hover:text-[#8F6C54]">
              <Link to="/learn" onClick={() => setMenuOpen(false)}>Learn</Link>
            </li>

            <li className="hover:text-[#8F6C54]">
              <Link to="/what-we-do" onClick={() => setMenuOpen(false)}>What We Do</Link>
            </li>

            <li className="hover:text-[#8F6C54]">
              <Link to="/get-involved" onClick={() => setMenuOpen(false)}>Get Involved</Link>
            </li>

            <li className="hover:text-[#8F6C54]">
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </li>

            <li className="hover:text-[#8F6C54]">
              <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </li>

            <li className="px-5 py-2 bg-[#8F6C54] text-white rounded-lg hover:bg-[#62422C]">
              <Link to="/donate" onClick={() => setMenuOpen(false)}>Donate</Link>
            </li>

          </ul>

        </div>
      )}

    </nav>
  );
}

export default Navbar;
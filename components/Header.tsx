import Link from "next/link";
import React from "react";
import { ModeToggle } from "./DarkModeButton";

const Header = () => {
  return (
    <header>
      <nav className="flex w-full p-3 items-center justify-between border-b  border-[--borderColor]">
        <div className="flex gap-3">
          <Link className="text-[--menuColor] text-3xl" href="/">
            IcantSpeakEnglish
          </Link>
        </div>
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Header;

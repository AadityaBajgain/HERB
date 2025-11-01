import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="page-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl">
            <Image
              src="/HERBLogo.png"
              alt="Herb logo"
              width={36}
              height={36}
              priority
            />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold text-white">HERB</p>
            <p className="text-xs text-muted">Your health AI buddy</p>
          </div>
        </Link>


        <Link href="/map" className="btn-primary">
          Find nearby care
        </Link>
      </nav>
    </header>
  );
};
export default Navbar;

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95">
      <nav className="page-shell flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/favicon.ico"
            alt="Herb logo"
            width={28}
            height={28}
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-slate-100">
            HERB
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/diagnosis" className="btn-secondary">
            Diagnosis
          </Link>
          <Link href="/map" className="btn-primary">
            Nearby care
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

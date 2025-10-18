import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-background border-b border-border p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-foreground">
        Rentsight
      </Link>
      <div className="flex items-center space-x-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/rent_entries">Rents</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/expense_entries">Expenses</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/tags">Tags</Link>
          </Button>
        </div>

        {/* Mobile Navigation (Hamburger or similar) */}
        <div className="md:hidden">
          {/* Placeholder for mobile menu button */}
          <Button variant="ghost">Menu</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

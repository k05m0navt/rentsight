'use client';

/**
 * Navigation Link Component
 * 
 * Enhanced Link component with smooth transitions and loading states
 * Replaces standard Next.js Link for better UX
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/context/NavigationContext';
import { LucideIcon } from 'lucide-react';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export function NavigationLink({
  href,
  children,
  className,
  activeClassName,
  icon: Icon,
  onClick,
}: NavigationLinkProps) {
  const pathname = usePathname();
  const { navigateWithTransition } = useNavigation();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    navigateWithTransition(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-3 py-3 rounded-md font-medium transition-all duration-200',
        isActive 
          ? cn('bg-primary/10 text-primary', activeClassName)
          : 'text-text hover:bg-hover',
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
      <span>{children}</span>
    </Link>
  );
}

/**
 * BOTTOM NAV — Biophilic Minimalism
 * Mobile-first tab navigation with smooth active indicator
 */
import { BarChart3, Home, Leaf, Target } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/log', label: 'Log', icon: Leaf },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
  { path: '/goals', label: 'Goals', icon: Target },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 eco-glass border-t border-border/60">
      <div className="flex items-stretch max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location === path;
          return (
            <Link
              key={path}
              href={path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-200 ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                active ? 'bg-primary/12' : ''
              }`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {active && (
                  <span className="absolute inset-0 rounded-full bg-primary/8 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all ${active ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}

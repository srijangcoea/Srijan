import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, Info, Users, Zap, CalendarCheck } from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
    exact: true,
  },
  {
    name: 'Events',
    path: '/events',
    icon: CalendarDays,
    exact: false,
  },
  {
    // CENTER elevated item — Schedule
    name: 'Schedule',
    path: '/schedule',
    icon: CalendarCheck,
    center: true,
    exact: false,
  },
  {
    name: 'About',
    path: '/about',
    icon: Info,
    exact: false,
  },
  {
    name: 'Our Team',
    path: '/ourteam',
    icon: Users,
    exact: false,
  },
];

export default function MobileBottomNav() {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    /* Only visible on mobile (md and below) */
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Outer pill container */}
      <div className="mx-3 mb-3">
        <div
          className="relative flex items-center justify-around rounded-2xl px-1 py-2"
          style={{
            background: 'linear-gradient(135deg, rgba(8,21,34,0.97) 0%, rgba(13,20,29,0.98) 100%)',
            border: '1px solid rgba(34,229,255,0.18)',
            boxShadow: '0 -4px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,229,255,0.06), inset 0 1px 0 rgba(34,229,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Top glowing edge line */}
          <div
            className="absolute top-0 left-8 right-8 h-[1px] rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, rgba(34,229,255,0.5), transparent)' }}
          />

          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            if (item.center) {
              /* ── Center elevated FAB-style button ── */
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.name}
                  aria-current={active ? 'page' : undefined}
                  className="relative flex flex-col items-center -mt-7 group"
                >
                  {/* Outer glow ring */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-150"
                    style={{ boxShadow: '0 0 20px rgba(34,229,255,0.6)' }}
                  />

                  {/* Circle button */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-active:scale-95"
                    style={{
                      background: active
                        ? 'radial-gradient(circle at 35% 30%, #52eeff 0%, #22e5ff 45%, #00b4cc 100%)'
                        : 'radial-gradient(circle at 35% 30%, #1ce0f8 0%, #0fb8d8 50%, #0890aa 100%)',
                      boxShadow: active
                        ? '0 0 0 3px rgba(34,229,255,0.25), 0 0 20px rgba(34,229,255,0.7), 0 4px 16px rgba(0,0,0,0.5)'
                        : '0 0 0 2px rgba(34,229,255,0.15), 0 0 12px rgba(34,229,255,0.4), 0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Icon
                      className="w-6 h-6 transition-transform duration-200 group-active:scale-90"
                      style={{ color: active ? '#001a22' : '#003040', strokeWidth: 2 }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-widest transition-colors duration-200"
                    style={{ color: active ? '#22e5ff' : 'rgba(148,180,195,0.75)' }}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            }

            /* ── Standard nav item ── */
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.name}
                aria-current={active ? 'page' : undefined}
                className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl group transition-all duration-200 active:scale-95"
              >
                {/* Active background pill */}
                {active && (
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'rgba(34,229,255,0.07)',
                      border: '1px solid rgba(34,229,255,0.18)',
                    }}
                  />
                )}

                {/* Icon wrapper with glow on active */}
                <div
                  className="relative flex items-center justify-center w-7 h-7 transition-all duration-200"
                  style={{
                    filter: active ? 'drop-shadow(0 0 6px rgba(34,229,255,0.7))' : 'none',
                  }}
                >
                  {/* Geometric accent behind icon when active */}
                  {active && (
                    <div
                      className="absolute inset-0 rounded-lg opacity-25"
                      style={{ background: 'rgba(34,229,255,0.3)' }}
                    />
                  )}
                  <Icon
                    className="w-5 h-5 relative z-10 transition-all duration-200"
                    style={{
                      color: active ? '#22e5ff' : 'rgba(148,180,195,0.6)',
                      strokeWidth: active ? 2 : 1.75,
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  className="font-mono text-[9px] font-bold uppercase tracking-widest transition-colors duration-200 leading-none"
                  style={{
                    color: active ? '#22e5ff' : 'rgba(148,180,195,0.6)',
                  }}
                >
                  {item.name}
                </span>

                {/* Active dot indicator */}
                {active && (
                  <div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#22e5ff', boxShadow: '0 0 6px #22e5ff' }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../useAuth";

const navItems = [
  { to: "/", label: "Дашборд" },
  { to: "/users", label: "Пользователи" },
  { to: "/broadcast", label: "Рассылка" },
  { to: "/broadcasts", label: "История" },
  { to: "/appointments", label: "Записи" },
];

export default function Layout() {
  const { isAuth, logout } = useAuth();

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-bold text-sm">Здоровье семьи — Админ</span>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Выйти
          </button>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

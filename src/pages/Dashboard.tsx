import { useEffect, useState } from "react";
import { getStats } from "../api";

interface Stats {
  total_users: number;
  linked_users: number;
  users_with_chat: number;
  bot_alive: boolean;
  bot_error: string | null;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Загрузка...</p>;
  if (!stats) return <p className="text-red-500">Ошибка загрузки</p>;

  const cards = [
    { label: "Всего пользователей", value: stats.total_users, color: "bg-blue-500" },
    { label: "Привязаны к пациенту", value: stats.linked_users, color: "bg-green-500" },
    { label: "Могут получать сообщения", value: stats.users_with_chat, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-5">
            <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{c.value}</span>
            </div>
            <p className="text-sm text-gray-600">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-semibold text-gray-800 mb-2">Статус бота</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${stats.bot_alive ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-sm">
            {stats.bot_alive ? "Работает" : "Не работает"}
          </span>
        </div>
        {stats.bot_error && (
          <p className="text-sm text-red-500 mt-1">{stats.bot_error}</p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getUsers, unlinkUser, sendMessage } from "../api";

interface User {
  max_user_id: string;
  patient_id: string;
  phone: string;
  full_name: string;
  chat_id: string | null;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgModal, setMsgModal] = useState<{ chatId: number; name: string } | null>(null);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);

  function load(q = "") {
    setLoading(true);
    getUsers(q)
      .then((d) => setUsers(d.users))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search);
  }

  async function handleUnlink(id: string) {
    if (!confirm("Отвязать пользователя?")) return;
    await unlinkUser(id);
    setUsers((prev) => prev.filter((u) => u.max_user_id !== id));
  }

  async function handleSendMsg() {
    if (!msgModal || !msgText.trim()) return;
    setSending(true);
    try {
      await sendMessage(msgModal.chatId, msgText);
      alert("Сообщение отправлено!");
      setMsgModal(null);
      setMsgText("");
    } catch (e) {
      alert("Ошибка: " + (e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Пользователи</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Поиск по имени или телефону..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Найти
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">Нет пользователей</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Имя</th>
                <th className="text-left px-4 py-3 font-medium">Телефон</th>
                <th className="text-left px-4 py-3 font-medium">Chat</th>
                <th className="text-left px-4 py-3 font-medium">Дата</th>
                <th className="text-right px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.max_user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{u.full_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{u.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {u.chat_id ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("ru-RU") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {u.chat_id && (
                      <button
                        onClick={() =>
                          setMsgModal({ chatId: Number(u.chat_id), name: u.full_name })
                        }
                        className="text-indigo-600 hover:underline text-xs"
                      >
                        Написать
                      </button>
                    )}
                    <button
                      onClick={() => handleUnlink(u.max_user_id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Отвязать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Send message modal */}
      {msgModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold text-gray-800">
              Сообщение: {msgModal.name || "пользователю"}
            </h3>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              rows={4}
              placeholder="Текст сообщения..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setMsgModal(null); setMsgText(""); }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={handleSendMsg}
                disabled={sending || !msgText.trim()}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {sending ? "Отправка..." : "Отправить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

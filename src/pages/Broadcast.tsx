import { useEffect, useState } from "react";
import { sendBroadcast, getStats } from "../api";

export default function Broadcast() {
  const [message, setMessage] = useState("");
  const [recipientCount, setRecipientCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    sent: number;
    failed: number;
  } | null>(null);

  useEffect(() => {
    getStats().then((s) => setRecipientCount(s.users_with_chat));
  }, []);

  async function handleSend() {
    if (!message.trim()) return;
    if (!confirm(`Отправить рассылку ${recipientCount} пользователям?`)) return;

    setSending(true);
    setResult(null);
    try {
      const res = await sendBroadcast(message);
      setResult(res);
      setMessage("");
    } catch (e) {
      alert("Ошибка: " + (e as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">Рассылка</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Текст сообщения
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Введите текст рассылки..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">
            {message.length} символов
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Получателей: <strong>{recipientCount}</strong> пользователей с активным чатом
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {sending ? "Отправка..." : "Отправить рассылку"}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Результат</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{result.total}</p>
              <p className="text-xs text-gray-500">Всего</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{result.sent}</p>
              <p className="text-xs text-gray-500">Доставлено</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{result.failed}</p>
              <p className="text-xs text-gray-500">Ошибки</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

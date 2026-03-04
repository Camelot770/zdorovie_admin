import { useEffect, useState } from "react";
import { getBroadcasts } from "../api";

interface BroadcastItem {
  id: number;
  message: string;
  sent_at: string;
  total: number;
  sent: number;
  failed: number;
}

export default function BroadcastHistory() {
  const [items, setItems] = useState<BroadcastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBroadcasts()
      .then((d) => setItems(d.broadcasts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">История рассылок</h1>

      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Рассылок пока не было</p>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500">
                  {new Date(b.sent_at).toLocaleString("ru-RU")}
                </span>
                <div className="flex gap-3 text-xs">
                  <span className="text-green-600">✓ {b.sent}</span>
                  {b.failed > 0 && (
                    <span className="text-red-500">✗ {b.failed}</span>
                  )}
                  <span className="text-gray-400">из {b.total}</span>
                </div>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {b.message.length > 200
                  ? b.message.slice(0, 200) + "..."
                  : b.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

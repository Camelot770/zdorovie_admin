import { useEffect, useState } from "react";
import { getAppointmentsToday } from "../api";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointmentsToday()
      .then((d) => setAppointments(d.appointments))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Записи на сегодня</h1>

      {loading ? (
        <p className="text-gray-500">Загрузка...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">На сегодня записей нет</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Время</th>
                <th className="text-left px-4 py-3 font-medium">Пациент</th>
                <th className="text-left px-4 py-3 font-medium">Врач</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((a, i) => {
                const apptAt = String(a.appointmentAt || "");
                const time = apptAt.includes("T")
                  ? apptAt.split("T")[1]?.slice(0, 5)
                  : apptAt;
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{time || "—"}</td>
                    <td className="px-4 py-3">{String(a.patientId || "—")}</td>
                    <td className="px-4 py-3">{String(a.doctorId || "—")}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          a.canceled
                            ? "bg-red-100 text-red-600"
                            : a.confirmed
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {a.canceled
                          ? "Отменена"
                          : a.confirmed
                          ? "Подтверждена"
                          : String(a.status || "Запланирована")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

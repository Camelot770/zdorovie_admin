import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(loginName, password);
      navigate("/", { replace: true });
    } catch {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-gray-800">
          Админ-панель
        </h1>
        <p className="text-sm text-gray-500 text-center">Здоровье семьи</p>

        <input
          type="text"
          placeholder="Логин"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !loginName || !password}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

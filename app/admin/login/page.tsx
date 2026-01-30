import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Solmaré Admin</h1>
            <p className="text-slate-300">Sign in to manage your properties</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

import { getSettings } from "@/actions/settings";
import { SettingsForm } from "./components/settings-form";
import { PasswordForm } from "./components/password-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage global application configuration</p>
      </div>

      <SettingsForm initialSettings={settings} />

      <div className="pt-8 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Security & Access</h2>
        <PasswordForm />
      </div>
    </div>
  );
}

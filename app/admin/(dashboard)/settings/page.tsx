import { getSettings } from "@/actions/settings";
import { SettingsForm } from "./components/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage global application configuration</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

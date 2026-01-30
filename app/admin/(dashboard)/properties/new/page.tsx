import { PropertyForm } from "../property-form";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Property</h1>
        <p className="text-slate-400 mt-1">Create a new guest guide property</p>
      </div>

      <PropertyForm />
    </div>
  );
}

import LogoutButton from "@/components/LogoutButton";
import WordForm from "@/components/WebForm";

export default function Dashboard() {
  return (
    <div className="min-h-[%90] p-4">
      <div className="flex w-full items-center justify-between">
        <LogoutButton />
        <h1 className="text-3xl font-bold mb-4">Kelime Ekleme</h1>
      </div>
      <WordForm />
    </div>
  );
}

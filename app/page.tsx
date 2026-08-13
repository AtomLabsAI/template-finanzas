import { Dashboard } from "@/components/Dashboard";
import { getDatos } from "@/lib/data";

// Sin caché: cada carga trae los datos actuales de la fuente conectada.
export const revalidate = 0;

export default async function Home() {
  const datos = await getDatos();
  return <Dashboard datos={datos} />;
}

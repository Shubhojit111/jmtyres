import { redirect } from "next/navigation";
import RequestDetails from "@/components/account/RequestDetails";
import { getSessionUser } from "@/lib/backend";
export const dynamic = "force-dynamic";
export default async function RequestPage({ params }) {
  const actor = await getSessionUser();
  if (!["customer", "admin"].includes(actor?.role))
    redirect(
      `/account?next=${encodeURIComponent(`/account/requests/${params.id}`)}`,
    );
  return <RequestDetails id={params.id} admin={actor.role === "admin"} />;
}

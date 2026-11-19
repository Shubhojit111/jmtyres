import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getSessionUser, getProduct } from "@/lib/backend";
import RequestForm from "@/components/account/RequestForm";
export const dynamic = "force-dynamic";
export default async function PurchaseRequestPage({ params }) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  const actor = await getSessionUser();
  if (!["customer", "admin"].includes(actor?.role))
    redirect(`/account?next=${encodeURIComponent(`/request/${params.slug}`)}`);
  return <RequestForm product={product} />;
}

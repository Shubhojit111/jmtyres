import CatalogueClient from "@/components/catalogue/CatalogueClient";
export const metadata = {
  title: "Tyre Catalogue | J.M. Tyre Services Mulund West",
  description:
    "Browse tyres and search by brand, category, tyre size, price and stock availability. The owner confirms compatibility before purchase.",
};
export default function CataloguePage({ searchParams }) {
  return (
    <CatalogueClient
      initialBrand={
        typeof searchParams?.brand === "string" ? searchParams.brand : ""
      }
      initialCategory={
        typeof searchParams?.category === "string" ? searchParams.category : ""
      }
    />
  );
}

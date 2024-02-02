import { ProductWithPrice } from "@/types/common";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const supabase = createClient(cookies());

  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { referencedTable: "prices" });

  if (error) {
    console.error(error);
  }

  return (data as any) || [];
};

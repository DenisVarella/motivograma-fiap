import type { Metadata } from "next";
import { Wizard } from "@/components/teste/Wizard";

export const metadata: Metadata = {
  title: "Teste",
};

export default function PaginaTeste() {
  return <Wizard />;
}

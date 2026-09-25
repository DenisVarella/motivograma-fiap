import type { Metadata } from "next";
import { PainelResultado } from "@/components/resultado/PainelResultado";

export const metadata: Metadata = {
  title: "Resultado",
};

export default function PaginaResultado() {
  return <PainelResultado />;
}

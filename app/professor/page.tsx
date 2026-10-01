import type { Metadata } from "next";
import { AcessoProfessor } from "@/components/professor/AcessoProfessor";

export const metadata: Metadata = {
  title: "Professor",
};

export default function PaginaProfessor() {
  return <AcessoProfessor />;
}

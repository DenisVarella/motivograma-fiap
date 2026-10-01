/** Converte um carimbo do Firestore, um número ou um texto em data. */

export function instanteDe(valor: unknown): Date | null {
  if (!valor) {
    return null;
  }

  if (typeof valor === "object" && valor !== null && "toDate" in valor) {
    const data = (valor as { toDate: () => Date }).toDate();
    return data instanceof Date && !Number.isNaN(data.getTime()) ? data : null;
  }

  if (typeof valor === "object" && valor !== null) {
    const segundos =
      "seconds" in valor
        ? (valor as { seconds: unknown }).seconds
        : "_seconds" in valor
          ? (valor as { _seconds: unknown })._seconds
          : undefined;

    if (typeof segundos === "number") {
      return new Date(segundos * 1000);
    }
  }

  if (typeof valor === "number" && Number.isFinite(valor)) {
    return new Date(valor);
  }

  if (typeof valor === "string") {
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? null : data;
  }

  return null;
}

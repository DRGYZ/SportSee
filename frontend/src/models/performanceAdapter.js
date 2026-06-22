const FRENCH_LABEL_BY_KIND = {
  cardio: "Cardio",
  energy: "Énergie",
  endurance: "Endurance",
  strength: "Force",
  speed: "Vitesse",
  intensity: "Intensité",
};

/**
 * Normalize performance payload and add localized categories.
 * @param {object} rawPerformance
 * @returns {{
 *   userId: number,
 *   kind: Record<string, string>,
 *   data: Array<{ value: number, kind: number }>,
 *   categories: Array<{ labelFr: string, value: number }>
 * }}
 */
export function adaptUserPerformance(rawPerformance) {
  const source = rawPerformance ?? {};
  const rawKind = source.kind ?? {};
  const data = Array.isArray(source.data) ? source.data : [];

  const normalizedData = data.map((item) => ({
    value: Number(item?.value ?? 0),
    kind: Number(item?.kind ?? 0),
  }));

  const categories = normalizedData.map((item) => {
    const kindKey = String(item.kind);
    const kindLabel = String(rawKind[kindKey] ?? "");
    const labelFr = FRENCH_LABEL_BY_KIND[kindLabel] ?? kindLabel;

    return { labelFr, value: item.value };
  });

  return {
    userId: Number(source.userId ?? 0),
    kind: Object.keys(rawKind).reduce((acc, key) => {
      acc[key] = String(rawKind[key] ?? "");
      return acc;
    }, {}),
    data: normalizedData,
    categories,
  };
}

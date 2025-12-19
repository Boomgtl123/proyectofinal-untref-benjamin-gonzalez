/**
 * Lógica de cotización (funciones puras).
 * Acá podés ajustar reglas y factores sin tocar componentes.
 */

export const PLANS = [
  {
    id: "basico",
    name: "Básico",
    multiplier: 1.0,
    tag: "Más económico",
    features: ["Incendio", "Responsabilidad civil"],
  },
  {
    id: "estandar",
    name: "Estándar",
    multiplier: 1.25,
    tag: "Equilibrado",
    features: ["Incendio", "Robo", "Responsabilidad civil"],
  },
  {
    id: "premium",
    name: "Premium",
    multiplier: 1.55,
    tag: "Cobertura total",
    features: ["Todo riesgo", "Robo", "Electrodomésticos"],
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function validate(form) {
  const errors = {};

  const fullName = (form.fullName ?? "").trim();
  if (!fullName) errors.fullName = "El nombre es obligatorio.";

  const email = (form.email ?? "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email) errors.email = "El email es obligatorio.";
  else if (!emailOk) errors.email = "Ingresá un email válido.";

  const age = Number(form.age);
  if (!form.age && form.age !== 0) errors.age = "La edad es obligatoria.";
  else if (!Number.isFinite(age) || age < 18 || age > 90) errors.age = "Edad válida: 18 a 90.";

  const m2 = Number(form.m2);
  if (!form.m2 && form.m2 !== 0) errors.m2 = "Los m² son obligatorios.";
  else if (!Number.isFinite(m2) || m2 <= 0 || m2 > 2000) errors.m2 = "Ingresá m² entre 1 y 2000.";

  if (!form.propertyType) errors.propertyType = "Seleccioná el tipo de propiedad.";
  if (!form.zone) errors.zone = "Seleccioná la ubicación.";

  if (!form.claimsLast3Years) errors.claimsLast3Years = "Seleccioná el historial de reclamos.";

  return errors;
}

export function calculateQuotes(form) {
  // Base en ARS (podés cambiar moneda)
  const base = 2500;

  const age = Number(form.age || 0);
  const m2 = Number(form.m2 || 0);

  // Factores (simple y explicable)
  const factorAge =
    age < 25 ? 1.15 :
    age <= 45 ? 1.0 :
    age <= 65 ? 1.08 :
    1.18;

  const factorM2 = 1 + m2 / 200; // 100m2 => 1.5

  const factorZone = ({ baja: 1.0, media: 1.2, alta: 1.4 }[form.zone] ?? 1.0);
  const factorType = ({ depto: 1.0, casa: 1.15 }[form.propertyType] ?? 1.0);

  const claimsFactor =
    form.claimsLast3Years === "0" ? 1.0 :
    form.claimsLast3Years === "1" ? 1.12 :
    1.25; // "2plus"

  // Descuento por seguridad (tope 15%)
  const sec = form.security ?? {};
  let discount = 0;
  if (sec.alarm) discount += 0.08;
  if (sec.cameras) discount += 0.05;
  if (sec.bars) discount += 0.03;
  discount = clamp(discount, 0, 0.15);

  // Cálculo final por plan
  const quotes = PLANS.map((p) => {
    const monthly =
      base *
      factorAge *
      factorM2 *
      factorZone *
      factorType *
      claimsFactor *
      p.multiplier *
      (1 - discount);

    // “Promo” anual (10% off)
    const yearly = monthly * 12 * 0.9;

    return {
      ...p,
      monthly,
      yearly,
      breakdown: {
        base,
        factorAge,
        factorM2,
        factorZone,
        factorType,
        claimsFactor,
        discount,
      },
    };
  });

  return quotes.sort((a, b) => a.monthly - b.monthly);
}

export function formatMoney(n, currency = "ARS") {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$ ${Math.round(n).toLocaleString("es-AR")}`;
  }
}

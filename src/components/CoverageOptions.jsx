import { formatMoney } from "../utils/quote";

/**
 * Visualización:
 * - Cards por plan
 * - Tabla comparativa
 * - Mini barras de comparación (CSS) para que sea más claro “a simple vista”
 */
export default function CoverageOptions({ quotes }) {
  if (!quotes?.length) {
    return (
      <div className="empty">
        <div className="emptyIcon">🏠</div>
        <div className="emptyTitle">Ingresá los datos y presioná “Cotizar”.</div>
        <div className="emptySub">Te mostramos 3 planes con precios mensuales y anuales.</div>
      </div>
    );
  }

  const min = Math.min(...quotes.map((q) => q.monthly));
  const max = Math.max(...quotes.map((q) => q.monthly));
  const range = max - min || 1;

  return (
    <div className="plans">
      {quotes.map((q) => {
        const barPct = Math.round(((q.monthly - min) / range) * 100);
        return (
          <div key={q.id} className="plan">
            <div className="planHeader">
              <div>
                <div className="planName">{q.name}</div>
                <div className="muted">{q.tag}</div>
              </div>
              <div className="price">{formatMoney(q.monthly)}</div>
            </div>

            <div className="barWrap" aria-hidden="true">
              <div className="bar" style={{ width: `${10 + (100 - barPct)}%` }} />
            </div>
            <div className="muted">Anual promo: {formatMoney(q.yearly)} (10% off)</div>

            <ul className="features">
              {q.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <details className="details">
              <summary>Ver factores aplicados</summary>
              <div className="detailsGrid">
                <div>Base: {formatMoney(q.breakdown.base)}</div>
                <div>Edad: x{q.breakdown.factorAge.toFixed(2)}</div>
                <div>m²: x{q.breakdown.factorM2.toFixed(2)}</div>
                <div>Zona: x{q.breakdown.factorZone.toFixed(2)}</div>
                <div>Propiedad: x{q.breakdown.factorType.toFixed(2)}</div>
                <div>Reclamos: x{q.breakdown.claimsFactor.toFixed(2)}</div>
                <div>Descuento: {Math.round(q.breakdown.discount * 100)}%</div>
              </div>
            </details>
          </div>
        );
      })}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <h2 style={{ margin: 0 }}>Comparación (tabla)</h2>
          <p className="muted" style={{ margin: "6px 0 0 0" }}>
            Ideal para ver diferencias de costo y coberturas.
          </p>
        </div>

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Mensual</th>
                <th>Anual (promo)</th>
                <th>Coberturas</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id}>
                  <td><b>{q.name}</b></td>
                  <td>{formatMoney(q.monthly)}</td>
                  <td>{formatMoney(q.yearly)}</td>
                  <td>{q.features.join(" • ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { validate } from "../utils/quote";

/**
 * Formulario controlado:
 * - Recibe form + setters desde App (estado levantado).
 * - Valida en base a "touched" para no mostrar errores de una.
 */
export default function QuoteForm({ form, setForm, touched, setTouched, onQuote, onReset }) {
  const errors = useMemo(() => validate(form), [form]);
  const hasErrors = Object.keys(errors).length > 0;

  function touch(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSecurityChange(e) {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      security: { ...(prev.security || {}), [name]: checked },
    }));
  }

  function submit(e) {
    e.preventDefault();

    // Marcar todo como tocado para mostrar errores
    const fieldsToTouch = [
      "fullName",
      "email",
      "age",
      "propertyType",
      "zone",
      "m2",
      "claimsLast3Years",
    ];
    setTouched((prev) => fieldsToTouch.reduce((acc, k) => ({ ...acc, [k]: true }), { ...prev }));

    const finalErrors = validate(form);
    if (Object.keys(finalErrors).length > 0) return;

    onQuote();
  }

  const err = (name) => (touched[name] ? errors[name] : null);

  return (
    <form className="form" onSubmit={submit}>
      <div className="row">
        <div>
          <label>Nombre y apellido</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            onBlur={() => touch("fullName")}
            placeholder="Ej: Julián Pérez"
            autoComplete="name"
          />
          {err("fullName") && <div className="error">{err("fullName")}</div>}
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            onBlur={() => touch("email")}
            placeholder="ejemplo@mail.com"
            autoComplete="email"
          />
          {err("email") && <div className="error">{err("email")}</div>}
        </div>
      </div>

      <div className="row">
        <div>
          <label>Edad</label>
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={onChange}
            onBlur={() => touch("age")}
            placeholder="18+"
            min={18}
            max={90}
          />
          {err("age") && <div className="error">{err("age")}</div>}
        </div>

        <div>
          <label>Historial de reclamos (últimos 3 años)</label>
          <select
            name="claimsLast3Years"
            value={form.claimsLast3Years}
            onChange={onChange}
            onBlur={() => touch("claimsLast3Years")}
          >
            <option value="0">0 reclamos</option>
            <option value="1">1 reclamo</option>
            <option value="2plus">2 o más</option>
          </select>
          {err("claimsLast3Years") && <div className="error">{err("claimsLast3Years")}</div>}
        </div>
      </div>

      <div className="row">
        <div>
          <label>Tipo de propiedad</label>
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={onChange}
            onBlur={() => touch("propertyType")}
          >
            <option value="depto">Departamento</option>
            <option value="casa">Casa</option>
          </select>
          {err("propertyType") && <div className="error">{err("propertyType")}</div>}
        </div>

        <div>
          <label>Ubicación / zona</label>
          <select
            name="zone"
            value={form.zone}
            onChange={onChange}
            onBlur={() => touch("zone")}
          >
            <option value="baja">Baja (menor riesgo)</option>
            <option value="media">Media</option>
            <option value="alta">Alta (mayor riesgo)</option>
          </select>
          {err("zone") && <div className="error">{err("zone")}</div>}
        </div>
      </div>

      <div>
        <label>Metros cuadrados (m²)</label>
        <input
          name="m2"
          type="number"
          value={form.m2}
          onChange={onChange}
          onBlur={() => touch("m2")}
          placeholder="Ej: 80"
          min={1}
          max={2000}
        />
        {err("m2") && <div className="error">{err("m2")}</div>}
        <div className="help">Tip: mientras más m², mayor costo (riesgo/valor asegurado).</div>
      </div>

      <div className="divider" />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Medidas de seguridad (descuentos)</h3>
          <span className="badge">Hasta 15% off</span>
        </div>

        <div className="checks">
          <label className="check">
            <input
              type="checkbox"
              name="alarm"
              checked={!!form.security?.alarm}
              onChange={onSecurityChange}
            />
            Alarma
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="cameras"
              checked={!!form.security?.cameras}
              onChange={onSecurityChange}
            />
            Cámaras
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="bars"
              checked={!!form.security?.bars}
              onChange={onSecurityChange}
            />
            Rejas
          </label>
        </div>
      </div>

      <div className="btns">
        <button className="primary" type="submit" disabled={hasErrors}>
          Cotizar
        </button>
        <button className="ghost" type="button" onClick={onReset}>
          Reiniciar
        </button>
      </div>

      {hasErrors && (
        <div className="note">
          Completá el formulario para habilitar la cotización.
        </div>
      )}
    </form>
  );
}

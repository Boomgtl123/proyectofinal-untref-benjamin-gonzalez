import { useEffect, useMemo, useState } from "react";
import QuoteForm from "./components/QuoteForm";
import CoverageOptions from "./components/CoverageOptions";
import { calculateQuotes, validate } from "./utils/quote";

const STORAGE_KEY = "cotizador_hogar_form_v1";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  age: "",
  propertyType: "depto",
  zone: "media",
  m2: "",
  claimsLast3Years: "0",
  security: { alarm: false, cameras: false, bars: false },
};

export default function App() {
  // 3) Estado principal (objeto)
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [didQuote, setDidQuote] = useState(false);

  // 3) Cargar persistencia (useEffect)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((prev) => ({ ...prev, ...parsed, security: { ...prev.security, ...(parsed.security || {}) } }));
      }
    } catch {
      // sin acción
    }
  }, []);

  // 3) Guardar persistencia (useEffect)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // sin acción
    }
  }, [form]);

  // 5) Cotizaciones calculadas (memo)
  const quotes = useMemo(() => {
    const errors = validate(form);
    if (Object.keys(errors).length > 0) return [];
    return calculateQuotes(form);
  }, [form]);

  function onQuote() {
    setDidQuote(true);
  }

  function onReset() {
    setForm(INITIAL_FORM);
    setTouched({});
    setDidQuote(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return (
    <div className="bg">
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Seguros BENJAMIN 🏠</h1>
            <p className="subtitle"> Compará planes y costos</p>
          </div>
          <span className="badge"> Proyecto final </span>
        </header>

        <div className="grid">
          <section className="card">
            <h2>Completá tus datos</h2>
            <QuoteForm
              form={form}
              setForm={setForm}
              touched={touched}
              setTouched={setTouched}
              onQuote={onQuote}
              onReset={onReset}
            />
          </section>

          <section className="card">
            <h2>Opciones de cobertura</h2>
            <CoverageOptions quotes={didQuote ? quotes : []} />
          </section>
        </div>

        <footer className="footer">
          <div className="muted">
          
          </div>
        </footer>
      </div>
    </div>
  );
}

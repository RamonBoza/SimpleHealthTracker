"use client";
import { useEffect, useState, useRef } from "react";
import {
  Heart,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Settings2,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Utensils,
  Dumbbell,
  Footprints,
  Moon,
  Building2,
  Activity,
  Check,
  ArrowRight,
  X,
  LoaderCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  Day,
  Settings,
  IndicatorKey,
  emptyDay,
  dailyColor,
  localDate,
  officeCount,
  indicators,
  meals,
} from "@/lib/model";
type User = {
  id: string;
  username: string;
  email: string;
  admin: boolean;
  settings: Settings;
};
type Privacy = {
  controller: string;
  contact: string;
  recovery: boolean;
  ready: boolean;
};
async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch("/api/" + path, {
    method,
    headers: method === "GET" ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || "No se pudo completar la operación");
  return data;
}
const dateLabel = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const shortDate = (date: string) =>
  new Date(date + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
const colorName = {
  green: "Sigue la dieta",
  yellow: "Sigue parcialmente la dieta",
  red: "Fuera de la dieta",
};
function ErrorText({ message }: { message: string }) {
  return message ? (
    <p className="error" role="alert">
      {message}
    </p>
  ) : null;
}
function PrivacyText({ privacy }: { privacy: Privacy | null }) {
  return (
    <div className="privacy-copy">
      <h3>Tu información, con cuidado</h3>
      <p>
        Guardamos tu cuenta y los registros que introduces para ofrecerte el
        diario y las gráficas. Los datos de salud se tratan con tu
        consentimiento explícito; puedes retirarlo y solicitar la eliminación de
        tu cuenta.
      </p>
      <p>
        Los demás usuarios no pueden ver tus datos. Administración puede
        consultar contenido en casos justificados de soporte o moderación,
        registrando el acceso y su motivo.
      </p>
      <p>
        Responsable:{" "}
        {privacy?.controller ||
          "Pendiente de configurar para abrir el servicio"}
        . Contacto y ejercicio de derechos:{" "}
        {privacy?.contact || "Pendiente de configurar"}.
      </p>
      <p>
        Puedes solicitar acceso, rectificación, supresión y, cuando corresponda,
        portabilidad mediante ese contacto, incluso si la cuenta está bloqueada.
        Conservamos los registros hasta que los elimines o solicites borrar la
        cuenta. Las copias de seguridad siguen la política de conservación del
        despliegue.
      </p>
      <p>
        Usamos una cookie necesaria para mantener tu sesión. No usamos analítica
        ni cookies publicitarias.
      </p>
    </div>
  );
}
function Auth({
  onLogin,
  privacy,
}: {
  onLogin: () => void;
  privacy: Privacy | null;
}) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  useEffect(() => {
    const token = new URLSearchParams(location.search).get("reset");
    if (token) {
      setReset(token);
      setMode("reset");
      history.replaceState(null, "", location.pathname);
    }
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      if (mode === "login") {
        await api("login", "POST", {
          identity: f.get("identity"),
          password: f.get("password"),
        });
        onLogin();
      }
      if (mode === "register") {
        await api("register", "POST", {
          username: f.get("username"),
          email: f.get("email"),
          password: f.get("password"),
          consent: f.get("consent") === "on",
        });
        onLogin();
      }
      if (mode === "forgot") {
        const r = await api("forgot", "POST", { email: f.get("email") });
        setNotice(r.message);
      }
      if (mode === "reset") {
        await api("reset", "POST", {
          token: reset,
          password: f.get("password"),
        });
        setMode("login");
        setNotice("Contraseña actualizada. Inicia sesión.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-layout">
      <section className="auth-story">
        <a className="brand" href="/">
          <span className="brand-icon">
            <Heart size={22} />
          </span>
          SimpleHealth<span>Tracker</span>
        </a>
        <div>
          <span className="eyebrow">UN POCO CADA DÍA</span>
          <h1>
            Tu salud.
            <br />
            Tu ritmo.
            <br />
            <em>Tu camino.</em>
          </h1>
          <p>
            Un espacio sencillo para registrar tus hábitos y ver cómo avanzas,
            día a día.
          </p>
          <div className="story-pills">
            <span>
              <Utensils size={16} /> Alimentación
            </span>
            <span>
              <Activity size={16} /> Movimiento
            </span>
            <span>
              <Moon size={16} /> Descanso
            </span>
          </div>
        </div>
        <small>Cada dato cuenta. Tú decides cuáles registrar.</small>
      </section>
      <section className="auth-side">
        <div className="auth-card">
          <span className="eyebrow">BIENVENIDO A TU DIARIO</span>
          <h2>
            {mode === "register"
              ? "Empieza tu camino"
              : mode === "forgot"
                ? "Recupera tu acceso"
                : mode === "reset"
                  ? "Una nueva contraseña"
                  : "Qué bueno verte"}
          </h2>
          <p className="muted">
            {mode === "login"
              ? "Entra y continúa donde lo dejaste."
              : "Tu información estará en tu propia cuenta."}
          </p>
          <form onSubmit={submit} key={mode}>
            {mode === "login" && (
              <label>
                Usuario o correo
                <input
                  name="identity"
                  autoComplete="username"
                  required
                  maxLength={254}
                />
              </label>
            )}
            {mode === "register" && (
              <label>
                Nombre de usuario
                <input
                  name="username"
                  autoComplete="username"
                  minLength={3}
                  maxLength={40}
                  required
                />
              </label>
            )}
            {(mode === "register" || mode === "forgot") && (
              <label>
                Correo electrónico
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label>
                Contraseña
                <input
                  name="password"
                  aria-label="Contraseña"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={mode === "login" ? 1 : 12}
                  maxLength={72}
                />
                {mode !== "login" && <small>Al menos 12 caracteres.</small>}
              </label>
            )}
            {mode === "register" && (
              <>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setShowPrivacy(!showPrivacy)}
                >
                  Leer información de privacidad
                </button>
                {showPrivacy && <PrivacyText privacy={privacy} />}
                <label className="checkbox-label">
                  <input name="consent" type="checkbox" required />
                  Consiento explícitamente el tratamiento de mis datos de salud
                  para el diario y las gráficas, según la información de
                  privacidad.
                </label>
              </>
            )}
            <ErrorText message={error} />
            {notice && (
              <p role="status" className="notice">
                {notice}
              </p>
            )}
            <button className="primary wide" disabled={busy}>
              {busy ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <ArrowRight size={18} />
              )}{" "}
              {mode === "login"
                ? "Entrar"
                : mode === "register"
                  ? "Crear cuenta"
                  : mode === "forgot"
                    ? "Enviar enlace"
                    : "Guardar contraseña"}
            </button>
          </form>
          <div className="auth-links">
            {mode === "login" ? (
              <>
                <button
                  onClick={() => {
                    setMode("forgot");
                    setError("");
                  }}
                >
                  He olvidado mi contraseña
                </button>
                <p>
                  ¿Es tu primera vez?{" "}
                  <button
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                  >
                    Crear cuenta
                  </button>
                </p>
              </>
            ) : (
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Volver a iniciar sesión
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
function Suggest({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const choices = options
    .filter(
      (o) =>
        !value || o.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
    )
    .slice(0, 6);
  return (
    <div className="suggest">
      <input
        aria-label={label}
        placeholder={label}
        value={value}
        maxLength={100}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && choices.length > 0 && (
        <div className="suggest-options">
          <small>Usadas recientemente</small>
          {choices.map((o) => (
            <button
              key={o}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function NumberField({
  label,
  value,
  onChange,
  max,
  step = 0.1,
  suffix,
}: {
  label: string;
  value: number | null;
  onChange: (n: number | null) => void;
  max: number;
  step?: number;
  suffix: string;
}) {
  return (
    <label>
      {label}
      <div className="input-suffix">
        <input
          type="number"
          aria-label={label}
          min={0}
          max={max}
          step={step}
          value={value ?? ""}
          placeholder="Sin registrar"
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
        />
        <span>{suffix}</span>
      </div>
    </label>
  );
}
function TriState({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: Day["office"]) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {[
        ["unset", "Sin registrar"],
        ["yes", "Sí"],
        ["no", "No"],
      ].map(([v, name]) => (
        <button
          type="button"
          aria-pressed={value === v}
          className={value === v ? "selected" : ""}
          key={v}
          onClick={() => onChange(v as Day["office"])}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
function Diary({
  date,
  days,
  onSave,
  onDelete,
  goal,
  onDirty,
  onSaving,
}: {
  date: string;
  days: Record<string, Day>;
  onSave: (d: Day, quiet?: boolean) => Promise<void>;
  onDelete: () => Promise<void>;
  goal: number;
  onDirty: (v: boolean) => void;
  onSaving: (v: boolean) => void;
}) {
  const [draft, setDraft] = useState<Day>(() =>
    structuredClone(days[date] || emptyDay()),
  );
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState("");
  const version = useRef(0);
  const saving = useRef(false);
  const failedVersion = useRef<number | null>(null);
  const latestSave = useRef(onSave);
  latestSave.current = onSave;
  const [saved, setSaved] = useState(!!days[date]);
  const [editing, setEditing] = useState<string | null>(null);
  const [meal, setMeal] = useState<Omit<Day["meals"][number], "id">>({
    type: "Desayuno",
    text: "",
    color: "green",
  });
  useEffect(() => {
    onDirty(dirty || !!meal.text.trim() || !!activity.trim());
  }, [dirty, meal.text, activity, onDirty]);
  useEffect(() => {
    onSaving(busy);
  }, [busy, onSaving]);
  function update<K extends keyof Day>(key: K, value: Day[K]) {
    version.current++;
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  }
  const history = Object.entries(days).sort(([a], [b]) => b.localeCompare(a));
  const strengthOptions = [
    ...new Set(history.map(([, d]) => d.strength).filter(Boolean)),
  ];
  const activityOptions = [
    ...new Set(history.flatMap(([, d]) => d.activities)),
  ];
  async function save(e?: React.FormEvent, automatic = false) {
    e?.preventDefault();
    if (saving.current) return;
    if (!automatic && (meal.text.trim() || activity.trim())) {
      setError("Añade la comida o actividad pendiente antes de guardar.");
      return;
    }
    const snapshotVersion = version.current;
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      await latestSave.current(structuredClone(draft), automatic);
      failedVersion.current = null;
      setSaved(true);
      if (version.current === snapshotVersion) setDirty(false);
    } catch (e) {
      failedVersion.current = snapshotVersion;
      setError((e as Error).message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!dirty || busy || failedVersion.current === version.current) return;
    const timer = setTimeout(() => {
      void save(undefined, true);
    }, 700);
    return () => clearTimeout(timer);
  }, [draft, dirty, busy]);
  function addMeal() {
    if (!meal.text.trim()) {
      setError("Describe la comida antes de añadirla.");
      return;
    }
    const item = { ...meal, id: editing || crypto.randomUUID() };
    update(
      "meals",
      editing
        ? draft.meals.map((m) => (m.id === editing ? item : m))
        : [...draft.meals, item],
    );
    setMeal({ type: "Comida", text: "", color: "green" });
    setEditing(null);
    setError("");
  }
  const count = officeCount({ ...days, [date]: draft }, date.slice(0, 7));
  return (
    <form
      className="diary-grid"
      onSubmit={(e) => {
        void save(e);
      }}
    >
      <section className="card meals-card" id="food-log">
        <div className="card-heading">
          <span className="tile-icon amber">
            <Utensils size={19} />
          </span>
          <div>
            <h2>Alimentación</h2>
            <p>Qué has comido y cómo encaja en tu dieta.</p>
          </div>
          {dailyColor(draft) && (
            <span className={"badge " + dailyColor(draft)}>
              {colorName[dailyColor(draft)!]}
            </span>
          )}
        </div>
        {!draft.meals.length && (
          <div className="empty-small">
            <Utensils size={26} />
            <p>Tu primera comida del día empieza aquí.</p>
          </div>
        )}
        <div className="meal-list">
          {draft.meals.map((m) => (
            <article key={m.id}>
              <span className={"dot " + m.color} />
              <button
                type="button"
                className="meal-detail"
                onClick={() => {
                  setEditing(m.id);
                  setMeal({ type: m.type, text: m.text, color: m.color });
                }}
              >
                <strong>{m.type}</strong>
                <span>{m.text}</span>
                <small>{colorName[m.color]} · Editar</small>
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label={"Eliminar " + m.type}
                onClick={() => {
                  update(
                    "meals",
                    draft.meals.filter((x) => x.id !== m.id),
                  );
                  if (editing === m.id) setEditing(null);
                }}
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
        <div className="meal-entry">
          <div className="field-row">
            <label>
              Comida
              <select
                value={meal.type}
                onChange={(e) =>
                  setMeal({
                    ...meal,
                    type: e.target.value as Day["meals"][number]["type"],
                  })
                }
              >
                {meals.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label>
              Qué has comido
              <input
                value={meal.text}
                maxLength={1500}
                onChange={(e) => setMeal({ ...meal, text: e.target.value })}
                placeholder="Por ejemplo, café y tostada"
              />
            </label>
          </div>
          <div className="meal-controls">
            <div
              className="color-picker"
              role="group"
              aria-label="Seguimiento de dieta"
            >
              {(["green", "yellow", "red"] as const).map((c) => (
                <button
                  type="button"
                  key={c}
                  title={colorName[c]}
                  aria-label={colorName[c]}
                  aria-pressed={meal.color === c}
                  className={c + (meal.color === c ? " active" : "")}
                  onClick={() => setMeal({ ...meal, color: c })}
                >
                  {meal.color === c ? <Check size={15} /> : <span />}
                  <span>{colorName[c]}</span>
                </button>
              ))}
            </div>
            <button className="secondary" type="button" onClick={addMeal}>
              <Plus size={16} />
              {editing ? "Actualizar" : "Añadir comida"}
            </button>
            {editing && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setEditing(null);
                  setMeal({ type: "Comida", text: "", color: "green" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </section>
      <section className="card">
        <div className="card-heading">
          <span className="tile-icon mint">
            <Dumbbell size={20} />
          </span>
          <div>
            <h2>Movimiento</h2>
            <p>A tu ritmo, sin rellenar de más.</p>
          </div>
        </div>
        <label>
          Rutina de fuerza
          <Suggest
            label="Nombre de la rutina"
            value={draft.strength}
            onChange={(v) => update("strength", v)}
            options={strengthOptions}
          />
          <small>Una rutina al día. Déjalo vacío si no has hecho.</small>
        </label>
        <label>Otras actividades físicas</label>
        <div className="activity-entry">
          <Suggest
            label="Natación, caminar, correr…"
            value={activity}
            onChange={setActivity}
            options={activityOptions}
          />
          <button
            type="button"
            className="icon-button add"
            aria-label="Añadir actividad"
            onClick={() => {
              if (
                activity.trim() &&
                !draft.activities.includes(activity.trim())
              ) {
                update("activities", [...draft.activities, activity.trim()]);
                setActivity("");
              }
            }}
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="chips">
          {draft.activities.map((a, index) => (
            <span key={index}>
              {a}
              <button
                type="button"
                aria-label={"Quitar " + a}
                onClick={() =>
                  update(
                    "activities",
                    draft.activities.filter((_, i) => i !== index),
                  )
                }
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
        <NumberField
          label="Pasos"
          value={draft.steps}
          onChange={(v) => update("steps", v)}
          max={200000}
          step={1}
          suffix="pasos"
        />
      </section>
      <section className="card">
        <div className="card-heading">
          <span className="tile-icon lavender">
            <Moon size={19} />
          </span>
          <div>
            <h2 id="sleep-log">Descanso y sueño</h2>
            <p>La noche que termina este día.</p>
          </div>
        </div>
        <div className="field-row">
          <NumberField
            label="Horas dormidas"
            value={draft.sleep}
            onChange={(v) => update("sleep", v)}
            max={24}
            suffix="h"
          />
          <NumberField
            label="Calidad del sueño"
            value={draft.quality}
            onChange={(v) => update("quality", v)}
            max={100}
            step={1}
            suffix="/100"
          />
        </div>
        <p className="hint">
          Introduce la puntuación de tu reloj. Sin siestas.
        </p>
      </section>
      <section className="card">
        <div className="card-heading">
          <span className="tile-icon sky">
            <Building2 size={19} />
          </span>
          <div>
            <h2>Oficina</h2>
            <p>¿Has ido presencialmente?</p>
          </div>
        </div>
        <TriState
          label="Asistencia a oficina"
          value={draft.office}
          onChange={(v) => update("office", v)}
        />
        <div className="progress-label">
          <span>Este mes</span>
          <strong>
            {count} <span>/ {goal} días</span>
          </strong>
        </div>
        <progress value={Math.min(count, goal || 1)} max={goal || 1} />
        <small>
          {goal === 0
            ? "Configura tu objetivo en Opciones."
            : count >= goal
              ? "Objetivo alcanzado"
              : `${goal - count} días para tu objetivo`}
        </small>
      </section>
      <section className="card measurements" id="measurements-log">
        <div className="card-heading">
          <span className="tile-icon mint">
            <Activity size={19} />
          </span>
          <div>
            <h2>Mediciones</h2>
            <p>Solo cuando tengas un dato nuevo.</p>
          </div>
        </div>
        <div className="measurement-fields">
          {indicators.map((i) => (
            <NumberField
              key={i.key}
              label={i.name}
              value={draft[i.key]}
              onChange={(v) => update(i.key, v)}
              max={i.limit}
              suffix={i.unit}
            />
          ))}
        </div>
      </section>
      <section className="card notes">
        <label>
          Notas del día
          <textarea
            value={draft.notes}
            maxLength={5000}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Un viaje, una celebración, cómo te has sentido…"
            rows={3}
          />
        </label>
      </section>
      <div className="save-bar">
        <div>
          <strong
            role="status"
            aria-label="Estado de guardado"
            aria-live="polite"
          >
            {busy
              ? "Guardando…"
              : error && dirty
                ? "No se pudo guardar"
                : dirty || !!meal.text.trim() || !!activity.trim()
                  ? "Cambios pendientes"
                  : saved
                    ? "Guardado"
                    : "Autoguardado activo"}
          </strong>
          <small>
            {meal.text.trim() || activity.trim()
              ? "Pulsa Añadir para registrar la entrada pendiente."
              : error && dirty
                ? "Tus cambios siguen en esta pantalla. Reintenta."
                : "Los cambios se guardan automáticamente."}
          </small>
          <ErrorText message={error} />
        </div>
        <div className="save-actions">
          {days[date] && (
            <button
              type="button"
              className="icon-button danger"
              aria-label="Eliminar registros del día"
              disabled={busy}
              onClick={async () => {
                if (confirm("¿Eliminar todos los registros de este día?")) {
                  setBusy(true);
                  saving.current = true;
                  try {
                    await onDelete();
                    setDraft(emptyDay());
                    setDirty(false);
                    setSaved(false);
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    saving.current = false;
                    setBusy(false);
                  }
                }
              }}
            >
              <Trash2 size={18} />
            </button>
          )}
          {(dirty || busy) && (
            <button className="primary" disabled={busy || !dirty}>
              {busy ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Check size={17} />
              )}
              {error ? "Reintentar" : "Guardar ahora"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
function WeekStrip({
  date,
  onDate,
  days,
}: {
  date: string;
  onDate: (date: string) => void;
  days: Record<string, Day>;
}) {
  const start = new Date(date + "T12:00:00");
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return (
    <div className="week-strip" aria-label="Días de la semana">
      {Array.from({ length: 7 }, (_, index) => {
        const day = new Date(start);
        day.setDate(start.getDate() + index);
        const key = localDate(day);
        const color = days[key] ? dailyColor(days[key]) : null;
        return (
          <button
            key={key}
            aria-label={"Ir al " + dateLabel(key)}
            aria-pressed={date === key}
            className={date === key ? "selected" : ""}
            onClick={() => onDate(key)}
          >
            <small>
              {day.toLocaleDateString("es-ES", { weekday: "short" })}
            </small>
            <strong>{day.getDate()}</strong>
            <span className={"dot " + (color || "unrecorded")} />
          </button>
        );
      })}
    </div>
  );
}
function Calendar({
  days,
  date,
  onDate,
}: {
  days: Record<string, Day>;
  date: string;
  onDate: (d: string) => void;
}) {
  const [month, setMonth] = useState(date.slice(0, 7));
  const [selected, setSelected] = useState(date);
  const selectedDay = days[selected] || emptyDay();
  const selectedColor = dailyColor(selectedDay);
  const base = new Date(month + "-01T12:00:00");
  const offset = (base.getDay() + 6) % 7;
  const total = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const change = (n: number) => {
    const d = new Date(base);
    d.setMonth(d.getMonth() + n);
    setMonth(localDate(d).slice(0, 7));
    setSelected(localDate(d).slice(0, 7) + "-01");
  };
  return (
    <section className="card calendar-card">
      <div className="calendar-heading">
        <div>
          <h2>
            {base.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <p>Tu alimentación, de un vistazo.</p>
        </div>
        <div className="date-controls">
          <button
            className="icon-button"
            aria-label="Mes anterior"
            onClick={() => change(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <input
            type="month"
            aria-label="Mes del calendario"
            value={month}
            onChange={(e) => {
              if (e.target.value) {
                setMonth(e.target.value);
                setSelected(e.target.value + "-01");
              }
            }}
          />
          <button
            className="icon-button"
            aria-label="Mes siguiente"
            onClick={() => change(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <span className="weekday" key={d}>
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <div key={"blank" + i} />
        ))}
        {Array.from({ length: total }, (_, i) => {
          const d = month + "-" + String(i + 1).padStart(2, "0");
          const day = days[d];
          const color = day ? dailyColor(day) : null;
          return (
            <button
              key={d}
              className={
                "calendar-day " +
                (color || "unrecorded") +
                (d === localDate() ? " today" : "")
              }
              aria-label={`${dateLabel(d)}: ${color ? colorName[color] : "Sin comidas registradas"}`}
              aria-pressed={selected === d}
              onClick={() => setSelected(d)}
            >
              <span>{i + 1}</span>
              {color ? (
                <span className={"calendar-symbol " + color} aria-hidden="true">
                  {color === "green" ? "✓" : color === "yellow" ? "△" : "×"}
                </span>
              ) : (
                <span className="no-data">—</span>
              )}
              <small>
                {day?.meals.length
                  ? `${day.meals.length} comida${day.meals.length > 1 ? "s" : ""}`
                  : "Sin registro"}
              </small>
            </button>
          );
        })}
      </div>
      <div className="calendar-legend">
        {Object.entries(colorName).map(([c, name]) => (
          <span key={c}>
            <span className={"dot " + c} />
            {name}
          </span>
        ))}
        <span>
          <span className="dot unrecorded" />
          Sin datos
        </span>
      </div>
      <p className="hint">
        El color se calcula con las comidas registradas. Selecciona un día para
        consultar sus comidas.
      </p>
      <section
        className="calendar-detail"
        aria-label="Detalle del día seleccionado"
      >
        <div className="calendar-detail-heading">
          <h2>{dateLabel(selected)}</h2>
          <span className={"badge " + (selectedColor || "neutral")}>
            {selectedColor
              ? colorName[selectedColor]
              : "Sin comidas registradas"}
          </span>
        </div>
        <p className="muted">{selectedDay.meals.length} comidas registradas</p>
        {selectedDay.meals.map((m) => (
          <article className="calendar-meal" key={m.id}>
            <Utensils size={19} />
            <div>
              <strong>{m.type}</strong>
              <p>{m.text}</p>
            </div>
            <span className={"badge " + m.color}>{colorName[m.color]}</span>
          </article>
        ))}
        {!selectedDay.meals.length && (
          <p className="empty-small">
            No hay comidas registradas en esta fecha.
          </p>
        )}
        <button className="primary wide" onClick={() => onDate(selected)}>
          Ver y editar en Diario <ArrowRight size={18} />
        </button>
      </section>
    </section>
  );
}
function Evolution({
  days,
  settings,
  onDiary,
  onOptions,
}: {
  days: Record<string, Day>;
  settings: Settings;
  onDiary: () => void;
  onOptions: () => void;
}) {
  const [period, setPeriod] = useState("all");
  const cutoff = new Date();
  if (period !== "all") cutoff.setMonth(cutoff.getMonth() - Number(period));
  const all = Object.entries(days).sort(([a], [b]) => a.localeCompare(b));
  return (
    <>
      <div className="view-toolbar">
        <p className="muted">Observa el camino, no solo el último número.</p>
        <select
          aria-label="Periodo de evolución"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="all">Todo el historial</option>
          <option value="1">Último mes</option>
          <option value="3">Últimos 3 meses</option>
          <option value="6">Últimos 6 meses</option>
          <option value="12">Último año</option>
        </select>
      </div>
      <div className="charts-grid">
        {indicators
          .filter((i) => settings.ranges[i.key].visible)
          .map((i) => {
            const range = settings.ranges[i.key];
            const values = all
              .filter(
                ([d, v]) =>
                  v[i.key] !== null &&
                  (period === "all" || d >= localDate(cutoff)),
              )
              .map(([date, d]) => ({
                date,
                time: new Date(date + "T12:00:00Z").getTime(),
                value: d[i.key] as number,
              }));
            const latest = values.at(-1);
            const within =
              latest && latest.value >= range.min && latest.value <= range.max;
            const low = Math.min(range.min, ...values.map((v) => v.value));
            const high = Math.max(range.max, ...values.map((v) => v.value));
            const margin = Math.max((high - low) * 0.2, 1);
            return (
              <section
                className={
                  "card chart-card " +
                  (i.key === "weight" ? "featured-chart" : "")
                }
                key={i.key}
              >
                <div className="chart-heading">
                  <div>
                    <span className="eyebrow">{i.name}</span>
                    <h2>
                      {latest ? latest.value.toLocaleString("es-ES") : "—"}{" "}
                      <small>{i.unit}</small>
                    </h2>
                    <small>
                      {latest
                        ? shortDate(latest.date)
                        : "Todavía sin mediciones"}
                    </small>
                  </div>
                  <span
                    className={
                      "badge " +
                      (latest ? (within ? "green" : "yellow") : "neutral")
                    }
                  >
                    {latest
                      ? within
                        ? "En rango"
                        : "Fuera de rango"
                      : "Sin datos"}
                  </span>
                </div>
                <p className="range-label">
                  Rango de referencia: {range.min}–{range.max} {i.unit}
                </p>
                {values.length ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={values}
                        margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 5"
                          vertical={false}
                          stroke="#e7ece9"
                        />
                        <XAxis
                          dataKey="time"
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          tickFormatter={(v) =>
                            shortDate(new Date(v).toISOString().slice(0, 10))
                          }
                          tick={{ fontSize: 11 }}
                          minTickGap={35}
                        />
                        <YAxis
                          domain={[
                            Math.max(0, low - margin),
                            Math.min(i.limit, high + margin),
                          ]}
                          width={38}
                          tickFormatter={(v) =>
                            Number(v).toLocaleString("es-ES", {
                              maximumFractionDigits: 1,
                            })
                          }
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip
                          labelFormatter={(v) =>
                            dateLabel(
                              new Date(Number(v)).toISOString().slice(0, 10),
                            )
                          }
                          formatter={(v) => [`${v} ${i.unit}`, i.name]}
                        />
                        <ReferenceArea
                          y1={range.min}
                          y2={range.max}
                          fill="#cbe8d8"
                          fillOpacity={0.5}
                          strokeOpacity={0}
                        />
                        <ReferenceLine
                          y={range.min}
                          stroke="#a5d0b9"
                          strokeDasharray="3 4"
                          label={{
                            value: `Mín. ${range.min} ${i.unit}`,
                            position: "insideTopLeft",
                            fill: "#1b4332",
                            fontSize: 10,
                          }}
                        />
                        <ReferenceLine
                          y={range.max}
                          stroke="#a5d0b9"
                          strokeDasharray="3 4"
                          label={{
                            value: `Máx. ${range.max} ${i.unit}`,
                            position: "insideBottomLeft",
                            fill: "#1b4332",
                            fontSize: 10,
                          }}
                        />
                        <Line
                          dataKey="value"
                          type="linear"
                          stroke="#267360"
                          strokeWidth={2.5}
                          dot={{
                            r: 4,
                            fill: "#267360",
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="chart-empty">
                    <ChartNoAxesCombined size={30} />
                    <p>
                      Añade una medición en el diario
                      <br />
                      para empezar a ver tu evolución.
                    </p>
                  </div>
                )}
                {i.key === "weight" && (
                  <button className="primary wide" onClick={onDiary}>
                    <Plus size={18} />
                    Registrar peso hoy
                  </button>
                )}
              </section>
            );
          })}
      </div>
      <section className="reference-note">
        <Settings2 size={22} />
        <div>
          <h3>Rangos personalizados</h3>
          <p>
            Las franjas sombreadas representan tus rangos de referencia. Puedes
            ajustarlos y decidir qué indicadores mostrar.
          </p>
          <button className="text-button" onClick={onOptions}>
            Personalizar rangos y visibilidad <ArrowRight size={16} />
          </button>
        </div>
      </section>
      {!indicators.some((i) => settings.ranges[i.key].visible) && (
        <section className="card empty-small">
          <p>
            No tienes indicadores visibles. Puedes mostrarlos desde Opciones.
          </p>
        </section>
      )}
    </>
  );
}
function Options({
  user,
  onSave,
  onDeleted,
  onLogout,
  privacy,
}: {
  user: User;
  onSave: (s: Settings) => Promise<void>;
  onDeleted: () => void;
  onLogout: () => Promise<void>;
  privacy: Privacy | null;
}) {
  const [settings, setSettings] = useState<Settings>(() =>
    structuredClone(user.settings),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="options-grid">
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            await onSave(settings);
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>Tus referencias</h2>
        <p className="muted">Ajusta tus rangos y decide qué indicadores ver.</p>
        <label>
          Objetivo mensual de oficina
          <input
            type="number"
            min={0}
            max={31}
            step={1}
            value={settings.officeGoal}
            onChange={(e) =>
              setSettings({ ...settings, officeGoal: Number(e.target.value) })
            }
            required
          />
        </label>
        {indicators.map((i) => (
          <fieldset key={i.key}>
            <legend>
              {i.name} ({i.unit})
            </legend>
            <div className="field-row">
              <label>
                Mínimo
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={i.limit}
                  value={settings.ranges[i.key].min}
                  required
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ranges: {
                        ...settings.ranges,
                        [i.key]: {
                          ...settings.ranges[i.key],
                          min: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </label>
              <label>
                Máximo
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={i.limit}
                  value={settings.ranges[i.key].max}
                  required
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ranges: {
                        ...settings.ranges,
                        [i.key]: {
                          ...settings.ranges[i.key],
                          max: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </label>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.ranges[i.key].visible}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    ranges: {
                      ...settings.ranges,
                      [i.key]: {
                        ...settings.ranges[i.key],
                        visible: e.target.checked,
                      },
                    },
                  })
                }
              />
              Mostrar en evolución
            </label>
          </fieldset>
        ))}
        <ErrorText message={error} />
        <button className="primary" disabled={busy}>
          <Check size={17} />
          Guardar opciones
        </button>
      </form>
      <div>
        <section className="card">
          <h2>Tu cuenta</h2>
          <p>
            <strong>{user.username}</strong>
            <br />
            {user.email}
          </p>
          <p className="hint">Ocultar un indicador no borra sus mediciones.</p>
          <button
            className="secondary"
            type="button"
            onClick={async () => {
              try {
                await onLogout();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </section>
        <section className="card privacy-card">
          <PrivacyText privacy={privacy} />
        </section>
        <section className="card danger-zone">
          <h3>Eliminar mi cuenta</h3>
          <p>
            Se eliminarán tu cuenta y todos tus registros del sistema activo.
            Esta acción no se puede deshacer.
          </p>
          {!deleting ? (
            <button
              className="secondary danger"
              onClick={() => setDeleting(true)}
            >
              Eliminar cuenta
            </button>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                const f = new FormData(e.currentTarget);
                try {
                  await api("account", "DELETE", {
                    password: f.get("password"),
                    confirm: f.get("confirm"),
                  });
                  onDeleted();
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                Tu contraseña
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                />
              </label>
              <label>
                Escribe ELIMINAR
                <input name="confirm" required pattern="ELIMINAR" />
              </label>
              <button disabled={busy} className="primary danger">
                Eliminar definitivamente
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setDeleting(false)}
              >
                Cancelar
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [audit, setAudit] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [target, setTarget] = useState<any>(null);
  const [action, setAction] = useState("inspect");
  const [inspection, setInspection] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const [u, a] = await Promise.all([
        api("admin/users"),
        api("admin/audit"),
      ]);
      setUsers(u);
      setAudit(a);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  return (
    <div className="admin-view">
      <ErrorText message={error} />
      <section className="card">
        <h2>Cuentas</h2>
        <p className="muted">
          Consulta registros solo ante un caso justificado. Cada acción queda
          registrada.
        </p>
        <label>
          Buscar cuenta
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre o correo"
          />
        </label>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) =>
                  `${u.username} ${u.email}`
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase()),
                )
                .map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.username}</strong>
                      <small>{u.email}</small>
                    </td>
                    <td>
                      {u.role === "admin"
                        ? "Administrador"
                        : u.banned_until === "indefinite" ||
                            (u.banned_until &&
                              new Date(u.banned_until) > new Date())
                          ? "Bloqueado"
                          : "Activo"}
                    </td>
                    <td>
                      <div className="admin-actions">
                        {(u.role === "admin"
                          ? ["inspect"]
                          : ["inspect", "ban", "unban", "delete"]
                        ).map((a) => (
                          <button
                            className="secondary"
                            key={a}
                            onClick={() => {
                              setTarget(u);
                              setAction(a);
                              setInspection(null);
                              setError("");
                            }}
                          >
                            {
                              {
                                inspect: "Consultar",
                                ban: "Bloquear",
                                unban: "Desbloquear",
                                delete: "Eliminar",
                              }[a]
                            }
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      {target && (
        <section className="card">
          <h3>
            {
              {
                inspect: "Consultar registros",
                ban: "Bloquear cuenta",
                unban: "Desbloquear cuenta",
                delete: "Eliminar cuenta",
              }[action]
            }{" "}
            · {target.username}
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              if (
                action === "delete" &&
                !confirm(
                  "Se eliminarán la cuenta y todos sus registros. ¿Continuar?",
                )
              )
                return;
              setBusy(true);
              setError("");
              try {
                const until = f.get("until");
                const result = await api("admin", "POST", {
                  target: target.id,
                  action,
                  reason: f.get("reason"),
                  until: until ? new Date(String(until)).toISOString() : null,
                });
                if (action === "inspect") setInspection(result);
                else setTarget(null);
                await load();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              Motivo (sin copiar datos sensibles)
              <textarea
                name="reason"
                minLength={10}
                maxLength={500}
                required
                rows={2}
              />
            </label>
            {action === "ban" && (
              <label>
                Fin del bloqueo (vacío = indefinido)
                <input type="datetime-local" name="until" />
              </label>
            )}
            <button className="primary" disabled={busy}>
              Confirmar acción
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setTarget(null);
                setInspection(null);
              }}
            >
              Cerrar
            </button>
          </form>
          {inspection && (
            <div className="inspection">
              <p>
                Acceso registrado. {Object.keys(inspection.days).length} días.
              </p>
              {Object.entries(inspection.days as Record<string, Day>).map(
                ([date, day]) => (
                  <details key={date}>
                    <summary>{dateLabel(date)}</summary>
                    <dl>
                      {day.meals.map((m) => (
                        <div key={m.id}>
                          <dt>
                            {m.type} · {colorName[m.color]}
                          </dt>
                          <dd>{m.text}</dd>
                        </div>
                      ))}
                      <dt>Fuerza</dt>
                      <dd>{day.strength || "—"}</dd>
                      <dt>Otras actividades</dt>
                      <dd>{day.activities.join(", ") || "—"}</dd>
                      <dt>Oficina / pasos</dt>
                      <dd>
                        {day.office} / {day.steps ?? "—"}
                      </dd>
                      <dt>Sueño</dt>
                      <dd>
                        {day.sleep ?? "—"} h · {day.quality ?? "—"}/100
                      </dd>
                      {indicators.map((i) => (
                        <div key={i.key}>
                          <dt>{i.name}</dt>
                          <dd>
                            {day[i.key] ?? "—"} {i.unit}
                          </dd>
                        </div>
                      ))}
                      <dt>Notas</dt>
                      <dd>{day.notes || "—"}</dd>
                    </dl>
                  </details>
                ),
              )}
            </div>
          )}
        </section>
      )}
      <section className="card">
        <h2>Registro de administración</h2>
        {audit.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Acción</th>
                  <th>Motivo</th>
                  <th>Identificadores</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.created).toLocaleString("es-ES")}</td>
                    <td>{a.action}</td>
                    <td>{a.reason}</td>
                    <td>
                      <small>
                        Admin: {a.actor || "Eliminado"}
                        <br />
                        Cuenta: {a.target || "Eliminada"}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">Todavía no hay acciones registradas.</p>
        )}
      </section>
    </div>
  );
}
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [days, setDays] = useState<Record<string, Day>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [view, setView] = useState("diary");
  const [date, setDate] = useState(localDate());
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const [privacy, setPrivacy] = useState<Privacy | null>(null);
  const [savingDay, setSavingDay] = useState(false);
  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const me = await api("me");
      const data = await api("days");
      setUser(me);
      setDays(data);
    } catch (e) {
      const message = (e as Error).message;
      if (message.includes("Inicia sesión") || message.includes("caducado"))
        setUser(null);
      else setLoadError(message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    api("privacy")
      .then(setPrivacy)
      .catch(() => {});
  }, []);
  useEffect(() => {
    const f = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", f);
    return () => window.removeEventListener("beforeunload", f);
  }, [dirty]);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 5000);
      return () => clearTimeout(t);
    }
  }, [notice]);
  function navigate(v: string, d?: string) {
    if (savingDay) {
      setNotice("Espera un momento: estamos guardando tus cambios.");
      return;
    }
    if (dirty && !confirm("Hay cambios sin guardar. ¿Quieres descartarlos?"))
      return;
    setDirty(false);
    setView(v);
    if (d) setDate(d);
  }
  const shift = (n: number) => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() + n);
    navigate("diary", localDate(d));
  };
  if (loading)
    return (
      <main className="loading">
        <Heart size={32} />
        <p>Preparando tu diario…</p>
      </main>
    );
  if (loadError)
    return (
      <main className="loading">
        <ErrorText message={loadError} />
        <button className="primary" onClick={load}>
          Reintentar
        </button>
        <button
          className="text-button"
          onClick={async () => {
            await api("logout", "POST", {});
            setLoadError("");
            setUser(null);
          }}
        >
          Volver al acceso
        </button>
      </main>
    );
  if (!user) return <Auth onLogin={load} privacy={privacy} />;
  const tabs = [
    { id: "diary", label: "Diario", icon: BookOpen },
    { id: "calendar", label: "Calendario", icon: CalendarDays },
    { id: "evolution", label: "Evolución", icon: ChartNoAxesCombined },
    { id: "options", label: "Opciones", icon: Settings2 },
    ...(user.admin
      ? [{ id: "admin", label: "Administración", icon: ShieldCheck }]
      : []),
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="/" className="brand">
          <span className="brand-icon">
            <Heart size={21} />
          </span>
          <span>
            SimpleHealth<small>TRACKER</small>
          </span>
        </a>
        <span className="nav-label">TU ESPACIO</span>
        <nav>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={view === t.id ? "active" : ""}
              onClick={() => navigate(t.id)}
            >
              <t.icon size={20} />
              <span>{t.label}</span>
              {view === t.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="tile-icon mint">
            <Heart size={18} />
          </span>
          <p>
            Pequeños pasos.
            <br />
            <strong>Un camino que es tuyo.</strong>
          </p>
        </div>
        <div className="profile">
          <span className="avatar">
            {user.username.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong>{user.username}</strong>
            <small>Tu diario personal</small>
          </div>
          <button
            className="icon-button"
            aria-label="Cerrar sesión"
            onClick={async () => {
              if (savingDay) {
                setNotice("Espera a que termine el guardado antes de salir.");
                return;
              }
              if (dirty && !confirm("¿Salir sin guardar los cambios?")) return;
              try {
                await api("logout", "POST", {});
                setUser(null);
                setDays({});
                setDirty(false);
                setView("diary");
              } catch (e) {
                setNotice((e as Error).message);
              }
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div className="mobile-topbar">
          <a className="brand" href="/">
            <span className="brand-icon">
              <Heart size={18} />
            </span>
            <span>SimpleHealthTracker</span>
          </a>
          <span className={"save-state " + (dirty ? "pending" : "")}>
            <span className="dot green" />
            {savingDay
              ? "Guardando…"
              : dirty
                ? "Cambios pendientes"
                : days[date]
                  ? "Guardado"
                  : "Sesión activa"}
          </span>
          <button
            className="account-button"
            aria-label="Mi cuenta"
            onClick={() => navigate("options")}
          >
            {user.username.slice(0, 1).toUpperCase()}
          </button>
        </div>
        <header className="page-header">
          <div>
            <span className="eyebrow">
              {view === "diary"
                ? "CADA DATO CUENTA"
                : "TU CAMINO, CON PERSPECTIVA"}
            </span>
            <h1>
              {
                {
                  diary: "Tu día, de un vistazo",
                  calendar: "Un mes de hábitos",
                  evolution: "Tu evolución",
                  options: "A tu manera",
                  admin: "Administración",
                }[view]
              }
            </h1>
            <p>
              {view === "diary"
                ? `Hola, ${user.username}. Registra lo que importa hoy.`
                : view === "calendar"
                  ? "Revisa tus comidas y vuelve a cualquier día."
                  : view === "evolution"
                    ? "Tus mediciones y los rangos que quieres alcanzar."
                    : view === "options"
                      ? "Tu cuenta, tus objetivos y tus referencias."
                      : "Gestiona las cuentas con cuidado."}
            </p>
          </div>
          <span className="header-pill">
            <span className="dot green" />
            Tu espacio personal
          </span>
        </header>
        {view === "diary" && (
          <>
            <div className="diary-toolbar">
              <div className="date-controls">
                <button
                  className="icon-button"
                  aria-label="Día anterior"
                  onClick={() => shift(-1)}
                >
                  <ChevronLeft size={19} />
                </button>
                <input
                  aria-label="Fecha del diario"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    if (e.target.value) navigate("diary", e.target.value);
                  }}
                />
                <button
                  className="icon-button"
                  aria-label="Día siguiente"
                  onClick={() => shift(1)}
                >
                  <ChevronRight size={19} />
                </button>
                <button
                  className="text-button"
                  onClick={() => navigate("diary", localDate())}
                >
                  Hoy
                </button>
              </div>
              <span className="muted">
                {new Date(date + "T12:00:00").toLocaleDateString("es-ES", {
                  weekday: "long",
                })}
              </span>
            </div>
            <WeekStrip
              date={date}
              onDate={(d) => navigate("diary", d)}
              days={days}
            />
            <div className="quick-actions" aria-label="Registro rápido">
              <button
                onClick={() =>
                  document
                    .getElementById("food-log")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <Utensils size={16} />
                <Plus size={14} />
                Comida
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById("measurements-log")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  document
                    .querySelector<HTMLInputElement>('input[aria-label="Peso"]')
                    ?.focus({ preventScroll: true });
                }}
              >
                <Activity size={16} />
                <Plus size={14} />
                Peso
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("sleep-log")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                <Moon size={16} />
                <Plus size={14} />
                Sueño
              </button>
            </div>
            <Diary
              key={date}
              date={date}
              days={days}
              goal={user.settings.officeGoal}
              onDirty={setDirty}
              onSaving={setSavingDay}
              onSave={async (d, quiet) => {
                await api("days/" + date, "PUT", d);
                setDays((prev) => ({ ...prev, [date]: structuredClone(d) }));
                if (!quiet) setNotice("Día guardado");
              }}
              onDelete={async () => {
                await api("days/" + date, "DELETE", {});
                setDays((prev) => {
                  const next = { ...prev };
                  delete next[date];
                  return next;
                });
                setNotice("Registros eliminados");
              }}
            />
          </>
        )}
        {view === "calendar" && (
          <Calendar
            days={days}
            date={date}
            onDate={(d) => navigate("diary", d)}
          />
        )}
        {view === "evolution" && (
          <Evolution
            days={days}
            settings={user.settings}
            onDiary={() => {
              navigate("diary", localDate());
              setTimeout(
                () =>
                  document
                    .getElementById("measurements-log")
                    ?.scrollIntoView({ behavior: "smooth" }),
                100,
              );
            }}
            onOptions={() => navigate("options")}
          />
        )}
        {view === "options" && (
          <Options
            user={user}
            privacy={privacy}
            onLogout={async () => {
              await api("logout", "POST", {});
              setUser(null);
              setDays({});
              setView("diary");
            }}
            onDeleted={() => {
              setUser(null);
              setDays({});
              setView("diary");
            }}
            onSave={async (s) => {
              await api("settings", "PUT", s);
              setUser({ ...user, settings: s });
              setNotice("Opciones guardadas");
            }}
          />
        )}
        {view === "admin" && user.admin && <Admin />}
        <footer>
          SimpleHealthTracker <span>·</span> A tu ritmo, día a día.
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          <Check size={18} />
          {notice}
        </div>
      )}
    </div>
  );
}

# Ruta Hacking Ético — Tracker personal

App web personal para dar seguimiento a tu plan de estudio. Login por link mágico (sin contraseña), progreso guardado en la nube (Supabase, gratis, sin tarjeta), 100% tuya e independiente de esta conversación.

---

## Paso 1 — Crear proyecto en Supabase

1. Andá a **https://supabase.com**
2. Clic en **"Start your project"** → entrá con GitHub o con tu correo
3. Clic en **"New project"**
4. Nombre: `hacking-etico-tracker`
5. Contraseña de base de datos: generá una y guardala (no la vas a necesitar para la app, es solo administrativa)
6. Región: elegí la más cercana (ej. `South America (São Paulo)`)
7. Plan: **Free** (ya viene seleccionado, no pide tarjeta)
8. Clic en **"Create new project"** — esperá 1-2 minutos mientras se aprovisiona

## Paso 2 — Crear la tabla de progreso

1. En el menú izquierdo, andá a **"SQL Editor"**
2. Clic en **"New query"**
3. Pegá exactamente esto:

```sql
create table progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  checklist jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table progress enable row level security;

create policy "Los usuarios ven solo su propio progreso"
on progress for select
using (auth.uid() = user_id);

create policy "Los usuarios escriben solo su propio progreso"
on progress for insert
with check (auth.uid() = user_id);

create policy "Los usuarios actualizan solo su propio progreso"
on progress for update
using (auth.uid() = user_id);
```

4. Clic en **"Run"** (o Ctrl+Enter)
5. Deberías ver "Success. No rows returned" — la tabla y las reglas de seguridad ya están creadas

Estas reglas (RLS) aseguran que **cada usuario solo puede ver y modificar su propio progreso**, nunca el de otro.

## Paso 3 — Login por link mágico

Ya viene activado por defecto en Supabase (proveedor "Email"), no necesitás hacer nada extra acá.

## Paso 4 — Conectar tu app con Supabase

1. En el menú izquierdo, andá a **"Project Settings" → "API"**
2. Vas a ver dos datos que necesitás:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga)
3. Copiá ambos valores y pegalos en el archivo **`supabase-config.js`** de este proyecto, reemplazando `TU_SUPABASE_URL` y `TU_SUPABASE_ANON_KEY`

## Paso 5 — Publicar en GitHub Pages

Igual que hiciste con tu app del Mundial:

1. Creá un repo nuevo en GitHub, por ejemplo `hacking-tracker`
2. Subí estos 5 archivos a la raíz del repo:
   - `index.html`
   - `style.css`
   - `app.js`
   - `data.js`
   - `supabase-config.js` (ya con tus datos reales)
3. En el repo: **Settings → Pages → Source: main branch, carpeta `/root`** → Guardar
4. Tu app va a quedar en: `https://TU_USUARIO.github.io/hacking-tracker/`
5. En Supabase, andá a **Authentication → URL Configuration** y agregá esa URL en **"Redirect URLs"** (ej: `https://TU_USUARIO.github.io/hacking-tracker/`) — si no hacés esto, el link mágico del correo no te va a redirigir bien de vuelta a la app.

## Paso 6 — Usarla

1. Abrís tu link de GitHub Pages
2. Escribís tu correo → clic en "Enviarme link de acceso"
3. Abrís tu correo, clic en el link que te llegó → te devuelve a la app ya logueado
4. Marcás tus avances — se guarda solo, ligado a tu cuenta
5. Podés entrar desde el celular, la laptop, donde sea, con el mismo correo

---

## Notas

- **Costo:** el plan gratuito de Supabase no pide tarjeta y cubre esto de sobra para uso personal.
- **Privacidad:** las políticas RLS del Paso 2 aseguran que solo vos podés leer/escribir tu propio progreso.
- **Editar el plan de estudio:** todo el contenido (fases y tareas) está en `data.js`.
- **Independencia total:** esta app no depende de Claude ni de esta conversación. Vive en tu GitHub y tu Supabase, para siempre.
- **El proyecto de Firebase que ya creaste** (`hacking-etico-tracker`) lo podés borrar tranquilamente desde la consola de Firebase — no lo vamos a usar.

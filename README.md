# Ruta Hacking Ético — Tracker personal

App web personal para dar seguimiento a tu plan de estudio. Login con Google, progreso guardado en la nube (Firebase), 100% tuya e independiente de esta conversación.

---

## Paso 1 — Crear proyecto en Firebase (gratis)

1. Andá a **https://console.firebase.google.com**
2. Clic en **"Agregar proyecto"**
3. Nombre: `hacking-etico-tracker` (o el que quieras)
4. Desactivá Google Analytics si te pregunta (no lo necesitás) → **Crear proyecto**

## Paso 2 — Activar autenticación con Google

1. En el menú izquierdo: **Compilación → Authentication**
2. Clic en **"Comenzar"**
3. En la pestaña **"Sign-in method"**, elegí **Google** → activalo → guardá
4. En **"Configuración"** de Authentication, agregá tu dominio de GitHub Pages en **"Dominios autorizados"** (ej: `tuusuario.github.io`) — esto lo hacés después de publicar, en el Paso 5.

## Paso 3 — Crear la base de datos (Firestore)

1. En el menú izquierdo: **Compilación → Firestore Database**
2. Clic en **"Crear base de datos"**
3. Elegí **"Modo de producción"**
4. Ubicación: cualquiera cercana (ej: `southamerica-east1` o `us-central`)
5. Andá a la pestaña **"Reglas"** y reemplazá todo por esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Esto asegura que **solo vos** (autenticado con tu cuenta de Google) podés leer o escribir tu propio progreso. Clic en **"Publicar"**.

## Paso 4 — Conectar tu app con Firebase

1. En Firebase, andá al ícono de **engranaje ⚙️ → Configuración del proyecto**
2. Bajá hasta **"Tus apps"** → clic en el ícono `</>` (Web)
3. Nombre de la app: `tracker` → **Registrar app**
4. Vas a ver un bloque de código con `firebaseConfig = { apiKey: ..., authDomain: ..., ... }`
5. Copiá esos valores y pegalos en el archivo **`firebase-config.js`** de este proyecto, reemplazando los valores de ejemplo (`TU_API_KEY`, etc.)

## Paso 5 — Publicar en GitHub Pages

Igual que hiciste con tu app del Mundial:

1. Creá un repo nuevo en GitHub, por ejemplo `hacking-tracker`
2. Subí estos 5 archivos a la raíz del repo:
   - `index.html`
   - `style.css`
   - `app.js`
   - `data.js`
   - `firebase-config.js` (ya con tus datos reales)
3. En el repo: **Settings → Pages → Source: main branch, carpeta `/root`** → Guardar
4. Tu app va a quedar en: `https://TU_USUARIO.github.io/hacking-tracker/`
5. Volvé a Firebase → Authentication → Configuración → **Dominios autorizados** → agregá `TU_USUARIO.github.io`

## Paso 6 — Usarla

1. Abrís tu link de GitHub Pages
2. Entrás con tu cuenta de Google
3. Marcás tus avances — se guarda solo, en tu Firestore, ligado a tu cuenta
4. Podés entrar desde el celular, la laptop, donde sea, con la misma cuenta de Google

---

## Notas

- **Costo:** el plan gratuito de Firebase (Spark) cubre esto de sobra — nunca vas a pagar nada con este uso.
- **Privacidad:** solo vos (con tu cuenta de Google autenticada) podés leer o escribir tu progreso, por las reglas de Firestore del Paso 3.
- **Editar el plan de estudio:** todo el contenido (fases y tareas) está en `data.js` — lo editás ahí si querés agregar o cambiar algo, sin tocar el resto del código.
- **Independencia total:** esta app no depende de Claude ni de esta conversación. Vive en tu GitHub y tu Firebase, para siempre.


#  Instrucciones de Configuración

Para poner en marcha el proyecto localmente, sigue estos pasos del 1 al 3:

1. **Instalar dependencias:**
Ejecuta el siguiente comando para instalar todos los paquetes necesarios mediante `pnpm`:
```bash
pnpm install

```


2. **Iniciar el servidor de desarrollo:**
Corre el entorno local; este proceso creará automáticamente el archivo `.env.local` en la raíz de tu proyecto:
```bash
pnpm run dev

```


3. **Configurar variables de entorno:**
Abre el archivo `.env.local` e ingresa las siguientes credenciales para la conexión con el backend de **Convex**:
```env
CONVEX_DEPLOYMENT=dev:tacit-camel-158 # team: brayan-nava, project: youtedex

NEXT_PUBLIC_CONVEX_URL=https://tacit-camel-158.convex.cloud

NEXT_PUBLIC_CONVEX_SITE_URL=https://tacit-camel-158.convex.site

```

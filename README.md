# Projecto Unidad 7

1. Iniciar y configurar proyecto de acuerdo a los campos requeridos: `npm init`

2. Instalar Express localmente: `npm install express -D`

3. Instalar Nodemon localmente para que esté actualizado el servidor con cada
cambio que se realice: `npm install nodemon -D`

4. Luego crear el archivo `index.js` con la configuración básica para levantar
el servidor.

5. Levantar servidor: `npx nodemon index.js`

6. Instalar dotenv: `npm install dotenv -D`

7. Configurar index.js con dotenv.

8. Instalar Prisma: `npm install prisma -D`

9. Iniciar Prisma con DB SQLite: `npx prisma init --datasource-provider sqlite`

10. Añadir prisma-client: `npm install @prisma/client -D`

11. Instalar Typescript como Dependencia: `npm install typescript ts-node @types/express @types/node -D`

12. Generar archivo `tsconfig.json`: `npx tsc --init`

13. Crear carpeta `src`, dentro crear la carpeta `v1`, y dentro crear la carpeta `routes`

14. Crear archivo `index.js` dentro de `/src/v1/routes` y configurar como ruta prueba.

15. Borrar ruta en el archivo `index.js` main y configurar para importar ruta desde `/src/v1/routes/index.js`.

16. Crear archivo `index.ts` dentro de carpeta `src` y copiar y pegar el código del archivo `index.ts` y modificar a typescript.

17. Crear archivo `index.ts` dentro de carpeta routes y definir código y rutas.

18. Configurar archivo `tsconfig.json`

19. Configurar archivo `package.json` y definir nuevo main el archivo `index.ts`

20. Configurar archivo `.env`

21. Instalar concurrently: `npm install concurrently -D`

22. Configurar variables en scripts dentro del archivo `package.json`

23. Ejecutar servidor: `npm run dev`

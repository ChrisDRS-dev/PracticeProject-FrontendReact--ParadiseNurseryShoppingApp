# To-do para entregar Paradise Nursery

Meta: obtener al menos **35/50 puntos (70%)**. La rúbrica no exige funciones adicionales.

## Requisitos evaluados

- [x] **Task 1 — `README.md` (2 pts):** incluir el nombre y los detalles del proyecto.
- [x] **Task 2 — `AboutUs.jsx` (1 pt):** mostrar información de la empresa.
- [x] **Task 3 — `App.css` (1 pt):** implementar la imagen de fondo de la landing page.
- [x] **Task 4 — `App.jsx` (3 pts):** mostrar el nombre de Paradise Nursery y el botón **Get Started**.
- [x] **Task 5 — `CartSlice.jsx` (4 pts):** usar un slice Redux para gestionar el carrito.
- [x] **Task 6 — `ProductList.jsx` (16 pts):**
  - [x] Mostrar al menos 6 plantas únicas por categoría.
  - [x] Usar al menos 3 categorías.
  - [x] Mostrar thumbnail, nombre y precio.
  - [x] Incluir **Add to Cart** para cada planta.
  - [x] Añadir la planta al carrito.
  - [x] Deshabilitar **Add to Cart** después de añadirla.
  - [x] Actualizar el contador del carrito dinámicamente.
  - [x] Mostrar navbar en productos y carrito, con Home, Plants y Cart.
- [x] **Task 7 — `CartItem.jsx` (23 pts):**
  - [x] Mostrar el total del carrito.
  - [x] Mostrar el subtotal de cada planta.
  - [x] Mostrar thumbnail, nombre y precio unitario.
  - [x] Permitir aumentar y disminuir cantidades.
  - [x] Incluir botón **Delete** por artículo.
  - [x] Incluir botón **Checkout** con flujo/mensaje de checkout.
  - [x] Incluir **Continue Shopping** hacia el catálogo.

## Antes de enviar en Coursera

- [x] Ejecutar `npm run build` y `npm run lint`.
- [x] Probar manualmente este recorrido: Home → Get Started → añadir planta → abrir Cart → aumentar/disminuir → Delete → Continue Shopping → Checkout.
- [ ] Confirmar que el repositorio de GitHub está actualizado y que los enlaces enviados son accesibles.
- [ ] Enviar las URLs de los siete archivos solicitados por la evaluación.
- [ ] No añadir más funcionalidades hasta entregar.

## Estado actual

- Hay **75 plantas en 4 categorías**, por encima del mínimo de 18.
- El build y el lint pasan; el build solo muestra una advertencia de tamaño del bundle.
- Las funciones extra (API, filtros, temas, idiomas y checkout interactivo) son opcionales para esta rúbrica.
- Nota: los siete archivos solicitados ahora contienen implementación visible y evaluable en sus rutas raíz. Después de hacer commit y push, usa las URLs del nuevo commit; los enlaces del intento anterior seguirán mostrando el código antiguo.

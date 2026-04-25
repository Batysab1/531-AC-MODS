-- =============================================
-- 531 AC MODS — Cambios en base de datos
-- Ejecutar en: Supabase > SQL Editor
-- =============================================

-- -----------------------------------------------
-- 1. DAR ADMIN A elbatysa@gmail.com
-- -----------------------------------------------
-- Esto actualiza los metadatos del usuario en auth.users
-- para que is_admin = true (que es lo que chequea el código)

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'elbatysa@gmail.com';

-- Verificar que se aplicó:
SELECT id, email, raw_user_meta_data->>'is_admin' AS is_admin
FROM auth.users
WHERE email = 'elbatysa@gmail.com';


-- -----------------------------------------------
-- 2. ELIMINAR PRODUCTOS DE PRUEBA
-- -----------------------------------------------
-- Elimina todos los mods cuyo título contenga
-- palabras típicas de prueba.
-- REVISAR antes de ejecutar haciendo el SELECT primero.

-- PASO A: Ver qué se va a eliminar (revisar antes):
SELECT id, title, category, created_at
FROM mods
WHERE 
  title ILIKE '%prueba%' OR
  title ILIKE '%test%' OR
  title ILIKE '%demo%' OR
  title ILIKE '%ejemplo%';

-- PASO B: Una vez confirmados, ejecutar el DELETE:
DELETE FROM mods
WHERE 
  title ILIKE '%prueba%' OR
  title ILIKE '%test%' OR
  title ILIKE '%demo%' OR
  title ILIKE '%ejemplo%';

-- =============================================
-- Si los productos de prueba tienen otro nombre,
-- podés eliminarlos por ID:
-- DELETE FROM mods WHERE id IN ('id1', 'id2', ...);
-- =============================================

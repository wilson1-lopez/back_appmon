-- ==============================================
-- Procedimiento para crear el esquema de empresa y clonar tablas base
-- ==============================================
CREATE OR REPLACE PROCEDURE public.cf_crear_schema_empresa(
  IN nombre_schema TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  tabla TEXT;
  tablas_a_copiar TEXT[] := ARRAY[
    'tr_visitas',
    'tr_residentes',
    'tr_autorizaciones'
  ];
BEGIN
  -- Crear el esquema si no existe
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', nombre_schema);

  -- Clonar las tablas base en el nuevo esquema
  FOREACH tabla IN ARRAY tablas_a_copiar
  LOOP
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I.%I (LIKE template_schema.%I INCLUDING ALL);',
      nombre_schema, tabla, tabla
    );
  END LOOP;
END;
$$;

-- ==============================================
-- Procedimiento para registrar empresa y clonar esquema
-- ==============================================
CREATE OR REPLACE PROCEDURE public.cf_registrar_empresa(
  IN _empresa_id UUID,
  IN _esquema TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Crear esquema nuevo y clonar tablas base
  CALL public.cf_crear_schema_empresa(_esquema);

  -- Registrar esquema asignado
  INSERT INTO public.cf_empresas (empresa_id, esquema)
  VALUES (_empresa_id, _esquema);
END;
$$;
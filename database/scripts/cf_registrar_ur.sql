
-- ==============================================
-- Procedimiento para crear el esquema privado y clonar tablas base para una unidad residencial
-- ==============================================
CREATE OR REPLACE PROCEDURE public.cf_crear_schema_unidad(
  IN nombre_schema TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  tabla TEXT;
  tablas_a_copiar TEXT[] := ARRAY[
    'tr_visitas',
    'tr_residentes',
    'tr_autorizaciones',
    'tr_registro_visitantes',
    'tr_reservas_areas_comunes',
    'tr_historial_apartamento',
    'tr_logs_auditoria'
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
-- Procedimiento para crear y registrar una nueva unidad residencial
-- ==============================================
CREATE OR REPLACE PROCEDURE public.cf_crear_unidad_residencial(
  IN _unidad_id UUID,
  IN _empresa_id UUID,
  IN _documento TEXT,
  IN _tipo_documento_id INT,
  IN _nombre TEXT,
  IN _esquema TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Registrar la unidad residencial
  INSERT INTO public.am_unidad_residencial (id, empresa_id, documento, tipo_documento_id, nombre)
  VALUES (_unidad_id, _empresa_id, _documento, _tipo_documento_id, _nombre);

  -- Crear esquema privado y clonar tablas base para la unidad residencial
  CALL public.cf_crear_schema_unidad(_esquema);

  -- Registrar la relación unidad-esquema
  INSERT INTO public.cf_unidades_residenciales_esquemas (unidad_residencial_id, empresa_id, esquema)
  VALUES (_unidad_id, _empresa_id, _esquema);
END;
$$;



CREATE SCHEMA IF NOT EXISTS public;
-- Esquema plantilla (para clonar tablas privadas por unidad residencial)
CREATE SCHEMA IF NOT EXISTS template_schema;
-- Países
CREATE TABLE IF NOT EXISTS am_paises (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  codigo_internacional VARCHAR(5) NOT NULL UNIQUE,
  icono_pais TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departamentos
CREATE TABLE IF NOT EXISTS am_departamentos (
  id SERIAL PRIMARY KEY,
  dane_codigo VARCHAR(5) NOT NULL UNIQUE,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  pais_id INTEGER NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_departamentos_pais FOREIGN KEY (pais_id) REFERENCES am_paises(id)
);

-- Ciudades
CREATE TABLE IF NOT EXISTS am_ciudades (
  id SERIAL PRIMARY KEY,
  dane_codigo VARCHAR(5) NOT NULL UNIQUE,
  nombre VARCHAR(60) NOT NULL,
  departamento_id INTEGER NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_ciudades_departamento FOREIGN KEY (departamento_id) REFERENCES am_departamentos(id)
);

-- Tipos de documento base (antes tipo_documento_enum)
CREATE TABLE IF NOT EXISTS am_tipos_documento_base (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de documento (por país) - Relación entre tipo base y país
CREATE TABLE IF NOT EXISTS am_tipos_documento (
  id SERIAL PRIMARY KEY,
  tipo_documento_base_id INTEGER NOT NULL,
  pais_id INTEGER NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (tipo_documento_base_id, pais_id),
  CONSTRAINT fk_tipos_documento_base FOREIGN KEY (tipo_documento_base_id) REFERENCES am_tipos_documento_base(id),
  CONSTRAINT fk_tipos_documento_pais FOREIGN KEY (pais_id) REFERENCES am_paises(id)
);

-- Tipos de compañía
CREATE TABLE IF NOT EXISTS am_tipos_compania (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de negocio (empresa, unidad_residencial)
CREATE TABLE IF NOT EXISTS am_tipos_negocio (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados de suscripción
CREATE TABLE IF NOT EXISTS am_estados_suscripcion (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unidades de cobro (ej: hora, día)
CREATE TABLE IF NOT EXISTS am_unidades_cobro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Días de la semana (para reservas, horarios)
CREATE TABLE IF NOT EXISTS am_dias_semana (
  id SMALLINT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de área común (globales o por unidad)
CREATE TABLE IF NOT EXISTS am_tipos_area_comun (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  es_global BOOLEAN DEFAULT TRUE,
  id_unidad_residencial UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de equipamiento (por unidad)
CREATE TABLE IF NOT EXISTS am_tipos_equipamiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidad_residencial UUID NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados para apartamentos
CREATE TABLE IF NOT EXISTS am_estado_apto (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de vehículo
CREATE TABLE IF NOT EXISTS am_tipos_vehiculo (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Géneros
CREATE TABLE IF NOT EXISTS am_generos (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- TABLAS MAESTRAS ADICIONALES DE APPMON
-- =====================================================

-- Confirmación (antes confirmacion_enum)
CREATE TABLE IF NOT EXISTS am_confirmacion (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de inmueble (antes tipo_inmueble_enum)
CREATE TABLE IF NOT EXISTS am_tipos_inmueble (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estado del módulo (antes module_status)
CREATE TABLE IF NOT EXISTS am_module_status (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados de contacto (antes contact_submission_estado)
CREATE TABLE IF NOT EXISTS am_contact_submission_estado (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de lead (antes tipo_lead)
CREATE TABLE IF NOT EXISTS am_tipo_lead (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Rol consejo (antes rol_consejo)
CREATE TABLE IF NOT EXISTS am_rol_consejo (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Medios de pago
CREATE TABLE IF NOT EXISTS am_medios_pago (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  icono TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de cargo para tarifas de parqueadero
CREATE TABLE IF NOT EXISTS am_tipos_cargo_tarifa (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de correspondencia
CREATE TABLE IF NOT EXISTS am_tipos_correspondencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Empresas de mensajería
CREATE TABLE IF NOT EXISTS am_empresas_mensajeria (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  logo_url TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Motivos de devolución de correspondencia
CREATE TABLE IF NOT EXISTS am_motivos_devolucion_correspondencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de minuta/reporte
CREATE TABLE IF NOT EXISTS am_tipos_minuta (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  requiere_seccion_adicional BOOLEAN DEFAULT FALSE,
  nombre_seccion_adicional TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Destinatarios de notificación para minutas
CREATE TABLE IF NOT EXISTS am_destinatarios_notificacion (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ubicaciones de incidencia para minutas
CREATE TABLE IF NOT EXISTS am_ubicaciones_incidencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados de vehículo (para tablero de vehículos)
CREATE TABLE IF NOT EXISTS am_estados_vehiculo (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados de correspondencia
CREATE TABLE IF NOT EXISTS am_estados_correspondencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color_hex TEXT, -- Para UI
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Configuración del sitio
CREATE TABLE IF NOT EXISTS am_site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'AppMon',
  site_icon_url TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enlaces sociales
CREATE TABLE IF NOT EXISTS am_social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Menu items
CREATE TABLE IF NOT EXISTS am_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  parent_id UUID,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id)
    REFERENCES am_menu_items (id)
);

-- Logs auditoría
CREATE TABLE IF NOT EXISTS am_logs_auditoria (
  id_log BIGSERIAL PRIMARY KEY,
  id VARCHAR NOT NULL,
  accion VARCHAR NOT NULL,
  datos JSONB,
  resultado VARCHAR,
  log_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  ip_origen INET,
  user_agent TEXT,
  telefono_destino VARCHAR,
  duracion_ms INTEGER,
  error_message TEXT,
  webhook_response JSONB
);


-- Empresas (solo ciudad_id, sin país_id ni departamento_id redundantes)
CREATE TABLE IF NOT EXISTS am_empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  tipo_documento_id INTEGER NOT NULL,
  documento TEXT NOT NULL,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT NOT NULL,
  correo TEXT NOT NULL,
  tipo_compania_id INTEGER NOT NULL,
  estado TEXT NOT NULL DEFAULT 'activo',
  ciudad_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_empresa_tipo_documento FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT fk_empresa_tipo_compania FOREIGN KEY (tipo_compania_id) REFERENCES am_tipos_compania(id),
  CONSTRAINT fk_empresa_ciudad FOREIGN KEY (ciudad_id) REFERENCES am_ciudades(id),
  CONSTRAINT chk_empresa_estado CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  CONSTRAINT chk_empresa_correo CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT uq_empresa_documento UNIQUE (documento, tipo_documento_id)
);

-- ALTER TABLE para agregar la relación con país
ALTER TABLE am_empresas ADD COLUMN IF NOT EXISTS pais_id INTEGER;
ALTER TABLE am_empresas ADD CONSTRAINT fk_empresa_pais FOREIGN KEY (pais_id) REFERENCES am_paises(id);

-- Unidades residenciales, transferibles entre empresas
CREATE TABLE IF NOT EXISTS am_unidad_residencial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  tipo_documento_id INTEGER NOT NULL,
  documento TEXT NOT NULL,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  ciudad_id INTEGER NOT NULL,
  telefono_administradora TEXT NOT NULL,
  telefono_soporte TEXT NOT NULL,
  correo_contacto TEXT NOT NULL,
  descripcion TEXT,
  empresa_id UUID NOT NULL,  -- FK obligatoria (una unidad siempre debe tener empresa)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_unidad_empresa FOREIGN KEY (empresa_id) REFERENCES am_empresas(id),
  CONSTRAINT fk_unidad_tipo_documento FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT fk_unidad_ciudad FOREIGN KEY (ciudad_id) REFERENCES am_ciudades(id),
  CONSTRAINT chk_correo_formato CHECK (correo_contacto ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT uq_unidad_documento UNIQUE (documento, tipo_documento_id)
);

-- ===============================================
-- TABLAS MAESTRAS PARA ÁREAS COMUNES 
-- ===============================================

-- Estados de áreas comunes
CREATE TABLE IF NOT EXISTS am_estados_area_comun (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color_hex VARCHAR(7),
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados de reservas de áreas comunes
CREATE TABLE IF NOT EXISTS am_estados_reserva_area_comun (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  color_hex VARCHAR(7),
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Métodos de pago para reservas de áreas comunes
CREATE TABLE IF NOT EXISTS am_metodos_pago_reservas (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Relación unidad-esquema privado (multi-tenant)
CREATE TABLE IF NOT EXISTS cf_unidades_residenciales_esquemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL,
  esquema TEXT NOT NULL,
  creado_en TIMESTAMPTZ DEFAULT now(),
  UNIQUE (unidad_residencial_id, esquema),
  CONSTRAINT fk_ur_esquema_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id)
);

-- Catálogo global de personas
CREATE TABLE IF NOT EXISTS am_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_documento_id INTEGER NOT NULL,
  documento TEXT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  genero_id INTEGER NOT NULL,
  correo TEXT UNIQUE,
  telefono TEXT,
  unidad_residencial_id UUID,
  foto_url TEXT, -- SOLO AQUÍ la foto
  fecha_nacimiento DATE,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_personas_tipo_doc FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT fk_personas_genero FOREIGN KEY (genero_id) REFERENCES am_generos(id),
  CONSTRAINT fk_personas_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id),
  CONSTRAINT chk_personas_correo CHECK (correo IS NULL OR correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_personas_fecha_nacimiento CHECK (fecha_nacimiento IS NULL OR fecha_nacimiento <= CURRENT_DATE),
  CONSTRAINT uq_personas_documento_tipo UNIQUE (documento, tipo_documento_id, unidad_residencial_id)
);

-- Catálogo global de visitantes
CREATE TABLE IF NOT EXISTS am_visitantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documento TEXT NOT NULL,
  nombre TEXT NOT NULL,
  observaciones TEXT,
  unidad_residencial_id UUID,
  tipo_documento_id INTEGER NOT NULL,
  foto_url TEXT, -- SOLO AQUÍ la foto
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_visitantes_tipo_doc FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT fk_visitantes_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id)
);


-- Usuarios globales (SuperAdmin)
CREATE TABLE IF NOT EXISTS cf_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT,
  correo TEXT UNIQUE NOT NULL,
  usuario TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  ultimo_acceso TIMESTAMPTZ,
  intentos_fallidos INTEGER DEFAULT 0,
  bloqueado_hasta TIMESTAMPTZ,
  creado_en TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_usuarios_correo CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT chk_usuarios_intentos CHECK (intentos_fallidos >= 0 AND intentos_fallidos <= 10)
);

-- Roles globales (con tipo_negocio)
CREATE TABLE IF NOT EXISTS cf_roles (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  tipo_negocio_id INTEGER NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_rol_tipo_negocio FOREIGN KEY (tipo_negocio_id) REFERENCES am_tipos_negocio(id)
);

-- Funcionalidades globales
CREATE TABLE IF NOT EXISTS cf_funcionalidades (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Usuarios de empresa (contexto empresa)
CREATE TABLE IF NOT EXISTS cf_usuario_empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  fecha_asignacion TIMESTAMPTZ DEFAULT now(),
  fecha_desactivacion TIMESTAMPTZ,
  asignado_por UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user_emp_usuario FOREIGN KEY (usuario_id) REFERENCES cf_usuarios(id),
  CONSTRAINT fk_user_emp_empresa FOREIGN KEY (empresa_id) REFERENCES am_empresas(id),
  CONSTRAINT fk_user_emp_asignado_por FOREIGN KEY (asignado_por) REFERENCES cf_usuarios(id),
  CONSTRAINT uq_usuario_empresa UNIQUE (usuario_id, empresa_id)
);

-- Usuarios de unidad residencial (contexto unidad)
CREATE TABLE IF NOT EXISTS cf_usuario_unidad_residencial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL,
  unidad_residencial_id UUID NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  fecha_asignacion TIMESTAMPTZ DEFAULT now(),
  fecha_desactivacion TIMESTAMPTZ,
  asignado_por UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user_ur_usuario FOREIGN KEY (usuario_id) REFERENCES cf_usuarios(id),
  CONSTRAINT fk_user_ur_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id),
  CONSTRAINT fk_user_ur_asignado_por FOREIGN KEY (asignado_por) REFERENCES cf_usuarios(id),
  CONSTRAINT uq_usuario_unidad UNIQUE (usuario_id, unidad_residencial_id)
);

-- Roles por usuario-empresa (permite múltiples roles)
CREATE TABLE IF NOT EXISTS cf_usuario_empresa_roles (
  usuario_empresa_id UUID NOT NULL,
  rol_id INTEGER NOT NULL,
  asignado_en TIMESTAMPTZ DEFAULT now(),
  asignado_por UUID,
  activo BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (usuario_empresa_id, rol_id),
  CONSTRAINT fk_uer_usuario_empresa FOREIGN KEY (usuario_empresa_id) REFERENCES cf_usuario_empresa(id) ON DELETE CASCADE,
  CONSTRAINT fk_uer_rol FOREIGN KEY (rol_id) REFERENCES cf_roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_uer_asignado_por FOREIGN KEY (asignado_por) REFERENCES cf_usuarios(id)
);

-- Roles por usuario-unidad (permite múltiples roles)
CREATE TABLE IF NOT EXISTS cf_usuario_unidad_roles (
  usuario_unidad_id UUID NOT NULL,
  rol_id INTEGER NOT NULL,
  asignado_en TIMESTAMPTZ DEFAULT now(),
  asignado_por UUID,
  activo BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (usuario_unidad_id, rol_id),
  CONSTRAINT fk_uur_usuario_unidad FOREIGN KEY (usuario_unidad_id) REFERENCES cf_usuario_unidad_residencial(id) ON DELETE CASCADE,
  CONSTRAINT fk_uur_rol FOREIGN KEY (rol_id) REFERENCES cf_roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_uur_asignado_por FOREIGN KEY (asignado_por) REFERENCES cf_usuarios(id)
);

-- Permisos por rol y funcionalidad
CREATE TABLE IF NOT EXISTS cf_permisos (
  id SERIAL PRIMARY KEY,
  rol_id INTEGER NOT NULL,
  funcionalidad_id INTEGER NOT NULL,
  puede_ver BOOLEAN DEFAULT FALSE,
  puede_crear BOOLEAN DEFAULT FALSE,
  puede_editar BOOLEAN DEFAULT FALSE,
  puede_eliminar BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_permiso_rol FOREIGN KEY (rol_id) REFERENCES cf_roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_permiso_funcionalidad FOREIGN KEY (funcionalidad_id) REFERENCES cf_funcionalidades(id) ON DELETE CASCADE,
  CONSTRAINT uq_permiso UNIQUE (rol_id, funcionalidad_id)
);

-- Torres/Bloques
CREATE TABLE IF NOT EXISTS am_torre_bloque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  unidad_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_torre_unidad FOREIGN KEY (unidad_id) REFERENCES am_unidad_residencial(id)
);

-- Apartamentos
CREATE TABLE IF NOT EXISTS am_apto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_bloque_id UUID NOT NULL,
  numero_apto TEXT NOT NULL,
  nro_parqueadero TEXT,
  coeficiente NUMERIC(10,6) CHECK (coeficiente > 0 AND coeficiente <= 1),  -- Coeficiente de participación (0 < coef <= 1)
  area_privada NUMERIC(10,2) CHECK (area_privada > 0),  -- Área en metros cuadrados
  valor_avaluo NUMERIC(15,2) CHECK (valor_avaluo >= 0),  -- Valor del avalúo
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  estado_id INTEGER NOT NULL,
  CONSTRAINT fk_apto_torre_bloque FOREIGN KEY (torre_bloque_id) REFERENCES am_torre_bloque(id),
  CONSTRAINT fk_apto_estado FOREIGN KEY (estado_id) REFERENCES am_estado_apto(id),
  CONSTRAINT uq_apto_numero_torre UNIQUE (torre_bloque_id, numero_apto)
);

-- Propietarios x apartamento
CREATE TABLE IF NOT EXISTS am_propietarios_x_apto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartamento_id UUID NOT NULL,
  propietario_id UUID NOT NULL,
  es_residente BOOLEAN DEFAULT FALSE,
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_prop_x_apto_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id),
  CONSTRAINT fk_prop_x_apto_persona FOREIGN KEY (propietario_id) REFERENCES am_personas(id),
  CONSTRAINT uq_propietario_apto_activo UNIQUE (apartamento_id, propietario_id)
);

-- Residentes x apartamento
CREATE TABLE IF NOT EXISTS am_residentes_x_apto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartamento_id UUID NOT NULL,
  residente_id UUID NOT NULL,
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  es_principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_res_x_apto_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id),
  CONSTRAINT fk_res_x_apto_persona FOREIGN KEY (residente_id) REFERENCES am_personas(id),
  CONSTRAINT uq_residente_apto_activo UNIQUE (apartamento_id, residente_id)
);

-- Vehículos x apartamento
CREATE TABLE IF NOT EXISTS am_vehiculos_x_apto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartamento_id UUID NOT NULL,
  tipo_id INTEGER NOT NULL,
  placa TEXT,
  otro_tipo_descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_vehiculos_x_apto_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id),
  CONSTRAINT fk_vehiculos_tipo FOREIGN KEY (tipo_id) REFERENCES am_tipos_vehiculo(id)
);

-- Consejo de administración
CREATE TABLE IF NOT EXISTS am_consejo_administracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL,
  year INTEGER NOT NULL,
  persona_id UUID NOT NULL,
  apto_id UUID NOT NULL,
  rol_id INTEGER NOT NULL, -- FK a am_rol_consejo
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_consejo_unidad FOREIGN KEY (unidad_residencial_id)
    REFERENCES am_unidad_residencial (id),
  CONSTRAINT fk_consejo_persona FOREIGN KEY (persona_id)
    REFERENCES am_personas (id),
  CONSTRAINT fk_consejo_apto FOREIGN KEY (apto_id)
    REFERENCES am_apto (id),
  CONSTRAINT fk_consejo_rol FOREIGN KEY (rol_id)
    REFERENCES am_rol_consejo (id)
);

-- Áreas comunes
CREATE TABLE IF NOT EXISTS am_areas_comunes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_unidad_residencial UUID NOT NULL,
  id_tipo_area UUID NOT NULL,
  nombre_area TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL DEFAULT 'borrador',
  costo NUMERIC NOT NULL DEFAULT 0,
  id_unidad_cobro UUID,
  duracion_min_reserva_valor INTEGER,
  duracion_min_reserva_unidad TEXT,
  duracion_max_reserva_valor INTEGER,
  duracion_max_reserva_unidad TEXT,
  capacidad_maxima INTEGER,
  antelacion_reserva_valor INTEGER,
  antelacion_reserva_unidad TEXT,
  politicas_uso TEXT,
  requiere_aprobacion BOOLEAN DEFAULT FALSE,
  emails_notificacion TEXT[],
  user_created UUID,
  user_updated UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_areas_comunes_unidad FOREIGN KEY (id_unidad_residencial) REFERENCES am_unidad_residencial(id),
  CONSTRAINT fk_areas_comunes_tipo_area FOREIGN KEY (id_tipo_area) REFERENCES am_tipos_area_comun(id),
  CONSTRAINT fk_areas_comunes_unidad_cobro FOREIGN KEY (id_unidad_cobro) REFERENCES am_unidades_cobro(id)
);

-- Equipamiento de áreas comunes
CREATE TABLE IF NOT EXISTS am_area_comun_equipamientos (
  id_area_comun UUID NOT NULL,
  id_tipo_equipamiento UUID NOT NULL,
  cantidad INTEGER DEFAULT 1,
  PRIMARY KEY (id_area_comun, id_tipo_equipamiento),
  CONSTRAINT fk_ac_equip_area FOREIGN KEY (id_area_comun) REFERENCES am_areas_comunes(id),
  CONSTRAINT fk_ac_equip_tipo FOREIGN KEY (id_tipo_equipamiento) REFERENCES am_tipos_equipamiento(id)
);

-- Fotos de área común
CREATE TABLE IF NOT EXISTS am_fotos_area_comun (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_area_comun UUID NOT NULL,
  url_foto TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_fotos_area_comun_area FOREIGN KEY (id_area_comun) REFERENCES am_areas_comunes(id)
);

-- Horarios de disponibilidad por área común
CREATE TABLE IF NOT EXISTS am_horarios_disponibilidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_area_comun UUID NOT NULL,
  id_dia_semana SMALLINT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  cerrado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_horarios_area_comun FOREIGN KEY (id_area_comun) REFERENCES am_areas_comunes(id),
  CONSTRAINT fk_horarios_dia FOREIGN KEY (id_dia_semana) REFERENCES am_dias_semana(id)
);

-- Índices para optimizar consultas de usuarios y contextos
CREATE INDEX IF NOT EXISTS idx_usuario_empresa_usuario ON cf_usuario_empresa(usuario_id) WHERE estado = TRUE;
CREATE INDEX IF NOT EXISTS idx_usuario_empresa_empresa ON cf_usuario_empresa(empresa_id) WHERE estado = TRUE;
CREATE INDEX IF NOT EXISTS idx_usuario_unidad_usuario ON cf_usuario_unidad_residencial(usuario_id) WHERE estado = TRUE;
CREATE INDEX IF NOT EXISTS idx_usuario_unidad_unidad ON cf_usuario_unidad_residencial(unidad_residencial_id) WHERE estado = TRUE;
CREATE INDEX IF NOT EXISTS idx_usuario_empresa_roles_activo ON cf_usuario_empresa_roles(usuario_empresa_id) WHERE activo = TRUE;
CREATE INDEX IF NOT EXISTS idx_usuario_unidad_roles_activo ON cf_usuario_unidad_roles(usuario_unidad_id) WHERE activo = TRUE;

-- Índices adicionales para optimizar consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_personas_unidad_documento ON am_personas(unidad_residencial_id, documento) WHERE estado = TRUE;
CREATE INDEX IF NOT EXISTS idx_personas_documento_tipo ON am_personas(documento, tipo_documento_id) WHERE estado = TRUE;
CREATE INDEX IF NOT EXISTS idx_visitantes_documento ON am_visitantes(documento, unidad_residencial_id);
CREATE INDEX IF NOT EXISTS idx_visitantes_nombre ON am_visitantes(nombre) WHERE unidad_residencial_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_empresas_estado ON am_empresas(estado, ciudad_id);
CREATE INDEX IF NOT EXISTS idx_unidades_empresa ON am_unidad_residencial(empresa_id) WHERE empresa_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_apartamentos_torre ON am_apto(torre_bloque_id, estado_id);
CREATE INDEX IF NOT EXISTS idx_propietarios_apto_activo ON am_propietarios_x_apto(apartamento_id) WHERE fecha_fin IS NULL;
CREATE INDEX IF NOT EXISTS idx_residentes_apto_activo ON am_residentes_x_apto(apartamento_id) WHERE fecha_fin IS NULL;
CREATE INDEX IF NOT EXISTS idx_areas_comunes_unidad_estado ON am_areas_comunes(id_unidad_residencial, estado);

-- Validaciones adicionales para asegurar coherencia de roles por tipo de negocio
-- Estas validaciones se pueden implementar mediante triggers o funciones
-- Por ahora se documentan como comentarios para implementación posterior

-- NOTA: Implementar validación para asegurar que los roles asignados en cf_usuario_empresa_roles
-- correspondan a roles con tipo_negocio = 'empresa'
-- NOTA: Implementar validación para asegurar que los roles asignados en cf_usuario_unidad_roles
-- correspondan a roles con tipo_negocio = 'unidad_residencial'

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar automáticamente updated_at en tablas principales
CREATE TRIGGER update_am_paises_updated_at BEFORE UPDATE ON am_paises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_departamentos_updated_at BEFORE UPDATE ON am_departamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_ciudades_updated_at BEFORE UPDATE ON am_ciudades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_documento_updated_at BEFORE UPDATE ON am_tipos_documento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_compania_updated_at BEFORE UPDATE ON am_tipos_compania FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_negocio_updated_at BEFORE UPDATE ON am_tipos_negocio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_estados_suscripcion_updated_at BEFORE UPDATE ON am_estados_suscripcion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_dias_semana_updated_at BEFORE UPDATE ON am_dias_semana FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_estado_apto_updated_at BEFORE UPDATE ON am_estado_apto FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_vehiculo_updated_at BEFORE UPDATE ON am_tipos_vehiculo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_generos_updated_at BEFORE UPDATE ON am_generos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cf_roles_updated_at BEFORE UPDATE ON cf_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cf_funcionalidades_updated_at BEFORE UPDATE ON cf_funcionalidades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_empresas_updated_at BEFORE UPDATE ON am_empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_unidad_residencial_updated_at BEFORE UPDATE ON am_unidad_residencial FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_personas_updated_at BEFORE UPDATE ON am_personas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_visitantes_updated_at BEFORE UPDATE ON am_visitantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cf_usuarios_updated_at BEFORE UPDATE ON cf_usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cf_usuario_empresa_updated_at BEFORE UPDATE ON cf_usuario_empresa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cf_usuario_unidad_updated_at BEFORE UPDATE ON cf_usuario_unidad_residencial FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_apto_updated_at BEFORE UPDATE ON am_apto FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_areas_comunes_updated_at BEFORE UPDATE ON am_areas_comunes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para tablas de áreas comunes
CREATE TRIGGER update_am_estados_area_comun_updated_at BEFORE UPDATE ON am_estados_area_comun FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_estados_reserva_area_comun_updated_at BEFORE UPDATE ON am_estados_reserva_area_comun FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_metodos_pago_reservas_updated_at BEFORE UPDATE ON am_metodos_pago_reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para nuevas tablas de AppMon
CREATE TRIGGER update_am_confirmacion_updated_at BEFORE UPDATE ON am_confirmacion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_inmueble_updated_at BEFORE UPDATE ON am_tipos_inmueble FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_documento_base_updated_at BEFORE UPDATE ON am_tipos_documento_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_module_status_updated_at BEFORE UPDATE ON am_module_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_contact_submission_estado_updated_at BEFORE UPDATE ON am_contact_submission_estado FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipo_lead_updated_at BEFORE UPDATE ON am_tipo_lead FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_rol_consejo_updated_at BEFORE UPDATE ON am_rol_consejo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_consejo_administracion_updated_at BEFORE UPDATE ON am_consejo_administracion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_site_config_updated_at BEFORE UPDATE ON am_site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_social_links_updated_at BEFORE UPDATE ON am_social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_menu_items_updated_at BEFORE UPDATE ON am_menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Drop existing triggers to avoid conflicts when re-running the script
DROP TRIGGER IF EXISTS update_am_medios_pago_updated_at ON am_medios_pago;
DROP TRIGGER IF EXISTS update_am_tipos_cargo_tarifa_updated_at ON am_tipos_cargo_tarifa;
DROP TRIGGER IF EXISTS update_am_tipos_correspondencia_updated_at ON am_tipos_correspondencia;
DROP TRIGGER IF EXISTS update_am_empresas_mensajeria_updated_at ON am_empresas_mensajeria;
DROP TRIGGER IF EXISTS update_am_motivos_devolucion_correspondencia_updated_at ON am_motivos_devolucion_correspondencia;
DROP TRIGGER IF EXISTS update_am_tipos_minuta_updated_at ON am_tipos_minuta;
DROP TRIGGER IF EXISTS update_am_destinatarios_notificacion_updated_at ON am_destinatarios_notificacion;
DROP TRIGGER IF EXISTS update_am_ubicaciones_incidencia_updated_at ON am_ubicaciones_incidencia;
DROP TRIGGER IF EXISTS update_am_estados_vehiculo_updated_at ON am_estados_vehiculo;
DROP TRIGGER IF EXISTS update_am_estados_correspondencia_updated_at ON am_estados_correspondencia;
DROP TRIGGER IF EXISTS update_am_visitantes_updated_at ON am_visitantes;

-- Create/recreate triggers for tables with potential conflicts
CREATE TRIGGER update_am_medios_pago_updated_at BEFORE UPDATE ON am_medios_pago FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_cargo_tarifa_updated_at BEFORE UPDATE ON am_tipos_cargo_tarifa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para nuevas tablas maestras
CREATE TRIGGER update_am_tipos_correspondencia_updated_at BEFORE UPDATE ON am_tipos_correspondencia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_empresas_mensajeria_updated_at BEFORE UPDATE ON am_empresas_mensajeria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_motivos_devolucion_correspondencia_updated_at BEFORE UPDATE ON am_motivos_devolucion_correspondencia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_tipos_minuta_updated_at BEFORE UPDATE ON am_tipos_minuta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_destinatarios_notificacion_updated_at BEFORE UPDATE ON am_destinatarios_notificacion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_ubicaciones_incidencia_updated_at BEFORE UPDATE ON am_ubicaciones_incidencia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_estados_vehiculo_updated_at BEFORE UPDATE ON am_estados_vehiculo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_estados_correspondencia_updated_at BEFORE UPDATE ON am_estados_correspondencia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_am_visitantes_updated_at BEFORE UPDATE ON am_visitantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vista para consultar contextos de usuario de forma sencilla
CREATE OR REPLACE VIEW vw_usuario_contextos AS
SELECT 
    u.id as usuario_id,
    u.nombre || ' ' || COALESCE(u.apellido, '') as nombre_completo,
    u.correo,
    u.usuario,
    'empresa' as tipo_contexto,
    e.id as contexto_id,
    e.nombre as contexto_nombre,
    e.documento as contexto_documento,
    ARRAY_AGG(DISTINCT r.nombre) as roles,
    ue.estado as contexto_activo,
    ue.fecha_asignacion
FROM cf_usuarios u
JOIN cf_usuario_empresa ue ON u.id = ue.usuario_id
JOIN am_empresas e ON ue.empresa_id = e.id
JOIN cf_usuario_empresa_roles uer ON ue.id = uer.usuario_empresa_id
JOIN cf_roles r ON uer.rol_id = r.id
WHERE u.estado = TRUE 
    AND ue.estado = TRUE 
    AND uer.activo = TRUE 
    AND r.estado = TRUE
GROUP BY u.id, u.nombre, u.apellido, u.correo, u.usuario, e.id, e.nombre, e.documento, ue.estado, ue.fecha_asignacion

UNION ALL

SELECT 
    u.id as usuario_id,
    u.nombre || ' ' || COALESCE(u.apellido, '') as nombre_completo,
    u.correo,
    u.usuario,
    'unidad_residencial' as tipo_contexto,
    ur.id as contexto_id,
    ur.nombre as contexto_nombre,
    ur.documento as contexto_documento,
    ARRAY_AGG(DISTINCT r.nombre) as roles,
    uur.estado as contexto_activo,
    uur.fecha_asignacion
FROM cf_usuarios u
JOIN cf_usuario_unidad_residencial uur ON u.id = uur.usuario_id
JOIN am_unidad_residencial ur ON uur.unidad_residencial_id = ur.id
JOIN cf_usuario_unidad_roles uurr ON uur.id = uurr.usuario_unidad_id
JOIN cf_roles r ON uurr.rol_id = r.id
WHERE u.estado = TRUE 
    AND uur.estado = TRUE 
    AND uurr.activo = TRUE 
    AND r.estado = TRUE
GROUP BY u.id, u.nombre, u.apellido, u.correo, u.usuario, ur.id, ur.nombre, ur.documento, uur.estado, uur.fecha_asignacion;

-- Vista para facilitar consultas de tipos de documento con información completa
CREATE OR REPLACE VIEW vw_tipos_documento AS
SELECT 
    td.id,
    tdb.codigo,
    tdb.nombre,
    p.codigo_internacional as pais_codigo,
    p.nombre as pais_nombre,
    td.pais_id,
    td.tipo_documento_base_id,
    td.estado,
    td.created_at,
    td.updated_at
FROM am_tipos_documento td
JOIN am_tipos_documento_base tdb ON td.tipo_documento_base_id = tdb.id
JOIN am_paises p ON td.pais_id = p.id
WHERE td.estado = TRUE 
    AND tdb.estado = TRUE 
    AND p.estado = TRUE;

-- Función para validar que los roles asignados correspondan al tipo de negocio correcto
CREATE OR REPLACE FUNCTION validar_rol_tipo_negocio()
RETURNS TRIGGER AS $$
DECLARE
    tipo_negocio_esperado TEXT;
    tipo_negocio_rol TEXT;
BEGIN
    -- Determinar el tipo de negocio esperado según la tabla
    IF TG_TABLE_NAME = 'cf_usuario_empresa_roles' THEN
        tipo_negocio_esperado := 'empresa';
    ELSIF TG_TABLE_NAME = 'cf_usuario_unidad_roles' THEN
        tipo_negocio_esperado := 'unidad_residencial';
    ELSE
        RAISE EXCEPTION 'Tabla no soportada: %', TG_TABLE_NAME;
    END IF;

    -- Obtener el tipo de negocio del rol
    SELECT tn.codigo INTO tipo_negocio_rol
    FROM cf_roles r
    JOIN am_tipos_negocio tn ON r.tipo_negocio_id = tn.id
    WHERE r.id = NEW.rol_id;

    -- Validar que coincidan
    IF tipo_negocio_rol != tipo_negocio_esperado THEN
        RAISE EXCEPTION 'El rol con ID % no es compatible con el tipo de negocio %. Se esperaba: %, se encontró: %', 
            NEW.rol_id, tipo_negocio_esperado, tipo_negocio_esperado, tipo_negocio_rol;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers de validación
CREATE TRIGGER trg_validar_rol_empresa 
    BEFORE INSERT OR UPDATE ON cf_usuario_empresa_roles 
    FOR EACH ROW EXECUTE FUNCTION validar_rol_tipo_negocio();

CREATE TRIGGER trg_validar_rol_unidad 
    BEFORE INSERT OR UPDATE ON cf_usuario_unidad_roles 
    FOR EACH ROW EXECUTE FUNCTION validar_rol_tipo_negocio();

-- Función para verificar si una unidad puede crear tarifas de parqueadero
CREATE OR REPLACE FUNCTION cf_puede_crear_tarifas_parqueadero(p_unidad_residencial_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    total_parqueaderos INTEGER;
BEGIN
    SELECT (parqueaderos_carros + parqueaderos_motos + parqueaderos_bicicletas)
    INTO total_parqueaderos
    FROM cf_configuracion_unidad_residencial
    WHERE unidad_residencial_id = p_unidad_residencial_id;
    
    RETURN COALESCE(total_parqueaderos, 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de parqueaderos por unidad
CREATE OR REPLACE FUNCTION cf_estadisticas_parqueaderos(p_unidad_residencial_id UUID)
RETURNS TABLE(
    total_parqueaderos INTEGER,
    carros INTEGER,
    motos INTEGER,
    bicicletas INTEGER,
    tarifas_activas INTEGER,
    puede_crear_tarifas BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(c.parqueaderos_carros + c.parqueaderos_motos + c.parqueaderos_bicicletas, 0) as total_parqueaderos,
        COALESCE(c.parqueaderos_carros, 0) as carros,
        COALESCE(c.parqueaderos_motos, 0) as motos,
        COALESCE(c.parqueaderos_bicicletas, 0) as bicicletas,
        COALESCE(COUNT(t.id), 0)::INTEGER as tarifas_activas,
        cf_puede_crear_tarifas_parqueadero(p_unidad_residencial_id) as puede_crear_tarifas
    FROM cf_configuracion_unidad_residencial c
    LEFT JOIN cf_tarifas_parqueadero t ON c.unidad_residencial_id = t.unidad_residencial_id 
        AND t.activa = TRUE 
        AND (t.fecha_vigencia_fin IS NULL OR t.fecha_vigencia_fin > now())
    WHERE c.unidad_residencial_id = p_unidad_residencial_id
    GROUP BY c.parqueaderos_carros, c.parqueaderos_motos, c.parqueaderos_bicicletas;
END;
$$ LANGUAGE plpgsql;

-- Planes de suscripción (con storage, visible, activo)
CREATE TABLE IF NOT EXISTS am_pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  is_popular TEXT,
  button_text TEXT,
  button_url TEXT,
  order_index INTEGER NOT NULL,
  price_anual TEXT,
  descuento INTEGER DEFAULT 0,
  tipo_negocio_id INTEGER NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  activo BOOLEAN DEFAULT TRUE,
  storage_mb_empresa INTEGER DEFAULT 0,
  storage_mb_unidad INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_plan_tipo_negocio FOREIGN KEY (tipo_negocio_id) REFERENCES am_tipos_negocio(id)
);


-- Suscripción de empresas
CREATE TABLE IF NOT EXISTS am_empresa_plan_suscripcion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  estado_id INTEGER NOT NULL,
  es_actual BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_empresa_plan_empresa FOREIGN KEY (empresa_id) REFERENCES am_empresas(id),
  CONSTRAINT fk_empresa_plan_plan FOREIGN KEY (plan_id) REFERENCES am_pricing_plans(id),
  CONSTRAINT fk_empresa_plan_estado FOREIGN KEY (estado_id) REFERENCES am_estados_suscripcion(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_empresa_plan_actual
ON am_empresa_plan_suscripcion (empresa_id)
WHERE es_actual = TRUE;

-- Suscripción de unidades
CREATE TABLE IF NOT EXISTS am_unidad_plan_suscripcion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  estado_id INTEGER NOT NULL,
  es_actual BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_unidad_plan_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id),
  CONSTRAINT fk_unidad_plan_plan FOREIGN KEY (plan_id) REFERENCES am_pricing_plans(id),
  CONSTRAINT fk_unidad_plan_estado FOREIGN KEY (estado_id) REFERENCES am_estados_suscripcion(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_unidad_plan_actual
ON am_unidad_plan_suscripcion (unidad_residencial_id)
WHERE es_actual = TRUE;

-- Features de planes
CREATE TABLE IF NOT EXISTS am_plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL,
  feature_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_plan_feature_plan FOREIGN KEY (plan_id) REFERENCES am_pricing_plans(id)
);

-- Trigger para am_plan_features
CREATE TRIGGER update_am_plan_features_updated_at BEFORE UPDATE ON am_plan_features FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- Registro de visitantes (transaccional, ahora sin foto_url)
CREATE TABLE IF NOT EXISTS template_schema.tr_registro_visitantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_ingreso DATE NOT NULL,
  hora_ingreso TIME NOT NULL,
  hora_salida TIME,
  documento TEXT NOT NULL,
  nombre_visitante TEXT NOT NULL,
  torre_bloque_id UUID,
  apartamento_id UUID,
  visitante_id UUID NOT NULL,
  estado TEXT NOT NULL DEFAULT 'ingreso',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  unidad_residencial_id UUID NOT NULL,
  usuario_id UUID,
  fecha_salida DATE,
  confirmacion TEXT NOT NULL DEFAULT 'Pendiente',
  fecha_confirmacion DATE,
  hora_confirmacion TIME,
  usuario_quien_confirma TEXT,
  tipo_documento_id INTEGER NOT NULL,
  es_domiciliario BOOLEAN DEFAULT FALSE,
  empresa_domicilio_id UUID,
  CONSTRAINT fk_reg_vis_torre FOREIGN KEY (torre_bloque_id) REFERENCES am_torre_bloque(id),
  CONSTRAINT fk_reg_vis_empresa_dom FOREIGN KEY (empresa_domicilio_id) REFERENCES am_empresas(id),
  CONSTRAINT fk_reg_vis_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id),
  CONSTRAINT fk_reg_vis_visitante FOREIGN KEY (visitante_id) REFERENCES am_visitantes(id),
  CONSTRAINT fk_reg_vis_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id),
  CONSTRAINT fk_reg_vis_tipo_doc FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id)
);

-- Reservas de áreas comunes (transaccional, puede ir en el esquema privado)
-- Aquí lo dejamos global, pero podrías moverlo a los schemas privados si quieres
CREATE TABLE IF NOT EXISTS template_schema.tr_reservas_areas_comunes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_comun_id UUID NOT NULL,
  usuario_id UUID NOT NULL,
  fecha_reserva DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  comentarios TEXT,
  creado_en TIMESTAMPTZ DEFAULT now(),
  actualizado_en TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_reservas_area_comun FOREIGN KEY (area_comun_id) REFERENCES am_areas_comunes(id)
);

-- Historial/hoja de vida del apartamento (eventos relevantes)
CREATE TABLE IF NOT EXISTS template_schema.tr_historial_apartamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartamento_id UUID NOT NULL,
  tipo_evento TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_evento TIMESTAMPTZ DEFAULT now(),
  usuario_id UUID,
  imagen_url TEXT,
  datos_extra JSONB,
  creado_en TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_historial_apto_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id)
);

-- Logs de auditoría de acciones
CREATE TABLE IF NOT EXISTS template_schema.tr_logs_auditoria (
  id_log UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  usuario_id UUID,
  tabla_afectada TEXT,
  id_registro TEXT,
  accion TEXT NOT NULL,
  datos_antes JSONB,
  datos_despues JSONB,
  resultado TEXT,
  ip_origen INET,
  descripcion TEXT,
  tipo_evento TEXT
);

-- Procedimiento para crear el schema privado y clonar tablas base
CREATE OR REPLACE PROCEDURE cf_crear_schema_unidad(
  IN nombre_schema TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  tabla TEXT;
  tablas_a_copiar TEXT[] := ARRAY[
    'tr_registro_visitantes',
    'tr_historial_apartamento',
    'tr_reservas_areas_comunes',
    'tr_logs_auditoria',
    'tr_registro_vehiculos',
    'tr_cobros_parqueadero',
    'tr_correspondencia',
    'tr_devoluciones_correspondencia',
    'tr_minutas',
    'tr_minutas_evidencias'
  ];
BEGIN
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', nombre_schema);

  FOREACH tabla IN ARRAY tablas_a_copiar
  LOOP
    BEGIN
      EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I.%I (LIKE template_schema.%I INCLUDING ALL);',
        nombre_schema, tabla, tabla
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'No se pudo crear la tabla: %', tabla;
    END;
  END LOOP;
END;
$$;

-- Catálogo centralizado de archivos cargados a la plataforma (imágenes, documentos, evidencias, etc.)
-- Permite controlar el consumo de almacenamiento por empresa o unidad residencial,
-- auditar archivos, y categorizar por tipo.

CREATE TABLE IF NOT EXISTS am_archivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_tipo TEXT NOT NULL CHECK (entidad_tipo IN ('empresa', 'unidad_residencial')),
  entidad_id UUID NOT NULL,
  categoria TEXT NOT NULL,  -- Ej: 'foto_visitante', 'contrato', 'respaldo', 'evidencia_mantenimiento'
  url TEXT NOT NULL,
  peso_mb NUMERIC NOT NULL,  -- Tamaño en megabytes
  subido_por UUID,           -- Usuario que subió el archivo
  fecha_subida TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_archivos_entidad_categoria
  ON am_archivos (entidad_tipo, entidad_id, categoria);

CREATE INDEX IF NOT EXISTS idx_archivos_fecha
  ON am_archivos (fecha_subida);


-- Tabla para gestionar procesos de carga masiva de datos
CREATE TABLE IF NOT EXISTS am_carga_masiva_procesos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL,
  usuario_id UUID NOT NULL,
  tipo_carga TEXT NOT NULL CHECK (tipo_carga IN ('por_secciones', 'documento_completo')),
  seccion_actual TEXT CHECK (seccion_actual IN ('estructura', 'propietarios', 'residentes', 'vehiculos')),
  archivo_url TEXT NOT NULL,
  archivo_nombre TEXT NOT NULL,
  archivo_tamano_mb NUMERIC NOT NULL,
  estado TEXT NOT NULL DEFAULT 'subido' CHECK (estado IN ('subido', 'procesando', 'validando', 'completado', 'error', 'cancelado')),
  fecha_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  registros_totales INTEGER DEFAULT 0,
  registros_procesados INTEGER DEFAULT 0,
  registros_exitosos INTEGER DEFAULT 0,
  registros_fallidos INTEGER DEFAULT 0,
  errores_validacion JSONB,  -- Almacena errores de validación estructurados
  metadatos_archivo JSONB,   -- Información adicional del archivo (headers, formato, etc.)
  resultado_procesamiento JSONB,  -- Resultado detallado del procesamiento
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_carga_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id),
  CONSTRAINT fk_carga_usuario FOREIGN KEY (usuario_id) REFERENCES cf_usuarios(id)
);

-- Tabla de detalle para errores específicos por fila durante la carga masiva
CREATE TABLE IF NOT EXISTS am_carga_masiva_errores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proceso_id UUID NOT NULL,
  numero_fila INTEGER NOT NULL,
  columna TEXT,
  valor_original TEXT,
  tipo_error TEXT NOT NULL,  -- 'validacion', 'formato', 'referencia', 'duplicado'
  mensaje_error TEXT NOT NULL,
  sugerencia TEXT,  -- Sugerencia de corrección
  es_critico BOOLEAN DEFAULT TRUE,  -- Si bloquea el procesamiento
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_error_proceso FOREIGN KEY (proceso_id) REFERENCES am_carga_masiva_procesos(id) ON DELETE CASCADE
);

-- Índices para optimizar consultas de carga masiva
CREATE INDEX IF NOT EXISTS idx_carga_masiva_unidad_estado 
  ON am_carga_masiva_procesos(unidad_residencial_id, estado);

CREATE INDEX IF NOT EXISTS idx_carga_masiva_fecha 
  ON am_carga_masiva_procesos(fecha_inicio);

CREATE INDEX IF NOT EXISTS idx_carga_errores_proceso 
  ON am_carga_masiva_errores(proceso_id, es_critico);

-- Trigger para actualizar updated_at en tabla de carga masiva
CREATE TRIGGER update_am_carga_masiva_procesos_updated_at BEFORE UPDATE ON am_carga_masiva_procesos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Tabla para configuraciones específicas de cada unidad residencial
CREATE TABLE IF NOT EXISTS cf_configuracion_unidad_residencial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL UNIQUE,
  -- Configuraciones de privacidad y contacto
  mostrar_telefono_residente BOOLEAN DEFAULT FALSE,
  mostrar_correo_residente BOOLEAN DEFAULT FALSE,
  mostrar_telefono_propietario BOOLEAN DEFAULT FALSE,
  mostrar_correo_propietario BOOLEAN DEFAULT FALSE,
  -- Configuraciones de notificaciones
  notificar_nuevo_visitante BOOLEAN DEFAULT TRUE,
  notificar_vehiculo_ingreso BOOLEAN DEFAULT FALSE,
  notificar_correspondencia BOOLEAN DEFAULT TRUE,
  -- Configuraciones de acceso
  permitir_reservas_areas_comunes BOOLEAN DEFAULT TRUE,
  requiere_aprobacion_visitantes BOOLEAN DEFAULT FALSE,
  tiempo_max_visita_horas INTEGER DEFAULT 8 CHECK (tiempo_max_visita_horas > 0 AND tiempo_max_visita_horas <= 24),
  -- Configuraciones de reportes
  generar_reportes_automaticos BOOLEAN DEFAULT FALSE,
  frecuencia_reportes TEXT DEFAULT 'mensual' CHECK (frecuencia_reportes IN ('diario', 'semanal', 'mensual', 'trimestral')),
  -- Configuraciones de parqueaderos
  parqueaderos_carros INTEGER DEFAULT 0 CHECK (parqueaderos_carros >= 0),
  parqueaderos_motos INTEGER DEFAULT 0 CHECK (parqueaderos_motos >= 0),
  parqueaderos_bicicletas INTEGER DEFAULT 0 CHECK (parqueaderos_bicicletas >= 0),
  -- Configuraciones de domiciliarios
  permitir_acceso_domiciliarios BOOLEAN DEFAULT FALSE,
  modalidad_entrega_sin_acceso TEXT DEFAULT 'porteria' CHECK (modalidad_entrega_sin_acceso IN ('porteria', 'rondero')),
  -- Datos obligatorios para domiciliarios (cuando se permite acceso)
  requiere_documento_domiciliario BOOLEAN DEFAULT TRUE,
  requiere_nombre_domiciliario BOOLEAN DEFAULT TRUE,
  requiere_foto_domiciliario BOOLEAN DEFAULT TRUE,
  -- Metadatos
  configurado_por UUID,  -- Usuario que hizo la última configuración
  fecha_ultima_configuracion TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_config_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id) ON DELETE CASCADE,
  CONSTRAINT fk_config_usuario FOREIGN KEY (configurado_por) REFERENCES cf_usuarios(id)
);

-- Índice para optimizar consultas por unidad residencial
CREATE INDEX IF NOT EXISTS idx_cf_configuracion_unidad 
  ON cf_configuracion_unidad_residencial(unidad_residencial_id);

-- Trigger para actualizar updated_at en configuración
CREATE TRIGGER update_cf_configuracion_unidad_residencial_updated_at 
    BEFORE UPDATE ON cf_configuracion_unidad_residencial 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vista para consultar configuraciones de unidad residencial con información completa
CREATE OR REPLACE VIEW vw_configuracion_unidad_residencial AS
SELECT 
    c.id,
    c.unidad_residencial_id,
    ur.nombre as unidad_nombre,
    ur.documento as unidad_documento,
    -- Configuraciones de privacidad
    c.mostrar_telefono_residente,
    c.mostrar_correo_residente,
    c.mostrar_telefono_propietario,
    c.mostrar_correo_propietario,
    -- Configuraciones de notificaciones
    c.notificar_nuevo_visitante,
    c.notificar_vehiculo_ingreso,
    c.notificar_correspondencia,
    -- Configuraciones de acceso
    c.permitir_reservas_areas_comunes,
    c.requiere_aprobacion_visitantes,
    c.tiempo_max_visita_horas,
    -- Configuraciones de reportes
    c.generar_reportes_automaticos,
    c.frecuencia_reportes,
    -- Configuraciones de parqueaderos
    c.parqueaderos_carros,
    c.parqueaderos_motos,
    c.parqueaderos_bicicletas,
    (c.parqueaderos_carros + c.parqueaderos_motos + c.parqueaderos_bicicletas) as total_parqueaderos,
    -- Configuraciones de domiciliarios
    c.permitir_acceso_domiciliarios,
    c.modalidad_entrega_sin_acceso,
    c.requiere_documento_domiciliario,
    c.requiere_nombre_domiciliario,
    c.requiere_foto_domiciliario,
    -- Metadatos
    c.configurado_por,
    COALESCE(u.nombre || ' ' || u.apellido, 'Sistema') as configurado_por_nombre,
    c.fecha_ultima_configuracion,
    c.created_at,
    c.updated_at
FROM cf_configuracion_unidad_residencial c
JOIN am_unidad_residencial ur ON c.unidad_residencial_id = ur.id
LEFT JOIN cf_usuarios u ON c.configurado_por = u.id;

-- Función para crear configuración por defecto al crear una unidad residencial
CREATE OR REPLACE FUNCTION crear_configuracion_unidad_por_defecto()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear configuración por defecto para la nueva unidad residencial
    INSERT INTO cf_configuracion_unidad_residencial (
        unidad_residencial_id,
        mostrar_telefono_residente,
        mostrar_correo_residente,
        mostrar_telefono_propietario,
        mostrar_correo_propietario,
        notificar_nuevo_visitante,
        notificar_vehiculo_ingreso,
        notificar_correspondencia,
        permitir_reservas_areas_comunes,
        requiere_aprobacion_visitantes,
        tiempo_max_visita_horas,
        generar_reportes_automaticos,
        frecuencia_reportes,
        parqueaderos_carros,
        parqueaderos_motos,
        parqueaderos_bicicletas,
        permitir_acceso_domiciliarios,
        modalidad_entrega_sin_acceso,
        requiere_documento_domiciliario,
        requiere_nombre_domiciliario,
        requiere_foto_domiciliario
    ) VALUES (
        NEW.id,
        FALSE,  -- Por defecto no mostrar teléfono de residentes
        FALSE,  -- Por defecto no mostrar correo de residentes
        FALSE,  -- Por defecto no mostrar teléfono de propietarios
        FALSE,  -- Por defecto no mostrar correo de propietarios
        TRUE,   -- Notificar nuevos visitantes
        FALSE,  -- No notificar ingreso de vehículos por defecto
        TRUE,   -- Notificar correspondencia
        TRUE,   -- Permitir reservas de áreas comunes
        FALSE,  -- No requiere aprobación de visitantes por defecto
        8,      -- Máximo 8 horas de visita
        FALSE,  -- No generar reportes automáticos por defecto
        'mensual', -- Frecuencia mensual por defecto
        0,      -- Sin parqueaderos de carros configurados inicialmente
        0,      -- Sin parqueaderos de motos configurados inicialmente
        0,      -- Sin parqueaderos de bicicletas configurados inicialmente
        FALSE,  -- Por defecto no permitir acceso de domiciliarios
        'porteria', -- Por defecto entrega en portería cuando no se permite acceso
        TRUE,   -- Por defecto requerir documento del domiciliario
        TRUE,   -- Por defecto requerir nombre del domiciliario
        TRUE    -- Por defecto requerir foto del domiciliario
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear configuración automáticamente
CREATE TRIGGER trg_crear_config_unidad_por_defecto
    AFTER INSERT ON am_unidad_residencial
    FOR EACH ROW EXECUTE FUNCTION crear_configuracion_unidad_por_defecto();

-- Función para auditar cambios en configuraciones
CREATE OR REPLACE FUNCTION auditar_cambios_configuracion()
RETURNS TRIGGER AS $$
DECLARE
    campo TEXT;
    valor_ant TEXT;
    valor_nvo TEXT;
BEGIN
    -- Solo procesar si es una actualización
    IF TG_OP = 'UPDATE' THEN
        -- Revisar cada campo que haya cambiado
        IF OLD.mostrar_telefono_residente != NEW.mostrar_telefono_residente THEN
            INSERT INTO cf_historial_configuracion_unidad (
                unidad_residencial_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por
            ) VALUES (
                NEW.unidad_residencial_id, 'mostrar_telefono_residente', 
                OLD.mostrar_telefono_residente::TEXT, NEW.mostrar_telefono_residente::TEXT, NEW.configurado_por
            );
        END IF;
        
        IF OLD.mostrar_correo_residente != NEW.mostrar_correo_residente THEN
            INSERT INTO cf_historial_configuracion_unidad (
                unidad_residencial_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por
            ) VALUES (
                NEW.unidad_residencial_id, 'mostrar_correo_residente', 
                OLD.mostrar_correo_residente::TEXT, NEW.mostrar_correo_residente::TEXT, NEW.configurado_por
            );
        END IF;
        
        IF OLD.requiere_aprobacion_visitantes != NEW.requiere_aprobacion_visitantes THEN
            INSERT INTO cf_historial_configuracion_unidad (
                unidad_residencial_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por
            ) VALUES (
                NEW.unidad_residencial_id, 'requiere_aprobacion_visitantes', 
                OLD.requiere_aprobacion_visitantes::TEXT, NEW.requiere_aprobacion_visitantes::TEXT, NEW.configurado_por
            );
        END IF;
        
        -- Auditar cambios en configuraciones de domiciliarios
        IF OLD.permitir_acceso_domiciliarios != NEW.permitir_acceso_domiciliarios THEN
            INSERT INTO cf_historial_configuracion_unidad (
                unidad_residencial_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por
            ) VALUES (
                NEW.unidad_residencial_id, 'permitir_acceso_domiciliarios', 
                OLD.permitir_acceso_domiciliarios::TEXT, NEW.permitir_acceso_domiciliarios::TEXT, NEW.configurado_por
            );
        END IF;
        
        IF OLD.modalidad_entrega_sin_acceso != NEW.modalidad_entrega_sin_acceso THEN
            INSERT INTO cf_historial_configuracion_unidad (
                unidad_residencial_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por
            ) VALUES (
                NEW.unidad_residencial_id, 'modalidad_entrega_sin_acceso', 
                OLD.modalidad_entrega_sin_acceso::TEXT, NEW.modalidad_entrega_sin_acceso::TEXT, NEW.configurado_por
            );
        END IF;
        
        IF OLD.requiere_documento_domiciliario != NEW.requiere_documento_domiciliario THEN
            INSERT INTO cf_historial_configuracion_unidad (
                unidad_residencial_id, campo_modificado, valor_anterior, valor_nuevo, modificado_por
            ) VALUES (
                NEW.unidad_residencial_id, 'requiere_documento_domiciliario', 
                OLD.requiere_documento_domiciliario::TEXT, NEW.requiere_documento_domiciliario::TEXT, NEW.configurado_por
            );
        END IF;
        
        -- Actualizar metadatos
        NEW.fecha_ultima_configuracion = now();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auditoría de cambios
CREATE TRIGGER trg_auditar_cambios_configuracion
    BEFORE UPDATE ON cf_configuracion_unidad_residencial
    FOR EACH ROW EXECUTE FUNCTION auditar_cambios_configuracion();

-- Función para verificar si una unidad puede crear tarifas de parqueadero
CREATE OR REPLACE FUNCTION cf_puede_crear_tarifas_parqueadero(p_unidad_residencial_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    total_parqueaderos INTEGER;
BEGIN
    SELECT (parqueaderos_carros + parqueaderos_motos + parqueaderos_bicicletas)
    INTO total_parqueaderos
    FROM cf_configuracion_unidad_residencial
    WHERE unidad_residencial_id = p_unidad_residencial_id;
    
    RETURN COALESCE(total_parqueaderos, 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de parqueaderos por unidad
CREATE OR REPLACE FUNCTION cf_estadisticas_parqueaderos(p_unidad_residencial_id UUID)
RETURNS TABLE(
    total_parqueaderos INTEGER,
    carros INTEGER,
    motos INTEGER,
    bicicletas INTEGER,
    tarifas_activas INTEGER,
    puede_crear_tarifas BOOLEAN
) AS $$
BEGIN
    RETURN QUERY SELECT 
        COALESCE(c.parqueaderos_carros + c.parqueaderos_motos + c.parqueaderos_bicicletas, 0) as total_parqueaderos,
        COALESCE(c.parqueaderos_carros, 0) as carros,
        COALESCE(c.parqueaderos_motos, 0) as motos,
        COALESCE(c.parqueaderos_bicicletas, 0) as bicicletas,
        COALESCE(COUNT(t.id), 0)::INTEGER as tarifas_activas,
        cf_puede_crear_tarifas_parqueadero(p_unidad_residencial_id) as puede_crear_tarifas
    FROM cf_configuracion_unidad_residencial c
    LEFT JOIN cf_tarifas_parqueadero t ON c.unidad_residencial_id = t.unidad_residencial_id 
        AND t.activa = TRUE 
        AND (t.fecha_vigencia_fin IS NULL OR t.fecha_vigencia_fin > now())
    WHERE c.unidad_residencial_id = p_unidad_residencial_id
    GROUP BY c.parqueaderos_carros, c.parqueaderos_motos, c.parqueaderos_bicicletas;
END;
$$ LANGUAGE plpgsql;

-- Función para validar configuración de domiciliarios
CREATE OR REPLACE FUNCTION cf_validar_configuracion_domiciliarios(p_unidad_residencial_id UUID)
RETURNS TABLE(
    es_valida BOOLEAN,
    mensaje_error TEXT,
    permitir_acceso BOOLEAN,
    modalidad_entrega TEXT,
    datos_obligatorios_completos BOOLEAN
) AS $$
DECLARE
    config_record RECORD;
BEGIN
    SELECT 
        permitir_acceso_domiciliarios,
        modalidad_entrega_sin_acceso,
        requiere_documento_domiciliario,
        requiere_nombre_domiciliario,
        requiere_foto_domiciliario
    INTO config_record
    FROM cf_configuracion_unidad_residencial
    WHERE unidad_residencial_id = p_unidad_residencial_id;
    
    -- Si no se permite acceso, solo verificar modalidad de entrega
    IF NOT COALESCE(config_record.permitir_acceso_domiciliarios, FALSE) THEN
        RETURN QUERY SELECT 
            TRUE as es_valida,
            NULL::TEXT as mensaje_error,
            config_record.permitir_acceso_domiciliarios as permitir_acceso,
            config_record.modalidad_entrega_sin_acceso as modalidad_entrega,
            TRUE as datos_obligatorios_completos;
    ELSE
        -- Si se permite acceso, verificar que todos los datos obligatorios estén configurados
        IF NOT (COALESCE(config_record.requiere_documento_domiciliario, FALSE) AND 
                COALESCE(config_record.requiere_nombre_domiciliario, FALSE) AND 
                COALESCE(config_record.requiere_foto_domiciliario, FALSE)) THEN
            RETURN QUERY SELECT 
                FALSE as es_valida,
                'Debes seleccionar todos los datos obligatorios'::TEXT as mensaje_error,
                config_record.permitir_acceso_domiciliarios as permitir_acceso,
                config_record.modalidad_entrega_sin_acceso as modalidad_entrega,
                FALSE as datos_obligatorios_completos;
        ELSE
            RETURN QUERY SELECT 
                TRUE as es_valida,
                NULL::TEXT as mensaje_error,
                config_record.permitir_acceso_domiciliarios as permitir_acceso,
                config_record.modalidad_entrega_sin_acceso as modalidad_entrega,
                TRUE as datos_obligatorios_completos;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener protocolo de entrega según configuración
CREATE OR REPLACE FUNCTION cf_obtener_protocolo_entrega(p_unidad_residencial_id UUID)
RETURNS TABLE(
    protocolo_nombre TEXT,
    descripcion TEXT,
    requiere_autorizacion BOOLEAN,
    ubicacion_entrega TEXT,
    notificacion_residente TEXT
) AS $$
DECLARE
    config_record RECORD;
BEGIN
    SELECT 
        permitir_acceso_domiciliarios,
        modalidad_entrega_sin_acceso
    INTO config_record
    FROM cf_configuracion_unidad_residencial
    WHERE unidad_residencial_id = p_unidad_residencial_id;
    
    IF COALESCE(config_record.permitir_acceso_domiciliarios, FALSE) THEN
        -- Acceso permitido: el domiciliario entra a la unidad
        RETURN QUERY SELECT 
            'acceso_permitido'::TEXT as protocolo_nombre,
            'El domiciliario puede ingresar a la unidad tras verificación de datos'::TEXT as descripcion,
            FALSE as requiere_autorizacion,
            'apartamento'::TEXT as ubicacion_entrega,
            'Tu pedido ya va en camino'::TEXT as notificacion_residente;
    ELSE
        -- Acceso no permitido: según modalidad configurada
        IF COALESCE(config_record.modalidad_entrega_sin_acceso, 'porteria') = 'porteria' THEN
            RETURN QUERY SELECT 
                'entrega_porteria'::TEXT as protocolo_nombre,
                'El guardia recibe el paquete en portería'::TEXT as descripcion,
                FALSE as requiere_autorizacion,
                'porteria'::TEXT as ubicacion_entrega,
                'Tu pedido está en portería'::TEXT as notificacion_residente;
        ELSE
            RETURN QUERY SELECT 
                'entrega_rondero'::TEXT as protocolo_nombre,
                'El rondero lleva el paquete al apartamento'::TEXT as descripcion,
                TRUE as requiere_autorizacion,
                'apartamento'::TEXT as ubicacion_entrega,
                'Que ya le llevan el paquete'::TEXT as notificacion_residente;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Función para validar ingreso de domiciliario 
CREATE OR REPLACE FUNCTION cf_validar_ingreso_domiciliario(
    p_unidad_residencial_id UUID,
    p_empresa_domicilio_id UUID DEFAULT NULL,
    p_foto_domiciliario_url TEXT DEFAULT NULL,
    p_documento TEXT DEFAULT NULL,
    p_foto_documento_url TEXT DEFAULT NULL
)
RETURNS TABLE(
    puede_ingresar BOOLEAN,
    mensaje_error TEXT,
    campos_faltantes TEXT[],
    protocolo_aplicable TEXT
) AS $$
DECLARE
    config_record RECORD;
    campos_faltantes_array TEXT[] := ARRAY[]::TEXT[];
    protocolo_info RECORD;
BEGIN
    -- Obtener configuración de la unidad
    SELECT 
        permitir_acceso_domiciliarios,
        modalidad_entrega_sin_acceso,
        requiere_documento_domiciliario,
        requiere_nombre_domiciliario,
        requiere_foto_domiciliario
    INTO config_record
    FROM cf_configuracion_unidad_residencial
    WHERE unidad_residencial_id = p_unidad_residencial_id;
    
    -- Si no se permite acceso, devolver protocolo alternativo
    IF NOT COALESCE(config_record.permitir_acceso_domiciliarios, FALSE) THEN
        SELECT * INTO protocolo_info FROM cf_obtener_protocolo_entrega(p_unidad_residencial_id) LIMIT 1;
        
        RETURN QUERY SELECT 
            FALSE as puede_ingresar,
            'El ingreso de domiciliarios no está autorizado. ' || protocolo_info.descripcion as mensaje_error,
            ARRAY[]::TEXT[] as campos_faltantes,
            protocolo_info.protocolo_nombre as protocolo_aplicable;
        RETURN;
    END IF;
    
    -- Validar campos obligatorios
    IF config_record.requiere_documento_domiciliario AND (p_documento IS NULL OR p_documento = '') THEN
        campos_faltantes_array := array_append(campos_faltantes_array, 'Número de documento');
    END IF;
    
    IF config_record.requiere_foto_domiciliario AND (p_foto_domiciliario_url IS NULL OR p_foto_domiciliario_url = '') THEN
        campos_faltantes_array := array_append(campos_faltantes_array, 'Fotografía del domiciliario');
    END IF;
    
    IF p_empresa_domicilio_id IS NULL THEN
        campos_faltantes_array := array_append(campos_faltantes_array, 'Empresa de domicilios');
    END IF;
    
    -- Si hay campos faltantes
    IF array_length(campos_faltantes_array, 1) > 0 THEN
        RETURN QUERY SELECT 
            FALSE as puede_ingresar,
            'Faltan datos obligatorios para permitir el ingreso del domiciliario' as mensaje_error,
            campos_faltantes_array as campos_faltantes,
            'acceso_permitido'::TEXT as protocolo_aplicable;
    ELSE
        RETURN QUERY SELECT 
            TRUE as puede_ingresar,
            NULL::TEXT as mensaje_error,
            ARRAY[]::TEXT[] as campos_faltantes,
            'acceso_permitido'::TEXT as protocolo_aplicable;
    END IF;
END;
$$ LANGUAGE plpgsql;



-- Tabla para historial de cambios en configuraciones (auditoría)
CREATE TABLE IF NOT EXISTS cf_historial_configuracion_unidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL,
  campo_modificado TEXT NOT NULL,
  valor_anterior TEXT,
  valor_nuevo TEXT NOT NULL,
  modificado_por UUID NOT NULL,
  motivo_cambio TEXT,
  fecha_modificacion TIMESTAMPTZ DEFAULT now(),
  ip_origen INET,
  user_agent TEXT,
  CONSTRAINT fk_historial_config_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id) ON DELETE CASCADE,
  CONSTRAINT fk_historial_config_usuario FOREIGN KEY (modificado_por) REFERENCES cf_usuarios(id)
);

-- Índice para optimizar consultas de auditoría
CREATE INDEX IF NOT EXISTS idx_cf_historial_config_unidad_fecha 
  ON cf_historial_configuracion_unidad(unidad_residencial_id, fecha_modificacion DESC);

CREATE INDEX IF NOT EXISTS idx_cf_historial_config_campo 
  ON cf_historial_configuracion_unidad(campo_modificado, fecha_modificacion DESC);

-- Tarifas de parqueadero por unidad residencial
CREATE TABLE IF NOT EXISTS cf_tarifas_parqueadero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidad_residencial_id UUID NOT NULL,
  tipo_vehiculo_id INTEGER NOT NULL,
  unidad_cobro_id UUID NOT NULL,
  descripcion TEXT,
  valor_por_unidad NUMERIC(15,2) NOT NULL CHECK (valor_por_unidad > 0),
  unidad_tiempo_gracia_id UUID,
  tiempo_gracia INTEGER DEFAULT 0 CHECK (tiempo_gracia >= 0),
  tarifa_minima NUMERIC(15,2) CHECK (tarifa_minima >= 0),
  tarifa_maxima NUMERIC(15,2) CHECK (tarifa_maxima >= 0),
  periodo_tarifa_maxima TEXT CHECK (periodo_tarifa_maxima IN ('hora', 'dia', 'mes')),
  a_cargo_id INTEGER NOT NULL, -- FK a am_tipos_cargo_tarifa
  activa BOOLEAN DEFAULT TRUE,
  usuario_creacion UUID NOT NULL,
  fecha_vigencia_inicio TIMESTAMPTZ DEFAULT now(),
  fecha_vigencia_fin TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_tarifa_parq_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id) ON DELETE CASCADE,
  CONSTRAINT fk_tarifa_parq_tipo_vehiculo FOREIGN KEY (tipo_vehiculo_id) REFERENCES am_tipos_vehiculo(id),
  CONSTRAINT fk_tarifa_parq_unidad_cobro FOREIGN KEY (unidad_cobro_id) REFERENCES am_unidades_cobro(id),
  CONSTRAINT fk_tarifa_parq_tiempo_gracia FOREIGN KEY (unidad_tiempo_gracia_id) REFERENCES am_unidades_cobro(id),
  CONSTRAINT fk_tarifa_parq_cargo FOREIGN KEY (a_cargo_id) REFERENCES am_tipos_cargo_tarifa(id),
  CONSTRAINT fk_tarifa_parq_usuario FOREIGN KEY (usuario_creacion) REFERENCES cf_usuarios(id),
  CONSTRAINT chk_tarifa_parq_fechas CHECK (fecha_vigencia_fin IS NULL OR fecha_vigencia_fin > fecha_vigencia_inicio),
  CONSTRAINT chk_tarifa_parq_minima_maxima CHECK (tarifa_maxima IS NULL OR tarifa_minima IS NULL OR tarifa_maxima >= tarifa_minima)
);

-- Medios de pago habilitados por tarifa de parqueadero
CREATE TABLE IF NOT EXISTS cf_tarifa_parqueadero_medios_pago (
  tarifa_parqueadero_id UUID NOT NULL,
  medio_pago_id INTEGER NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tarifa_parqueadero_id, medio_pago_id),
  CONSTRAINT fk_tarifa_medio_tarifa FOREIGN KEY (tarifa_parqueadero_id) REFERENCES cf_tarifas_parqueadero(id) ON DELETE CASCADE,
  CONSTRAINT fk_tarifa_medio_pago FOREIGN KEY (medio_pago_id) REFERENCES am_medios_pago(id)
);

-- Historial de tarifas de parqueadero (auditoría)
CREATE TABLE IF NOT EXISTS cf_historial_tarifas_parqueadero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarifa_parqueadero_id UUID NOT NULL,
  accion TEXT NOT NULL CHECK (accion IN ('creacion', 'actualizacion', 'activacion', 'desactivacion', 'eliminacion')),
  campo_modificado TEXT,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  usuario_id UUID NOT NULL,
  motivo TEXT,
  fecha_modificacion TIMESTAMPTZ DEFAULT now(),
  ip_origen INET,
  user_agent TEXT,
  CONSTRAINT fk_hist_tarifa_parq_tarifa FOREIGN KEY (tarifa_parqueadero_id) REFERENCES cf_tarifas_parqueadero(id) ON DELETE CASCADE,
  CONSTRAINT fk_hist_tarifa_parq_usuario FOREIGN KEY (usuario_id) REFERENCES cf_usuarios(id)
);

-- Índices para optimizar consultas de tarifas de parqueadero
CREATE INDEX IF NOT EXISTS idx_cf_tarifas_parq_unidad_activa 
  ON cf_tarifas_parqueadero(unidad_residencial_id, activa) WHERE activa = TRUE;

CREATE INDEX IF NOT EXISTS idx_cf_tarifas_parq_tipo_vehiculo 
  ON cf_tarifas_parqueadero(tipo_vehiculo_id, activa) WHERE activa = TRUE;

CREATE INDEX IF NOT EXISTS idx_cf_tarifas_parq_vigencia 
  ON cf_tarifas_parqueadero(fecha_vigencia_inicio, fecha_vigencia_fin) WHERE activa = TRUE;

CREATE INDEX IF NOT EXISTS idx_cf_hist_tarifas_parq_fecha 
  ON cf_historial_tarifas_parqueadero(tarifa_parqueadero_id, fecha_modificacion DESC);

-- Trigger para actualizar updated_at en tarifas de parqueadero
CREATE TRIGGER update_cf_tarifas_parqueadero_updated_at 
    BEFORE UPDATE ON cf_tarifas_parqueadero 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vista para consultar tarifas de parqueadero con información completa
CREATE OR REPLACE VIEW vw_tarifas_parqueadero AS
SELECT 
    t.id,
    t.unidad_residencial_id,
    ur.nombre as unidad_nombre,
    ur.documento as unidad_documento,
    t.tipo_vehiculo_id,
    tv.nombre as tipo_vehiculo_nombre,
    tv.codigo as tipo_vehiculo_codigo,
    t.unidad_cobro_id,
    uc.nombre as unidad_cobro_nombre,
    t.descripcion,
    t.valor_por_unidad,
    t.tiempo_gracia,
    t.unidad_tiempo_gracia_id,
    ucg.nombre as unidad_tiempo_gracia_nombre,
    t.tarifa_minima,
    t.tarifa_maxima,
    t.periodo_tarifa_maxima,
    t.a_cargo_id,
    tc.nombre as a_cargo_nombre,
    tc.codigo as a_cargo_codigo,
    t.activa,
    t.usuario_creacion,
    COALESCE(u.nombre || ' ' || u.apellido, 'Sistema') as usuario_creacion_nombre,
    t.fecha_vigencia_inicio,
    t.fecha_vigencia_fin,
    -- Medios de pago disponibles para esta tarifa (como array)
    ARRAY_AGG(DISTINCT mp.nombre ORDER BY mp.nombre) FILTER (WHERE mp.id IS NOT NULL AND tmp.activo = TRUE) as medios_pago_habilitados,
    t.created_at,
    t.updated_at
FROM cf_tarifas_parqueadero t
JOIN am_unidad_residencial ur ON t.unidad_residencial_id = ur.id
JOIN am_tipos_vehiculo tv ON t.tipo_vehiculo_id = tv.id
JOIN am_unidades_cobro uc ON t.unidad_cobro_id = uc.id
LEFT JOIN am_unidades_cobro ucg ON t.unidad_tiempo_gracia_id = ucg.id
JOIN am_tipos_cargo_tarifa tc ON t.a_cargo_id = tc.id
LEFT JOIN cf_usuarios u ON t.usuario_creacion = u.id
LEFT JOIN cf_tarifa_parqueadero_medios_pago tmp ON t.id = tmp.tarifa_parqueadero_id
LEFT JOIN am_medios_pago mp ON tmp.medio_pago_id = mp.id AND mp.estado = TRUE
GROUP BY t.id, ur.id, ur.nombre, ur.documento, tv.id, tv.nombre, tv.codigo, 
         uc.id, uc.nombre, ucg.id, ucg.nombre, tc.id, tc.nombre, tc.codigo,
         u.nombre, u.apellido, t.descripcion, t.valor_por_unidad, t.tiempo_gracia,
         t.tarifa_minima, t.tarifa_maxima, t.periodo_tarifa_maxima, t.activa,
         t.usuario_creacion, t.fecha_vigencia_inicio, t.fecha_vigencia_fin,
         t.created_at, t.updated_at;



-- Función para validar unicidad de tarifa activa por tipo de vehículo
CREATE OR REPLACE FUNCTION validar_tarifa_unica_por_vehiculo()
RETURNS TRIGGER AS $$
DECLARE
    tarifa_existente_id UUID;
BEGIN
    -- Solo validar si la tarifa está activa
    IF NEW.activa = TRUE THEN
        -- Buscar otra tarifa activa para el mismo tipo de vehículo en la misma unidad
        SELECT id INTO tarifa_existente_id
        FROM cf_tarifas_parqueadero 
        WHERE unidad_residencial_id = NEW.unidad_residencial_id 
          AND tipo_vehiculo_id = NEW.tipo_vehiculo_id 
          AND activa = TRUE
          AND id != COALESCE(NEW.id, gen_random_uuid()) -- Excluir el registro actual en caso de UPDATE
          AND (fecha_vigencia_fin IS NULL OR fecha_vigencia_fin > now())
        LIMIT 1;
        
        -- Si existe otra tarifa activa, lanzar excepción
        IF tarifa_existente_id IS NOT NULL THEN
            RAISE EXCEPTION 'Ya existe una tarifa activa para este tipo de vehículo (ID: %). Desactive la tarifa existente antes de crear una nueva.', tarifa_existente_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para auditar cambios en tarifas de parqueadero
CREATE OR REPLACE FUNCTION auditar_cambios_tarifas_parqueadero()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO cf_historial_tarifas_parqueadero (
            tarifa_parqueadero_id, accion, usuario_id, 
            valor_nuevo, fecha_modificacion
        ) VALUES (
            NEW.id, 'creacion', NEW.usuario_creacion,
            'Tarifa creada', now()
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Auditar cambios específicos
        IF OLD.activa != NEW.activa THEN
            INSERT INTO cf_historial_tarifas_parqueadero (
                tarifa_parqueadero_id, accion, campo_modificado,
                valor_anterior, valor_nuevo, usuario_id
            ) VALUES (
                NEW.id, 
                CASE WHEN NEW.activa THEN 'activacion' ELSE 'desactivacion' END,
                'activa',
                OLD.activa::TEXT, NEW.activa::TEXT, NEW.usuario_creacion
            );
        END IF;
        
        IF OLD.valor_por_unidad != NEW.valor_por_unidad THEN
            INSERT INTO cf_historial_tarifas_parqueadero (
                tarifa_parqueadero_id, accion, campo_modificado,
                valor_anterior, valor_nuevo, usuario_id
            ) VALUES (
                NEW.id, 'actualizacion', 'valor_por_unidad',
                OLD.valor_por_unidad::TEXT, NEW.valor_por_unidad::TEXT, NEW.usuario_creacion
            );
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO cf_historial_tarifas_parqueadero (
            tarifa_parqueadero_id, accion, usuario_id,
            valor_anterior, fecha_modificacion
        ) VALUES (
            OLD.id, 'eliminacion', OLD.usuario_creacion,
            'Tarifa eliminada', now()
        );
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers para tarifas de parqueadero
CREATE TRIGGER trg_validar_tarifa_unica_vehiculo
    BEFORE INSERT OR UPDATE ON cf_tarifas_parqueadero
    FOR EACH ROW EXECUTE FUNCTION validar_tarifa_unica_por_vehiculo();

CREATE TRIGGER trg_auditar_tarifas_parqueadero
    AFTER INSERT OR UPDATE OR DELETE ON cf_tarifas_parqueadero
    FOR EACH ROW EXECUTE FUNCTION auditar_cambios_tarifas_parqueadero();


-- Registro de vehículos 
CREATE TABLE IF NOT EXISTS template_schema.tr_registro_vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_ingreso DATE NOT NULL,
  hora_ingreso TIME NOT NULL,
  fecha_salida DATE,
  hora_salida TIME,
  torre_bloque_id UUID NOT NULL,
  apartamento_id UUID NOT NULL,
  residente_id UUID NOT NULL,
  tipo_vehiculo_id INTEGER NOT NULL,
  placa TEXT,
  otro_tipo_descripcion TEXT,
  numero_parqueadero TEXT,
  estado_vehiculo_id INTEGER NOT NULL DEFAULT 1, -- FK a am_estados_vehiculo
  confirmacion_id INTEGER NOT NULL DEFAULT 1, -- FK a am_confirmacion
  visitante_id UUID, -- Si es vehículo de visitante
  nombre_conductor TEXT,
  documento_conductor TEXT,
  tipo_documento_conductor_id INTEGER,
  foto_vehiculo_url TEXT,
  observaciones TEXT,
  usuario_registro_id UUID NOT NULL,
  usuario_salida_id UUID,
  fecha_autorizacion TIMESTAMPTZ,
  residente_autorizo_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_reg_veh_torre FOREIGN KEY (torre_bloque_id) REFERENCES am_torre_bloque(id),
  CONSTRAINT fk_reg_veh_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id),
  CONSTRAINT fk_reg_veh_residente FOREIGN KEY (residente_id) REFERENCES am_personas(id),
  CONSTRAINT fk_reg_veh_tipo FOREIGN KEY (tipo_vehiculo_id) REFERENCES am_tipos_vehiculo(id),
  CONSTRAINT fk_reg_veh_estado FOREIGN KEY (estado_vehiculo_id) REFERENCES am_estados_vehiculo(id),
  CONSTRAINT fk_reg_veh_confirmacion FOREIGN KEY (confirmacion_id) REFERENCES am_confirmacion(id),
  CONSTRAINT fk_reg_veh_visitante FOREIGN KEY (visitante_id) REFERENCES am_visitantes(id),
  CONSTRAINT fk_reg_veh_tipo_doc_conductor FOREIGN KEY (tipo_documento_conductor_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT fk_reg_veh_usuario_registro FOREIGN KEY (usuario_registro_id) REFERENCES cf_usuarios(id),
  CONSTRAINT fk_reg_veh_usuario_salida FOREIGN KEY (usuario_salida_id) REFERENCES cf_usuarios(id),
  CONSTRAINT fk_reg_veh_residente_autorizo FOREIGN KEY (residente_autorizo_id) REFERENCES am_personas(id)
);

-- Cobros de parqueadero 
CREATE TABLE IF NOT EXISTS template_schema.tr_cobros_parqueadero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro_vehiculo_id UUID NOT NULL,
  tarifa_parqueadero_id UUID NOT NULL,
  tiempo_total_minutos INTEGER NOT NULL,
  tiempo_gracia_minutos INTEGER DEFAULT 0,
  tiempo_cobrable_minutos INTEGER NOT NULL,
  valor_por_unidad NUMERIC(15,2) NOT NULL,
  valor_total_calculado NUMERIC(15,2) NOT NULL,
  valor_cobrado NUMERIC(15,2) NOT NULL,
  medio_pago_id INTEGER NOT NULL,
  pagado_por TEXT NOT NULL DEFAULT 'visitante', -- 'visitante', 'residente'
  aplicar_a_factura_residente BOOLEAN DEFAULT FALSE,
  observaciones_cobro TEXT,
  usuario_cobro_id UUID NOT NULL,
  fecha_cobro TIMESTAMPTZ DEFAULT now(),
  numero_recibo TEXT,
  estado_cobro TEXT NOT NULL DEFAULT 'pagado', -- 'pagado', 'pendiente', 'anulado'
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Las FK hacia template_schema se agregan después
  CONSTRAINT fk_cobro_parq_tarifa FOREIGN KEY (tarifa_parqueadero_id) REFERENCES cf_tarifas_parqueadero(id),
  CONSTRAINT fk_cobro_parq_medio_pago FOREIGN KEY (medio_pago_id) REFERENCES am_medios_pago(id),
  CONSTRAINT fk_cobro_parq_usuario FOREIGN KEY (usuario_cobro_id) REFERENCES cf_usuarios(id)
);

-- Correspondencia 
CREATE TABLE IF NOT EXISTS template_schema.tr_correspondencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_bloque_id UUID NOT NULL,
  apartamento_id UUID NOT NULL,
  residente_id UUID NOT NULL,
  tipo_correspondencia_id INTEGER NOT NULL,
  numero_guia TEXT NOT NULL,
  empresa_mensajeria_id INTEGER NOT NULL,
  estado_correspondencia_id INTEGER NOT NULL DEFAULT 1, -- 'en_porteria'
  fecha_recepcion DATE NOT NULL,
  hora_recepcion TIME NOT NULL,
  fecha_entrega DATE,
  hora_entrega TIME,
  observaciones TEXT,
  foto_paquete_url TEXT,
  notificado BOOLEAN DEFAULT FALSE,
  medio_notificacion TEXT, -- 'whatsapp', 'correo', 'ambos'
  fecha_notificacion TIMESTAMPTZ,
  usuario_recepcion_id UUID NOT NULL,
  usuario_entrega_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_corresp_torre FOREIGN KEY (torre_bloque_id) REFERENCES am_torre_bloque(id),
  CONSTRAINT fk_corresp_apto FOREIGN KEY (apartamento_id) REFERENCES am_apto(id),
  CONSTRAINT fk_corresp_residente FOREIGN KEY (residente_id) REFERENCES am_personas(id),
  CONSTRAINT fk_corresp_tipo FOREIGN KEY (tipo_correspondencia_id) REFERENCES am_tipos_correspondencia(id),
  CONSTRAINT fk_corresp_empresa_mens FOREIGN KEY (empresa_mensajeria_id) REFERENCES am_empresas_mensajeria(id),
  CONSTRAINT fk_corresp_estado FOREIGN KEY (estado_correspondencia_id) REFERENCES am_estados_correspondencia(id),
  CONSTRAINT fk_corresp_usuario_recep FOREIGN KEY (usuario_recepcion_id) REFERENCES cf_usuarios(id),
  CONSTRAINT fk_corresp_usuario_entrega FOREIGN KEY (usuario_entrega_id) REFERENCES cf_usuarios(id)
);

-- Devoluciones de correspondencia 
CREATE TABLE IF NOT EXISTS template_schema.tr_devoluciones_correspondencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  correspondencia_id UUID NOT NULL,
  motivo_devolucion_id INTEGER NOT NULL,
  observaciones TEXT,
  fecha_devolucion DATE NOT NULL,
  hora_devolucion TIME NOT NULL,
  fotos_evidencia_urls TEXT[], -- Array de URLs de fotos
  usuario_devolucion_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Las FK hacia template_schema se agregan después
  CONSTRAINT fk_devol_corresp_motivo FOREIGN KEY (motivo_devolucion_id) REFERENCES am_motivos_devolucion_correspondencia(id),
  CONSTRAINT fk_devol_corresp_usuario FOREIGN KEY (usuario_devolucion_id) REFERENCES cf_usuarios(id)
);

-- Minutas 
CREATE TABLE IF NOT EXISTS template_schema.tr_minutas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_registro DATE NOT NULL,
  hora_registro TIME NOT NULL,
  tipo_minuta_id INTEGER NOT NULL,
  asunto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  destinatario_notificacion_id INTEGER,
  -- Campos específicos según tipo de reporte
  residente_reportado_id UUID, 
  ubicacion_incidencia_id INTEGER, 
  vigilante_entrante_id UUID, 
  apartamento_incidencia_id UUID, 
  numero_parqueadero_incidencia TEXT, 
  -- Metadatos
  usuario_registro_id UUID NOT NULL,
  notificacion_enviada BOOLEAN DEFAULT FALSE,
  fecha_notificacion TIMESTAMPTZ,
  observaciones_adicionales TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_minuta_tipo FOREIGN KEY (tipo_minuta_id) REFERENCES am_tipos_minuta(id),
  CONSTRAINT fk_minuta_destinatario FOREIGN KEY (destinatario_notificacion_id) REFERENCES am_destinatarios_notificacion(id),
  CONSTRAINT fk_minuta_residente_reportado FOREIGN KEY (residente_reportado_id) REFERENCES am_personas(id),
  CONSTRAINT fk_minuta_ubicacion_incidencia FOREIGN KEY (ubicacion_incidencia_id) REFERENCES am_ubicaciones_incidencia(id),
  CONSTRAINT fk_minuta_vigilante_entrante FOREIGN KEY (vigilante_entrante_id) REFERENCES cf_usuarios(id),
  CONSTRAINT fk_minuta_apto_incidencia FOREIGN KEY (apartamento_incidencia_id) REFERENCES am_apto(id),
  CONSTRAINT fk_minuta_usuario_registro FOREIGN KEY (usuario_registro_id) REFERENCES cf_usuarios(id)
);

-- Evidencias de minutas (fotos y videos) 
CREATE TABLE IF NOT EXISTS template_schema.tr_minutas_evidencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  minuta_id UUID NOT NULL,
  tipo_evidencia TEXT NOT NULL CHECK (tipo_evidencia IN ('fotografia', 'video')),
  url_evidencia TEXT NOT NULL,
  nombre_archivo TEXT,
  tamano_mb NUMERIC,
  descripcion TEXT,
  orden INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
  -- Las FK hacia template_schema se agregan después
);

-- Registros de equipamiento en entrega de áreas comunes 
CREATE TABLE IF NOT EXISTS template_schema.tr_registro_equipamiento_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_comun_id UUID NOT NULL,
  usuario_registro_id UUID NOT NULL,
  fecha_registro DATE NOT NULL,
  hora_registro TIME NOT NULL,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_reg_equip_area_comun FOREIGN KEY (area_comun_id) REFERENCES am_areas_comunes(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_equip_usuario FOREIGN KEY (usuario_registro_id) REFERENCES cf_usuarios(id)
);

-- Detalle de equipamiento por registro 
CREATE TABLE IF NOT EXISTS template_schema.tr_detalle_equipamiento_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro_equipamiento_id UUID NOT NULL,
  nombre_equipo TEXT NOT NULL,
  estado_equipo TEXT NOT NULL CHECK (estado_equipo IN ('bueno', 'regular', 'malo')),
  observaciones TEXT,
  cantidad INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_detalle_equip_registro FOREIGN KEY (registro_equipamiento_id) REFERENCES template_schema.tr_registro_equipamiento_areas(id) ON DELETE CASCADE
);

-- =====================================================
-- FOREIGN KEYS ENTRE TABLAS DEL TEMPLATE_SCHEMA
-- (Se agregan después de crear todas las tablas)
-- =====================================================

-- FK de tr_cobros_parqueadero hacia tr_registro_vehiculos
ALTER TABLE template_schema.tr_cobros_parqueadero 
ADD CONSTRAINT fk_cobro_parq_registro 
FOREIGN KEY (registro_vehiculo_id) REFERENCES template_schema.tr_registro_vehiculos(id);

-- FK de tr_devoluciones_correspondencia hacia tr_correspondencia
ALTER TABLE template_schema.tr_devoluciones_correspondencia 
ADD CONSTRAINT fk_devol_corresp_correspondencia 
FOREIGN KEY (correspondencia_id) REFERENCES template_schema.tr_correspondencia(id);

-- FK de tr_minutas_evidencias hacia tr_minutas
ALTER TABLE template_schema.tr_minutas_evidencias 
ADD CONSTRAINT fk_evidencia_minuta 
FOREIGN KEY (minuta_id) REFERENCES template_schema.tr_minutas(id) ON DELETE CASCADE;


-- Función para calcular tarifa de parqueadero 
CREATE OR REPLACE FUNCTION cf_calcular_tarifa_parqueadero(
    p_registro_vehiculo_id UUID,
    p_fecha_salida DATE DEFAULT CURRENT_DATE,
    p_hora_salida TIME DEFAULT CURRENT_TIME
)
RETURNS TABLE(
    tarifa_id UUID,
    tiempo_total_minutos INTEGER,
    tiempo_gracia_minutos INTEGER,
    tiempo_cobrable_minutos INTEGER,
    valor_por_unidad NUMERIC,
    valor_total_calculado NUMERIC,
    tarifa_aplicable BOOLEAN,
    mensaje_info TEXT
) AS $$
DECLARE
    vehiculo_record RECORD;
    tarifa_record RECORD;
    tiempo_total INTEGER;
    tiempo_gracia INTEGER;
    tiempo_cobrable INTEGER;
    valor_calculado NUMERIC;
BEGIN
    -- Obtener información del vehículo
    SELECT 
        rv.*,
        a.id as apartamento_id
    INTO vehiculo_record
    FROM template_schema.tr_registro_vehiculos rv
    JOIN am_apto a ON rv.apartamento_id = a.id
    WHERE rv.id = p_registro_vehiculo_id;
    
    -- Buscar tarifa activa para este tipo de vehículo
    SELECT t.*
    INTO tarifa_record
    FROM cf_tarifas_parqueadero t
    JOIN am_unidad_residencial ur ON t.unidad_residencial_id = ur.id
    JOIN am_apto a ON a.torre_bloque_id IN (
        SELECT tb.id FROM am_torre_bloque tb WHERE tb.unidad_id = ur.id
    )
    WHERE a.id = vehiculo_record.apartamento_id
      AND t.tipo_vehiculo_id = vehiculo_record.tipo_vehiculo_id
      AND t.activa = TRUE
      AND (t.fecha_vigencia_fin IS NULL OR t.fecha_vigencia_fin > now())
    LIMIT 1;
    
    -- Si no hay tarifa, no hay cobro
    IF tarifa_record.id IS NULL THEN
        RETURN QUERY SELECT 
            NULL::UUID as tarifa_id,
            0 as tiempo_total_minutos,
            0 as tiempo_gracia_minutos,
            0 as tiempo_cobrable_minutos,
            0::NUMERIC as valor_por_unidad,
            0::NUMERIC as valor_total_calculado,
            FALSE as tarifa_aplicable,
            'No hay tarifa configurada para este tipo de vehículo' as mensaje_info;
        RETURN;
    END IF;
    
    -- Calcular tiempo total en minutos
    tiempo_total := EXTRACT(EPOCH FROM (
        (p_fecha_salida + p_hora_salida) - 
        (vehiculo_record.fecha_ingreso + vehiculo_record.hora_ingreso)
    )) / 60;
    
    -- Aplicar tiempo de gracia
    tiempo_gracia := COALESCE(tarifa_record.tiempo_gracia, 0);
    tiempo_cobrable := GREATEST(0, tiempo_total - tiempo_gracia);
    
    -- Calcular valor según unidad de cobro
    CASE 
        WHEN tarifa_record.unidad_cobro_id = (SELECT id FROM am_unidades_cobro WHERE nombre = 'Minuto') THEN
            valor_calculado := tiempo_cobrable * tarifa_record.valor_por_unidad;
        WHEN tarifa_record.unidad_cobro_id = (SELECT id FROM am_unidades_cobro WHERE nombre = 'Hora') THEN
            valor_calculado := CEIL(tiempo_cobrable / 60.0) * tarifa_record.valor_por_unidad;
        WHEN tarifa_record.unidad_cobro_id = (SELECT id FROM am_unidades_cobro WHERE nombre = 'Fracción 15 min') THEN
            valor_calculado := CEIL(tiempo_cobrable / 15.0) * tarifa_record.valor_por_unidad;
        WHEN tarifa_record.unidad_cobro_id = (SELECT id FROM am_unidades_cobro WHERE nombre = 'Fracción 30 min') THEN
            valor_calculado := CEIL(tiempo_cobrable / 30.0) * tarifa_record.valor_por_unidad;
        ELSE
            valor_calculado := tarifa_record.valor_por_unidad; -- Tarifa única
    END CASE;
    
    -- Aplicar tarifas mínima y máxima si están configuradas
    IF tarifa_record.tarifa_minima IS NOT NULL THEN
        valor_calculado := GREATEST(valor_calculado, tarifa_record.tarifa_minima);
    END IF;
    
    IF tarifa_record.tarifa_maxima IS NOT NULL THEN
        valor_calculado := LEAST(valor_calculado, tarifa_record.tarifa_maxima);
    END IF;
    
    RETURN QUERY SELECT 
        tarifa_record.id as tarifa_id,
        tiempo_total as tiempo_total_minutos,
        tiempo_gracia as tiempo_gracia_minutos,
        tiempo_cobrable as tiempo_cobrable_minutos,
        tarifa_record.valor_por_unidad as valor_por_unidad,
        valor_calculado as valor_total_calculado,
        TRUE as tarifa_aplicable,
        'Tarifa calculada exitosamente' as mensaje_info;
END;
$$ LANGUAGE plpgsql;

-- Función para autocompletado de vehículo recurrente 
CREATE OR REPLACE FUNCTION cf_autocompletar_vehiculo_recurrente(p_placa TEXT)
RETURNS TABLE(
    es_recurrente BOOLEAN,
    torre_bloque_id UUID,
    apartamento_id UUID,
    residente_id UUID,
    tipo_vehiculo_id INTEGER,
    nombre_conductor TEXT,
    documento_conductor TEXT,
    ultimo_ingreso TIMESTAMPTZ
) AS $$
DECLARE
    vehiculo_previo RECORD;
BEGIN
    -- Buscar el registro más reciente de este vehículo
    SELECT 
        rv.torre_bloque_id,
        rv.apartamento_id,
        rv.residente_id,
        rv.tipo_vehiculo_id,
        rv.nombre_conductor,
        rv.documento_conductor,
        rv.created_at
    INTO vehiculo_previo
    FROM template_schema.tr_registro_vehiculos rv
    WHERE UPPER(rv.placa) = UPPER(p_placa)
    ORDER BY rv.created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT 
            TRUE as es_recurrente,
            vehiculo_previo.torre_bloque_id,
            vehiculo_previo.apartamento_id,
            vehiculo_previo.residente_id,
            vehiculo_previo.tipo_vehiculo_id,
            vehiculo_previo.nombre_conductor,
            vehiculo_previo.documento_conductor,
            vehiculo_previo.created_at as ultimo_ingreso;
    ELSE
        RETURN QUERY SELECT 
            FALSE as es_recurrente,
            NULL::UUID as torre_bloque_id,
            NULL::UUID as apartamento_id,
            NULL::UUID as residente_id,
            NULL::INTEGER as tipo_vehiculo_id,
            NULL::TEXT as nombre_conductor,
            NULL::TEXT as documento_conductor,
            NULL::TIMESTAMPTZ as ultimo_ingreso;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para autocompletado de correspondencia recurrente 
CREATE OR REPLACE FUNCTION cf_autocompletar_correspondencia_recurrente(p_numero_guia TEXT)
RETURNS TABLE(
    es_recurrente BOOLEAN,
    torre_bloque_id UUID,
    apartamento_id UUID,
    residente_id UUID,
    empresa_mensajeria_id INTEGER,
    ultima_recepcion TIMESTAMPTZ
) AS $$
DECLARE
    correspondencia_previa RECORD;
BEGIN
    -- Buscar el registro más reciente de esta guía
    SELECT 
        c.torre_bloque_id,
        c.apartamento_id,
        c.residente_id,
        c.empresa_mensajeria_id,
        c.created_at
    INTO correspondencia_previa
    FROM template_schema.tr_correspondencia c
    WHERE c.numero_guia = p_numero_guia
    ORDER BY c.created_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN QUERY SELECT 
            TRUE as es_recurrente,
            correspondencia_previa.torre_bloque_id,
            correspondencia_previa.apartamento_id,
            correspondencia_previa.residente_id,
            correspondencia_previa.empresa_mensajeria_id,
            correspondencia_previa.created_at as ultima_recepcion;
    ELSE
        RETURN QUERY SELECT 
            FALSE as es_recurrente,
            NULL::UUID as torre_bloque_id,
            NULL::UUID as apartamento_id,
            NULL::UUID as residente_id,
            NULL::INTEGER as empresa_mensajeria_id,
            NULL::TIMESTAMPTZ as ultima_recepcion;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Vista para tablero de vehículos 
CREATE OR REPLACE VIEW vw_tablero_vehiculos AS
SELECT 
    rv.id,
    ev.nombre as estado,
    c.nombre as confirmacion,
    tv.nombre as tipo_vehiculo,
    rv.placa,
    COALESCE(rv.nombre_conductor, p.nombre || ' ' || p.apellido) as visitante_conductor,
    COALESCE(rv.documento_conductor, p.documento) as documento_visitante,
    rv.numero_parqueadero,
    rv.fecha_ingreso,
    rv.hora_ingreso,
    rv.fecha_salida,
    rv.hora_salida,
    tb.nombre as torre_bloque,
    a.numero_apto,
    res.nombre || ' ' || res.apellido as residente,
    rv.observaciones,
    rv.created_at,
    rv.updated_at
FROM template_schema.tr_registro_vehiculos rv
JOIN am_estados_vehiculo ev ON rv.estado_vehiculo_id = ev.id
JOIN am_confirmacion c ON rv.confirmacion_id = c.id
JOIN am_tipos_vehiculo tv ON rv.tipo_vehiculo_id = tv.id
JOIN am_torre_bloque tb ON rv.torre_bloque_id = tb.id
JOIN am_apto a ON rv.apartamento_id = a.id
JOIN am_personas res ON rv.residente_id = res.id
LEFT JOIN am_personas p ON rv.visitante_id = p.id;

-- Vista para tablero de correspondencia 
CREATE OR REPLACE VIEW vw_tablero_correspondencia AS
SELECT 
    c.id,
    ec.nombre as estado,
    ec.color_hex as color_estado,
    tb.nombre as torre_bloque,
    a.numero_apto,
    p.nombre || ' ' || p.apellido as residente,
    tc.nombre as tipo_correspondencia,
    c.numero_guia,
    em.nombre as empresa_mensajeria,
    c.fecha_recepcion,
    c.hora_recepcion,
    c.fecha_entrega,
    c.hora_entrega,
    c.notificado,
    c.medio_notificacion,
    ur.nombre || ' - ' || ur.apellido as usuario_recepcion,
    ue.nombre || ' - ' || ue.apellido as usuario_entrega,
    c.observaciones,
    c.created_at,
    c.updated_at
FROM template_schema.tr_correspondencia c
JOIN am_estados_correspondencia ec ON c.estado_correspondencia_id = ec.id
JOIN am_torre_bloque tb ON c.torre_bloque_id = tb.id
JOIN am_apto a ON c.apartamento_id = a.id
JOIN am_personas p ON c.residente_id = p.id
JOIN am_tipos_correspondencia tc ON c.tipo_correspondencia_id = tc.id
JOIN am_empresas_mensajeria em ON c.empresa_mensajeria_id = em.id
JOIN cf_usuarios ur ON c.usuario_recepcion_id = ur.id
LEFT JOIN cf_usuarios ue ON c.usuario_entrega_id = ue.id;

-- Vista para minutas con información completa 
CREATE OR REPLACE VIEW vw_minutas_completas AS
SELECT 
    m.id,
    m.fecha_registro,
    m.hora_registro,
    tm.nombre as tipo_minuta,
    tm.requiere_seccion_adicional,
    tm.nombre_seccion_adicional,
    m.asunto,
    m.descripcion,
    dn.nombre as destinatario_notificacion,
    -- Campos específicos según tipo
    rr.nombre || ' ' || rr.apellido as residente_reportado,
    ui.nombre as ubicacion_incidencia,
    ve.nombre || ' ' || ve.apellido as vigilante_entrante,
    ai.numero_apto as apartamento_incidencia,
    m.numero_parqueadero_incidencia,
    -- Metadatos
    u.nombre || ' ' || u.apellido as usuario_registro,
    m.notificacion_enviada,
    m.fecha_notificacion,
    m.observaciones_adicionales,
    -- Evidencias (como array)
    ARRAY_AGG(me.url_evidencia ORDER BY me.orden) FILTER (WHERE me.id IS NOT NULL) as urls_evidencias,
    ARRAY_AGG(me.tipo_evidencia ORDER BY me.orden) FILTER (WHERE me.id IS NOT NULL) as tipos_evidencias,
    m.created_at,
    m.updated_at
FROM template_schema.tr_minutas m
JOIN am_tipos_minuta tm ON m.tipo_minuta_id = tm.id
LEFT JOIN am_destinatarios_notificacion dn ON m.destinatario_notificacion_id = dn.id
LEFT JOIN am_personas rr ON m.residente_reportado_id = rr.id
LEFT JOIN am_ubicaciones_incidencia ui ON m.ubicacion_incidencia_id = ui.id
LEFT JOIN cf_usuarios ve ON m.vigilante_entrante_id = ve.id
LEFT JOIN am_apto ai ON m.apartamento_incidencia_id = ai.id
JOIN cf_usuarios u ON m.usuario_registro_id = u.id
LEFT JOIN template_schema.tr_minutas_evidencias me ON m.id = me.minuta_id
GROUP BY m.id, tm.id, tm.nombre, tm.requiere_seccion_adicional, tm.nombre_seccion_adicional,
         m.fecha_registro, m.hora_registro, m.asunto, m.descripcion,
         dn.nombre, rr.nombre, rr.apellido, ui.nombre, ve.nombre, ve.apellido,
         ai.numero_apto, m.numero_parqueadero_incidencia, u.nombre, u.apellido,
         m.notificacion_enviada, m.fecha_notificacion, m.observaciones_adicionales,
         m.created_at, m.updated_at;

-- Agregar campos faltantes a am_apto para carga masiva
ALTER TABLE am_apto 
ADD COLUMN IF NOT EXISTS coeficiente_apto NUMERIC(10,6) CHECK (coeficiente_apto >= 0 AND coeficiente_apto <= 1),
ADD COLUMN IF NOT EXISTS coeficiente_carro NUMERIC(10,6) CHECK (coeficiente_carro >= 0 AND coeficiente_carro <= 1),
ADD COLUMN IF NOT EXISTS coeficiente_cuarto_util NUMERIC(10,6) CHECK (coeficiente_cuarto_util >= 0 AND coeficiente_cuarto_util <= 1),
ADD COLUMN IF NOT EXISTS coeficiente_total NUMERIC(10,6) CHECK (coeficiente_total >= 0 AND coeficiente_total <= 1),
ADD COLUMN IF NOT EXISTS tipo_inmueble_id INTEGER,
ADD COLUMN IF NOT EXISTS alquilado BOOLEAN DEFAULT FALSE;

-- Agregar foreign key para tipo_inmueble_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_apto_tipo_inmueble' 
        AND table_name = 'am_apto'
    ) THEN
        ALTER TABLE am_apto 
        ADD CONSTRAINT fk_apto_tipo_inmueble 
        FOREIGN KEY (tipo_inmueble_id) REFERENCES am_tipos_inmueble(id);
    END IF;
END $$;

-- Agregar campos faltantes a tr_registro_visitantes
ALTER TABLE template_schema.tr_registro_visitantes 
ADD COLUMN IF NOT EXISTS residente_visitado_id UUID,
ADD COLUMN IF NOT EXISTS motivo_visita TEXT,
ADD COLUMN IF NOT EXISTS requiere_documento_domiciliario BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requiere_nombre_domiciliario BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requiere_foto_domiciliario BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS foto_domiciliario_url TEXT,
ADD COLUMN IF NOT EXISTS foto_documento_domiciliario_url TEXT,
ADD COLUMN IF NOT EXISTS observaciones_domiciliario TEXT,
ADD COLUMN IF NOT EXISTS protocolo_entrega TEXT,
ADD COLUMN IF NOT EXISTS notificado_residente BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fecha_notificacion_residente TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS mensaje_notificacion_residente TEXT,
ADD CONSTRAINT fk_reg_vis_residente 
    FOREIGN KEY (residente_visitado_id) 
    REFERENCES am_personas(id);

-- Índice para optimizar consultas por residente
CREATE INDEX IF NOT EXISTS idx_registro_visitantes_residente 
ON template_schema.tr_registro_visitantes(residente_visitado_id);

-- =====================================================
-- ÍNDICES PARA LAS NUEVAS TABLAS
-- =====================================================

-- Índices para tr_registro_vehiculos
CREATE INDEX IF NOT EXISTS idx_tr_registro_vehiculos_estado 
ON template_schema.tr_registro_vehiculos(estado_vehiculo_id, fecha_ingreso DESC);

CREATE INDEX IF NOT EXISTS idx_tr_registro_vehiculos_placa 
ON template_schema.tr_registro_vehiculos(placa) WHERE placa IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tr_registro_vehiculos_apartamento 
ON template_schema.tr_registro_vehiculos(apartamento_id, fecha_ingreso DESC);

CREATE INDEX IF NOT EXISTS idx_tr_registro_vehiculos_residente 
ON template_schema.tr_registro_vehiculos(residente_id, fecha_ingreso DESC);

-- Índices para tr_correspondencia
CREATE INDEX IF NOT EXISTS idx_tr_correspondencia_estado 
ON template_schema.tr_correspondencia(estado_correspondencia_id, fecha_recepcion DESC);

CREATE INDEX IF NOT EXISTS idx_tr_correspondencia_numero_guia 
ON template_schema.tr_correspondencia(numero_guia);

CREATE INDEX IF NOT EXISTS idx_tr_correspondencia_apartamento 
ON template_schema.tr_correspondencia(apartamento_id, fecha_recepcion DESC);

CREATE INDEX IF NOT EXISTS idx_tr_correspondencia_residente 
ON template_schema.tr_correspondencia(residente_id, fecha_recepcion DESC);

-- Índices para tr_minutas
CREATE INDEX IF NOT EXISTS idx_tr_minutas_tipo_fecha 
ON template_schema.tr_minutas(tipo_minuta_id, fecha_registro DESC);

CREATE INDEX IF NOT EXISTS idx_tr_minutas_usuario_fecha 
ON template_schema.tr_minutas(usuario_registro_id, fecha_registro DESC);

CREATE INDEX IF NOT EXISTS idx_tr_minutas_residente_reportado 
ON template_schema.tr_minutas(residente_reportado_id) WHERE residente_reportado_id IS NOT NULL;

-- Índices para tr_cobros_parqueadero
CREATE INDEX IF NOT EXISTS idx_tr_cobros_parqueadero_registro 
ON template_schema.tr_cobros_parqueadero(registro_vehiculo_id);

CREATE INDEX IF NOT EXISTS idx_tr_cobros_parqueadero_fecha 
ON template_schema.tr_cobros_parqueadero(fecha_cobro DESC);

CREATE INDEX IF NOT EXISTS idx_tr_cobros_parqueadero_estado 
ON template_schema.tr_cobros_parqueadero(estado_cobro, fecha_cobro DESC);

-- ===============================================
-- MEJORAS A TABLA EXISTENTE am_areas_comunes
-- ===============================================

-- Agregar nuevos campos requeridos para las historias de usuario
ALTER TABLE am_areas_comunes 
ADD COLUMN IF NOT EXISTS estado_area_id INTEGER,
ADD COLUMN IF NOT EXISTS tipo_detallado TEXT, -- Ej: 'lavanderia', 'salon_social', 'gimnasio'
ADD COLUMN IF NOT EXISTS fotos_urls TEXT[], -- Array de URLs de fotos (hasta 5)
ADD COLUMN IF NOT EXISTS equipamiento_servicios TEXT[], -- Array de equipamiento disponible
ADD COLUMN IF NOT EXISTS observaciones_mantenimiento TEXT,
ADD COLUMN IF NOT EXISTS fecha_ultimo_mantenimiento DATE,
ADD COLUMN IF NOT EXISTS usuario_ultimo_mantenimiento UUID;

-- Agregar foreign keys después de crear las columnas
DO $$
BEGIN
    -- Agregar foreign key para estado si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_area_comun_estado' 
        AND table_name = 'am_areas_comunes'
    ) THEN
        ALTER TABLE am_areas_comunes
        ADD CONSTRAINT fk_area_comun_estado 
        FOREIGN KEY (estado_area_id) REFERENCES am_estados_area_comun(id);
    END IF;

    -- Agregar foreign key para usuario de mantenimiento si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_area_comun_usuario_mantenimiento' 
        AND table_name = 'am_areas_comunes'
    ) THEN
        ALTER TABLE am_areas_comunes
        ADD CONSTRAINT fk_area_comun_usuario_mantenimiento 
        FOREIGN KEY (usuario_ultimo_mantenimiento) REFERENCES cf_usuarios(id);
    END IF;
END $$;


-- Mejoras a tabla existente de reservas
ALTER TABLE template_schema.tr_reservas_areas_comunes 
ADD COLUMN IF NOT EXISTS apartamento_id UUID,
ADD COLUMN IF NOT EXISTS residente_id UUID,
ADD COLUMN IF NOT EXISTS estado_reserva_id INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS costo_reserva NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS metodo_pago_id INTEGER,
ADD COLUMN IF NOT EXISTS comprobante_pago_url TEXT,
ADD COLUMN IF NOT EXISTS numero_transaccion TEXT,
ADD COLUMN IF NOT EXISTS fecha_pago TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS observaciones_reserva TEXT,
ADD COLUMN IF NOT EXISTS notificacion_enviada BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS fecha_notificacion TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS usuario_aprobacion_id UUID,
ADD COLUMN IF NOT EXISTS fecha_aprobacion TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS motivo_rechazo TEXT;

-- Agregar foreign keys después de crear las columnas
DO $$
BEGIN
    -- Agregar foreign key para apartamento si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reserva_apartamento' 
        AND table_name = 'tr_reservas_areas_comunes'
        AND table_schema = 'template_schema'
    ) THEN
        ALTER TABLE template_schema.tr_reservas_areas_comunes
        ADD CONSTRAINT fk_reserva_apartamento 
        FOREIGN KEY (apartamento_id) REFERENCES am_apto(id);
    END IF;

    -- Agregar foreign key para residente si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reserva_residente' 
        AND table_name = 'tr_reservas_areas_comunes'
        AND table_schema = 'template_schema'
    ) THEN
        ALTER TABLE template_schema.tr_reservas_areas_comunes
        ADD CONSTRAINT fk_reserva_residente 
        FOREIGN KEY (residente_id) REFERENCES am_personas(id);
    END IF;

    -- Agregar foreign key para estado si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reserva_estado' 
        AND table_name = 'tr_reservas_areas_comunes'
        AND table_schema = 'template_schema'
    ) THEN
        ALTER TABLE template_schema.tr_reservas_areas_comunes
        ADD CONSTRAINT fk_reserva_estado 
        FOREIGN KEY (estado_reserva_id) REFERENCES am_estados_reserva_area_comun(id);
    END IF;

    -- Agregar foreign key para método de pago si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reserva_metodo_pago' 
        AND table_name = 'tr_reservas_areas_comunes'
        AND table_schema = 'template_schema'
    ) THEN
        ALTER TABLE template_schema.tr_reservas_areas_comunes
        ADD CONSTRAINT fk_reserva_metodo_pago 
        FOREIGN KEY (metodo_pago_id) REFERENCES am_metodos_pago_reservas(id);
    END IF;

    -- Agregar foreign key para usuario aprobación si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_reserva_usuario_aprobacion' 
        AND table_name = 'tr_reservas_areas_comunes'
        AND table_schema = 'template_schema'
    ) THEN
        ALTER TABLE template_schema.tr_reservas_areas_comunes
        ADD CONSTRAINT fk_reserva_usuario_aprobacion 
        FOREIGN KEY (usuario_aprobacion_id) REFERENCES cf_usuarios(id);
    END IF;
END $$;

-- Índices para tablas de áreas comunes
CREATE INDEX IF NOT EXISTS idx_tr_reservas_areas_fecha 
ON template_schema.tr_reservas_areas_comunes(fecha_reserva DESC, estado_reserva_id);

CREATE INDEX IF NOT EXISTS idx_tr_reservas_areas_residente 
ON template_schema.tr_reservas_areas_comunes(residente_id, fecha_reserva DESC);

CREATE INDEX IF NOT EXISTS idx_tr_reservas_areas_apartamento 
ON template_schema.tr_reservas_areas_comunes(apartamento_id, fecha_reserva DESC);

CREATE INDEX IF NOT EXISTS idx_tr_registro_equipamiento_areas_fecha 
ON template_schema.tr_registro_equipamiento_areas(area_comun_id, fecha_registro DESC);

-- ===============================================
-- FUNCIONES DE NEGOCIO PARA ÁREAS COMUNES
-- ===============================================

-- Función para validar disponibilidad de área común
CREATE OR REPLACE FUNCTION cf_validar_disponibilidad_area_comun(
    p_area_comun_id UUID,
    p_fecha_reserva DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_excluir_reserva_id UUID DEFAULT NULL
)
RETURNS TABLE(
    disponible BOOLEAN,
    mensaje TEXT,
    conflictos INTEGER
) AS $$
DECLARE
    area_record RECORD;
    conflictos_count INTEGER;
    dia_semana INTEGER;
    horario_valido BOOLEAN := FALSE;
BEGIN
    -- Obtener información del área común
    SELECT ac.*, eac.codigo as estado_codigo
    INTO area_record
    FROM am_areas_comunes ac
    LEFT JOIN am_estados_area_comun eac ON ac.estado_area_id = eac.id
    WHERE ac.id = p_area_comun_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Área común no encontrada', 0;
        RETURN;
    END IF;
    
    -- Verificar que el área esté disponible (no en mantenimiento)
    IF area_record.estado_codigo = 'mantenimiento' THEN
        RETURN QUERY SELECT FALSE, 'El área se encuentra en mantenimiento y no está disponible para reservas', 0;
        RETURN;
    END IF;
    
    -- Verificar que esté en estado publicado
    IF area_record.estado != 'publicado' THEN
        RETURN QUERY SELECT FALSE, 'El área no está disponible para reservas', 0;
        RETURN;
    END IF;
    
    -- Verificar horarios de disponibilidad
    dia_semana := EXTRACT(DOW FROM p_fecha_reserva);
    IF dia_semana = 0 THEN dia_semana := 7; END IF; -- Convertir domingo de 0 a 7
    
    SELECT COUNT(*) > 0 INTO horario_valido
    FROM am_horarios_disponibilidad hd
    WHERE hd.id_area_comun = p_area_comun_id
      AND hd.id_dia_semana = dia_semana
      AND hd.cerrado = FALSE
      AND p_hora_inicio >= hd.hora_inicio
      AND p_hora_fin <= hd.hora_fin;
    
    IF NOT horario_valido THEN
        RETURN QUERY SELECT FALSE, 'El horario solicitado no está dentro de los horarios de disponibilidad del área', 0;
        RETURN;
    END IF;
    
    -- Verificar conflictos con otras reservas confirmadas
    SELECT COUNT(*) INTO conflictos_count
    FROM template_schema.tr_reservas_areas_comunes rac
    JOIN am_estados_reserva_area_comun erac ON rac.estado_reserva_id = erac.id
    WHERE rac.area_comun_id = p_area_comun_id
      AND rac.fecha_reserva = p_fecha_reserva
      AND erac.codigo IN ('confirmada', 'pendiente_pago', 'pagada')
      AND (rac.id != p_excluir_reserva_id OR p_excluir_reserva_id IS NULL)
      AND (
          (p_hora_inicio < rac.hora_fin AND p_hora_fin > rac.hora_inicio)
      );
    
    IF conflictos_count > 0 THEN
        RETURN QUERY SELECT FALSE, 'Ya existe una reserva confirmada en el horario solicitado', conflictos_count;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT TRUE, 'Horario disponible para reserva', 0;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular costo de reserva de área común
CREATE OR REPLACE FUNCTION cf_calcular_costo_reserva_area_comun(
    p_area_comun_id UUID,
    p_fecha_reserva DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME
)
RETURNS TABLE(
    costo_total NUMERIC,
    costo_por_unidad NUMERIC,
    unidades_cobradas NUMERIC,
    unidad_cobro TEXT,
    detalle_calculo TEXT
) AS $$
DECLARE
    area_record RECORD;
    duracion_minutos INTEGER;
    duracion_horas NUMERIC;
    costo_calculado NUMERIC;
    unidades NUMERIC;
BEGIN
    -- Obtener información del área común
    SELECT ac.*, uc.nombre as unidad_cobro_nombre
    INTO area_record
    FROM am_areas_comunes ac
    LEFT JOIN am_unidades_cobro uc ON ac.id_unidad_cobro = uc.id
    WHERE ac.id = p_area_comun_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT 0::NUMERIC, 0::NUMERIC, 0::NUMERIC, 'N/A'::TEXT, 'Área común no encontrada'::TEXT;
        RETURN;
    END IF;
    
    -- Si el costo es 0, es gratis
    IF area_record.costo = 0 THEN
        RETURN QUERY SELECT 0::NUMERIC, 0::NUMERIC, 0::NUMERIC, 
                           COALESCE(area_record.unidad_cobro_nombre, 'Gratis'), 
                           'Área de uso gratuito'::TEXT;
        RETURN;
    END IF;
    
    -- Calcular duración
    duracion_minutos := EXTRACT(EPOCH FROM (p_hora_fin - p_hora_inicio)) / 60;
    duracion_horas := duracion_minutos / 60.0;
    
    -- Calcular según unidad de cobro
    CASE area_record.unidad_cobro_nombre
        WHEN 'Hora' THEN
            unidades := CEIL(duracion_horas);
            costo_calculado := unidades * area_record.costo;
        WHEN 'Día' THEN
            unidades := 1;
            costo_calculado := area_record.costo;
        WHEN 'Evento' THEN
            unidades := 1;
            costo_calculado := area_record.costo;
        ELSE
            unidades := duracion_horas;
            costo_calculado := unidades * area_record.costo;
    END CASE;
    
    RETURN QUERY SELECT 
        costo_calculado,
        area_record.costo,
        unidades,
        COALESCE(area_record.unidad_cobro_nombre, 'Tarifa fija'),
        format('Duración: %s horas (%s minutos). Unidades cobradas: %s %s', 
               duracion_horas, duracion_minutos, unidades, 
               COALESCE(area_record.unidad_cobro_nombre, 'unidad'));
END;
$$ LANGUAGE plpgsql;



-- Vista completa de áreas comunes con información de estado y configuración
CREATE OR REPLACE VIEW vw_areas_comunes_completa AS
SELECT 
    ac.id,
    ac.id_unidad_residencial,
    ur.nombre as unidad_residencial_nombre,
    ac.nombre_area,
    ac.descripcion,
    ac.estado,
    eac.nombre as estado_area_nombre,
    eac.color_hex as estado_color,
    tac.nombre as tipo_area_nombre,
    ac.tipo_detallado,
    ac.costo,
    uc.nombre as unidad_cobro_nombre,
    ac.duracion_min_reserva_valor,
    ac.duracion_min_reserva_unidad,
    ac.duracion_max_reserva_valor,
    ac.duracion_max_reserva_unidad,
    ac.capacidad_maxima,
    ac.antelacion_reserva_valor,
    ac.antelacion_reserva_unidad,
    ac.requiere_aprobacion,
    ac.politicas_uso,
    ac.fotos_urls,
    ac.equipamiento_servicios,
    ac.fecha_ultimo_mantenimiento,
    um.nombre || ' ' || um.apellido as usuario_ultimo_mantenimiento_nombre,
    ac.observaciones_mantenimiento,
    uc_creador.nombre || ' ' || uc_creador.apellido as usuario_creacion_nombre,
    ua_actualizador.nombre || ' ' || ua_actualizador.apellido as usuario_actualizacion_nombre,
    ac.created_at,
    ac.updated_at
FROM am_areas_comunes ac
JOIN am_unidad_residencial ur ON ac.id_unidad_residencial = ur.id
JOIN am_tipos_area_comun tac ON ac.id_tipo_area = tac.id
LEFT JOIN am_estados_area_comun eac ON ac.estado_area_id = eac.id
LEFT JOIN am_unidades_cobro uc ON ac.id_unidad_cobro = uc.id
LEFT JOIN cf_usuarios um ON ac.usuario_ultimo_mantenimiento = um.id
LEFT JOIN cf_usuarios uc_creador ON ac.user_created = uc_creador.id
LEFT JOIN cf_usuarios ua_actualizador ON ac.user_updated = ua_actualizador.id;

-- Vista de reservas de áreas comunes con información completa
CREATE OR REPLACE VIEW vw_reservas_areas_comunes_completa AS
SELECT 
    rac.id,
    rac.area_comun_id,
    ac.nombre_area,
    ac.costo as costo_por_unidad_area,
    rac.apartamento_id,
    a.numero_apto,
    tb.nombre as torre_bloque_nombre,
    rac.residente_id,
    p.nombre || ' ' || p.apellido as residente_nombre,
    p.telefono as residente_telefono,
    p.correo as residente_correo,
    rac.fecha_reserva,
    rac.hora_inicio,
    rac.hora_fin,
    EXTRACT(EPOCH FROM (rac.hora_fin - rac.hora_inicio)) / 60 as duracion_minutos,
    rac.estado_reserva_id,
    erac.nombre as estado_reserva_nombre,
    erac.color_hex as estado_color,
    rac.costo_reserva,
    rac.metodo_pago_id,
    mpr.nombre as metodo_pago_nombre,
    rac.comprobante_pago_url,
    rac.numero_transaccion,
    rac.fecha_pago,
    rac.observaciones_reserva,
    rac.notificacion_enviada,
    rac.fecha_notificacion,
    rac.usuario_aprobacion_id,
    ua.nombre || ' ' || ua.apellido as usuario_aprobacion_nombre,
    rac.fecha_aprobacion,
    rac.motivo_rechazo,
    rac.comentarios,
    u.nombre || ' ' || u.apellido as usuario_reserva_nombre,
    rac.creado_en,
    rac.actualizado_en
FROM template_schema.tr_reservas_areas_comunes rac
JOIN am_areas_comunes ac ON rac.area_comun_id = ac.id
LEFT JOIN am_apto a ON rac.apartamento_id = a.id
LEFT JOIN am_torre_bloque tb ON a.torre_bloque_id = tb.id
LEFT JOIN am_personas p ON rac.residente_id = p.id
LEFT JOIN am_estados_reserva_area_comun erac ON rac.estado_reserva_id = erac.id
LEFT JOIN am_metodos_pago_reservas mpr ON rac.metodo_pago_id = mpr.id
LEFT JOIN cf_usuarios ua ON rac.usuario_aprobacion_id = ua.id
LEFT JOIN cf_usuarios u ON rac.usuario_id = u.id;

-- Vista de horarios de disponibilidad de áreas comunes
CREATE OR REPLACE VIEW vw_horarios_areas_comunes AS
SELECT 
    hd.id,
    hd.id_area_comun,
    ac.nombre_area,
    hd.id_dia_semana,
    ds.nombre as dia_semana_nombre,
    hd.hora_inicio,
    hd.hora_fin,
    hd.cerrado,
    CASE 
        WHEN hd.cerrado THEN 'Cerrado'
        ELSE hd.hora_inicio::TEXT || ' - ' || hd.hora_fin::TEXT
    END as horario_display,
    hd.created_at
FROM am_horarios_disponibilidad hd
JOIN am_areas_comunes ac ON hd.id_area_comun = ac.id
JOIN am_dias_semana ds ON hd.id_dia_semana = ds.id
ORDER BY hd.id_area_comun, hd.id_dia_semana;

-- Vista de equipamiento registrado en áreas comunes
CREATE OR REPLACE VIEW vw_equipamiento_areas_comunes AS
SELECT 
    rea.id as registro_id,
    rea.area_comun_id,
    ac.nombre_area,
    rea.fecha_registro,
    rea.hora_registro,
    rea.observaciones as observaciones_generales,
    dea.id as detalle_id,
    dea.nombre_equipo,
    dea.estado_equipo,
    dea.observaciones as observaciones_equipo,
    dea.cantidad,
    u.nombre || ' ' || u.apellido as usuario_registro_nombre,
    rea.created_at,
    rea.updated_at
FROM template_schema.tr_registro_equipamiento_areas rea
JOIN am_areas_comunes ac ON rea.area_comun_id = ac.id
LEFT JOIN template_schema.tr_detalle_equipamiento_areas dea ON rea.id = dea.registro_equipamiento_id
JOIN cf_usuarios u ON rea.usuario_registro_id = u.id
ORDER BY rea.fecha_registro DESC, rea.hora_registro DESC, dea.nombre_equipo;



-- ===============================================
-- DATOS DE EJEMPLO PARA TABLAS MAESTRAS
-- ===============================================

-- Países
INSERT INTO am_paises (nombre, codigo_internacional, estado) VALUES 
('Colombia', 'CO', TRUE),
('Estados Unidos', 'US', TRUE),
('México', 'MX', TRUE),
('España', 'ES', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Departamentos (Colombia)
INSERT INTO am_departamentos (dane_codigo, nombre, pais_id, estado) VALUES 
('11', 'Bogotá D.C.', (SELECT id FROM am_paises WHERE codigo_internacional = 'CO'), TRUE),
('05', 'Antioquia', (SELECT id FROM am_paises WHERE codigo_internacional = 'CO'), TRUE),
('76', 'Valle del Cauca', (SELECT id FROM am_paises WHERE codigo_internacional = 'CO'), TRUE),
('08', 'Atlántico', (SELECT id FROM am_paises WHERE codigo_internacional = 'CO'), TRUE)
ON CONFLICT (dane_codigo) DO NOTHING;

-- Ciudades principales
INSERT INTO am_ciudades (dane_codigo, nombre, departamento_id, estado) VALUES 
('11001', 'Bogotá', (SELECT id FROM am_departamentos WHERE dane_codigo = '11'), TRUE),
('05001', 'Medellín', (SELECT id FROM am_departamentos WHERE dane_codigo = '05'), TRUE),
('76001', 'Cali', (SELECT id FROM am_departamentos WHERE dane_codigo = '76'), TRUE),
('08001', 'Barranquilla', (SELECT id FROM am_departamentos WHERE dane_codigo = '08'), TRUE)
ON CONFLICT (dane_codigo) DO NOTHING;

-- Datos para tipos de documento base (deben insertarse antes que am_tipos_documento)
INSERT INTO am_tipos_documento_base (codigo, nombre) VALUES
  ('cedula_ciudadania', 'Cédula de Ciudadanía'),
  ('cedula_extranjeria', 'Cédula de Extranjería'),
  ('tarjeta_identidad', 'Tarjeta de Identidad'),
  ('pasaporte', 'Pasaporte'),
  ('nit', 'NIT'),
  ('rut', 'RUT')
ON CONFLICT (codigo) DO NOTHING;

-- Tipos de documento (asociaciones entre tipos base y países)
-- Esta tabla permite que un mismo tipo de documento base (ej: pasaporte) 
-- esté disponible en múltiples países
INSERT INTO am_tipos_documento (tipo_documento_base_id, pais_id) VALUES 
-- Colombia - Documentos disponibles
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'cedula_ciudadania'), (SELECT id FROM am_paises WHERE codigo_internacional = 'CO')),
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'cedula_extranjeria'), (SELECT id FROM am_paises WHERE codigo_internacional = 'CO')),
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'nit'), (SELECT id FROM am_paises WHERE codigo_internacional = 'CO')),
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'pasaporte'), (SELECT id FROM am_paises WHERE codigo_internacional = 'CO')),
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'tarjeta_identidad'), (SELECT id FROM am_paises WHERE codigo_internacional = 'CO')),

-- Estados Unidos - Documentos disponibles
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'pasaporte'), (SELECT id FROM am_paises WHERE codigo_internacional = 'US')),

-- México - Documentos disponibles  
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'nit'), (SELECT id FROM am_paises WHERE codigo_internacional = 'MX')),
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'pasaporte'), (SELECT id FROM am_paises WHERE codigo_internacional = 'MX')),

-- España - Documentos disponibles
((SELECT id FROM am_tipos_documento_base WHERE codigo = 'pasaporte'), (SELECT id FROM am_paises WHERE codigo_internacional = 'ES'))
ON CONFLICT (tipo_documento_base_id, pais_id) DO NOTHING;

-- Tipos de compañía
INSERT INTO am_tipos_compania (codigo, nombre, estado) VALUES 
('SAS', 'Sociedad por Acciones Simplificada', TRUE),
('LTDA', 'Sociedad de Responsabilidad Limitada', TRUE),
('SA', 'Sociedad Anónima', TRUE),
('EMPRESA_UNIPERSONAL', 'Empresa Unipersonal', TRUE),
('COOPERATIVA', 'Cooperativa', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Tipos de negocio
INSERT INTO am_tipos_negocio (codigo, nombre, estado) VALUES 
('empresa', 'Empresa', TRUE),
('unidad_residencial', 'Unidad Residencial', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Estados de suscripción
INSERT INTO am_estados_suscripcion (codigo, nombre, estado) VALUES 
('activa', 'Activa', TRUE),
('suspendida', 'Suspendida', TRUE),
('cancelada', 'Cancelada', TRUE),
('vencida', 'Vencida', TRUE),
('prueba', 'Período de Prueba', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Géneros
INSERT INTO am_generos (codigo, nombre, estado) VALUES 
('M', 'Masculino', TRUE),
('F', 'Femenino', TRUE),
('O', 'Otro', TRUE),
('NR', 'No reporta', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Estados para apartamentos
INSERT INTO am_estado_apto (codigo, nombre, estado) VALUES 
('disponible', 'Disponible', TRUE),
('ocupado', 'Ocupado', TRUE),
('mantenimiento', 'En Mantenimiento', TRUE),
('reservado', 'Reservado', TRUE),
('inactivo', 'Inactivo', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Tipos de vehículo
INSERT INTO am_tipos_vehiculo (codigo, nombre, estado) VALUES 
('auto', 'Automóvil', TRUE),
('moto', 'Motocicleta', TRUE),
('bicicleta', 'Bicicleta', TRUE),
('camioneta', 'Camioneta', TRUE),
('otro', 'Otro', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Estados de vehículo
CREATE TABLE IF NOT EXISTS am_estados_vehiculo (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estados de correspondencia
CREATE TABLE IF NOT EXISTS am_estados_correspondencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  color_hex VARCHAR(7),
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de correspondencia
CREATE TABLE IF NOT EXISTS am_tipos_correspondencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Empresas de mensajería
CREATE TABLE IF NOT EXISTS am_empresas_mensajeria (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Motivos de devolución de correspondencia
CREATE TABLE IF NOT EXISTS am_motivos_devolucion_correspondencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de minuta/reporte
CREATE TABLE IF NOT EXISTS am_tipos_minuta (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  requiere_seccion_adicional BOOLEAN DEFAULT FALSE,
  nombre_seccion_adicional TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Destinatarios de notificación
CREATE TABLE IF NOT EXISTS am_destinatarios_notificacion (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ubicaciones de incidencia
CREATE TABLE IF NOT EXISTS am_ubicaciones_incidencia (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Visitantes (tabla faltante para referencias)
CREATE TABLE IF NOT EXISTS am_visitantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_documento_id INTEGER NOT NULL,
  documento TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT,
  telefono TEXT,
  correo TEXT,
  empresa_visitante TEXT,
  foto_url TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_visitante_tipo_doc FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT uq_visitante_documento UNIQUE (tipo_documento_id, documento)
);

-- Medios de pago
CREATE TABLE IF NOT EXISTS am_medios_pago (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tipos de cargo para tarifas
CREATE TABLE IF NOT EXISTS am_tipos_cargo_tarifa (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Días de la semana
INSERT INTO am_dias_semana (id, nombre) VALUES 
(1, 'Lunes'),
(2, 'Martes'),
(3, 'Miércoles'),
(4, 'Jueves'),
(5, 'Viernes'),
(6, 'Sábado'),
(7, 'Domingo')
ON CONFLICT (id) DO NOTHING;

-- Unidades de cobro
INSERT INTO am_unidades_cobro (nombre, descripcion) VALUES 
('Hora', 'Cobro por hora'),
('Día', 'Cobro por día completo'),
('Evento', 'Cobro por evento'),
('Mes', 'Cobro mensual'),
('Minuto', 'Cobro por minuto'),
('Fracción 15 min', 'Cobro por fracción de 15 minutos'),
('Fracción 30 min', 'Cobro por fracción de 30 minutos'),
('Tarifa única', 'Tarifa fija sin importar el tiempo')
ON CONFLICT (nombre) DO NOTHING;

-- Funcionalidades del sistema
INSERT INTO cf_funcionalidades (nombre, descripcion, estado) VALUES 
('usuarios', 'Gestión de usuarios del sistema', TRUE),
('empresas', 'Administración de empresas', TRUE),
('unidades_residenciales', 'Administración de unidades residenciales', TRUE),
('visitantes', 'Gestión de visitantes', TRUE),
('areas_comunes', 'Administración de áreas comunes', TRUE),
('reservas', 'Sistema de reservas', TRUE),
('reportes', 'Generación de reportes', TRUE),
('configuracion', 'Configuración del sistema', TRUE),
('auditoria', 'Logs de auditoría', TRUE),
('apartamentos', 'Gestión de apartamentos', TRUE),
('propietarios', 'Administración de propietarios', TRUE),
('residentes', 'Gestión de residentes', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Roles por tipo de negocio
INSERT INTO cf_roles (nombre, tipo_negocio_id, descripcion, estado) VALUES 
-- Roles para empresas
('Super Admin Empresa', (SELECT id FROM am_tipos_negocio WHERE codigo = 'empresa'), 'Administrador principal de la empresa', TRUE),
('Admin Empresa', (SELECT id FROM am_tipos_negocio WHERE codigo = 'empresa'), 'Administrador de empresa', TRUE),
('Operador Empresa', (SELECT id FROM am_tipos_negocio WHERE codigo = 'empresa'), 'Operador con permisos limitados', TRUE),

-- Roles para unidades residenciales
('Administrador UR', (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), 'Administrador de unidad residencial', TRUE),
('Portero', (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), 'Personal de portería', TRUE),
('Vigilante', (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), 'Personal de vigilancia', TRUE),
('Residente', (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), 'Residente de la unidad', TRUE),
('Propietario', (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), 'Propietario de apartamento', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Planes de suscripción
INSERT INTO am_pricing_plans (title, price, description, is_popular, button_text, button_url, order_index, price_anual, descuento, tipo_negocio_id, visible, activo, storage_mb_empresa, storage_mb_unidad) VALUES 
-- Planes para empresas
('Básico Empresa', '$99', 'Plan básico para empresas pequeñas', 'false', 'Seleccionar', '/planes/basico-empresa', 1, '$990', 15, (SELECT id FROM am_tipos_negocio WHERE codigo = 'empresa'), TRUE, TRUE, 1024, 0),
('Profesional Empresa', '$199', 'Plan profesional para empresas medianas', 'true', 'Seleccionar', '/planes/profesional-empresa', 2, '$1990', 20, (SELECT id FROM am_tipos_negocio WHERE codigo = 'empresa'), TRUE, TRUE, 5120, 0),
('Enterprise', '$399', 'Plan enterprise para grandes empresas', 'false', 'Contactar', '/planes/enterprise', 3, '$3990', 25, (SELECT id FROM am_tipos_negocio WHERE codigo = 'empresa'), TRUE, TRUE, 20480, 0),

-- Planes para unidades residenciales
('Básico UR', '$49', 'Plan básico para unidades residenciales pequeñas', 'false', 'Seleccionar', '/planes/basico-ur', 1, '$490', 15, (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), TRUE, TRUE, 0, 512),
('Estándar UR', '$99', 'Plan estándar para unidades residenciales medianas', 'true', 'Seleccionar', '/planes/estandar-ur', 2, '$990', 20, (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), TRUE, TRUE, 0, 2048),
('Premium UR', '$199', 'Plan premium para unidades residenciales grandes', 'false', 'Seleccionar', '/planes/premium-ur', 3, '$1990', 25, (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), TRUE, TRUE, 0, 10240);

-- Usuario super administrador de ejemplo
INSERT INTO cf_usuarios (nombre, apellido, correo, usuario, clave, estado) VALUES 
('Super', 'Admin', 'admin@appmon.com', 'superadmin', '$2b$10$rQJ8YlGjqKVY9v6YlOaQrO.QVY9v6YlOaQrO.QVY9v6YlOaQrO.QVY', TRUE)
ON CONFLICT (correo) DO NOTHING;

-- Empresa de ejemplo
INSERT INTO am_empresas (tipo_documento_id, documento, nombre, direccion, telefono, correo, tipo_compania_id, estado, ciudad_id) VALUES 
((SELECT td.id FROM am_tipos_documento td JOIN am_tipos_documento_base tdb ON td.tipo_documento_base_id = tdb.id JOIN am_paises p ON td.pais_id = p.id WHERE tdb.codigo = 'nit' AND p.codigo_internacional = 'CO'), '900123456-1', 'AppMon Solutions SAS', 'Calle 123 #45-67', '+57 1 234 5678', 'contacto@appmon.com', (SELECT id FROM am_tipos_compania WHERE codigo = 'SAS'), 'activo', (SELECT id FROM am_ciudades WHERE dane_codigo = '11001'))
ON CONFLICT (documento, tipo_documento_id) DO NOTHING;

-- Unidad residencial de ejemplo
INSERT INTO am_unidad_residencial (tipo_documento_id, documento, nombre, direccion, ciudad_id, telefono_administradora, telefono_soporte, correo_contacto, descripcion, empresa_id) VALUES 
((SELECT td.id FROM am_tipos_documento td JOIN am_tipos_documento_base tdb ON td.tipo_documento_base_id = tdb.id JOIN am_paises p ON td.pais_id = p.id WHERE tdb.codigo = 'nit' AND p.codigo_internacional = 'CO'), '900987654-1', 'Conjunto Residencial Los Pinos', 'Carrera 15 #28-30', (SELECT id FROM am_ciudades WHERE dane_codigo = '11001'), '+57 1 345 6789', '+57 1 345 6790', 'admin@lospinos.com', 'Conjunto residencial familiar de 5 torres', (SELECT id FROM am_empresas WHERE documento = '900123456-1'))
ON CONFLICT (documento, tipo_documento_id) DO NOTHING;


-- Datos para confirmación
INSERT INTO am_confirmacion (codigo, nombre) VALUES
  ('pendiente', 'Pendiente'),
  ('aprobado', 'Aprobado'),
  ('rechazado', 'Rechazado')
ON CONFLICT (codigo) DO NOTHING;

-- Datos para tipos de inmueble
INSERT INTO am_tipos_inmueble (codigo, nombre) VALUES
  ('apartamento', 'Apartamento'),
  ('casa', 'Casa'),
  ('local', 'Local')
ON CONFLICT (codigo) DO NOTHING;

-- Datos para estado del módulo
INSERT INTO am_module_status (codigo, nombre) VALUES
  ('active', 'Activo'),
  ('inactive', 'Inactivo')
ON CONFLICT (codigo) DO NOTHING;

-- Datos para estados de contacto
INSERT INTO am_contact_submission_estado (codigo, nombre) VALUES
  ('abierto', 'Abierto'),
  ('en_proceso', 'En proceso'),
  ('cerrado', 'Cerrado'),
  ('cancelado', 'Cancelado')
ON CONFLICT (codigo) DO NOTHING;

-- Datos para tipos de lead
INSERT INTO am_tipo_lead (codigo, nombre) VALUES
  ('lead', 'Lead'),
  ('prospecto', 'Prospecto'),
  ('venta', 'Venta'),
  ('no_venta', 'No Venta'),
  ('prueba', 'Prueba')
ON CONFLICT (codigo) DO NOTHING;

-- Datos para rol consejo
INSERT INTO am_rol_consejo (codigo, nombre) VALUES
  ('principal', 'Principal'),
  ('suplente', 'Suplente')
ON CONFLICT (codigo) DO NOTHING;

-- Configuración inicial del sitio
INSERT INTO am_site_config (site_name, site_icon_url) VALUES 
('AppMon', '/assets/logo.png')
ON CONFLICT DO NOTHING;

-- Enlaces sociales de ejemplo
INSERT INTO am_social_links (platform, url, icon, order_index) VALUES 
('Facebook', 'https://facebook.com/appmon', 'fab fa-facebook', 1),
('Twitter', 'https://twitter.com/appmon', 'fab fa-twitter', 2),
('LinkedIn', 'https://linkedin.com/company/appmon', 'fab fa-linkedin', 3)
ON CONFLICT DO NOTHING;

-- Menu items de ejemplo
INSERT INTO am_menu_items (label, url, order_index) VALUES 
('Inicio', '/', 1),
('Planes', '/planes', 2),
('Contacto', '/contacto', 3),
('Acerca de', '/acerca', 4)
ON CONFLICT DO NOTHING;

-- Medios de pago
INSERT INTO am_medios_pago (codigo, nombre, descripcion, estado) VALUES 
('efectivo', 'Efectivo', 'Pago en efectivo', TRUE),
('cuenta_cobro', 'Cuenta de Cobro', 'Cargo a cuenta de cobro del residente', TRUE),
('debito', 'Tarjeta Débito', 'Pago con tarjeta débito', TRUE),
('credito', 'Tarjeta Crédito', 'Pago con tarjeta de crédito', TRUE),
('transferencia', 'Transferencia Bancaria', 'Transferencia bancaria electrónica', TRUE),
('pse', 'PSE', 'Pagos Seguros en Línea', TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Tipos de cargo para tarifas
INSERT INTO am_tipos_cargo_tarifa (codigo, nombre, descripcion, estado) VALUES 
('residente', 'Residente', 'El costo es asumido por el residente/propietario del apartamento', TRUE),
('visitante', 'Visitante', 'El costo es asumido por el visitante', TRUE)
ON CONFLICT (codigo) DO NOTHING;


-- Triggers para actualización automática de updated_at en tablas de template_schema
CREATE TRIGGER update_tr_registro_visitantes_updated_at BEFORE UPDATE ON template_schema.tr_registro_visitantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_reservas_areas_comunes_updated_at BEFORE UPDATE ON template_schema.tr_reservas_areas_comunes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_historial_apartamento_updated_at BEFORE UPDATE ON template_schema.tr_historial_apartamento FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_logs_auditoria_updated_at BEFORE UPDATE ON template_schema.tr_logs_auditoria FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_registro_vehiculos_updated_at BEFORE UPDATE ON template_schema.tr_registro_vehiculos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_cobros_parqueadero_updated_at BEFORE UPDATE ON template_schema.tr_cobros_parqueadero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_correspondencia_updated_at BEFORE UPDATE ON template_schema.tr_correspondencia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_devoluciones_correspondencia_updated_at BEFORE UPDATE ON template_schema.tr_devoluciones_correspondencia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_minutas_updated_at BEFORE UPDATE ON template_schema.tr_minutas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_minutas_evidencias_updated_at BEFORE UPDATE ON template_schema.tr_minutas_evidencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_registro_equipamiento_areas_updated_at BEFORE UPDATE ON template_schema.tr_registro_equipamiento_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tr_detalle_equipamiento_areas_updated_at BEFORE UPDATE ON template_schema.tr_detalle_equipamiento_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 1. Modificar am_personas para ser un catálogo GLOBAL
ALTER TABLE am_personas DROP CONSTRAINT IF EXISTS uq_personas_documento_tipo;
ALTER TABLE am_personas DROP CONSTRAINT IF EXISTS fk_personas_unidad;
ALTER TABLE am_personas DROP COLUMN IF EXISTS unidad_residencial_id;

-- 2. Crear constraint único GLOBAL (sin unidad)
ALTER TABLE am_personas 
ADD CONSTRAINT uq_personas_documento_tipo_global 
UNIQUE (documento, tipo_documento_id);

-- 3. Crear tabla de relación persona-unidad (muchos a muchos)
CREATE TABLE am_personas_x_unidad_residencial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID NOT NULL,
  unidad_residencial_id UUID NOT NULL,
  fecha_vinculacion TIMESTAMPTZ DEFAULT now(),
  fecha_desvinculacion TIMESTAMPTZ,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_persona_unidad_persona FOREIGN KEY (persona_id) REFERENCES am_personas(id),
  CONSTRAINT fk_persona_unidad_unidad FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id),
  CONSTRAINT uq_persona_unidad_activa UNIQUE (persona_id, unidad_residencial_id)
);

-- Agregar columna unidad_residencial_id a am_archivos
ALTER TABLE am_archivos 
ADD COLUMN IF NOT EXISTS unidad_residencial_id UUID;

-- Agregar foreign key
ALTER TABLE am_archivos 
ADD CONSTRAINT fk_archivos_unidad_residencial 
FOREIGN KEY (unidad_residencial_id) REFERENCES am_unidad_residencial(id);

-- Crear índices optimizados
CREATE INDEX IF NOT EXISTS idx_archivos_unidad_categoria 
    ON am_archivos(unidad_residencial_id, categoria) 
    WHERE unidad_residencial_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_archivos_unidad_fecha 
    ON am_archivos(unidad_residencial_id, fecha_subida DESC) 
    WHERE unidad_residencial_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_archivos_peso_unidad 
    ON am_archivos(unidad_residencial_id, peso_mb) 
    WHERE unidad_residencial_id IS NOT NULL;


    -- Función para verificar límite de storage antes de subir archivo
CREATE OR REPLACE FUNCTION cf_verificar_limite_storage_unidad(
    p_unidad_residencial_id UUID,
    p_peso_nuevo_archivo_mb NUMERIC
)
RETURNS TABLE(
    puede_subir BOOLEAN,
    storage_actual_mb NUMERIC,
    limite_mb NUMERIC,
    storage_despues_subida_mb NUMERIC,
    porcentaje_uso_actual NUMERIC,
    porcentaje_uso_despues NUMERIC
) AS $$
DECLARE
    storage_actual NUMERIC;
    limite_storage NUMERIC;
BEGIN
    -- Obtener storage actual de la unidad
    SELECT COALESCE(SUM(peso_mb), 0) INTO storage_actual
    FROM am_archivos 
    WHERE unidad_residencial_id = p_unidad_residencial_id;
    
    -- Obtener límite del plan activo
    SELECT pp.storage_mb_unidad INTO limite_storage
    FROM am_unidad_plan_suscripcion ups
    JOIN am_pricing_plans pp ON ups.plan_id = pp.id
    WHERE ups.unidad_residencial_id = p_unidad_residencial_id 
      AND ups.es_actual = TRUE;
    
    -- Si no hay límite configurado, permitir
    IF limite_storage IS NULL OR limite_storage = 0 THEN
        RETURN QUERY SELECT 
            TRUE,
            storage_actual,
            limite_storage,
            storage_actual + p_peso_nuevo_archivo_mb,
            0::NUMERIC,
            0::NUMERIC;
        RETURN;
    END IF;
    
    -- Verificar si puede subir el archivo
    RETURN QUERY SELECT 
        (storage_actual + p_peso_nuevo_archivo_mb) <= limite_storage,
        storage_actual,
        limite_storage,
        storage_actual + p_peso_nuevo_archivo_mb,
        ROUND((storage_actual * 100.0 / limite_storage), 2),
        ROUND(((storage_actual + p_peso_nuevo_archivo_mb) * 100.0 / limite_storage), 2);
END;
$$ LANGUAGE plpgsql;
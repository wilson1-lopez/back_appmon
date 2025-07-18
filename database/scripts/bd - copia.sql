CREATE SCHEMA IF NOT EXISTS public;
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
  ciudad_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_empresa_tipo_documento FOREIGN KEY (tipo_documento_id) REFERENCES am_tipos_documento(id),
  CONSTRAINT fk_empresa_tipo_compania FOREIGN KEY (tipo_compania_id) REFERENCES am_tipos_compania(id),
  CONSTRAINT fk_empresa_ciudad FOREIGN KEY (ciudad_id) REFERENCES am_ciudades(id),
  CONSTRAINT chk_empresa_estado CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  CONSTRAINT chk_empresa_correo CHECK (correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT uq_empresa_documento UNIQUE (documento, tipo_documento_id)
);

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

-- Esquema plantilla (para clonar tablas privadas por unidad residencial)
CREATE SCHEMA IF NOT EXISTS template_schema;

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
    'tr_registro_visitantes'
    ,'tr_historial_apartamento' 
    ,'tr_reservas_areas_comunes'
    ,'tr_logs_auditoria'
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
('Mes', 'Cobro mensual')
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
('Premium UR', '$199', 'Plan premium para unidades residenciales grandes', 'false', 'Seleccionar', '/planes/premium-ur', 3, '$1990', 25, (SELECT id FROM am_tipos_negocio WHERE codigo = 'unidad_residencial'), TRUE, TRUE, 0, 10240)
ON CONFLICT DO NOTHING;

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

-- ===============================================
-- DATOS DE EJEMPLO PARA NUEVAS TABLAS DE APPMON
-- ===============================================

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


const DEFAULT_USER_IMAGE_URL = '/fallback-participant-profile-image.svg'

const GENDERS_CATEGORIES = ["FEMALE", "MALE", "MIXED"] as const

const PDF_FONT_BASE_SIZE = '0.35cm'
const PDF_LINE_HEIGHT_BASE_SIZE = 1.8

const GENDERS = ["FEMALE", "MALE"] as const
const GENDERS_MAP = {
    "FEMALE": "Femenino",
    "MALE": "Masculino",
    "MIXED": "Mixto"
}

const PARTICIPANTS_TYPES_MAP = {
    "STUDENT": 'ESTUDIANTE',
    "TEACHER": 'PROFESOR'
}

const PARTICIPANTS_GENDERS_TYPES_MAP = {
    "STUDENT": {
        "MALE": 'ESTUDIANTE',
        "FEMALE": 'ESTUDIANTE'
    },
    "TEACHER": {
        "MALE": 'PROFESOR',
        "FEMALE": 'PROFESORA'
    }
}

const ROLES_MAP = {
    PLAYER: "DEPORTISTAS",
    COACHING_STAFF: "CUERPO TÉCNICO",
    TEAM_MANAGER: "DELEGADO"
}

const DISCIPLINES_MAP = {
    "TEAM_MANAGER": {
        singular: "Delegado",
        plural: "Delegados"
    },
    "PLAYER": {
        singular: "Jugador",
        plural: "Jugadores"
    },
    "COACHING_STAFF": {
        singular: "Cuerpo Técnico",
        plural: "Cuerpo Técnico"
    }
}

const STUDENTS_PER_PAGE = 8

const TEACHERS_PER_PAGE = 8

export {
    DEFAULT_USER_IMAGE_URL,
    GENDERS,
    GENDERS_CATEGORIES,
    GENDERS_MAP,
    DISCIPLINES_MAP,
    STUDENTS_PER_PAGE,
    TEACHERS_PER_PAGE,
    PDF_FONT_BASE_SIZE,
    PDF_LINE_HEIGHT_BASE_SIZE,
    ROLES_MAP,
    PARTICIPANTS_TYPES_MAP,
    PARTICIPANTS_GENDERS_TYPES_MAP
}
const DEFAULT_USER_IMAGE_URL = '/fallback-participant-profile-image.svg'

const GENDERS_CATEGORIES = ["FEMALE", "MALE", "MIXED"] as const

const GENDERS = ["FEMALE", "MALE"] as const
const GENDERS_MAP = {
    "FEMALE": "Femenino",
    "MALE": "Masculino",
    "MIXED": "Mixto"
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

export {
    DEFAULT_USER_IMAGE_URL,
    GENDERS,
    GENDERS_CATEGORIES,
    GENDERS_MAP,
    DISCIPLINES_MAP
}
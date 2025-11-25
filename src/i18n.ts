import { Request } from "express";

type Lang = "en" | "es" | "fr";

const messages: Record<Lang, Record<string, string>> = {
  en: {
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_IN_USE: "Email already used",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    RESTAURANT_NOT_FOUND: "Restaurant not found",
    REVIEW_NOT_FOUND: "Review not found",
    TOO_MANY_REQUESTS: "Too many requests, please try again later",
    INTERNAL_ERROR: "Internal server error",
    REVIEW_UPDATED: "Review updated",
    FAVORITE_ADDED: "Added to favorites",
    RESTAURANT_UPDATED: "Restaurant updated successfully",
    INVALID_PAYLOAD: "Invalid payload",
    ADMIN_STATS_ERROR: "Failed to load admin statistics",
    ALREADY_FAVORITE: "Already added to favorites",
    USER_NOT_FOUND: "User not found",
    CACHE_MIDDLEWARE_ERROR: "Cache middleware error",
    RATE_LIMIT_AUTH: "Too many login attempts, please try again later",
    VALIDATION_ERROR: "Validation error",

    // DTO validation
    INVALID_EMAIL: "Email is not valid",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    PASSWORD_UPPERCASE_REQUIRED: "Password must contain an uppercase letter",
    PASSWORD_LOWERCASE_REQUIRED: "Password must contain a lowercase letter",
    PASSWORD_NUMBER_REQUIRED: "Password must contain a number",
    PASSWORD_REQUIRED: "Password is required",
    NAME_REQUIRED: "Name is required",

    INVALID_PAGE: "Invalid page number",
    INVALID_LIMIT: "Invalid limit",
    INVALID_RATING: "Rating must be a number",
    RATING_MIN: "Rating cannot be lower than 1",
    RATING_MAX: "Rating cannot be higher than 5",

    INVALID_SORT: "Invalid sort format",
    INVALID_LAT: "Invalid latitude",
    INVALID_LNG: "Invalid longitude",

    INVALID_DAY: "Invalid day",
    INVALID_HOURS: "Invalid hours format",

    INVALID_RESTAURANT_ID: "Invalid restaurant ID",
    INVALID_REVIEW_ID: "Invalid review ID",

    REQUIRED: "The field is required:",
    ALREADY_REVIEWED: "You have already submitted a review for this restaurant",

    // Length validations
    COMMENTS_TOO_LONG: "Comments cannot exceed 5000 characters",
    NAME_TOO_LONG: "Name cannot exceed 200 characters",
    NEIGHBORHOOD_TOO_LONG: "Neighborhood cannot exceed 100 characters",
    CUISINE_TYPE_TOO_LONG: "Cuisine type cannot exceed 100 characters",
    ADDRESS_TOO_LONG: "Address cannot exceed 500 characters",
    PHOTOGRAPH_TOO_LONG: "Photograph URL cannot exceed 1000 characters",
    IMAGE_TOO_LONG: "Image URL cannot exceed 1000 characters",
    PASSWORD_TOO_LONG: "Password cannot exceed 128 characters"
  },

  es: {
    INVALID_CREDENTIALS: "Credenciales inválidas",
    EMAIL_IN_USE: "El email ya está en uso",
    UNAUTHORIZED: "No autorizado",
    FORBIDDEN: "Prohibido",
    RESTAURANT_NOT_FOUND: "Restaurante no encontrado",
    REVIEW_NOT_FOUND: "Reseña no encontrada",
    TOO_MANY_REQUESTS: "Demasiadas peticiones, inténtalo de nuevo más tarde",
    INTERNAL_ERROR: "Error interno del servidor",
    REVIEW_UPDATED: "Reseña actualizada",
    FAVORITE_ADDED: "Añadido a favoritos",
    RESTAURANT_UPDATED: "Restaurante actualizado correctamente",
    INVALID_PAYLOAD: "Payload inválido",
    ADMIN_STATS_ERROR: "No se pudieron cargar las estadísticas de administración",
    ALREADY_FAVORITE: "Ya está en favoritos",
    USER_NOT_FOUND: "Usuario no encontrado",
    CACHE_MIDDLEWARE_ERROR: "Error en el middleware de caché",
    RATE_LIMIT_AUTH: "Demasiados intentos de login, inténtalo más tarde",
    VALIDATION_ERROR: "Error de validación",


    // DTO validation
    INVALID_EMAIL: "El email no es válido",
    PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres",
    PASSWORD_UPPERCASE_REQUIRED: "La contraseña debe contener una mayúscula",
    PASSWORD_LOWERCASE_REQUIRED: "La contraseña debe contener una minúscula",
    PASSWORD_NUMBER_REQUIRED: "La contraseña debe contener un número",
    PASSWORD_REQUIRED: "La contraseña es obligatoria",
    NAME_REQUIRED: "El nombre es obligatorio",

    INVALID_PAGE: "El número de página no es válido",
    INVALID_LIMIT: "El límite no es válido",
    INVALID_RATING: "El rating debe ser un número",
    RATING_MIN: "El rating no puede ser menor que 1",
    RATING_MAX: "El rating no puede ser mayor que 5",

    INVALID_SORT: "El formato de ordenación es inválido",
    INVALID_LAT: "Latitud inválida",
    INVALID_LNG: "Longitud inválida",

    INVALID_DAY: "Día inválido",
    INVALID_HOURS: "Formato de horas inválido",

    INVALID_RESTAURANT_ID: "ID de restaurante inválido",
    INVALID_REVIEW_ID: "ID de reseña inválido",

    REQUIRED: "El campo es obligatorio:",
    ALREADY_REVIEWED: "Ya has enviado una reseña para este restaurante",

    // Length validations
    COMMENTS_TOO_LONG: "Los comentarios no pueden exceder 5000 caracteres",
    NAME_TOO_LONG: "El nombre no puede exceder 200 caracteres",
    NEIGHBORHOOD_TOO_LONG: "El barrio no puede exceder 100 caracteres",
    CUISINE_TYPE_TOO_LONG: "El tipo de cocina no puede exceder 100 caracteres",
    ADDRESS_TOO_LONG: "La dirección no puede exceder 500 caracteres",
    PHOTOGRAPH_TOO_LONG: "La URL de la fotografía no puede exceder 1000 caracteres",
    IMAGE_TOO_LONG: "La URL de la imagen no puede exceder 1000 caracteres",
    PASSWORD_TOO_LONG: "La contraseña no puede exceder 128 caracteres"
  },

  fr: {
    INVALID_CREDENTIALS: "Identifiants invalides",
    EMAIL_IN_USE: "L'email est déjà utilisé",
    UNAUTHORIZED: "Non autorisé",
    FORBIDDEN: "Interdit",
    RESTAURANT_NOT_FOUND: "Restaurant introuvable",
    REVIEW_NOT_FOUND: "Avis introuvable",
    TOO_MANY_REQUESTS: "Trop de requêtes, réessayez plus tard",
    INTERNAL_ERROR: "Erreur interne du serveur",
    REVIEW_UPDATED: "Avis mis à jour",
    FAVORITE_ADDED: "Ajouté aux favoris",
    RESTAURANT_UPDATED: "Restaurant mis à jour avec succès",
    INVALID_PAYLOAD: "Données invalides",
    ADMIN_STATS_ERROR: "Impossible de charger les statistiques d'administration",
    ALREADY_FAVORITE: "Déjà dans les favoris",
    USER_NOT_FOUND: "Utilisateur introuvable",
    CACHE_MIDDLEWARE_ERROR: "Erreur du middleware de cache",
    RATE_LIMIT_AUTH: "Trop de tentatives de connexion, réessayez plus tard",
    VALIDATION_ERROR: "Erreur de validation",

    // DTO validation
    INVALID_EMAIL: "L'email n'est pas valide",
    PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères",
    PASSWORD_UPPERCASE_REQUIRED: "Le mot de passe doit contenir une majuscule",
    PASSWORD_LOWERCASE_REQUIRED: "Le mot de passe doit contenir une minuscule",
    PASSWORD_NUMBER_REQUIRED: "Le mot de passe doit contenir un chiffre",
    PASSWORD_REQUIRED: "Le mot de passe est obligatoire",
    NAME_REQUIRED: "Le nom est obligatoire",

    INVALID_PAGE: "Numéro de page invalide",
    INVALID_LIMIT: "Limite invalide",
    INVALID_RATING: "La note doit être un nombre",
    RATING_MIN: "La note ne peut pas être inférieure à 1",
    RATING_MAX: "La note ne peut pas dépasser 5",

    INVALID_SORT: "Format de tri invalide",
    INVALID_LAT: "Latitude invalide",
    INVALID_LNG: "Longitude invalide",

    INVALID_DAY: "Jour invalide",
    INVALID_HOURS: "Format horaire invalide",

    INVALID_RESTAURANT_ID: "ID de restaurant invalide",
    INVALID_REVIEW_ID: "ID d'avis invalide",

    REQUIRED: "Le champ est obligatoire :",
    ALREADY_REVIEWED: "Vous avez déjà déposé un avis pour ce restaurant",

    // Length validations
    COMMENTS_TOO_LONG: "Les commentaires ne peuvent pas dépasser 5000 caractères",
    NAME_TOO_LONG: "Le nom ne peut pas dépasser 200 caractères",
    NEIGHBORHOOD_TOO_LONG: "Le quartier ne peut pas dépasser 100 caractères",
    CUISINE_TYPE_TOO_LONG: "Le type de cuisine ne peut pas dépasser 100 caractères",
    ADDRESS_TOO_LONG: "L'adresse ne peut pas dépasser 500 caractères",
    PHOTOGRAPH_TOO_LONG: "L'URL de la photographie ne peut pas dépasser 1000 caractères",
    IMAGE_TOO_LONG: "L'URL de l'image ne peut pas dépasser 1000 caractères",
    PASSWORD_TOO_LONG: "Le mot de passe ne peut pas dépasser 128 caractères"
  },
};

function getLangFromRequest(req: Request): Lang {
  const header = req.headers["accept-language"];
  if (typeof header === "string" && header.toLowerCase().startsWith("es")) {
    return "es";
  }
  if (typeof header === "string" && header.toLowerCase().startsWith("fr")) {
    return "fr";
  }
  return "en";
}

export function t(req: Request, key: string): string {
  const lang = getLangFromRequest(req);
  return messages[lang][key] ?? messages.en[key] ?? key;
}
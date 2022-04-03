// Auth methods messages
export const MSG_EMPTY_REQUEST = 'Please. Send your information to register.';
export const MSG_EMAIL_FORMAT = 'Please. Send an email with a valid format.';
export const MSG_PASSWORD_FORMAT = 'Please. Send a password with at least 10 characters, one lowercase letter, one uppercase letter, and one of the following characters: !, @, #, ? or ].';
export const MSG_USER_NOT_FOUND = 'The user could not be valid, check your email and password and try again';
export const MSG_EMAIL_REGISTERED = 'The email $EMAIL is already registered.';

// Song methods messages to register
export const MSG_SONG_REGISTER_SUCCEED = 'The $TYPE song was registered successfully.';
export const MSG_SONG_REGISTER_DUPLICATED = 'The song $SONG_NAME already was registered on $TYPE list.';

// Song methods messages to update
export const MSG_SONG_UPDATE_MISSED_ID = 'The song\'s Id couldn\'t be found';
export const MSG_SONG_UPDATE_MISSED_SONG = 'The song couldn\'t be found';
export const MSG_SONG_UPDATE_MISSED_ALL_PARAMETERS = 'It couldn\'t find any song parameter sent to update';
export const MSG_SONG_UPDATE_SUCCEED = "The song $SONG_NAME was updated";


// Server Error
export const MSG_SERVER_ERROR_500 = "Error unexpected on the request";

export function newUserIsValid(user){
    return ( usernameIsValid(user) && passwordIsValid(user));
}

export function userIsValid(user){
    return (idIsValid(user) && usernameIsValid(user) && passwordIsValid(user));
}

function idIsValid(user){
    return (user.id && typeof user.id==="number" && Number.isInteger(user.id) && user.id>0);
}

function usernameIsValid(user){
    return (user.username && typeof user.username==="string");
}

function passwordIsValid(user){
    return (user.password && typeof user.password==="string");
}
export function newNoteIsValid(note){
    return (titleIsValid(note) && textIsValid(note));
}

export function noteIsValid(note){
    return (idIsValid(note) && titleIsValid(note) && textIsValid(note) && userIdIsValid(note));
}

function idIsValid(note){
    return (note.id && typeof note.id==="number" && Number.isInteger(note.id) && note.id>0);
}

function titleIsValid(note){
    return (note.title && typeof note.title==="string" && note.title.length<256);
}

function textIsValid(note){
    return (note.text && typeof note.text==="string" && note.text.length<512);
}

function userIdIsValid(note){
    return (note.UserId && typeof note.UserId==="number" && Number.isInteger(note.UserId) && note.UserId>0);
}
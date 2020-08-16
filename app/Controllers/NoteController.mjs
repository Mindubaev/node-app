import express from 'express';
import {newNoteIsValid,noteIsValid} from '../Validators/NoteValidator.mjs'

export default class NoteController{

    constructor(app,noteService){
        this.app=app;
        this.noteService=noteService;
        this.jsonParser=express.json();
        this.handleGetNote();
        this.handlePostNote();
        this.handlePutNote();
        this.handleDeleteNote();
    }

    handleGetNote(){
        this.app.get("/note/:noteId",async (req,resp)=>{
            let noteId=Number(req.params.noteId);
            if (!Number.isInteger(noteId) ||  (Number.isInteger(noteId) && noteId<0))
                resp.sendStatus(400);
            else{
                let note= await this.noteService.findById(noteId);
                if (!note)
                    resp.sendStatus(404);
                else{
                    resp.status(200);
                    resp.json(note);
                }
            }
        });
    }

    handlePostNote(){
        this.app.post("/note",this.jsonParser,async (req,resp)=>{
            let note=req.body;
            if (newNoteIsValid(note)){
                note=await this.noteService.save(note);
                resp.status(200);
                resp.json(note);
            }
            else
                resp.sendStatus(400);
        });
    }

    handlePutNote(){
        this.app.put("/note",this.jsonParser,async (req,resp)=>{
            let note=req.body;
            if (noteIsValid(note)){
                note=await this.noteService.save(note);
                resp.status(200);
                resp.json(note);
            }
            else
                resp.sendStatus(400);
        });
    }

    handleDeleteNote(){
        this.app.delete("/note/:id", async (req,resp)=>{
            let id=Number(req.params.id);
            if (this.noteService.delete(id))
                resp.sendStatus(200);
            else
                resp.sendStatus(400);
        });
    }

}
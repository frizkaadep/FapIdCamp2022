import React from "react";
import ButtonActive from "./ButtonActive";
import ButtonDelete from "./ButtonDelete";
import ButtonArchive from "./ButtonArchive";
import NoteItemContent from "./NoteItemContent";
import { showFormattedDate } from "../utils/data";

function NoteItem({ id, title, createdAt, body, archived, onDelete, onArchive, onActive }) {
    return (
        <div className="note-item">

            <NoteItemContent title={title} date={showFormattedDate(createdAt)} body={body} />

            <div className="note-item__action">
                <ButtonDelete id={id} onDelete={onDelete} />
                {
                    archived ?
                        <ButtonActive id={id} onActive={onActive} />
                        :
                        <ButtonArchive id={id} onArchive={onArchive} />
                }
            </div>
        </div>
    );
}

export default NoteItem;

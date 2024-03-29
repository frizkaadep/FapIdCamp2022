import React from "react";
import NoteSearch from "./NoteSearch";

function Header({ searchNote, handleToggleDarkMode }) {
  return (
    <div className="note-app__header">
      <h1>Notes</h1>
      <NoteSearch searchNote={searchNote} />
    </div>
  );
}

export default Header;

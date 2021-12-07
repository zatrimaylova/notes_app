import { useState } from 'react';

import Notes from '../../store/notes.json';

import './style.scss';

const Note = ({ data }) => {
  const [rendering, setRendering] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newNoteText, setNewNoteText] = useState(data.text);
  const [isValid, noteValidation] = useState(true);
  const tags = [];
  const notesData = require("../../store/notes.json");
  const findResult = notesData.notes.find((item) => Number(item.id) === Number(data.id));
  const getNote = (text) => {
    if (text.indexOf('#') > -1) {
      getTags(text);
      const data = createTemplate(text)
      return <p dangerouslySetInnerHTML={createMarkup(data)}></p>;
    } else {
      return <p>{ text }</p>
    }
  }

  const createMarkup = (data) => {
    return {__html: data}
  }

  const getTags = (str) => {
    const index = str.indexOf('#');
    const substr = str.slice(index);
    const tag = substr.indexOf(' ') > -1 ? substr.slice(0, substr.indexOf(' ')) : substr;
    tags.push(tag)
    const newStr = substr.slice(substr.indexOf(' '));

    if (newStr.indexOf('#') > -1) getTags(newStr);

    Notes.notes.map((item) => {
      if (Number(item.id) === Number(data.id)) {
        item.tags = tags;
      }
    })
  }

  const createTemplate = (str) => {
    if (str.includes('#')) str = str.replace(/#([a-zA-ZА-Яа-я0-9\-\_]+)/gim, '<span>$1</span>');
    const template = `${str}`
    return template;
  }

  const deleteNote = () => {
    notesData.notes = notesData.notes.filter((item) => Number(item.id) !== Number(data.id));
    setRendering(rendering + 1);
  }

  const editNote = (e) => {
    if (isEditing) {
      if(newNoteText.trim().length < 10) {
        noteValidation(false);
        return;
      }
      Notes.notes.map((item) => {
        if (Number(item.id) === Number(data.id)) {
          item.text = newNoteText;
        }
      })
      setIsEditing(false);
    } else if (!isEditing) {
      setIsEditing(true);
    }
  }

  const changeHandler = (e) => {
    setNewNoteText(e.target.value);
    if (!isValid) noteValidation(true);
  }

  const openNote = (e) => {
    const currentNote = e.target.closest('li');
    if (isOpen) {
      currentNote.classList.remove('opened_note');
      setIsOpen(false);
    } else if (!isOpen) {
      currentNote.classList.add('opened_note');
      setIsOpen(true);
    }
  }

  return (
    <>
      {findResult && <li id={data.id} className="note">
        { !isEditing && getNote(data.text) }
        { isEditing && <textarea className={isValid ? '' : 'unvalid'} onChange={changeHandler} value={newNoteText} placeholder={data.text} />}
        <div className="notes-manage">
          <div>
            <button onClick={deleteNote}>Detele</button>
            <button onClick={editNote}>{isEditing ? 'Save' : 'Edit'}</button>
            <button onClick={openNote}>{isOpen ? 'Close' : 'Open'}</button>
          </div>
          { tags.length > 0 && <ul>{tags.map((item, index) => <li key={index}>{item}</li>)}</ul> }
        </div>
      </li>}
    </>
  );
}

export default Note;
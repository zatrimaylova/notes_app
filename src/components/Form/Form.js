import { useState } from 'react';

import Notes from '../../store/notes.json';
import NotesList from '../NotesList/NotesList.js';

import './style.scss';

const Form = () => {
  const [noteValue, setNoteValue] = useState('');
  const [isValid, noteValidation] = useState(true);
  const [isFiltering, setFiltering] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [filterResult, setFilterResult] = useState([]);

  let filteredNotes = [];

  const changeHandler = (e) => {
    setNoteValue(e.target.value);
    if (!isValid) noteValidation(true);
  }

  const handleAddClick = (e) => {
    e.preventDefault();
    if (noteValue.trim().length < 10) {
      noteValidation(false);
      return;
    }

    const note = {
      text: noteValue.trim(),
      id: getId(),
      tags: [],
    }

    Notes["notes"].unshift(note);
    setNoteValue('');
  }

  const getId = () => new Date().getTime();

  const handleCancelClick = (e) => {
    e.preventDefault();
    setNoteValue('');
    noteValidation(true);
  }

  const filterNotes = (e) => {
    e.preventDefault();
    setFiltering(true);
  }

  const findNotes = (e) => {
    e.preventDefault();
    filteredNotes = [];
    Notes.notes.map((item) => {
      if (item.tags.length) {
        if (item.tags.find((i) => i.indexOf(filterTag) > -1)) filteredNotes.unshift(item);
      }
    })
    setFilterResult(filteredNotes)
    setFiltering(false);
  }

  const handleInputChange = (e) => {
    if (e.target.value.trim().length) {
      setFilterTag(e.target.value.trim());
    }
  }

  const cancelFilterNotes = (e) => {
    e.preventDefault();
    setFiltering(false);
    setFilterTag('');
  }

  const showAllNotes = (e) => {
    e.preventDefault();
    setFilterResult([]);
    filteredNotes = [];
  }

  return (
    <div className="container">
      <div className="form-holder">
        <form>
          { !isFiltering && <textarea maxLength="1000" value={noteValue} placeholder="Note..." onChange={changeHandler}/> }
          { isFiltering && <>
            <input onChange={handleInputChange} placeholder="Tag..." />
            <button onClick={findNotes}>Find!</button>
            <button onClick={cancelFilterNotes}>Cancel</button>
          </>}
          <div className="form__footer">
            <div>
              <button id="add" onClick={handleAddClick}>Add</button>
              <button id="cancel" onClick={handleCancelClick}>Cancel</button>
              { Notes.notes.length > 0 && <button onClick={filterNotes}>Filter</button> }
              {filterResult.length > 0 && <button onClick={showAllNotes}>Show all notes</button>}
            </div>
            <div>
              { !isValid && <h3>Please enter at least 10 characters</h3> }
            </div>
          </div>
        </form>
      </div>
      { filterResult.length === 0 && <NotesList data={Notes.notes} /> }
      { filterResult.length > 0 && <NotesList data={filterResult} /> }
    </div>
  );
}

export default Form;
import Note from '../Note/Note.js';

import './style.scss';

const NotesList = ({ data }) => {
  return (
    <ul className="notes-list">
      {data.map((item) => <Note key={item.id} data={item}/> )}
    </ul>
  );
}

export default NotesList;
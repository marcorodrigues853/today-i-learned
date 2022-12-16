import { useState } from 'react';
import supabase from './../supabase';

function NewFactForm({ setFacts, setShowForm, categories }) {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    // 1) prevent browser reload
    e.preventDefault();

    // 2) Check if the data is valid. If so, create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //3) upload fact to supabase and receive and receive new fact object.

      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from('facts')
        .insert([{ text, source, category }])
        .select();

      // 4) Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      setIsUploading(false);

      // 5) Reset input fields
      setText('');
      setSource('');
      setCategory('');

      // 6) Close the form
      setShowForm(false);
    }
  }

  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  return (
    <form className='fact-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Share a fact with the world...'
        value={text}
        disabled={isUploading}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type='text'
        placeholder='Trustworthy source...'
        value={source}
        disabled={isUploading}
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        value={category}
        disabled={isUploading}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value=''>Choose category:</option>
        {categories.map((category) => (
          <option key={crypto.randomUUID()} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className='btn btn-large' disabled={isUploading}>
        {isUploading ? 'Sending...' : 'Post'}
      </button>
    </form>
  );
}

export default NewFactForm;

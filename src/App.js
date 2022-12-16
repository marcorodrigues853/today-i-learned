import { useEffect, useState } from 'react';
import supabase from './supabase';

import './style.css';
const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  const [isLoading, setIsLoading] = useState(false);
  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from('facts').select('*');

        if (currentCategory !== 'all')
          query = query.eq('category', currentCategory);

        const { data: facts, error } = await query
          .order('votesInteresting', { ascending: false })
          .limit(1000);
        if (!error) setFacts(facts);
        else alert('there was a problem getting data');
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory],
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className='main'>
        <CategoryFilter
          setCurrentCategory={setCurrentCategory}
          categories={CATEGORIES}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className='message'>Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = 'Today I Learned';
  return (
    <header className='header'>
      <div className='logo'>
        <img src='logo.png' height='68' width='68' alt='Today I Learned Logo' />
        <h1>{appTitle}</h1>
      </div>

      <button
        className='btn btn-large btn-open'
        onClick={() => setShowForm((showForm) => !showForm)}
      >
        {showForm ? 'close' : 'Share a fact'}
      </button>
    </header>
  );
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

function NewFactForm({ setFacts, setShowForm }) {
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
        {CATEGORIES.map((category) => (
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

function CategoryFilter({ setCurrentCategory, categories }) {
  return (
    <aside>
      <ul>
        <li className='category'>
          <button
            className='btn btn-all-categories'
            onClick={() => setCurrentCategory('all')}
          >
            All
          </button>
        </li>

        {categories.map((category) => (
          <li className='category' key={crypto.randomUUID()}>
            <button
              className='btn btn-category'
              style={{
                backgroundColor: category.color,
              }}
              onClick={() => setCurrentCategory(category.name)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className='message'>
        No facts for this category yet! Create the first one 🙃
      </p>
    );
  }

  return (
    <>
      <section>
        <ul className='facts-list'>
          {facts.map((fact) => (
            <Fact key={fact.id} fact={fact} setFacts={setFacts}></Fact>
          ))}
        </ul>
        <p>There are {facts.length} facts. Add your own.</p>
      </section>
    </>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindBlowing < fact.votesFalse;

  async function handleVote(collumnName) {
    setIsUpdating(true);

    const { data: updatedFact, error } = await supabase
      .from('facts')
      .update({ [collumnName]: ++fact[collumnName] })
      .eq('id', fact.id)
      .select();

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f)),
      );
    setIsUpdating(false);
  }

  return (
    <li className='fact'>
      <p>
        {isDisputed ? <span className='disputed'>[⛔️ DISPUTED]</span> : null}
        {fact.text}
        <a
          className='source'
          href={fact.source}
          target='_blank'
          rel='noreferrer'
        >
          (Source)
        </a>
      </p>

      <span
        className='tag'
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className='vote-buttons'>
        <button
          onClick={() => handleVote('votesInteresting')}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          disabled={isUpdating}
          onClick={() => handleVote('votesMindBlowing')}
        >
          🤯 {fact.votesMindBlowing}
        </button>
        <button disabled={isUpdating} onClick={() => handleVote('votesFalse')}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;

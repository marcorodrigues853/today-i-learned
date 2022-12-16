import { useState } from 'react';
import supabase from './../supabase';

function Fact({ fact, setFacts, categories }) {
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
          backgroundColor: categories.find((cat) => cat.name === fact.category)
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

export default Fact;

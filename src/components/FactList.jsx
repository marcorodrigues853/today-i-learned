import Fact from './Fact';
function FactList({ facts, setFacts, categories }) {
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
            <Fact
              key={fact.id}
              fact={fact}
              setFacts={setFacts}
              categories={categories}
            ></Fact>
          ))}
        </ul>
        <p>There are {facts.length} facts. Add your own.</p>
      </section>
    </>
  );
}
export default FactList;

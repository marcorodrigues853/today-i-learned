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

export default CategoryFilter;

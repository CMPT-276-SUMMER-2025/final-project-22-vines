import React, { useEffect, useState } from 'react';
import {
  fetchExercises,
  fetchCategories,
  fetchEquipment,
  fetchMuscles
} from '../api/wger';

function ExerciseSearch({ onSelectExercise }) {
  const [categories, setCategories] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [filters, setFilters] = useState({ category: '', equipment: '', muscles: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, eq, mus] = await Promise.all([
          fetchCategories(),
          fetchEquipment(),
          fetchMuscles(),
        ]);
        setCategories(cats);
        setEquipment(eq);
        setMuscles(mus);
      } catch (err) {
        console.error(err);
      }
    }
    loadFilters();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setNoResults(false);
    try {
      const data = await fetchExercises(filters);
      setResults(data);
      setNoResults(data.length === 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div>
        <label>Category: </label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">-- Select --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label> Equipment: </label>
        <select name="equipment" value={filters.equipment} onChange={handleChange}>
          <option value="">-- Select --</option>
          {equipment.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>

        <label> Muscle: </label>
        <select name="muscles" value={filters.muscles} onChange={handleChange}>
          <option value="">-- Select --</option>
          {muscles.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {noResults && !loading && (
        <p style={{ color: 'crimson', fontWeight: 'bold' }}>
          No exercises found for the selected filters. Try a different combination.
        </p>
      )}

      <div style={{ marginTop: '1rem' }}>
        {results.length > 0 && results.map((exercise) => (
          <div key={exercise.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
            <h4>{exercise.name}</h4>

            {exercise.image && (
              <img
                src={exercise.image}
                alt={exercise.name}
                style={{ maxWidth: '300px', marginBottom: '0.5rem' }}
              />
            )}

            {exercise.description && exercise.description.trim() !== '' ? (
              <div dangerouslySetInnerHTML={{ __html: exercise.description }} />
            ) : (
              <p style={{ color: 'gray' }}><i>No description available</i></p>
            )}

            <button
              onClick={() => onSelectExercise(exercise.name)}
              style={{ marginTop: '0.5rem' }}
            >
              Log This Workout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseSearch;

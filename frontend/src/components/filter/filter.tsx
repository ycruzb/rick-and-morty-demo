
import { useNavigate, useSearchParams } from "react-router-dom";

import './filter.css';

interface FilterProps {
  field: string;
  label: string;
  values: string[];
  availableFilterFields: string[];
}

export default function Filter({field, label, values, availableFilterFields}: FilterProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const filterParam = searchParams.get(field) ? searchParams.get(field) : 'all';

  const restOfFilters = availableFilterFields.filter((filter) => filter !== field);
  let restOfFiltersParams = '';
  restOfFilters.forEach((filter) => {
    const param = searchParams.get(filter);
    if (param) {
      restOfFiltersParams += `&${filter}=${param}`;
    }
  });

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    navigate(`/?${field}=${value}${restOfFiltersParams}`);
  }

  return (
    <div className='filter'>
      <label htmlFor={field}>{label}</label>
      <select id={field} value={filterParam ? filterParam : 'all'} onChange={(e) => handleChange(e)}>
        {values.map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
    </div>
  );
}
function SortableTh({ label, field, sortBy, order, onSort }) {
  const isActive = sortBy === field;
  return (
    <th onClick={() => onSort(field)} className="sortable-th">
      {label}{isActive && (order === 'asc' ? ' \u25B2' : ' \u25BC')}
    </th>
  );
}

export default SortableTh;
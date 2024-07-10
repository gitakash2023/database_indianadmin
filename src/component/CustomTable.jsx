import React from 'react';
import { IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CustomTable = ({ headers, data, onSort, currentSort, currentDirection, onEdit, onDelete }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <SortableHeader
              key={header.column}
              column={header.column}
              label={header.label}
              currentSort={currentSort}
              currentDirection={currentDirection}
              onClick={onSort}
            />
          ))}
          <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontSize: '1rem' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {headers.map((header) => (
              <td key={header.column} style={{ border: '1px solid #ddd', padding: '8px', fontSize: '1rem' }}>
                {item[header.column]}
              </td>
            ))}
            <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '1rem' }}>
              <IconButton onClick={() => onEdit(item)}>
                <EditIcon style={{ fontSize: '1rem' }} />
              </IconButton>
              <IconButton onClick={() => onDelete(item.id)}>
                <DeleteIcon style={{ fontSize: '1rem' }} />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SortableHeader = ({ column, label, currentSort, currentDirection, onClick }) => {
  const isSorted = currentSort === column;
  const direction = isSorted ? currentDirection : 'asc';
  const IconComponent = isSorted
    ? direction === 'asc'
      ? '↑'
      : '↓'
    : '';

  return (
    <th
      style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', cursor: 'pointer' }}
      onClick={() => onClick(column)}
    >
      {label} {IconComponent}
    </th>
  );
};

export default CustomTable;

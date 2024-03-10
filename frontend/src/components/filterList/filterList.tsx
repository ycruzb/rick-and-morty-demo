import './filterList.css'

interface FilterListProps {
  children: React.ReactNode;
}

export default function FilterList({children}: FilterListProps) {
  return (
    <div id='filterList'>
      {children}
    </div>
  );
}
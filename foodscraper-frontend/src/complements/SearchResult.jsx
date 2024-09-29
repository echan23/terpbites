import './SearchResult.css';

export const SearchResult = ({ result }) => {
    return (
        <div 
            className='search-result' 
            onClick={() => alert(`You clicked on ${result.name}`)}
        >
            {result.name}
        </div>
    );
};

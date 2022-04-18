import React, {useState, useEffect, useRef} from 'react'

const SearchBox = () => {

  const [searchText, setSearchText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');
  const [isCaseSensitive, setisCaseSensitive] = useState(false);
  const caseValue = useRef();

  useEffect(() => {

    /**
     * 
     * Check if the user has entered a search term and a text to search.
     * Result is set to a placeholder string or 
     * the newly formated string which highights tha matching characters.
     * 
     */

    if( searchText !== '' && 
    searchTerm !== '' ) {

        /**
         * 
         * Check if the user ticked the case sensitive checkbox.
         * If case sensitive only replace the text matching the regex
         * 
         */

        if( isCaseSensitive ) {
            const regex = new RegExp(searchTerm, 'g');
            setResult(searchText.replaceAll(regex, `<mark>${searchTerm}</mark>`));
        }else{

            /**
             * 
             * If the case is insentisive match all characters with ignore flag.
             * 
             */
            const regex = new RegExp(searchTerm, 'gi');
            const occurences = [...searchText.matchAll(regex, searchTerm)];
            let regexValues = occurences.map(occurence => {
                return occurence[0];
            });

            /**
             * 
             * Remove duplicate occurences that was matched above.
             * Example: Testing Testing would result in [T, t, T, t]
             * When replaces it would result in a double redundant <mark> element.
             * 
             */

            regexValues = [...new Set(regexValues)];

            caseValue.current = '';

            /**
             * 
             * Highlight case insensitve characters matched
             * 
             */
            regexValues.forEach(value => {
                if(caseValue.current === '') {
                    caseValue.current = searchText.replaceAll(new RegExp(value, 'g'), `<mark>${value}</mark>`);
                }else{
                    caseValue.current = caseValue.current.replaceAll(new RegExp(value, 'g'), `<mark>${value}</mark>`);
                }
                
            });

            setResult(caseValue.current);
        }
    }else{
        setResult('Enter something to search for...');
    };

  }, [searchText, searchTerm, isCaseSensitive]);

  return (
      <>
        <textarea onChange={(e) => setSearchText(e.target.value)} />
        <input type="text" onChange={(e) => setSearchTerm(e.target.value)} />
        <label>Case sensitive?
            <input type="checkbox" onChange={() => setisCaseSensitive(!isCaseSensitive)}/>
        </label>
        <div className="result" dangerouslySetInnerHTML={{
            __html: result
        }} />
      </>
  );
}
export default SearchBox;

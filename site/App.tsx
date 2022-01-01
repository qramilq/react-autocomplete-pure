import { FocusEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AutocompletePure, RenderInput, RenderContainer, ChangeReason, Theme } from '../src';
import { fetchFilms } from './mock';
import { Film, AutocompletePurePropsFilm, RenderFilmItem } from './types';
import styles from './App.module.css';

const theme: Theme = {
  list: styles.list,
  item: styles.item,
};

const renderItem: RenderFilmItem = (item, { isHighlighted }) => (
  <span style={{ fontWeight: isHighlighted ? 700 : 400 }}>{item.title}</span>
);

const getSuggestionValue = (item: Film) => item.title;

const renderInput: RenderInput = (props) => <input type="search" {...props} />;

const renderContainer: RenderContainer = ({ list }) => (
  <div className={styles.listContainer}>
    {list}
    <button type="button">Test button</button>
  </div>
);

export function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Film[]>([]);
  const [value, setValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const loadNShowSuggestions = useCallback(
    async (value: string, reason: ChangeReason | 'FOCUS') => {
      if (['INPUT', 'FOCUS'].includes(reason)) {
        const newFilms = await fetchFilms(value);
        setSuggestions(newFilms);
        setIsOpen(Boolean(newFilms.length));
      } else if (reason === 'ENTER') {
        setIsOpen(false);
      }
    },
    [],
  );

  const handleChange: AutocompletePurePropsFilm['onChange'] = useCallback(
    (_event, { value, reason }) => {
      setValue(value);
      loadNShowSuggestions(value, reason);
    },
    [loadNShowSuggestions],
  );

  const handleSelect: AutocompletePurePropsFilm['onSelect'] = useCallback((_event, { item }) => {
    const value = getSuggestionValue(item);
    setValue(value);
    setIsOpen(false);
  }, []);

  const handleClickOutside = (_event: Event) => {
    setIsOpen(false);
  };

  const handleInputFocus = (_event: FocusEvent) => {
    if (value) {
      loadNShowSuggestions(value, 'FOCUS');
    }
  };

  return (
    <>
      Heaeder
      <AutocompletePure
        open={isOpen}
        value={value}
        items={suggestions}
        onChange={handleChange}
        onSelect={handleSelect}
        onClickOutside={handleClickOutside}
        renderItem={renderItem}
        renderInput={renderInput}
        renderContainer={renderContainer}
        getSuggestionValue={getSuggestionValue}
        onInputFocus={handleInputFocus}
        ref={inputRef}
        theme={theme}
      />
      Footer
    </>
  );
}

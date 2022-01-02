# react-autocomplete-pure

Typescript-friendly autocomplete component for React.js. Fully customizable for your needs.<br />Inspired by [react-autosuggest](https://github.com/moroshko/react-autosuggest) and [react-autocomplete](https://github.com/reactjs/react-autocomplete)

## Basic usage

```tsx
import { useState, useCallback } from 'React';
import {
  AutocompletePure,
  AutocompletePureProps,
  ChangeReason,
  RenderItem,
} from 'react-autocomplete-pure';

type Film = { title: string; year: number };

// make font bolder when item is highlighted
const renderItem: RenderItem<Film> = (item, { isHighlighted }) => (
  <span style={{ fontWeight: isHighlighted ? 700 : 400 }}>{item.title}</span>
);

// how to get item's label from item
const getSuggestionValue = (item: Film) => item.title;

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Film[]>([]);
  const [value, setValue] = useState<string>('');

  // When input changes then save value
  // If change reason is type on input then get new items, save them and close dropdown if no new items fetched
  // If change reason is enter keydown then simple close dropdown
  const handleChange: AutocompletePureProps<Film>['onChange'] = useCallback(
    async (_event, { value, reason }) => {
      setValue(value);
      if (reason === 'INPUT') {
        const newFilms = await fetchFilms(value);
        setSuggestions(newFilms);
        setIsOpen(Boolean(newFilms.length));
      } else if (reason === 'ENTER') {
        setIsOpen(false);
      }
    },
    [],
  );

  // When item selected then save it and close dropdown
  const handleSelect: AutocompletePureProps<Film>['onSelect'] = useCallback((_event, { item }) => {
    const value = getSuggestionValue(item);
    setValue(value);
    setIsOpen(false);
  }, []);

  // Close dropdown when clicked outside of component
  const handleClickOutside = (_event: Event) => {
    setIsOpen(false);
  };

  return (
    <AutocompletePure
      open={isOpen}
      value={value}
      items={suggestions}
      onChange={handleChange}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      renderItem={renderItem}
      getSuggestionValue={getSuggestionValue}
    />
  );
}
```

## Demo

Feel free to play with `AutocompletePure` component in [Sandbox](https://codesandbox.io/s/vibrant-field-mmrow)

## Installation

via `yarn`

```sh
yarn add react-autocomplete-pure
```

via `npm`

```sh
npm install react-autocomplete-pure --save
```

## Props

| Prop               | Type                                                                                                                     | Required | Description                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------- |
| open               | boolean                                                                                                                  | ✓        | Control the dropdown show state                                                        |
| value              | string                                                                                                                   | ✓        | The value of the autocomplete                                                          |
| items              | array                                                                                                                    | ✓        | Array of options                                                                       |
| renderItem         | (item: Item, {isHighlighted: boolean}) => ReactNode                                                                      | ✓        | Invokes for each entry in `items` to tell how to render each item in list.             |
| getSuggestionValue | (item: Item) => string                                                                                                   | ✓        | Invokes to get new `value` when using keyboard events                                  |
| onChange           | (event: ChangeEvent<HTMLInputElement> \| KeyboardEvent<HTMLInputElement>, {value: string, reason: ChangeReason}) => void | ✓        | Callback fired when the value changes                                                  |
| onSelect           | (event: MouseEvent<HTMLLIElement>, {item: Item; itemIndex:number}) => void                                               | ✓        | Callback fired when clicked on item in item list                                       |
| theme              | Theme                                                                                                                    |          | Uses to pass classNames to AutocompletePure's components                               |
| renderInput        | (props: ComponentPropsWithRef<'input'>) => JSX.Element                                                                   |          | Invokes to generate `input` element                                                    |
| renderContainer    | ({list}: {list: JSX.Element}) => JSX.Element                                                                             |          | Invokes to generate new element with `list` component                                  |
| onClickOutside     | (event: Event) => void                                                                                                   |          | Invokes when clicking outside of component. Can use to change `open` state in callback |
| onInputFocus       | FocusEventHandler<HTMLInputElement>                                                                                      |          | Invokes when `input` has focus                                                         |

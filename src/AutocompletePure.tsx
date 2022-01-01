import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
  Ref,
} from 'react';
import { useClickOutside } from './hooks';
import { List } from './List';
import { AutucompletePureProps, RenderInput } from './types';

const DEFAULT_ITEM_INDEX = -1;

const defaultRenderInput: RenderInput = (props) => <input type="text" {...props} />;

function InnerAutocompletePure<Item>(
  {
    open,
    value,
    items = [],
    theme,
    renderItem,
    renderInput = defaultRenderInput,
    renderContainer,
    getSuggestionValue,
    onChange,
    onClickOutside,
    onSelect,
    onInputFocus,
    ...props
  }: AutucompletePureProps<Item>,
  ref: Ref<HTMLInputElement>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputValue = useRef<string>(value);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number>(DEFAULT_ITEM_INDEX);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { code } = event;

    switch (code) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextItemIndex = highlightedItemIndex + 1;
        const newItemIndex = nextItemIndex === items.length ? DEFAULT_ITEM_INDEX : nextItemIndex;
        const newValue =
          newItemIndex === DEFAULT_ITEM_INDEX
            ? inputValue.current
            : getSuggestionValue(items[newItemIndex]);
        setHighlightedItemIndex(newItemIndex);
        onChange(event, { value: newValue, reason: 'ARROW' });
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const nextItemIndex = highlightedItemIndex - 1;
        const newItemIndex = nextItemIndex < DEFAULT_ITEM_INDEX ? items.length - 1 : nextItemIndex;
        const newValue =
          newItemIndex === DEFAULT_ITEM_INDEX
            ? inputValue.current
            : getSuggestionValue(items[newItemIndex]);
        setHighlightedItemIndex(newItemIndex);
        onChange(event, { value: newValue, reason: 'ARROW' });
        break;
      }
      case 'Enter': {
        event.preventDefault();
        const newValue = getSuggestionValue(items[highlightedItemIndex]);
        setHighlightedItemIndex(DEFAULT_ITEM_INDEX);
        onChange(event, { value: newValue, reason: 'ENTER' });
        break;
      }
      default:
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    inputValue.current = value;
    setHighlightedItemIndex(DEFAULT_ITEM_INDEX);
    onChange(event, { value, reason: 'INPUT' });
  };

  const handleItemMouseEnter = useCallback(
    (_event: MouseEvent<HTMLLIElement>, { itemIndex }: { item?: Item; itemIndex: number }) => {
      setHighlightedItemIndex(itemIndex);
    },
    [],
  );

  useClickOutside(containerRef, onClickOutside);

  const listComponent = (
    <List
      items={items}
      highlightedItemIndex={highlightedItemIndex}
      renderItem={renderItem}
      className={theme?.list}
      itemClassName={theme?.item}
      onItemClick={onSelect}
      onItemMouseEnter={handleItemMouseEnter}
    />
  );

  return (
    <div ref={containerRef} className={theme?.container}>
      {renderInput({
        ...props,
        value,
        onChange: handleInputChange,
        onKeyDown: handleInputKeyDown,
        onFocus: onInputFocus,
        ref,
      })}
      {open && (renderContainer ? renderContainer({ list: listComponent }) : listComponent)}
    </div>
  );
}

export const AutocompletePure = forwardRef(InnerAutocompletePure) as (<Item extends object>(
  // eslint-disable-next-line no-use-before-define
  props: AutucompletePureProps<Item> & { ref?: Ref<HTMLInputElement> },
) => React.ReactElement) & {
  displayName: string;
};

AutocompletePure.displayName = 'AutocompletePure';

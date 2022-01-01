import { memo } from 'react';
import { Item } from './Item';
import { AutocompletePureListProps } from './types';

function InnerList<Item>({
  items,
  highlightedItemIndex,
  className,
  itemClassName,
  renderItem,
  onItemClick,
  onItemMouseEnter,
}: AutocompletePureListProps<Item>) {
  return (
    <ul role="listbox" className={className}>
      {items.map((item, index) => {
        const isHighlighted = highlightedItemIndex === index;

        return (
          <Item
            key={index}
            index={index}
            item={item}
            isHighlighted={isHighlighted}
            className={itemClassName}
            onClick={onItemClick}
            onMouseEnter={onItemMouseEnter}
            renderItem={renderItem}
          />
        );
      })}
    </ul>
  );
}
export const List = memo(InnerList) as typeof InnerList & { displayName: string };

List.displayName = 'AutocompletePureList';

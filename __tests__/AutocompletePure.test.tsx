import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutocompletePureTest, AutucompletePureTestProps, theme } from './AutocompletePureTest';
import { RenderItem, RenderInput, RenderContainer } from '../src';
import { Film } from '../site/types';

type RenderAutocompletePureComponentCommonReturnType = ReturnType<typeof render> & {
  inputElement: HTMLInputElement;
  onChange: jest.Mock;
  onSelect: jest.Mock;
  onClickOutside: jest.Mock;
};

const testValue = '1';
const testItems = [
  {
    title: '12 Angry Men',
    year: 1957,
  },
  {
    title: '2001: A Space Odyssey',
    year: 1968,
  },
];
const testSelectedItemIndex = 1;

function renderAutocompletePureComponent(
  props: AutucompletePureTestProps & { open: false },
): RenderAutocompletePureComponentCommonReturnType;
function renderAutocompletePureComponent(
  props: AutucompletePureTestProps & { open: true },
): RenderAutocompletePureComponentCommonReturnType & {
  listElement: HTMLUListElement;
  itemElements: HTMLLIElement[];
};

function renderAutocompletePureComponent(props: AutucompletePureTestProps) {
  const onChange = jest.fn();
  const onSelect = jest.fn();
  const onClickOutside = jest.fn();
  const utils = render(
    <AutocompletePureTest
      onChange={onChange}
      onSelect={onSelect}
      onClickOutside={onClickOutside}
      {...props}
    />,
  );
  const inputElement = screen.getByLabelText(/Label/i) as HTMLInputElement;

  const commonReturn = { ...utils, inputElement, onChange, onSelect, onClickOutside };

  if (props.open) {
    const listElement = screen.getByRole('listbox') as HTMLUListElement;
    const itemElements = screen.getAllByRole('option') as HTMLLIElement[];

    return { ...commonReturn, listElement, itemElements };
  }

  return { ...commonReturn };
}

describe('when rendered', () => {
  it('has properly classes when open prop is false', () => {
    const { inputElement } = renderAutocompletePureComponent({ open: false });

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('inputClassName');
    expect(inputElement.parentElement).toHaveClass(theme.container as string);
  });

  it('has properly classes when open is true', () => {
    const { listElement, itemElements } = renderAutocompletePureComponent({
      open: true,
      items: testItems,
    });

    expect(listElement).toBeInTheDocument();
    expect(listElement).toHaveClass(theme.list as string);

    itemElements.forEach((element) => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass(theme.item as string);
    });
  });
});

describe('handlers test', () => {
  it('should fire handlers', () => {
    const { inputElement, itemElements, onChange, onSelect, onClickOutside } =
      renderAutocompletePureComponent({
        open: true,
        value: testValue,
        items: testItems,
      });
    userEvent.type(inputElement, testValue);

    expect(onChange).toHaveBeenCalledTimes(testValue.length);
    expect(inputElement).toHaveValue(testValue);

    userEvent.click(itemElements[testSelectedItemIndex]);
    expect(onSelect).toHaveBeenCalled();
    expect(onClickOutside).not.toHaveBeenCalled();
  });
});

describe('highlight item test', () => {
  it('should highlight by keyboard event', () => {
    const renderItem: RenderItem<Film> = (item, { isHighlighted }) => (
      <span data-testid="render-item" style={{ fontWeight: isHighlighted ? 700 : 400 }}>
        {item.title}
      </span>
    );
    const { inputElement, itemElements, onChange } = renderAutocompletePureComponent({
      open: true,
      value: testValue,
      items: testItems,
      renderItem,
    });

    userEvent.type(inputElement, '{arrowdown}{arrowdown}');
    expect(itemElements[1]).toHaveAttribute('aria-selected', 'true');
    expect(itemElements[1].firstChild).toHaveStyle('font-weight: 700');

    userEvent.type(inputElement, '{arrowdown}');
    const isItemElementHasSelected = itemElements.some(
      (el) => el.getAttribute('aria-selected') === 'true',
    );
    expect(isItemElementHasSelected).toBeFalsy();

    userEvent.type(inputElement, '{arrowup}');
    expect(itemElements.at(-1)).toHaveAttribute('aria-selected', 'true');

    userEvent.type(inputElement, '{enter}');
    expect(onChange).toBeCalled();
  });

  it('should highlight by mouse event', () => {
    const { inputElement, itemElements, onChange } = renderAutocompletePureComponent({
      open: true,
      value: testValue,
      items: testItems,
    });
    const hoveredItemElement = itemElements[1];

    userEvent.hover(hoveredItemElement);
    expect(hoveredItemElement).toHaveAttribute('aria-selected', 'true');

    userEvent.type(inputElement, '{enter}');
    expect(onChange).toBeCalled();
  });
});

describe('custom renders test', () => {
  it('should render custom input', () => {
    const renderInput: RenderInput = (props) => <input type="search" {...props} />;

    const renderContainer: RenderContainer = ({ list }) => (
      <div data-testid="list-container">
        {list}
        <button type="button">Test button</button>
      </div>
    );
    renderAutocompletePureComponent({
      open: true,
      value: testValue,
      items: testItems,
      renderInput,
      renderContainer,
    });
    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    expect(screen.getByTestId('list-container')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /test button/i,
      }),
    ).toBeInTheDocument();
  });
});

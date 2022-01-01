import { AutocompletePure, AutucompletePureProps, Theme } from '../src';
import { Film } from '../site/types';

export type AutucompletePureTestProps = Partial<AutucompletePureProps<Film>>;

export const theme: Theme = {
  container: 'containerClassName',
  list: 'listClassName',
  item: 'itemClassName',
};

export function AutocompletePureTest(props: AutucompletePureTestProps) {
  return (
    <>
      <label htmlFor="react-autocomplete-pure">Label</label>
      <AutocompletePure
        open={false}
        value=""
        items={[]}
        renderItem={(item) => item.title}
        getSuggestionValue={(item) => item.title}
        id="react-autocomplete-pure"
        className="inputClassName"
        theme={theme}
        onChange={() => undefined}
        onSelect={() => undefined}
        {...props}
      />
    </>
  );
}

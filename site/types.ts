import { AutocompletePureProps, RenderItem } from '../src';

export type Film = {
  title: string;
  year: number;
};

export type AutocompletePurePropsFilm = AutocompletePureProps<Film>;
export type RenderFilmItem = RenderItem<Film>;

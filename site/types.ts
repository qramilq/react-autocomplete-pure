import { AutucompletePureProps, RenderItem } from '../src';

export type Film = {
  title: string;
  year: number;
};

export type AutocompletePurePropsFilm = AutucompletePureProps<Film>;
export type RenderFilmItem = RenderItem<Film>;

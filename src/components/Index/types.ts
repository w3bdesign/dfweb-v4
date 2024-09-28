export interface IChild {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface IText {
  _key: string;
  _type: string;
  children: IChild[];
  markDefs: string[];
  style: string;
}

export interface IContent {
  id: string;
  text: IText[];
  title: string;
}
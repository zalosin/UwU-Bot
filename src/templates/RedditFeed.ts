export interface RedditFeed {
  feed: Feed;
}

export interface Feed {
  empty: FeedClass;
  category: CategoryElement[];
  updated: Date[];
  icon: string[];
  id: string[];
  link: FeedLink[];
  logo: string[];
  subtitle: string[];
  title: Title[];
  entry: Entry[];
}

export interface CategoryElement {
  empty: Category;
}

export interface Category {
  term: Title;
  label: Label;
}

export enum Label {
  RGameDeals = "r/GameDeals",
}

export enum Title {
  GameDeals = "GameDeals",
}

export interface FeedClass {
  xmlns: string;
}

export interface Entry {
  author: Author[];
  category: CategoryElement[];
  content: ContentElement[];
  id: string[];
  link: EntryLink[];
  updated: Date[];
  title: string[];
}

export interface Author {
  name: string[];
  uri: string[];
}

export interface ContentElement {
  content: string;
  empty: Content;
}

export interface Content {
  type: Type;
}

export enum Type {
  HTML = "html",
}

export interface EntryLink {
  empty: Purple;
}

export interface Purple {
  href: string;
}

export interface FeedLink {
  empty: Fluffy;
}

export interface Fluffy {
  rel: string;
  href: string;
  type: string;
}

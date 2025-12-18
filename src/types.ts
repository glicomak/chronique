type Tag = {
  id: string,
  name: string,
  color: string
}

type EntryMetadata = {
  id: string,
  datetime: string,
  title: string,
  tags: Tag[]
}

type Entry = {
  id: string,
  datetime: string,
  title: string,
  tags: Tag[],
  content: string
}

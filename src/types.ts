type Tag = {
  id: string,
  name: string,
  bgColor: string,
  fgColor: string
}

type EntryMetadata = {
  id: string,
  datetime: string,
  title: string,
  tags: string[]
}

type Entry = {
  id: string,
  datetime: string,
  title: string,
  tags: string[],
  content: string
}

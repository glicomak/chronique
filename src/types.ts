type Entry = {
  id: string,
  datetime: string,
  title: string,
  tags: string[],
  content: string
}

type EntryMetadata = {
  id: string,
  datetime: string,
  title: string,
  tags: string[]
}

type Settings = {
  dataPath: string
}

type Tag = {
  id: string,
  name: string,
  bgColor: string,
  fgColor: string
}

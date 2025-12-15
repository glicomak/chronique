type Tag = {
  id: string,
  name: string,
  color: string
}

type EntryMeta = {
  id: string,
  datetime: string,
  title: string,
  tags: Tag[]
}

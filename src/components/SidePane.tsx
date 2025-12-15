import EntryItem from "./EntryItem";

function SidePane() {
  const entries: EntryMeta[] = [
    {
      id: "0",
      datetime: "2025-12-25T10:00:00Z",
      title: "Hello World!",
      tags: []
    },
    {
      id: "1",
      datetime: "2025-12-25T10:00:00Z",
      title: "Bye World!",
      tags: []
    }
  ]

  return (
    <aside className="w-[20%] bg-[#2d2d2e]">
      <h1 className="m-4 text-xl font-medium">CHRONIQUE</h1>
      {entries.map(entry => (
        <EntryItem entry={entry} />
      ))}
    </aside>
  )
}

export default SidePane;

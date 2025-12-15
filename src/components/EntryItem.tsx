function EntryItem(props: {entry: EntryMeta}) {
  const entry = props.entry;

  const datetimeObject = new Date(entry.datetime);
  const date = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(datetimeObject);
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(datetimeObject);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(datetimeObject);

  return (
    <div className="px-4 py-2">
      <p>{date} | {day} | {time}</p>
      <p>{entry.title}</p>
    </div>
  )
}

export default EntryItem;

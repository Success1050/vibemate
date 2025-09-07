export const formatDisplayDate = (dateString: string) => {
  if (!dateString) return "Select date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

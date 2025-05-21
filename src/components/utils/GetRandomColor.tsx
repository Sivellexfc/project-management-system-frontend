export const getRandomColor = (id: number) => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-sky-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[id % colors.length]; // deterministik renk, id'ye göre
};
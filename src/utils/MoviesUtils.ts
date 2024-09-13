export const movies = [
  {
    title: "test",
    title64: "test",
    src: ["test", "test"],
  },
];

export function generateMovie() {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];

  return randomMovie;
}

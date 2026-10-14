export const LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

export const azSectionId = (letter: string) => `az-${letter === "#" ? "num" : letter}`;

export function letterOf(name: string): string {
  const first = name.normalize("NFKD").replace(/^[^a-zA-Z0-9]+/, "").charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

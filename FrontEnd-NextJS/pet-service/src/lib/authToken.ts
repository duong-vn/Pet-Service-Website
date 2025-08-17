let _at: string | null = "ok";
export const setAT = (t: string | null) => {
  _at = t;
};
export const getAT = () => _at;

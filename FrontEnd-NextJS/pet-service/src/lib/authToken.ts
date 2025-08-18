let _at: string | null = null;
export const setAT = (t: string | null) => {
  _at = t;
};
export const getAT = () => _at;

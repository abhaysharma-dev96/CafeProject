// Shows prices in Indian Rupees, e.g. 250 -> ₹250, 249.5 -> ₹249.50
export const formatPrice = (value) => {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
};

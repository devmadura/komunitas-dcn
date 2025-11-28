export const getKontributorCount = async () => {
  try {
    const response = await fetch("/api/kontributor?count=true");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal mengambil total kontributor");
    }
    const result = await response.json();
    return result.total;
  } catch (error) {
    console.error("Error in getKontributorCount:", error);
    throw error;
  }
};

export const getPertemuanCount = async () => {
  try {
    const response = await fetch("/api/pertemuan?count=true");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Gagal mengambil total pertemuan");
    }
    const result = await response.json();
    return result.total;
  } catch (error) {
    console.error("Error in getPertemuanCount:", error);
    throw error;
  }
};

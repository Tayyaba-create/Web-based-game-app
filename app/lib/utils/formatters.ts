// Utility functions for formatting

export const formatters = {
  // Format time in seconds to HH:MM:SS
  formatTime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  },

  // Format date to readable string
  formatDate: (date: string | Date): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Format number with commas
  formatNumber: (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  // Truncate text
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  },
};

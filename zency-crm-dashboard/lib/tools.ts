export const tools = {
  generateLeads: async (
    query: string
  ) => {
    return {
      success: true,
      query,
    };
  },

  findHotLeads: async () => {
    return {
      success: true,
    };
  },

  draftEmail: async (
    businessName: string
  ) => {
    return {
      success: true,
      businessName,
    };
  },
};
import { useQuery } from "@tanstack/react-query";

const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/conversations/all`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
};

export default useConversations;

import { trpc } from "@/lib/trpc";

export function useSubjects() {
    const utils = trpc.useUtils();

    // Queries
    const {
        data: subjects,
        isLoading,
        error,
    } = trpc.subject.getAll.useQuery(void 0, {
        retry: (failureCount, error) => {
            if (error?.data?.code === "BAD_REQUEST") return false;
            return failureCount < 3;
        },
    });

    const { data: searchResults, isLoading: isSearching } =
        trpc.subject.search.useQuery(
            { query: " " },
            {
                retry: (failureCount, error) => {
                    if (error?.data?.code === "BAD_REQUEST") return false;
                    return failureCount < 3;
                },
            },
        );

    const createSubject = trpc.subject.create.useMutation({
        onSuccess: () => {
            utils.subject.getAll.invalidate();
        },
    });

    const updateSubject = trpc.subject.update.useMutation({
        onSuccess: () => {
            utils.subject.getAll.invalidate();
        },
    });

    const deleteSubject = trpc.subject.delete.useMutation({
        onSuccess: () => {
            utils.subject.getAll.invalidate();
        },
    });

    const searchSubjects = (query: string) => {
        if (query.trim()) {
            utils.subject.search.fetch({ query });
        }
    };

    return {
        subjects: subjects || [],
        searchResults: searchResults || [],

        isLoading,
        isSearching,
        isCreating: createSubject.isPending,
        isUpdating: updateSubject.isPending,
        isDeleting: deleteSubject.isPending,

        error,
        createError: createSubject.error,
        updateError: updateSubject.error,
        deleteError: deleteSubject.error,

        createSubject: (data: { name: string; color: string }) =>
            createSubject.mutate({ ...data }),
        updateSubject: (data: {
            subjectId: string;
            name?: string;
            color?: string;
        }) => updateSubject.mutate({ ...data }),
        deleteSubject: (data: { subjectId: string }) =>
            deleteSubject.mutate({ ...data }),
        searchSubjects,

        utils,
    };
}

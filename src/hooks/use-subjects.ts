import {trpc} from "@/lib/trpc";
import {useSession} from "@/lib/auth-client";

export function useSubjects() {
    const utils = trpc.useUtils();
    const session = useSession();

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
        enabled: !!session.data, // Only run query if session exists
    });

    const {data: searchResults, isLoading: isSearching} =
        trpc.subject.search.useQuery(
            {query: " "},
            {
                retry: (failureCount, error) => {
                    if (error?.data?.code === "BAD_REQUEST") return false;
                    return failureCount < 3;
                },
                enabled: !!session.data, // Only run query if session exists
            },
        );

    const createSubject = trpc.subject.create.useMutation({
        onSuccess: () => {
            if (session.data) {
                utils.subject.getAll.invalidate();
            }
        },
    });

    const updateSubject = trpc.subject.update.useMutation({
        onSuccess: () => {
            if (session.data) {
                utils.subject.getAll.invalidate();
            }
        },
    });

    const deleteSubject = trpc.subject.delete.useMutation({
        onSuccess: () => {
            if (session.data) {
                utils.subject.getAll.invalidate();
            }
        },
    });

    const searchSubjects = (query: string) => {
        if (query.trim() && session.data) {
            utils.subject.search.fetch({query});
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

        createSubject: (data: { name: string; color: string }) => {
            if (session.data) {
                createSubject.mutate({...data});
            }
        },
        updateSubject: (data: {
            subjectId: string;
            name?: string;
            color?: string;
        }) => {
            if (session.data) {
                updateSubject.mutate({...data});
            }
        },
        deleteSubject: (data: { subjectId: string }) => {
            if (session.data) {
                deleteSubject.mutate({...data});
            }
        },
        searchSubjects,

        utils,
    };
}

"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { HomeworkCreate } from "./dialogs/homework-create";
import { HomeworkInfo } from "./dialogs/homework-info"; // You'll need to create this component
import { useTranslations } from "next-intl";
import { useSubjects } from "@/hooks/use-subjects";

export type HomeworkRow = {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date | null;
    completed: boolean;
    subjectId: string;
};

function useHomeworkData(completed: boolean | undefined, subjectId?: string) {
    const queryInput = React.useMemo(() => ({ subjectId, completed }), [subjectId, completed]);
    const query = trpc.homework.getAll.useQuery(queryInput);
    const utils = trpc.useUtils();

    const updateMutation = trpc.homework.update.useMutation({
        onSuccess: () => utils.homework.getAll.invalidate(),
    });

    const deleteMutation = trpc.homework.delete.useMutation({
        onSuccess: () => utils.homework.getAll.invalidate(),
    });

    const createMutation = trpc.homework.create.useMutation({
        onSuccess: () => utils.homework.getAll.invalidate(),
    });

    return { query, updateMutation, deleteMutation, createMutation };
}

export function HomeworkTable({ subjectId, showSubjects = true }: { subjectId?: string; showSubjects?: boolean }) {
    const t = useTranslations("HomeworkTable");
    const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "completed">("pending");
    const [selectedHomework, setSelectedHomework] = React.useState<HomeworkRow | null>(null);
    const [infoDialogOpen, setInfoDialogOpen] = React.useState(false);

    const completedParam = statusFilter === "all" ? undefined : statusFilter === "completed";

    const { query, updateMutation, deleteMutation } = useHomeworkData(completedParam, subjectId);
    const { subjects } = useSubjects();
    const data = React.useMemo(() => (query.data ?? []) as HomeworkRow[], [query.data]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    // Create a map for quick subject lookup
    const subjectMap = React.useMemo(() => {
        const map = new Map();
        subjects.forEach(subject => {
            map.set(subject.id, subject);
        });
        return map;
    }, [subjects]);

    const update = React.useCallback(
        async (vars: Parameters<typeof updateMutation.mutateAsync>[0]) => {
            try {
                const result = await updateMutation.mutateAsync(vars);
                // Update the selected homework with the returned data
                if (result) {
                    const updatedHomework = {
                        ...result,
                        // Ensure completed is always a boolean
                        completed: result.completed ?? false,
                        // Ensure dueDate is a Date or null
                        dueDate: result.dueDate ? new Date(result.dueDate) : null,
                    };
                    
                    setSelectedHomework(prev => ({
                        ...prev,
                        ...updatedHomework,
                    }));
                    
                    // Return the updated homework with correct types
                    return {
                        id: updatedHomework.id,
                        title: updatedHomework.title,
                        description: updatedHomework.description,
                        dueDate: updatedHomework.dueDate,
                        completed: updatedHomework.completed,
                        subjectId: updatedHomework.subjectId,
                    };
                }
            } catch (error) {
                console.error('Error updating homework:', error);
                throw error; // Re-throw to be handled by the dialog
            }
        },
        [updateMutation]
    );

    const del = React.useCallback(
        async (vars: Parameters<typeof deleteMutation.mutateAsync>[0]) => {
            try {
                await deleteMutation.mutateAsync(vars);
            } catch (error) {
                console.error('Error deleting homework:', error);
                throw error; // Re-throw to be handled by the dialog
            }
        },
        [deleteMutation]
    );

    // Handle row click to open info dialog
    const handleRowClick = React.useCallback((homework: HomeworkRow, event: React.MouseEvent) => {
        // Prevent opening dialog if clicking on checkbox or other interactive elements
        const target = event.target as HTMLElement;
        if (target.closest('[role="checkbox"]') || target.closest('button')) {
            return;
        }

        setSelectedHomework(homework);
        setInfoDialogOpen(true);
    }, []);

    const columns = React.useMemo<ColumnDef<HomeworkRow>[]>(
        () => [
            {
                accessorKey: "completed",
                header: t("completed"),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.original.completed}
                        onCheckedChange={(value) =>
                            update({ homeworkId: row.original.id, completed: !!value })
                        }
                        aria-label={t("toggle_complete_aria")}
                    />
                ),
            },
            ...(subjectId || !showSubjects ? [] : [{
                accessorKey: "subject",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {t("subject")}
                        <ArrowUpDown />
                    </Button>
                ),
                cell: ({ row }) => {
                    const subject = subjectMap.get(row.original.subjectId);
                    return (
                        <div className="flex items-center justify-center gap-2 h-6">
                            {subject && (
                                <>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: subject.color }}
                                    />
                                    <span className="font-medium">{subject.name}</span>
                                </>
                            )}
                        </div>
                    );
                },
                sortingFn: (rowA, rowB) => {
                    const subjectA = subjectMap.get(rowA.original.subjectId)?.name || "";
                    const subjectB = subjectMap.get(rowB.original.subjectId)?.name || "";
                    return subjectA.localeCompare(subjectB);
                },
            }] as ColumnDef<HomeworkRow>[]),
            {
                accessorKey: "title",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {t("title")}
                        <ArrowUpDown />
                    </Button>
                ),
                cell: ({ row }) => <div className="font-medium h-6">{row.getValue("title") as string}</div>,
            },
            {
                accessorKey: "dueDate",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {t("due")}
                        <ArrowUpDown />
                    </Button>
                ),
                cell: ({ row }) => <div className="font-medium h-6">{row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "—"}</div>,
            },
        ],
        [t, subjectId, showSubjects, update, subjectMap]
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        autoResetPageIndex: false,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col gap-3 py-4">
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div className="flex flex-wrap items-center gap-2"></div>
                    </div>

                    <div className="flex items-center">
                        <Input
                            placeholder={t("filter_title_placeholder")}
                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
                            className="max-w-sm"
                        />
                        <div className="ml-auto flex items-center gap-2">
                            <HomeworkCreate subjectId={subjectId} />
                        </div>
                        <div className="ml-2 items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Filter />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>{t("status_label")}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                        value={statusFilter}
                                        onValueChange={(v) => setStatusFilter(v as "all" | "pending" | "completed")}
                                    >
                                        <DropdownMenuRadioItem value="all">{t("status_all")}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="pending">{t("status_pending")}</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="completed">{t("status_completed")}</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-center">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={(e) => handleRowClick(row.original, e)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="text-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        {query.isLoading ? t("loading") : t("empty")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-center space-x-2 py-4">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        {t("previous")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        {t("next")}
                    </Button>
                </div>
            </div>

            {/* Info Dialog */}
            {selectedHomework && (
                <HomeworkInfo
                    homework={selectedHomework}
                    open={infoDialogOpen}
                    onOpenChange={setInfoDialogOpen}
                    onUpdate={update}
                    onDelete={del}
                    subjects={subjects}
                    updateMutation={{
                        isPending: updateMutation.isPending,
                    }}
                    deleteMutation={{
                        isPending: deleteMutation.isPending,
                    }}
                />
            )}
        </>
    );
}
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
import { ArrowUpDown, Filter, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import {useTranslations} from "next-intl";

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

export function HomeworkTable({ subjectId }: { subjectId?: string }) {
    const t = useTranslations("HomeworkTable");
    const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "completed">("pending");
    const completedParam = statusFilter === "all" ? undefined : statusFilter === "completed";

    const { query, updateMutation, deleteMutation } = useHomeworkData(completedParam, subjectId);
    const data = React.useMemo(() => (query.data ?? []) as HomeworkRow[], [query.data]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const update = React.useCallback(
        (vars: Parameters<typeof updateMutation.mutate>[0]) => updateMutation.mutate(vars),
        [updateMutation]
    );

    const del = React.useCallback(
        (vars: Parameters<typeof deleteMutation.mutate>[0]) => deleteMutation.mutate(vars),
        [deleteMutation]
    );

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
                cell: ({ row }) => <div className="font-medium">{row.getValue("title") as string}</div>,
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
                cell: ({ row }) => <div>{row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "—"}</div>,
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("open_menu_sr")}</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                                {t("copy_id")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => del({ homeworkId: row.original.id })}>{t("delete")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [update, del, t]
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
    );
}

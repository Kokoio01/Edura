"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSession, admin } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCreate } from "./dialogs/user-create";
import { UserDelete } from "./dialogs/user-delete";
import { UserResetPassword } from "./dialogs/user-reset-password";
import { Loader2, MoreHorizontal, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { UserEdit } from "./dialogs/user-edit";

interface SortConfig {
    key: keyof User;
    direction: 'asc' | 'desc';
}

const ITEMS_PER_PAGE = 10;

export // API Response Type
type ApiUser = {
    id: string;
    email: string;
    name: string | null;
    role?: string;
    created_at?: string;
};

// Our internal User type
interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'user' | 'admin';
    createdAt?: Date;
}

// Helper function to map API user to our User type
const mapApiUserToUser = (apiUser: ApiUser): User => ({
    ...apiUser,
    role: (apiUser.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
    createdAt: apiUser.created_at ? new Date(apiUser.created_at) : undefined
});

const UserTable = () => {
    const t = useTranslations('UsersTable');
    const session = useSession();
    const user = session.data?.user;

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'email', direction: 'asc' });

    // Load users
    const loadUsers = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: response, error } = await admin.listUsers({ query: { limit: 100, offset: 0 } });
            if (error) throw error;
            const users = response?.users || [];
            setUsers(users.map(mapApiUserToUser));
        } catch (err) {
            console.error('Error loading users:', err);
            toast.error(t('error_loading_users'));
        } finally {
            setLoading(false);
        }
    }, [user, t]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Sorting & filtering
    const sortedAndFilteredUsers = useMemo(() => {
        let result = [...users];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.email.toLowerCase().includes(term) ||
                (u.name?.toLowerCase().includes(term) ?? false)
            );
        }
        if (sortConfig?.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [users, searchTerm, sortConfig])

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = sortedAndFilteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Sorting handler
    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    if (!user) return <div className="flex items-center justify-center p-8">{t('login_required')}</div>;

    return (
        <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <UserCreate/>
                </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => requestSort('email')}>
                                <div className="flex items-center">Email <ArrowUpDown className="ml-2 h-4 w-4" /></div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                                <div className="flex items-center">Name <ArrowUpDown className="ml-2 h-4 w-4" /></div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => requestSort('role')}>
                                <div className="flex items-center">Role <ArrowUpDown className="ml-2 h-4 w-4" /></div>
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Loading users...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">No users found</TableCell>
                            </TableRow>
                        ) : paginatedUsers.map(u => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.email}</TableCell>
                                <TableCell>
                                        <div className="flex items-center gap-2">
                                            {u.name || '-'}
                                        </div>
                                </TableCell>
                                <TableCell><Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role === 'admin' ? 'Admin' : 'User'}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <UserEdit user={u}/>
                                            <UserResetPassword userId={u.id}/>
                                            <UserDelete userId={u.id}/>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserTable;

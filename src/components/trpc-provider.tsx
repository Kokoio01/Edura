"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "../lib/trpc";
import superjson from "superjson";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => {
        const client = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 5 * 60 * 1000,
                    gcTime: 10 * 60 * 1000,
                    retry: 3,
                    refetchOnWindowFocus: true,
                    refetchOnReconnect: true,
                },
                mutations: {
                    retry: 1,
                },
            },
        });

        return client;
    });

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "/api/trpc",
                    maxURLLength: 2083,
                    transformer: superjson,
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    );
}

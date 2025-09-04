"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {usePathname, useRouter} from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React from "react";
import {useSubjects} from "@/hooks/use-subjects";
import {useTranslations} from "next-intl";

function isNanoId(segment: string) {
    return /^[A-Za-z0-9_-]{21}$/.test(segment);
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function SiteHeader() {
    const router = useRouter();
    const {subjects} = useSubjects();
    const t = useTranslations("Breadcrumb");
    const pathname = usePathname()
    let segments:string[] = []
    if (pathname !== "/") {
        segments = pathname.split("/")
    }
    segments.shift()
    segments.unshift("Home")

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const label = index === 0
                                ? t("home")
                                : isNanoId(segment)
                                    ? subjects.find(subject => subject.id === segment)?.name
                                    : capitalize(segment);

                            const href =
                                index === 0
                                    ? "/"
                                    : "/" + segments.slice(1, index + 1).join("/");

                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        {index < segments.length ?
                                            <BreadcrumbLink onClick={() => router.push(href)}>
                                                {label}
                                            </BreadcrumbLink>
                                            :
                                            <BreadcrumbPage>
                                                {label}
                                            </BreadcrumbPage>
                                        }
                                    </BreadcrumbItem>
                                    { index + 1 < segments.length ? <BreadcrumbSeparator/> : null}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}

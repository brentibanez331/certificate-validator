
"use client"
import { useRouter } from 'next/navigation';
import UserHeader from '@/components/ui/UserHeader';
import { RxCaretSort } from "react-icons/rx";
import { FaChevronDown } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { Badge } from "@/components/ui/badge"
import { FaDownload } from "react-icons/fa6";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useMemo, useState } from "react"
import axios from 'axios';
import { Label } from '@/components/ui/label';

const data: Certificate[] = [
    {
        id: "m5gr84i9",
        status: "Valid",
        control_number: "IIWQIWIWE",
        participant: "ken99@yahoo.com",
        expiration_date: "2024-08-31T00:00:00Z",
        created_at: "2024-08-04T00:00:00Z"
    },
    {
        id: "3u1reuv4",
        status: "Valid",
        control_number: "AKQOWKEEW",
        participant: "Abe45@gmail.com",
        expiration_date: "2024-08-06T00:00:00Z",
        created_at: "2024-08-04T00:00:00Z"
    },
    {
        id: "derv1ws0",
        status: "Revoked",
        control_number: "OPQPCPASM",
        participant: "Monserrat44@gmail.com",
        expiration_date: "2024-08-02T00:00:00Z",
        created_at: "2024-08-04T00:00:00Z"
    },
    {
        id: "5kma53ae",
        status: "Valid",
        // amount: 874,
        control_number: "PMXMSDKQQ",
        participant: "Silas22@gmail.com",
        expiration_date: "2024-08-05T00:00:00Z",
        created_at: "2024-08-04T00:00:00Z"
    },
    {
        id: "bhqecj4p",
        status: "Expired",
        // amount: 721,
        control_number: "OQIWMSMSQ",
        participant: "carmella@hotmail.com",
        expiration_date: "2024-08-04T00:00:00Z",
        created_at: "2024-08-04T00:00:00Z"
    },
]

export type Certificate = {
    id: string
    status: string
    // amount: number
    control_number: string
    participant: string
    expiration_date: string
    created_at: string
}
const eventName = localStorage.getItem("eventName")
const downloadCertificate = async (controlNumber: string) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/download/${controlNumber}`,
            { responseType: 'blob' } // Important for binary data
        );

        // Create a temporary URL to download the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${controlNumber}.pdf`); // Set the file name
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary URL
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading certificate:", error);
        // Handle the error, e.g., display an error message
    }
};


const downloadBulkCertificates = async (certificateCodes: string[]) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/download-zip`,
            certificateCodes,
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            } // Important for binary data
        );

        // Create a temporary URL to download the blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificates.zip`); // Set the file name
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary URL
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading certificates:", error);
        // Handle the error, e.g., display an error message
    }
};

export const columns: ColumnDef<Certificate>[] = [
    {
        id: "select",
        header: ({ table }: any) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }: any) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "control_number",
        header: "Control Number",
        cell: ({ row }: any) => (
            <div className="capitalize">{row.getValue("control_number")}</div>
        ),
    },
    {
        accessorKey: "participant",
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Participant
                    <RxCaretSort className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: any) => <div className="lowercase">{row.getValue("participant")}</div>,
    },
    {
        accessorKey: "expiration_date",
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Expiration Date
                    <RxCaretSort className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: any) => <div >{new Date(row.getValue("expiration_date")).toLocaleDateString()}</div>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }: any) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <RxCaretSort className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }: any) => <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>,
    },
    {

        accessorKey: "status",
        header: "Status",
        cell: ({ row }: any) => {
            const status = row.getValue("status") as string
            return (
                <Badge className={`
                    ${status === "Revoked" ? "bg-red-500" : ""}
              
              ${status === "Valid" ? "bg-blue-500" : ""}`
                }>{row.getValue("status")}</Badge>
            )
            // <div className="capitalize text-right">{row.getValue("status")}</div>

        },
    },

    // {
    //     accessorKey: "amount",
    //     header: () => <div className="text-right">Amount</div>,
    //     cell: ({ row }: any) => {
    //         const amount = parseFloat(row.getValue("amount"))

    //         // Format the amount as a dollar amount
    //         const formatted = new Intl.NumberFormat("en-US", {
    //             style: "currency",
    //             currency: "USD",
    //         }).format(amount)

    //         return <div className="text-right font-medium">{formatted}</div>
    //     },
    // },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }: any) => {
            const certificate = row.original
            const router = useRouter();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <HiDotsHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(certificate.control_number)}
                        >
                            Copy Control Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/validate/${certificate.control_number}`)}>View certificate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadCertificate(certificate.control_number)}>Download</DropdownMenuItem>
                        <DropdownMenuItem className='text-red-500'>Revoke</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export default function DataTableDemo() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [isLoading, setIsLoading] = useState(true);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const getAllCertificateCodes = () => {
        return certificates.map(certificate => certificate.control_number);
    };

    const allCertificateCodes = useMemo(() => getAllCertificateCodes(), [certificates]);

    const getSelectedCertificateCodes = () => {
        return table.getSelectedRowModel().rows.map(row => row.original.control_number);
    };


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const eventId = urlParams.get('eventId');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate?eventId=${eventId}`);
                const transformedCertificates: Certificate[] = response.data.map((item: any) => ({
                    id: item.id,
                    status: item.revoked ? "Revoked" : "Valid", // Determine status
                    control_number: item.certificateCode,
                    participant: item.participantName,
                    expiration_date: item.expirationDate, // Use directly or format
                    created_at: item.event.startDateTime // Extract from event
                }));

                setCertificates(transformedCertificates);
                // setCertificates(response.data); // Assuming your API returns an array of certificates
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors appropriately (e.g., show an error message)
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const table = useReactTable({
        data: certificates,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="mx-20">
            <UserHeader />
            <div className='flex flex-col'>
                <Label className='text-xl'>{`Event: ${eventName}`}</Label>
            </div>
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter participants..."
                    value={(table.getColumn("participant")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("participant")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className='space-x-4 flex items-center'>
                    <Button onClick={() => downloadBulkCertificates(getSelectedCertificateCodes())} disabled={!table.getIsSomeRowsSelected()}><FaDownload className='size-4 mr-2'></FaDownload>Download Selected</Button>
                    <Button onClick={() => downloadBulkCertificates(allCertificateCodes)}>Download All</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns
                                <FaChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column: any) => column.getCanHide())
                                .map((column: any) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: any) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    Loading Certificates...

                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell: any) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

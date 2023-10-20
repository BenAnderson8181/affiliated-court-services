import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api } from "~/utils/api";
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import Link from "next/link";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";
import type { ColDef, ICellRendererParams } from "ag-grid-community";

type RowData = {
    id: string;
    name: string;
    preferredName?: string | null;
    phoneNumnber?: string | null;
    email: string;
    status?: string | undefined;
}

type Props = {
    children?: ReactNode
}

const ClientSearch: React.FC<Props> = () => {
    const { user } = useUser();
    const router = useRouter();
    const [clientData, setClientData] = useState<RowData[]>([]);

    if (!user)
        router.push('/').catch((err) => console.error(err));

    const clientsQuery = api.account.clientList.useQuery();

    useEffect(() => {
        const data = clientsQuery.data;

        if (!data) return;

        const clientData: RowData[] = data.map((client) => {
            return {
                id: client.id,
                name: `${client.firstName} ${client.lastName}`,
                preferredName: client.preferredName,
                phoneNumber: client.phone,
                email: client.email,
                status: client.accountStatus?.name
            }
        });

        setClientData(clientData);

    }, [clientsQuery.data]);

    const NameCellRenderer = (c: ICellRendererParams) => {
        const name = c.data.name;
        const id = c.data.id;

        return <Link href={`/account/${id}`} className="font-bold">{name}</Link>;
    };

    const [columnDefs] = useState<ColDef[]>([
        { field: 'name', cellRenderer: NameCellRenderer },
        { field: 'preferredName', headerName: 'Preferred Name' },
        { field: 'phoneNumber', headerName: 'Phone' },
        { field: 'email', headerName: 'Email' },
        { field: 'status', headerName: 'Status' }
      ]);

    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
    }), []);

    if (clientsQuery.isLoading) {
        return <Loading type='Page' />
    }

    if (clientsQuery.isError) {
        return <LoadError type='Page' />
    }
    
    return (
        <div className="flex flex-col min-h-screen items-center my-auto bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 text-2xl">
            <div className="mt-10 mb-3">Client Search</div>
            <div className="w-full">
                <div className="ag-theme-alpine-dark mx-5 relative  shadow-purple-900 shadow-xl" style={{ height: '80vh' }}>
                    <AgGridReact<RowData>
                        rowData={clientData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        animateRows={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default ClientSearch;
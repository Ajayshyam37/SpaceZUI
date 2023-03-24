import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from '@mui/material';
import { useParams } from 'react-router-dom';

interface TelemetryData {
    id: string;
    altitude: string;
    longitude: string;
    latitude: string;
    temperature: string;
    timeToOrbit: string;
}

interface Column {
    id: keyof TelemetryData;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'altitude', label: 'Altitude', minWidth: 100 },
    { id: 'longitude', label: 'Longitude', minWidth: 100 },
    { id: 'latitude', label: 'Latitude', minWidth: 100 },
    { id: 'temperature', label: 'Temperature', minWidth: 100 },
    { id: 'timeToOrbit', label: 'Time To Orbit', minWidth: 100 },
];

const TelemetryTable = () => {
    const [data, setPayLoadData] = useState<TelemetryData[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    interface TelemetryData {
        id: string;
        altitude: string;
        longitude: string;
        latitude: string;
        temperature: string;
        timeToOrbit: string;
    }

    const { spaceCraft_ID } = useParams();

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get("https://localhost:7050/Communications/GetTelmentry/" + spaceCraft_ID)
                .then((response: AxiosResponse<any>) => {
                    setPayLoadData(prevTelemetryData => [...prevTelemetryData, ...response.data]);
                });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align} style={{padding: '10px'}}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default TelemetryTable;

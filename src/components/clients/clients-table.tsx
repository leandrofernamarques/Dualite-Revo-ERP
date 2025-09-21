import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Client } from '@/domain/entities/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { formatPhone } from '@/lib/utils';
import { format } from 'date-fns';

interface ClientsTableProps {
  clients: Client[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
  onEditClick: (client: Client) => void;
  onDeleteClick: (client: Client) => void;
}

const columnHelper = createColumnHelper<Client>();

export function ClientsTable({
  clients,
  total,
  page,
  pageSize,
  loading,
  searchQuery,
  onPageChange,
  onSearchChange,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: ClientsTableProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      onSearchChange(query);
    }, 300),
    [onSearchChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSearch(value);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Nome',
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'E-mail',
      cell: ({ getValue }) => (
        <div className="text-muted-foreground">{getValue().getValue()}</div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Telefone',
      cell: ({ getValue }) => {
        const phone = getValue();
        return (
          <div className="text-muted-foreground">
            {phone ? formatPhone(phone.getValue()) : '-'}
          </div>
        );
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Criado em',
      cell: ({ getValue }) => (
        <div className="text-sm text-muted-foreground">
          {format(getValue(), 'dd/MM/yyyy')}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(row.original)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar cliente</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(row.original)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir cliente</span>
          </Button>
        </div>
      ),
    }),
  ], [onEditClick, onDeleteClick]);

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(total / pageSize);

  if (loading && clients.length === 0) {
    return (
      <div className="glass rounded-lg border p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreateClick} className="shrink-0">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Table */}
      <div className="glass rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center">
                    <div className="text-muted-foreground">
                      {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/30 hover:bg-accent/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Página {page} de {totalPages} ({total} clientes)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

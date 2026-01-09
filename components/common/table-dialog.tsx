import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  minWidth?: string;
  className?: string;
}

interface TableDialogProps {
  triggerLabel: string;
  title: string;
  description: string;
  columns: TableColumn[];
  data: Record<string, any>[];
  formatCell?: (key: string, value: any, rowIndex: number) => React.ReactNode;
  highlightRow?: (rowIndex: number) => boolean;
}

export function TableDialog({
  triggerLabel,
  title,
  description,
  columns,
  data,
  formatCell,
  highlightRow,
}: TableDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full rounded-none" disabled={!data || data.length === 0}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[80vw] lg:max-w-5xl max-h-[85vh] rounded-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[65vh] overflow-y-auto pr-8">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`${column.align === "right" ? "text-right" : ""} ${column.minWidth ? `min-w-[${column.minWidth}]` : ""}`}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={highlightRow?.(rowIndex) ? "bg-muted/50" : ""}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`${column.align === "right" ? "text-right" : ""} ${column.className || ""}`}
                    >
                      {formatCell
                        ? formatCell(column.key, row[column.key], rowIndex)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

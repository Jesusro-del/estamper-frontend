import { useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

import { CreateProduct, GetProduct, GetProducts, UpdateProduct } from "../api/product.service";
import type { ResponseProductsDTO } from "../dto/ResponseProductsDTO";
import { UpsertTestModal } from "../ui/components/UpsertTestModal";

type ProductoUI = {
    id: string;
    nombre: string;
    stock: number;
};

export default function ProductsPage() {
    const [productos, setProductos] = useState<ProductoUI[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // Estado para controlar la visibilidad del modal
    const [isDialogInsertOpen, setIsDialogInsertOpen] = useState(false);
    const [isDialogUpdateOpen, setIsDialogUptadeOpen] = useState(false);

    const handleView = async (id: string) => {
        try {
            const producto = await GetProduct(id);
            console.log("Producto obtenido:", producto);
            alert(
                `ID: ${producto.idProduct}\nNombre: ${producto.nameProduct}\nStock: ${producto.Stock}`
            );
        } catch (error) {
            console.error("Error al obtener producto", error);
            alert("Error al obtener producto");
        }
    };
    const handleEdit = async (idProduct: string) => {
        try {
            setIsLoading(true);

            const created = await UpdateProduct("M3", {
                idProduct: "M3",
                nameProduct: "Funcion",
                Stock: 10,
            });

            const productoActualizado: ProductoUI = {
                id: created.idProduct,
                nombre: created.nameProduct,
                stock: created.Stock,
            };

            setProductos((prev) =>
                prev.map((p) => (p.id === idProduct ? productoActualizado : p))
            );
        } catch (error) {
            console.error("Error al ingresar producto del backend", error);
            alert("Error al leer datos del backend");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        console.log("Eliminar producto:", id);
    };

    const handleAddProduct = async () => {
        try {
            setIsLoading(true);

            const created = await CreateProduct({
                idProduct: "M3",
                nameProduct: "Gabardina",
                Stock: 40,
            });

            const nuevo: ProductoUI = {
                id: created.idProduct,
                nombre: created.nameProduct,
                stock: created.Stock,
            };

            setProductos((prev) => [...prev, nuevo]);
        } catch (error) {
            console.error("Error al ingresar producto del backend", error);
            alert("Error al leer datos del backend");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeerDatos = async () => {
        try {
            setIsLoading(true);

            const items: ResponseProductsDTO[] = await GetProducts();
            console.log(items);
            const data: ProductoUI[] = items.map((item) => ({
                id: item.idProduct,
                nombre: item.nameProduct,
                stock: item.Stock,
            }));

            setProductos(data);
        } catch (error) {
            console.error("Error al leer datos del backend", error);
            alert("Error al leer datos del backend");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <TooltipProvider>
            {/* 1. Encabezado con título y botón de "Nuevo Ensayo" */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Gestión de Ensayos
                </h1>
                <Button
                    className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white shadow-md rounded-lg px-4 py-2 h-auto"
                    onClick={() => setIsDialogInsertOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Nuevo Producto
                </Button>
                <UpsertTestModal
                    open={isDialogInsertOpen}
                    onOpenChange={setIsDialogInsertOpen}
                    action="CREATE"
                />
                <Button
                    className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white shadow-md rounded-lg px-4 py-2 h-auto"
                    onClick={() => setIsDialogUptadeOpen(true)}
                >
                    <Plus className="w-4 h-4" /> Actualizar Producto
                </Button>
                <UpsertTestModal
                    open={isDialogUpdateOpen}
                    onOpenChange={setIsDialogUptadeOpen}
                    action="UPDATE"
                />
            </div>
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8 gap-4">
                        <h1 className="text-foreground">Gestión de Productos</h1>
                        <div className="flex gap-2">
                            <Button onClick={handleAddProduct}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Producto
                            </Button>
                            <Button onClick={handleLeerDatos} disabled={isLoading}>
                                {isLoading ? "Cargando..." : "Leer Datos"}
                            </Button>
                        </div>
                    </div>


                    <div className="border rounded-lg bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">ID Producto</TableHead>
                                    <TableHead>Nombre del Producto</TableHead>
                                    <TableHead className="w-[200px]">Stock</TableHead>
                                    <TableHead className="text-right w-[150px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {productos.map((producto) => (
                                    <TableRow key={producto.id}>
                                        <TableCell className="text-muted-foreground">
                                            {producto.id}
                                        </TableCell>
                                        <TableCell>{producto.nombre}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">
                                                    {producto.stock} unidades
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleView(producto.id)}
                                                            className="hover:bg-primary/10 hover:text-primary"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Ver detalles</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(producto.id)}
                                                            className="hover:bg-blue-500/10 hover:text-blue-600"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Editar producto</p>
                                                    </TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(producto.id)}
                                                            className="hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Eliminar producto</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {productos.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6">
                                            Sin datos aún. Usa "Leer Datos".
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}

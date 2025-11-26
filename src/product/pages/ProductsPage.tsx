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

import { GetProduct, GetProducts } from "../api/product.service";
import type { ResponseProductsDTO } from "../dto/ResponseProductsDTO";

type ProductoUI = {
    id: string;
    nombre: string;
    stock: number;
};

export default function ProductsPage() {
    const [productos, setProductos] = useState<ProductoUI[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // estado del formulario
    const [form, setForm] = useState<{
        idProduct: string;
        nameProduct: string;
        Stock: number;
    }>({
        idProduct: "",
        nameProduct: "",
        Stock: 0,
    });

    const handleChangeForm = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "Stock" ? Number(value) || 0 : value,
        }));
    };

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
    const handleEdit = (id: string) => {
        console.log("Editar producto:", id);
    };

    const handleDelete = (id: string) => {
        console.log("Eliminar producto:", id);
    };

    const handleAddProduct = () => {
        console.log("Agregar nuevo producto");
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
                    {/* Formulario de producto */}
                    <div className="mb-8 border rounded-lg bg-card shadow-sm p-4 space-y-4">
                        <h2 className="text-lg font-semibold">
                            Formulario de Producto
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-muted-foreground">
                                    idProduct
                                </label>
                                <input
                                    name="idProduct"
                                    value={form.idProduct}
                                    onChange={handleChangeForm}
                                    className="border rounded px-2 py-1 text-sm bg-background"
                                    placeholder="M1"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-muted-foreground">
                                    nameProduct
                                </label>
                                <input
                                    name="nameProduct"
                                    value={form.nameProduct}
                                    onChange={handleChangeForm}
                                    className="border rounded px-2 py-1 text-sm bg-background"
                                    placeholder="Pantalón"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-muted-foreground">
                                    Stock
                                </label>
                                <input
                                    name="Stock"
                                    type="number"
                                    value={form.Stock}
                                    onChange={handleChangeForm}
                                    className="border rounded px-2 py-1 text-sm bg-background"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddProduct}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Producto
                            </Button>
                            <Button variant="outline" onClick={() => 2}>
                                Actualizar Producto
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

"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navigation from "../components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { showToast } from "@/lib/toast";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import API from "../services/api";

export interface Product {
  id: number;
  product_name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, searchText, sortBy, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        ...(searchText && { search: searchText }),
      });

      const response = await API.get(`/product?${params}`);
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (error: any) {
      showToast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      product_name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
    });
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/product/${id}`);
      showToast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      showToast.error("Failed to delete product");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: formData.price.toString(),
        quantity: formData.quantity.toString(),
      };

      if (editingProduct) {
        await API.put(`/product/${editingProduct.id}`, productData);
        showToast.success("Product updated successfully");
      } else {
        await API.post("/product", productData);
        showToast.success("Product created successfully");
      }

      setModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Failed to save product"
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Products</h2>
                <p className="text-muted-foreground">Manage your product inventory</p>
              </div>
              <Button onClick={handleCreate} size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <Card className="card-enhanced">
              {/* Search and Filter Controls */}
              <div className="mb-4 flex flex-wrap gap-4 items-center p-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-48 input-enhanced"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product_name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                      <SelectItem value="createdAt">Created</SelectItem>
                      <SelectItem value="updatedAt">Updated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Order:</span>
                  <Select value={sortOrder} onValueChange={(value: "ASC" | "DESC") => setSortOrder(value)}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASC">Ascending</SelectItem>
                      <SelectItem value="DESC">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="table-enhanced">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.product_name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {product.description}
                          </TableCell>
                          <TableCell>
                            ${parseFloat(product.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                parseInt(product.quantity) > 10
                                  ? "default"
                                  : parseInt(product.quantity) > 5
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {product.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(product.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the product.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, total)} to{" "}
                  {Math.min(currentPage * pageSize, total)} of {total} products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm px-2">Page {currentPage}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage * pageSize >= total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>

            {/* Product Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct
                      ? "Update the product information"
                      : "Fill in the details for the new product"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={onFinish} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      name="product_name"
                      placeholder="Enter product name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter product description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        placeholder="Enter quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Enter category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

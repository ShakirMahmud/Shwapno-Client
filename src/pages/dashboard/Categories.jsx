import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Swal from 'sweetalert2';
import { Search, Plus } from 'lucide-react';

// Sortable Product Item Component
const ProductItem = ({ product, index }) => {
    return (
        <Draggable draggableId={product._id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="bg-white p-3 rounded mb-2 shadow cursor-grab hover:shadow-md transition-colors duration-200"
                >
                    <div className="font-medium text-gray-800">{product.description || 'Sample Product'}</div>
                    <div className="text-sm text-gray-500">Barcode: {product.barcode || '123456'}</div>
                    {product.material && <div className="text-sm text-gray-500">Material: {product.material}</div>}
                </div>
            )}
        </Draggable>
    );
};

const Categories = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [visibleCategoryIds, setVisibleCategoryIds] = useState(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/products");
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                const productsWithDefaultCategory = data.map(product => ({
                    ...product,
                    category: product.category || 'Uncategorized'
                }));
                setProducts(productsWithDefaultCategory);
                setFilteredProducts(productsWithDefaultCategory);
            } catch (error) {
                console.error("Error loading products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch("http://localhost:5000/categories");
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await response.json();
                setCategories(data);
                setFilteredCategories(data);
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };

        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!isSearching) {
            setVisibleCategoryIds(new Set([
                'Uncategorized',
                ...categories.map(category => category.id)
            ]));
            return;
        }

        const visibleCats = new Set();
        filteredCategories.forEach(category => {
            visibleCats.add(category.id);
        });
        filteredProducts.forEach(product => {
            visibleCats.add(product.category);
        });

        setVisibleCategoryIds(visibleCats);
    }, [isSearching, filteredCategories, filteredProducts, categories]);

    useEffect(() => {
        const productsToUse = isSearching ? filteredProducts : products;
        const groupedProducts = {};

        categories.forEach(category => {
            if (visibleCategoryIds.has(category.id)) {
                groupedProducts[category.id] = productsToUse.filter(
                    product => product.category === category.id
                );
            }
        });

        if (visibleCategoryIds.has('Uncategorized')) {
            groupedProducts['Uncategorized'] = productsToUse.filter(
                product => product.category === 'Uncategorized'
            );
        }

        setProductsByCategory(groupedProducts);
    }, [categories, products, filteredProducts, isSearching, visibleCategoryIds]);

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId) {
            return;
        }

        const productId = draggableId;
        const overCategoryId = destination.droppableId;

        const updatedProducts = products.map(product =>
            product._id === productId ? { ...product, category: overCategoryId } : product
        );

        setProducts(updatedProducts);

        if (isSearching) {
            setFilteredProducts(updatedProducts);
        }

        try {
            const response = await fetch(`http://localhost:5000/products/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ category: overCategoryId })
            });

            if (!response.ok) {
                throw new Error("Failed to update category");
            }
        } catch (error) {
            console.error("Error updating product category:", error);
        }
    };

    const handleCreateCategory = () => {
        Swal.fire({
            title: 'Create New Category',
            input: 'text',
            inputPlaceholder: 'Enter category name',
            showCancelButton: true,
            confirmButtonText: 'Create',
            showLoaderOnConfirm: true,
            preConfirm: (categoryName) => {
                if (!categoryName) {
                    Swal.showValidationMessage('Category name is required');
                    return false;
                }

                if (categories.some(cat => cat.id === categoryName)) {
                    Swal.showValidationMessage('Category already exists');
                    return false;
                }

                return categoryName;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newCategory = {
                    id: result.value,
                    title: result.value,
                };

                setCategories(prevCategories => [...prevCategories, newCategory]);

                setVisibleCategoryIds(prev => {
                    const updated = new Set(prev);
                    updated.add(newCategory.id);
                    return updated;
                });

                fetch('http://localhost:5000/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: result.value,
                        id: result.value
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to create category');
                        }
                        return response.json();
                    })
                    .then((createdCategory) => {
                        console.log(`Category "${createdCategory.title}" created successfully with _id: ${createdCategory._id}`);
                    })
                    .catch(error => {
                        console.error('Error creating category:', error);
                    });
            }
        });
    };

    const handleDeleteCategory = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/categories/${id}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete category');
                    }

                    setProducts(prevProducts =>
                        prevProducts.map(product =>
                            product.category === id ? { ...product, category: 'Uncategorized' } : product
                        )
                    );

                    setFilteredProducts(prevProducts =>
                        prevProducts.map(product =>
                            product.category === id ? { ...product, category: 'Uncategorized' } : product
                        )
                    );

                    setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
                    setFilteredCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));

                    setVisibleCategoryIds(prev => {
                        const updated = new Set(prev);
                        updated.delete(id);
                        return updated;
                    });

                    Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting category:', error);
                    Swal.fire('Error', 'Failed to delete category.', 'error');
                }
            }
        });
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearching(true);
    
        if (query.trim() === '') {
            setIsSearching(false);
            setFilteredProducts(products);
            setFilteredCategories(categories);
            setVisibleCategoryIds(new Set([
                'Uncategorized',
                ...categories.map(category => category.id)
            ]));
            return;
        }
    
        try {
            const productResponse = await fetch(`http://localhost:5000/products?search=${query}`);
            if (!productResponse.ok) {
                throw new Error("Failed to fetch products");
            }
            const productsData = await productResponse.json();
            const productsWithDefaultCategory = productsData.map(product => ({
                ...product,
                category: product.category || 'Uncategorized'
            }));
            setFilteredProducts(productsWithDefaultCategory);
    
            const categoryResponse = await fetch(`http://localhost:5000/categories?search=${query}`);
            if (!categoryResponse.ok) {
                throw new Error("Failed to fetch categories");
            }
            const categoriesData = await categoryResponse.json();
            setFilteredCategories(categoriesData);
    
            const visibleCats = new Set();
            categoriesData.forEach(category => {
                visibleCats.add(category.id);
            });
            productsWithDefaultCategory.forEach(product => {
                visibleCats.add(product.category);
            });
    
            setVisibleCategoryIds(visibleCats);
        } catch (error) {
            console.error("Error during search:", error);
        }
    };
    


    // Category Column Component
    const CategoryColumn = ({ id, title, products }) => {
        return (
            <Droppable droppableId={id}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-gray-100 rounded-lg p-4 border-1 border-gray-100 shadow-md transition-colors duration-200 hover:shadow-lg"
                    >
                        <div className='flex justify-between items-center mb-3'>
                            <h3 className="font-semibold text-lg text-gray-700">{title}</h3>
                            {title !== 'Uncategorized' && (
                                <button
                                    className='bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition-colors duration-200'
                                    onClick={() => handleDeleteCategory(id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="min-h-[250px] max-h-[350px] overflow-y-auto p-2">
                            {products.map((product, index) => (
                                <ProductItem key={product._id} product={product} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Header with Search */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>

                    <div className="flex w-full md:w-auto space-x-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search Products or Categories"
                                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 transition-colors duration-200"
                            onClick={handleCreateCategory}
                        >
                            <Plus className="h-5 w-5" />
                            <span>Create Category</span>
                        </button>
                    </div>
                </div>

                {/* Categories and Products */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Uncategorized', ...categories.map(cat => cat.id)].filter(categoryId => visibleCategoryIds.has(categoryId)).map(categoryId => (
                            <CategoryColumn
                                key={categoryId}
                                id={categoryId}
                                title={categoryId === 'Uncategorized' ? 'Uncategorized' : categories.find(cat => cat.id === categoryId)?.title || categoryId}
                                products={(productsByCategory[categoryId] || [])}
                            />
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default Categories;

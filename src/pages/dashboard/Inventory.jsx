import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BrowserMultiFormatReader } from "@zxing/browser";

const Inventory = () => {
    const [barcode, setBarcode] = useState("");
    const [productsInDB, setProductsInDB] = useState([]);
    const [products, setProducts] = useState([]);
    const [image, setImage] = useState(null);

    useEffect(() => {
        setProducts(productsInDB);
    }, [productsInDB]);

    useEffect(() => {
        fetch("https://shwapno-server.vercel.app/products")
            .then((res) => res.json())
            .then((data) => setProductsInDB(data));
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                setImage(e.target.result);
                scanBarcode(e.target.result);
            };
            reader.readAsDataURL(file);
            event.target.value = null;
        } else {
            setImage(null);
            setBarcode("");
        }
    };

    const scanBarcode = async (imageSrc) => {
        try {
            const img = document.createElement("img");
            img.src = imageSrc;
            await img.decode();

            const codeReader = new BrowserMultiFormatReader();
            const result = await codeReader.decodeFromImageElement(img);

            if (result) {
                setBarcode(result.getText());
                fetchProduct(result.getText());
            } else {
                manualInputPrompt();
                setImage(null);
            }
        } catch (error) {
            console.error("Barcode scan failed:", error);
            manualInputPrompt();
        }
    };

    const manualInputPrompt = () => {
        Swal.fire({
            title: "Scan Failed",
            text: "Try scanning again or enter the barcode manually.",
            icon: "error",
            input: "text",
            inputPlaceholder: "Enter barcode manually",
            showCancelButton: true,
            confirmButtonText: "Submit",
        }).then((res) => {
            if (res.isConfirmed && res.value) {
                setBarcode(res.value);
                fetchProduct(res.value);
            }
            else {
                setImage(null);
                setBarcode("");
            }
        });
    };

    const fetchProduct = async (barcode) => {
        try {
          // Call your backend's proxy route
          const response = await fetch(`https://shwapno-server.vercel.app/api/proxy/product/${barcode}`);  
      
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }
      
          const data = await response.json();
      
          if (data.status) {
            if (productsInDB.some((p) => p.barcode === data.product.barcode)) {
              Swal.fire("Error", "Product already exists in the database.", "error");
              setImage(null);
              setBarcode("");
              return;
            }
      
            const product = {
              material: data.product.material,
              barcode: data.product.barcode,
              description: data.product.description,
              category: "Uncategorized",
            };
      
            const postResponse = await fetch("https://shwapno-server.vercel.app/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(product),
            });
      
            if (postResponse.status === 400) {
              Swal.fire("Error", "Product already exists in the database.", "error");
              setImage(null);
              setBarcode("");
              return;
            }
      
            if (postResponse.ok) {
              Swal.fire("Success", "Product added successfully!", "success");
              setProductsInDB((prevProducts) => [...prevProducts, product]);
      
              fetchUpdatedProducts();
              setImage(null);
              setBarcode("");
            }
          } else {
            throw new Error("Product not found");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          Swal.fire("Error", "Product not found or server error.", "error");
          setImage(null);
          setBarcode("");
        }
      };
      
    const handleDeleteProduct = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://shwapno-server.vercel.app/products/${id}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        throw new Error("Failed to delete product");
                    }

                    Swal.fire("Deleted!", "Product has been deleted.", "success");

                    fetchUpdatedProducts();
                } catch (error) {
                    console.error("Error deleting product:", error);
                    Swal.fire("Error", "Failed to delete product.", "error");
                }
            }
        });
    };

    const fetchUpdatedProducts = async () => {
        try {
            const response = await fetch("https://shwapno-server.vercel.app/products");
            const data = await response.json();
            setProductsInDB(data);
        } catch (error) {
            console.error("Error fetching updated products:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">📦 Inventory Management</h1>
                <div className="flex flex-col md:flex-row items-center justify-around gap-4 mb-6">
                    <div className="relative w-full max-w-xl">
                        <label className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:border-blue-500 transition">
                            <span className="flex items-center gap-2 text-gray-600">
                                📂 Choose File
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <span className="text-gray-500 truncate">
                                {image ? (typeof image === 'string' ? 'Image Selected' : image.name) : "No file chosen"}
                            </span>
                        </label>
                    </div>
                    {image && typeof image === 'string' && <img src={image} alt="Uploaded Barcode" className="max-w-[100px] rounded-lg shadow-md" />}

                    <input
                        type="text"
                        placeholder="Enter barcode manually"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full md:w-1/2 shadow-sm"
                    />

                    <button
                        onClick={() => fetchProduct(barcode)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                    >
                        Scan
                    </button>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto w-full hidden md:block">
                    <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="w-full">
                            <tr className="bg-gray-100 w-full">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b w-1/4">
                                    Material
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b w-1/4">
                                    Barcode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b w-1/4">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b w-1/4">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b w-1/6">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id || product.barcode} className="w-full">
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {product.material || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {product.barcode}
                                    </td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {product.description}
                                    </td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 border-b text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="text-red-600 hover:text-red-900 focus:outline-none"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Responsive Cards for Mobile */}
                <div className="md:hidden flex flex-col gap-4 justify-center">
                    {products.map((product) => (
                        <div key={product._id || product.barcode} className="bg-white shadow-md rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold mb-2">{product.material || "N/A"}</h2>
                                <button
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Barcode: {product.barcode}</p>
                            <p className="text-sm text-gray-500 mb-2">Description: {product.description}</p>
                            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inventory;

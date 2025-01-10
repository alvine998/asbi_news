import { database } from "@/config/firebase";
import { ref, push, set, get, update, remove } from "firebase/database";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

// Create a category
export const createCategory = async (payload: any) => {
    const categoryRef = ref(database, "categories");
    const timestamp = new Date().toISOString();

    try {
        const newCategory = {
            ...payload,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const newCategoryRef = push(categoryRef);
        await set(newCategoryRef, newCategory);
        // Show success toast
        toast.success("Category created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return { id: newCategoryRef.key, ...newCategory };
    } catch (error) {
        console.log(error);
        // Show error toast
        toast.error("Failed to create category. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

// Read categories
export const getCategories = async () => {
    const categoryRef = ref(database, "categories");
    const snapshot = await get(categoryRef);

    try {
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        // Show error toast
        toast.error("Failed to fetch category. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

// Update a category
export const updateCategory = async (id: string, updatedFields: Partial<{ name: string, description: string }>) => {
    if (!id) {
        // Show error toast if id is invalid
        toast.error("Invalid category ID.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return;
    }
    const categoryRef = ref(database, `categories/${id}`);
    const updatedAt = new Date().toISOString();

    try {
        // Check if the category exists before updating
        const categorySnapshot = await get(categoryRef);
        if (!categorySnapshot.exists()) {
            // Show error toast if category doesn't exist
            toast.error("Category not found. Unable to update.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        await update(categoryRef, { ...updatedFields, updatedAt });
        // Show success toast
        toast.success("Category updated successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    } catch (error) {
        console.log(error);
        // Show error toast
        toast.error("Failed to update category. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

// Delete a category
export const deleteCategory = async (id: string) => {
    const categoryRef = ref(database, `categories/${id}`);
    try {
        await remove(categoryRef);
        // Show success toast
        toast.success("Category deleted successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    } catch (error) {
        console.log(error);
        // Show error toast
        toast.error("Failed to delete category. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

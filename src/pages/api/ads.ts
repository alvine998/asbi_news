import { database } from "@/config/firebase";
import { ref, push, set, get, update, remove } from "firebase/database";
import { toast } from "react-toastify";

// Create a category
export const createAds = async (payload: any) => {
    const adsRef = ref(database, "ads");
    const timestamp = new Date().toISOString();

    try {
        const newAds = {
            ...payload,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const newAdsRef = push(adsRef);
        await set(newAdsRef, newAds);
        // Show success toast
        toast.success("Category created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return { id: newAdsRef.key, ...newAds };
    } catch (error) {
        console.log(error);
        // Show error toast
        toast.error("Failed to create ads. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

// Read ads
export const getAds = async () => {
    const adsRef = ref(database, "ads");
    const snapshot = await get(adsRef);

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
        toast.error("Failed to fetch ads. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

// Update a ads
export const updateAds = async (id: string, updatedFields: Partial<{ name: string, image: string }>) => {
    if (!id) {
        // Show error toast if id is invalid
        toast.error("Invalid ads ID.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return;
    }
    const adsRef = ref(database, `ads/${id}`);
    const updatedAt = new Date().toISOString();

    try {
        // Check if the ads exists before updating
        const adsSnapshot = await get(adsRef);
        if (!adsSnapshot.exists()) {
            // Show error toast if category doesn't exist
            toast.error("Ads not found. Unable to update.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        await update(adsRef, { ...updatedFields, updatedAt });
        // Show success toast
        toast.success("Ads updated successfully!", {
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
        toast.error("Failed to update Ads. Please try again.", {
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
export const deleteAds = async (id: string) => {
    const categoryRef = ref(database, `ads/${id}`);
    try {
        await remove(categoryRef);
        // Show success toast
        toast.success("Ads deleted successfully!", {
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
        toast.error("Failed to delete ads. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

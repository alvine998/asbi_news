import { database } from "@/config/firebase";
import { ref, push, set, get, update, remove, query, orderByChild, equalTo, increment, startAt, limitToFirst } from "firebase/database";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

// Create a News
export const createNews = async (payload: any) => {
    const newsRef = ref(database, "news");
    const timestamp = new Date().toISOString();

    try {
        const newNews = {
            ...payload,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const newNewsRef = push(newsRef);
        await set(newNewsRef, newNews);
        // Show success toast
        toast.success("News created successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return { id: newNewsRef.key, ...newNews };
    } catch (error) {
        console.log(error);
        // Show error toast
        toast.error("Failed to create News. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

// Read news
export const getNews = async (filter?: any, category_name?: any) => {
    const newsRef = ref(database, "news");
    let newsQuery: any = newsRef; // Default to fetching all news

    try {
        // Filter by status
        if (filter === "publish" || filter === "draft") {
            newsQuery = query(newsRef, orderByChild("status"), equalTo(filter));
        }

        // Filter by popularity (top 6 most viewed)
        if (filter == "popular") {
            newsQuery = query(newsRef, orderByChild("viewers"), limitToFirst(6));
        }

        // Handle category-based query
        if (filter === "category_name") {
            newsQuery = query(newsRef, orderByChild("category_name"), equalTo(category_name));
        }

        if (filter === "headline") {
            newsQuery = query(newsRef, orderByChild("headline"), equalTo("1"));
        }
        const snapshot = await get(newsQuery);

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
        toast.error("Failed to fetch news. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

export const getSingleNewsByID = async (newsId: string) => {
    const newsRef = ref(database, `news/${newsId}`);

    try {
        const snapshot = await get(newsRef);

        if (snapshot.exists()) {
            return { id: newsId, ...snapshot.val() };
        } else {
            toast.error("News not found.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return null;
        }
    } catch (error) {
        console.error("Error fetching single news:", error);
        toast.error("Failed to fetch news. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return null;
    }
};

export const getSingleNews = async (slug: string) => {
    if (!slug) {
        throw new Error("Slug is required to fetch news.");
    }
    const newsRef = ref(database, `news`);

    try {
        const newsQuery = query(newsRef, orderByChild("slug"), equalTo(slug));
        const snapshot = await get(newsQuery);

        if (snapshot.exists()) {
            const snapshot = await get(newsQuery);
            if (snapshot.exists()) {
                const data = snapshot.val();
                return Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }))[0]; // Assuming you only want a single item
            }
        } else {
            toast.error("News not found.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return null;
        }
    } catch (error) {
        console.error("Error fetching single news:", error);
        toast.error("Failed to fetch news. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return null;
    }
};

export const getNewsByCategory = async (category: string) => {
    const newsRef = ref(database, `news`);

    try {
        const newsQuery = query(newsRef, orderByChild("category"), equalTo(category));
        const snapshot = await get(newsQuery);

        if (snapshot.exists()) {
            const news = snapshot.val();
            return Object.keys(news).map((key) => ({
                id: key,
                ...news[key],
            }));;

        } else {
            toast.error("News not found.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return null;
        }
    } catch (error) {
        console.error("Error fetching single news:", error);
        toast.error("Failed to fetch news. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return null;
    }
};

// Update a news
export const updateNews = async (id: string, updatedFields: any) => {
    if (!id) {
        // Show error toast if id is invalid
        toast.error("Invalid News ID.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        return;
    }
    const newsRef = ref(database, `news/${id}`);
    const updatedAt = new Date().toISOString();

    try {
        // Check if the news exists before updating
        const newsSnapshot = await get(newsRef);
        if (!newsSnapshot.exists()) {
            // Show error toast if news doesn't exist
            toast.error("news not found. Unable to update.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        await update(newsRef, { ...updatedFields, updatedAt });
        // Show success toast
        toast.success("News updated successfully!", {
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
        toast.error("Failed to update News. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

export const updateViewers = async (newsId: string) => {
    const newsRef = ref(database, `news/${newsId}`);

    try {
        // Get current viewers count (optional for additional logic)
        const snapshot = await get(newsRef);
        if (snapshot.exists()) {
            const currentData = snapshot.val();

            // Increment the viewer count
            await update(newsRef, {
                viewers: increment(1),
            });
        } else {
            // If news entry doesn't exist, create it with 1 viewer
            await update(newsRef, {
                viewers: 1,
            });
        }
    } catch (error) {
        console.error("Failed to update viewers count:", error);
    }
};

// Delete a News
export const deleteNews = async (id: string) => {
    const newsRef = ref(database, `news/${id}`);
    try {
        await remove(newsRef);
        // Show success toast
        toast.success("News deleted successfully!", {
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
        toast.error("Failed to delete News. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};

import axiosInstance from '@/utils/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axiosInstance.delete(`/users?id=${req.body.id}`); // External API request
        res.status(200).json(response.data); // Respond with fetched data
    } catch (error) {
        console.error('API Route Error:', error);
        res.status(500).json({ message: 'Error fetching data', error });
    }
}
